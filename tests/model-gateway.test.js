import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_RESUME_MD,
  chatCompletionsUrl,
  endpointName,
  extractJson,
} from "../js/modelGateway.js";

test("未创建结构化简历时使用精简引导文本", () => {
  assert.match(DEFAULT_RESUME_MD, /Hello Offer 简历中心/);
  assert.equal(DEFAULT_RESUME_MD.length < 100, true);
});

test("内部协议地址解析为本地端点名", () => {
  assert.equal(
    endpointName("https://hello-offer.local/api/bridge/getNeedField"),
    "getNeedField",
  );
  assert.equal(
    endpointName("https://hello-offer.local/api/bridge/fillResumeValue/"),
    "fillResumeValue",
  );
});

test("模型 JSON 允许 Markdown 围栏", () => {
  assert.deepEqual(extractJson("```json\n{\"fields\":[]}\n```"), {
    fields: [],
  });
});

test("OpenAI 兼容地址只追加一次 chat/completions", () => {
  assert.equal(
    chatCompletionsUrl("https://api.deepseek.com/"),
    "https://api.deepseek.com/chat/completions",
  );
  assert.equal(
    chatCompletionsUrl("https://example.com/v1/chat/completions"),
    "https://example.com/v1/chat/completions",
  );
});
