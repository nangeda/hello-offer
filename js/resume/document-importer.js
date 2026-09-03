import { extractTextFromPdf } from "./pdf-extractor.js";
import { maskSensitiveInfo, restoreSensitiveInfo } from "./pii-masker.js";

const MAX_TEXT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_MODEL_CHARS = 40000;

export function detectResumeFileType(fileName) {
  const name = String(fileName || "").toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".md") || name.endsWith(".markdown")) return "markdown";
  if (name.endsWith(".txt")) return "text";
  if (name.endsWith(".json")) return "json";
  return "unknown";
}

export function resumeNameFromFile(fileName) {
  return String(fileName || "导入简历")
    .replace(/\.(?:pdf|md|markdown|txt|json)$/i, "")
    .trim() || "导入简历";
}

export async function readResumeSource(file, { onProgress } = {}) {
  if (!file) throw new Error("没有选择文件");
  const sourceType = detectResumeFileType(file.name);
  if (!["pdf", "markdown", "text"].includes(sourceType)) {
    throw new Error("仅支持 PDF、Markdown、TXT 和 JSON 文件");
  }

  let text;
  if (sourceType === "pdf") {
    text = await extractTextFromPdf(file, { onProgress });
  } else {
    if (file.size > MAX_TEXT_FILE_BYTES) {
      throw new Error("文本简历超过 5 MB，请精简后再导入");
    }
    text = (await file.text()).replace(/^\uFEFF/, "").trim();
  }

  if (text.length < 20) throw new Error("文件中没有足够的简历文本");
  return {
    fileName: file.name || "导入简历",
    resumeName: resumeNameFromFile(file.name),
    sourceType,
    text,
  };
}

export function prepareResumeForModel(source) {
  const { maskedText, piiMap } = maskSensitiveInfo(source?.text || "");
  return {
    payload: {
      fileName: source?.fileName || "导入简历",
      sourceType: source?.sourceType || "text",
      text: maskedText.slice(0, MAX_MODEL_CHARS),
      truncated: maskedText.length > MAX_MODEL_CHARS,
    },
    piiMap,
  };
}

export function restoreImportedResume(modelResult, piiMap) {
  const candidate = modelResult?.resume || modelResult?.data || modelResult;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("模型没有返回有效的结构化简历");
  }
  return restoreSensitiveInfo(candidate, piiMap);
}
