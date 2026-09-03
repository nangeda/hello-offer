import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  detectResumeFileType,
  prepareResumeForModel,
  resumeNameFromFile,
  restoreImportedResume,
} from "../js/resume/document-importer.js";
import { extractTextFromPdf } from "../js/resume/pdf-extractor.js";
import { resumeImportTemplate } from "../js/modelGateway.js";

test("简历导入支持 PDF、Markdown、TXT 和 JSON", () => {
  assert.equal(detectResumeFileType("张三.pdf"), "pdf");
  assert.equal(detectResumeFileType("张三.MD"), "markdown");
  assert.equal(detectResumeFileType("张三.markdown"), "markdown");
  assert.equal(detectResumeFileType("张三.txt"), "text");
  assert.equal(detectResumeFileType("backup.json"), "json");
  assert.equal(detectResumeFileType("resume.docx"), "unknown");
  assert.equal(resumeNameFromFile("校招简历.markdown"), "校招简历");
});

test("发往模型前掩码敏感字段并可在结构化结果中还原", () => {
  const source = {
    fileName: "resume.md",
    sourceType: "markdown",
    text: "姓名 张三\n手机 13800138000\n邮箱 hello@example.com\n身份证 110105199001011234\n教育经历 示例大学",
  };
  const { payload, piiMap } = prepareResumeForModel(source);
  assert.doesNotMatch(payload.text, /13800138000|hello@example\.com|110105199001011234/);
  assert.match(payload.text, /\{\{MASK_PHONE_/);

  const restored = restoreImportedResume(
    {
      basicInfo: {
        phone: Object.keys(piiMap).find((key) => key.includes("PHONE")),
        email: Object.keys(piiMap).find((key) => key.includes("EMAIL")),
        idNumber: Object.keys(piiMap).find((key) => key.includes("ID")),
      },
    },
    piiMap,
  );
  assert.equal(restored.basicInfo.phone, "13800138000");
  assert.equal(restored.basicInfo.email, "hello@example.com");
  assert.equal(restored.basicInfo.idNumber, "110105199001011234");
});

test("模型解析模板使用正式 ResumeSchema 字段", () => {
  const template = resumeImportTemplate();
  assert.equal(Object.hasOwn(template, "createdAt"), false);
  assert.equal(Object.hasOwn(template, "updatedAt"), false);
  assert.equal(typeof template.basicInfo.name, "string");
  assert.equal(Array.isArray(template.education), true);
  assert.equal(Array.isArray(template.projectExperience), true);
});

test("简历中心文件选择器公开 PDF 和 Markdown 类型", async () => {
  const html = await readFile(new URL("../html/localResume.html", import.meta.url), "utf8");
  assert.match(html, /accept="[^"]*\.pdf/);
  assert.match(html, /accept="[^"]*\.md/);
  assert.match(html, /accept="[^"]*\.json/);
});

test("PDF 文本按页并发提取但保持原始页序", async () => {
  const progress = [];
  globalThis.pdfjsLib = {
    getDocument() {
      return {
        promise: Promise.resolve({
          numPages: 3,
          async getPage(pageNumber) {
            return {
              async getTextContent() {
                return {
                  items: [{ str: `第${pageNumber}页内容`, hasEOL: true }],
                };
              },
              cleanup() {},
            };
          },
        }),
        async destroy() {},
      };
    },
  };

  try {
    const text = await extractTextFromPdf(
      {
        name: "测试.pdf",
        size: 128,
        async arrayBuffer() {
          return new ArrayBuffer(8);
        },
      },
      { onProgress: (value) => progress.push(value) },
    );
    assert.match(text, /第 1 页[\s\S]*第1页内容[\s\S]*第 3 页[\s\S]*第3页内容/);
    assert.equal(progress.length, 3);
    assert.equal(progress.at(-1).finished, 3);
  } finally {
    delete globalThis.pdfjsLib;
  }
});
