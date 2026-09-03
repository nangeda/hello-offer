import test from "node:test";
import assert from "node:assert/strict";
import { resumeToMarkdown } from "../js/resume/serializer.js";

const modules = [
  { id: "basic", title: "基本信息", type: "object" },
  {
    id: "education",
    title: "教育背景",
    type: "list",
    listKey: "education",
    itemTitle: "学历",
  },
];

const fields = {
  basic: [
    { label: "姓名", path: "basicInfo.name" },
    { label: "政治面貌", path: "basicInfo.politicalStatus" },
  ],
  education: [
    { label: "学校名称", path: "school" },
    { label: "就读专业", path: "major" },
    { label: "主修核心课程", path: "courses" },
  ],
};

test("结构化简历转换为模型可读 Markdown", () => {
  const markdown = resumeToMarkdown(
    {
      basicInfo: { name: "张三", politicalStatus: "共青团员" },
      education: [
        { school: "示例大学", major: "计算机科学", courses: ["算法", "数据库"] },
      ],
    },
    "校招简历",
    modules,
    fields,
  );

  assert.match(markdown, /^# 校招简历/m);
  assert.match(markdown, /## 基本信息/);
  assert.match(markdown, /- 政治面貌：共青团员/);
  assert.match(markdown, /### 学历 1/);
  assert.match(markdown, /- 就读专业：计算机科学/);
  assert.match(markdown, /- 主修核心课程：算法；数据库/);
});

test("空白字段和空白经历不会发送给模型", () => {
  const markdown = resumeToMarkdown(
    {
      basicInfo: { name: "", politicalStatus: "" },
      education: [{ school: "", major: "", courses: [] }],
    },
    "空白简历",
    modules,
    fields,
  );

  assert.equal(markdown, "# 空白简历\n");
});
