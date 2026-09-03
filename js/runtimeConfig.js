// 内部虚拟地址只用于内容脚本与后台之间的消息路由，不会发起网络访问。
export const API_BASE_URL = "https://hello-offer.local/api/bridge/";
export const API_AUTH_URL = "https://hello-offer.local/api/auth/";
export const API_HISTORY_URL = "https://hello-offer.local/api/history/";
export const WEB_DOMAIN = "https://hello-offer.local";
export const WEB_URL = chrome.runtime.getURL("html/localResume.html");
export const LOGIN_URL = WEB_URL;
export const CAMPUS_URL = "";
export const HISTORY_URL = WEB_URL;
export const AUTOFILL_URL = WEB_URL;
export const VERSION_URL = "";
export const WELCOME_URL = WEB_URL;
export const PRICING_URL = WEB_URL;
export const ALL_WEB_URLS = [];
export const isDevEnv = () => true;
export const getEnv = () => "local";
