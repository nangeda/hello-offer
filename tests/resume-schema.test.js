import test from "node:test";
import assert from "node:assert/strict";
import {
  FIELD_DEFINITIONS,
  MODULE_CONFIG,
  emptyResume,
} from "../js/resume/schema.js";
import { escapeHtml } from "../js/resume/sanitize.js";
import { resumeToMarkdown } from "../js/resume/serializer.js";

test("新简历不预填可能错误的个人事实", () => {
  const resume = emptyResume();
  assert.equal(resume.basicInfo.gender, "");
  assert.equal(resume.basicInfo.country, "");
  assert.equal(resume.basicInfo.ethnicity, "");
  assert.equal(resume.basicInfo.maritalStatus, "");
  assert.equal(resume.basicInfo.employmentStatus, "");
});

test("正式 Schema 可以直接生成模型输入", () => {
  const resume = emptyResume();
  resume.basicInfo.name = "测试用户";
  resume.basicInfo.politicalStatus = "共青团员";
  resume.education[0].school = "示例大学";
  resume.education[0].major = "自动化";

  const markdown = resumeToMarkdown(
    resume,
    "校招简历",
    MODULE_CONFIG,
    FIELD_DEFINITIONS,
  );

  assert.match(markdown, /- 姓名：测试用户/);
  assert.match(markdown, /- 政治面貌：共青团员/);
  assert.match(markdown, /- 学校名称：示例大学/);
  assert.match(markdown, /- 就读专业：自动化/);
});

test("预览文本会转义 HTML", () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)">'),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
  );
});
