let pdfJsPromise = null;

async function loadPdfJs() {
  if (globalThis.pdfjsLib?.getDocument) return globalThis.pdfjsLib;
  if (!pdfJsPromise) {
    if (typeof chrome === "undefined" || !chrome.runtime?.getURL) {
      throw new Error("PDF.js 只能在 Chrome 扩展的简历中心中加载");
    }
    const libraryUrl = chrome.runtime.getURL("assets/lib/pdf.min.mjs");
    pdfJsPromise = import(libraryUrl).then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL(
        "assets/lib/pdf.worker.min.mjs",
      );
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index], index);
      }
    },
  );
  await Promise.all(runners);
  return results;
}

function textContentToLines(textContent) {
  const lines = [];
  let current = "";
  for (const item of textContent.items || []) {
    const text = String(item.str || "").trim();
    if (text) current += `${current ? " " : ""}${text}`;
    if (item.hasEOL && current) {
      lines.push(current);
      current = "";
    }
  }
  if (current) lines.push(current);
  return lines.join("\n");
}

export async function extractTextFromPdf(
  file,
  { onProgress, maxPages = 30 } = {},
) {
  if (!file || !/\.pdf$/i.test(file.name || "")) {
    throw new Error("请选择有效的 PDF 文件");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("PDF 超过 25 MB，请压缩后再导入");
  }

  const [pdfjs, arrayBuffer] = await Promise.all([
    loadPdfJs(),
    file.arrayBuffer(),
  ]);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  try {
    const pageCount = Math.min(pdf.numPages, maxPages);
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
    let finished = 0;
    const pageTexts = await mapWithConcurrency(pages, 4, async (pageNumber) => {
      const page = await pdf.getPage(pageNumber);
      try {
        const content = await page.getTextContent({
          disableCombineTextItems: false,
        });
        return textContentToLines(content);
      } finally {
        page.cleanup?.();
        finished += 1;
        onProgress?.({ finished, total: pageCount });
      }
    });

    const text = pageTexts
      .map((pageText, index) => `--- 第 ${index + 1} 页 ---\n${pageText}`)
      .join("\n\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text.length < 20) {
      throw new Error("PDF 没有可提取文本；扫描版 PDF 暂不支持 OCR");
    }
    return text;
  } finally {
    await loadingTask.destroy?.();
  }
}
