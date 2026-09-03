const $ = (selector) => document.querySelector(selector);

function send(message) {
  return chrome.runtime.sendMessage(message);
}

function setStatus(text, error = false) {
  const status = $("#status");
  status.textContent = text;
  status.classList.toggle("error", error);
}

async function broadcast(action, state) {
  const tabs = await chrome.tabs.query({});
  await Promise.allSettled(tabs.map((tab) => chrome.tabs.sendMessage(tab.id, { action, state })));
}

document.addEventListener("DOMContentLoaded", async () => {
  const [response, stored] = await Promise.all([
    send({ type: "getLocalSettings" }),
    chrome.storage.local.get(["helloOfferButtonMode"]),
  ]);
  if (response?.settings) {
    $("#base-url").value = response.settings.baseUrl || "";
    $("#model").value = response.settings.model || "";
  }
  $("#button-mode").value = stored.helloOfferButtonMode || "show";

  $("#save").addEventListener("click", async () => {
    const result = await send({
      type: "saveLocalSettings",
      settings: {
        baseUrl: $("#base-url").value.trim(),
        model: $("#model").value.trim(),
        apiKey: $("#api-key").value.trim(),
      },
    });
    if (result?.success) {
      $("#api-key").value = "";
      setStatus("配置已保存。简历内容会发送到该模型用于生成填写值。");
    } else setStatus(result?.error || "保存失败", true);
  });

  $("#test").addEventListener("click", async () => {
    setStatus("正在测试模型连接…");
    const result = await send({ type: "testLocalModel" });
    setStatus(result?.success ? "模型连接成功。" : result?.error || "模型测试失败", !result?.success);
  });

  $("#resume").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("html/localResume.html") });
  });

  $("#button-mode").addEventListener("change", async (event) => {
    await chrome.storage.local.set({ helloOfferButtonMode: event.target.value });
    await broadcast("toggleHelloOfferButtonMode", event.target.value);
    setStatus("悬浮按钮显示方式已更新。");
  });
});
