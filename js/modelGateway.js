export const DEFAULT_SETTINGS = Object.freeze({
  baseUrl: "https://api.deepseek.com",
  model: "deepseek-chat",
  apiKey: "",
  maxHtmlChars: 120000,
});

export const DEFAULT_RESUME_MD = `# 本地简历

请打开 Hello Offer 简历中心填写并保存结构化简历。
`;

export function endpointName(url) {
  const clean = String(url || "").split("?")[0].replace(/\/+$/, "");
  return clean.slice(clean.lastIndexOf("/") + 1);
}

export function extractJson(text) {
  const raw = String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(raw);
  } catch (_) {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
    throw new Error("模型没有返回有效 JSON");
  }
}

export function chatCompletionsUrl(baseUrl) {
  const base = String(baseUrl || "").trim().replace(/\/+$/, "");
  if (!base) throw new Error("请先配置模型 Base URL");
  return /\/chat\/completions$/i.test(base)
    ? base
    : `${base}/chat/completions`;
}

async function fetchModel(messages, settings, maxTokens) {
  if (!settings.apiKey) throw new Error("请先在扩展弹窗中保存模型 API Key");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  const request = {
    model: settings.model || DEFAULT_SETTINGS.model,
    messages,
    temperature: 0,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
  };
  const send = () =>
    fetch(chatCompletionsUrl(settings.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  try {
    let response = await send();
    if (400 === response.status && request.response_format) {
      delete request.response_format;
      response = await send();
    }
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(`模型请求失败 (${response.status}) ${detail}`);
    }
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("模型响应缺少 choices[0].message.content");
    return extractJson(content);
  } catch (error) {
    if ("AbortError" === error?.name) throw new Error("模型请求超时（90 秒）");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeFields(result) {
  return {
    sessionId: result?.sessionId || `local-${Date.now()}`,
    fields: (Array.isArray(result?.fields) ? result.fields : [])
      .map((section) => ({
        name: String(section?.name || "基本信息").trim(),
        fields: (Array.isArray(section?.fields) ? section.fields : [])
          .map((field) => ({ name: String(field?.name || "").trim() }))
          .filter((field) => field.name),
      }))
      .filter((section) => section.fields.length),
  };
}

function normalizeValues(result) {
  return {
    sessionId: result?.sessionId || `local-${Date.now()}`,
    values: (Array.isArray(result?.values) ? result.values : [])
      .map((section) => ({
        name: String(section?.name || "基本信息").trim(),
        fields: (Array.isArray(section?.fields) ? section.fields : [])
          .map((field) => ({
            name: String(field?.name || "").trim(),
            value: null == field?.value ? "" : String(field.value),
          }))
          .filter((field) => field.name),
      }))
      .filter((section) => section.fields.length),
  };
}

async function discoverFields(payload, settings) {
  const html = String(payload?.html || "").slice(
    0,
    Number(settings.maxHtmlChars) || DEFAULT_SETTINGS.maxHtmlChars,
  );
  const result = await fetchModel(
    [
      {
        role: "system",
        content:
          '你是中文招聘网站表单识别器。输入是已脱水的可见页面 HTML。按页面顺序识别所有需要填写的简历字段，排除搜索框、按钮、导航、说明、登录字段和验证码。字段名尽量使用页面原文。只返回 JSON：{"fields":[{"name":"区块名称","fields":[{"name":"字段名称"}]}],"sessionId":"local"}。',
      },
      { role: "user", content: JSON.stringify({ url: payload?.url || "", html }) },
    ],
    settings,
    5000,
  );
  return normalizeFields(result);
}

async function fillValues(payload, settings, resumeMd) {
  const result = await fetchModel(
    [
      {
        role: "system",
        content:
          '你是中文招聘表单填写助手。根据简历为每个字段生成准确值，禁止编造；未知值用空字符串，但不要遗漏字段。区块名和字段名必须与输入一致。一个字段含多个空位时使用“字段名 - 空位名”。下拉框优先使用字段已有候选文字。只返回 JSON：{"values":[{"name":"区块名","fields":[{"name":"字段名","value":"值"}]}],"sessionId":"local"}。',
      },
      {
        role: "user",
        content: JSON.stringify({
          url: payload?.url || "",
          company: payload?.company || "",
          position: payload?.position || "",
          fields: payload?.fields || [],
          resumeMd: payload?.resumeMd || resumeMd,
          webType: payload?.webType || "onestep:1",
        }),
      },
    ],
    settings,
    8000,
  );
  return normalizeValues(result);
}

export async function initializeLocalState() {
  const stored = await chrome.storage.local.get([
    "localModelSettings",
    "localResumeMd",
    "localResumeName",
    "auth",
    "beautifyResume",
    "learningResume",
    "helloOfferButtonMode",
    "highlightEnabled",
  ]);
  const patch = {};
  if (!Object.hasOwn(stored, "localModelSettings"))
    patch.localModelSettings = { ...DEFAULT_SETTINGS };
  if (!Object.hasOwn(stored, "localResumeMd"))
    patch.localResumeMd = DEFAULT_RESUME_MD;
  if (!Object.hasOwn(stored, "localResumeName"))
    patch.localResumeName = "本地简历";
  if (!stored.auth)
    patch.auth = {
      token: "local",
      userInfo: { nickname: "本地简历", orgId: 1 },
    };
  if (false !== stored.beautifyResume) patch.beautifyResume = false;
  if (false !== stored.learningResume) patch.learningResume = false;
  if (!stored.helloOfferButtonMode) patch.helloOfferButtonMode = "show";
  if (undefined === stored.highlightEnabled) patch.highlightEnabled = true;
  if (Object.keys(patch).length) await chrome.storage.local.set(patch);
}

export async function handleLocalEndpoint(name, payload = {}) {
  const stored = await chrome.storage.local.get([
    "localModelSettings",
    "localResumeMd",
    "localResumeName",
  ]);
  const settings = {
    ...DEFAULT_SETTINGS,
    ...(stored.localModelSettings || {}),
  };
  const resumeMd =
    "string" === typeof stored.localResumeMd
      ? stored.localResumeMd
      : DEFAULT_RESUME_MD;
  const resumeName =
    "string" === typeof stored.localResumeName && stored.localResumeName.trim()
      ? stored.localResumeName.trim()
      : "本地简历";

  switch (name) {
    case "initResume":
      return {
        status: "success",
        company: "",
        position: "",
        resumeId: 1,
        resumeList: [{ id: 1, name: resumeName, resumeMd }],
      };
    case "getResumeMd":
      return { resumeId: 1, resumeMd };
    case "saveResumeMd":
      await chrome.storage.local.set({
        localResumeMd: String(payload?.resumeMd || ""),
      });
      return { status: "success", resumeId: 1 };
    case "getQuota":
      return { remainQuota: Number.MAX_SAFE_INTEGER };
    case "getNeedField":
      return discoverFields(payload, settings);
    case "fillResumeValue":
    case "fillBlockResumeValue":
      return fillValues(payload, settings, resumeMd);
    case "getBlankItem":
      return {
        items: (Array.isArray(payload?.blanks) ? payload.blanks : []).map(
          () => null,
        ),
      };
    case "saveBlankItem":
      return { status: "success" };
    case "beautifyResumeMd":
      return { resumeId: 1, resumeMd: payload?.resumeMd || resumeMd };
    default:
      return { status: "success" };
  }
}
