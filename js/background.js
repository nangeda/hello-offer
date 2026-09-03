import {
  DEFAULT_SETTINGS,
  endpointName,
  handleLocalEndpoint,
  initializeLocalState,
} from "./modelGateway.js";
import * as runtimeConfig from "./runtimeConfig.js";

async function initializeRuntime() {
  await initializeLocalState();
  await chrome.storage.local.set({
    config: {
      API_BASE_URL: runtimeConfig.API_BASE_URL,
      API_AUTH_URL: runtimeConfig.API_AUTH_URL,
      API_HISTORY_URL: runtimeConfig.API_HISTORY_URL,
      WEB_URL: runtimeConfig.WEB_URL,
      LOGIN_URL: runtimeConfig.LOGIN_URL,
      CAMPUS_URL: runtimeConfig.CAMPUS_URL,
      HISTORY_URL: runtimeConfig.HISTORY_URL,
      AUTOFILL_URL: runtimeConfig.AUTOFILL_URL,
      VERSION_URL: runtimeConfig.VERSION_URL,
      WELCOME_URL: runtimeConfig.WELCOME_URL,
      PRICING_URL: runtimeConfig.PRICING_URL,
      ALL_WEB_URLS: runtimeConfig.ALL_WEB_URLS,
    },
  });
}

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  await initializeRuntime();
  if (reason === "install") chrome.tabs.create({ url: chrome.runtime.getURL("html/localResume.html") });
});

chrome.runtime.onStartup.addListener(() => initializeRuntime());

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message?.type) {
        case "fetchWithJwt": {
          const payload = message.options?.body ? JSON.parse(message.options.body) : {};
          sendResponse(await handleLocalEndpoint(endpointName(message.url), payload));
          return;
        }
        case "getLocalSettings": {
          const stored = await chrome.storage.local.get(["localModelSettings"]);
          sendResponse({ success: true, settings: { ...DEFAULT_SETTINGS, ...(stored.localModelSettings || {}), apiKey: "" } });
          return;
        }
        case "saveLocalSettings": {
          const previous = await chrome.storage.local.get(["localModelSettings"]);
          const next = {
            ...DEFAULT_SETTINGS,
            ...(previous.localModelSettings || {}),
            ...(message.settings || {}),
          };
          // 空白 API Key 表示保持原值，避免弹窗回显密钥。
          if (!message.settings?.apiKey) next.apiKey = previous.localModelSettings?.apiKey || "";
          await chrome.storage.local.set({ localModelSettings: next });
          sendResponse({ success: true });
          return;
        }
        case "testLocalModel": {
          const result = await handleLocalEndpoint("getNeedField", {
            url: "local://connection-test",
            html: "<section><h2>基本信息</h2><label>姓名</label><input></section>",
          });
          sendResponse({ success: Array.isArray(result.fields), fields: result.fields });
          return;
        }
        case "getSource":
          sendResponse({ source: null });
          return;
        case "checkStarRating":
          sendResponse({ show: false });
          return;
        case "addHistory":
          sendResponse({ success: true });
          return;
        case "logError":
        case "learnField":
        case "stopLearnField":
        case "clickSource":
        case "getHistoryUrls":
        case "uploadStarRating":
          sendResponse({ success: true, urls: [] });
          return;
        default:
          sendResponse({ success: false, error: "unknown_message" });
      }
    } catch (error) {
      console.error("[Hello Offer]", error);
      sendResponse({ error: error?.message || String(error) });
    }
  })();
  return true;
});

initializeRuntime().catch((error) => console.error("[Hello Offer] 初始化失败", error));
