(async () => {
  let e = null,
    t = null,
    n = null,
    o = null,
    s = null;
  async function i() {
    try {
      (await (async function () {
        try {
          const o = document.createElement("div");
          if (
            ((o.id = "hello-offer-root"),
            (e = o.attachShadow({ mode: "open" })),
            document.body.appendChild(o),
            await (async function () {
              try {
                const { helloOfferButtonMode: e = "auto" } =
                  await chrome.storage.local.get(["helloOfferButtonMode"]);
                r(e);
              } catch (e) {}
            })(),
            (t = (function () {
              const t = document.createElement("button");
              t.id = "logo-button";
              const n = document.createElement("img");
              return (
                (n.src = chrome.runtime.getURL("image/icon128.png")),
                t.appendChild(n),
                e.appendChild(t),
                (function (e) {
                  let t = !1,
                    n = 0,
                    o = 0,
                    s = 0,
                    i = 0,
                    r = !1;
                  const a = 10,
                    c = (c) => {
                      if (!t) return;
                      const l = c.clientX - n,
                        u = c.clientY - o;
                      (Math.abs(l) > a || Math.abs(u) > a) && (r = !0);
                      let d = s + l,
                        m = i + u;
                      const w = e.getBoundingClientRect(),
                        h = w.width,
                        p = w.height,
                        y = window.innerWidth,
                        g = window.innerHeight;
                      ((d = Math.max(0, Math.min(d, y - h))),
                        (m = Math.max(0, Math.min(m, g - p))),
                        (e.style.position = "fixed"),
                        (e.style.left = `${d}px`),
                        (e.style.top = `${m}px`),
                        (e.style.right = "auto"),
                        (e.style.bottom = "auto"));
                    },
                    l = (n) => {
                      t &&
                        ((t = !1),
                        (e.style.cursor = "pointer"),
                        (e.style.userSelect = "auto"),
                        r &&
                          (n.preventDefault(),
                          n.stopPropagation(),
                          (e.style.pointerEvents = "none"),
                          setTimeout(() => {
                            e.style.pointerEvents = "auto";
                          }, 100)),
                        document.removeEventListener("mousemove", c),
                        document.removeEventListener("mouseup", l),
                        setTimeout(() => {
                          r = !1;
                        }, 200));
                    };
                  (e.addEventListener("mousedown", (a) => {
                    if (a.target === e || a.target === e.querySelector("img")) {
                      ((t = !0), (r = !1));
                      const u = e.getBoundingClientRect();
                      ((s = u.left),
                        (i = u.top),
                        (n = a.clientX),
                        (o = a.clientY),
                        a.preventDefault(),
                        (e.style.cursor = "grabbing"),
                        (e.style.userSelect = "none"),
                        document.addEventListener("mousemove", c),
                        document.addEventListener("mouseup", l));
                    }
                  }),
                    e.addEventListener(
                      "click",
                      (e) => {
                        if (r)
                          return (
                            e.preventDefault(),
                            e.stopPropagation(),
                            e.stopImmediatePropagation(),
                            !1
                          );
                      },
                      !0,
                    ));
                })(t),
                t
              );
            })()),
            !t)
          )
            return;
          if (
            ((n = await (async function () {
              const t = document.createElement("div");
              t.id = "resume-window-container";
              try {
                const e = await fetch(
                    chrome.runtime.getURL("html/floatingPanel.html"),
                  ),
                  n = await e.text();
                t.innerHTML = n;
              } catch (e) {
                return null;
              }
              e.appendChild(t);
              const n = t.querySelector("#resume-window");
              if (!n) return null;
              return (
                (t.querySelector("#header-logo").src =
                  chrome.runtime.getURL("image/icon128.png")),
                n
              );
            })()),
            !n)
          )
            return;
        } catch (e) {}
      })(),
        (function () {
          const t = document.createElement("link");
          ((t.rel = "stylesheet"),
            (t.href = chrome.runtime.getURL(
              "css/lib/font-awesome.all.min.css",
            )),
            e.appendChild(t));
          const n = document.createElement("link");
          ((n.rel = "stylesheet"),
            (n.href = chrome.runtime.getURL("css/lib/simplemde.min.css")),
            e.appendChild(n));
          const o = document.createElement("link");
          ((o.rel = "stylesheet"),
            (o.href = chrome.runtime.getURL("css/floatingPanel.css")),
            e.appendChild(o));
        })(),
        (function () {
          const e = chrome.runtime.getURL("webfonts/fa-solid-900.woff2");
          new FontFace("Font Awesome 6 Free", `url(${e})`, { weight: "900" })
            .load()
            .then((e) => {
              document.fonts.add(e);
            })
            .catch((e) => {});
        })(),
        await (async function (e, t) {
          if (!t) return;
          e.addEventListener("click", async () => {
            const { auth: e } = await chrome.storage.local.get(["auth"]);
            e ? c(!0) : alert("本地数据尚未初始化，请重新加载扩展。");
          });
          const n = t.querySelector("#close-window");
          n.addEventListener("click", () => {
            c(!1);
          });
          const o = t.querySelector("#start-button");
          o.addEventListener("click", () => {
            d();
          });
          const s = t.querySelector(".resume-header");
          s.addEventListener("click", () => {
            l();
          });
          const i = t.querySelector("#state-text");
          (i.addEventListener("click", () => {
            l();
          }),
            h());
          const r = t.querySelector("#beautify-checkbox"),
            a = await chrome.storage.local.get(["beautifyResume"]);
          ((r.checked = !0 === a.beautifyResume),
            r.addEventListener("change", (e) => {
              (b(e.target.checked),
                chrome.storage.local.set({ beautifyResume: e.target.checked }));
            }),
            T());
        })(t, n),
        (function () {
          if ("undefined" == typeof SimpleMDE) return void (x = "error");
          const t = e.querySelector("#resume-editor");
          if (!t) return void (x = "error");
          try {
            ((s = new SimpleMDE({
              autosave: { enabled: !0, uniqueId: "resume", delay: 1e3 },
              element: t,
              forceSync: !0,
              initialValue: "",
              placeholder: "请将简历粘贴到这里，建议使用Markdown格式",
              spellChecker: !1,
              status: ["autosave", "lines", "words"],
              toolbar: !1,
              autoDownloadFontAwesome: !1,
            })),
              e.querySelector(".CodeMirror").classList.add("normal-bg"));
            let i = "";
            (s.codemirror.on("change", () => {}),
              s.codemirror.on("focus", () => {
                i = s.value();
              }),
              s.codemirror.on("blur", () => {
                i !== s.value() &&
                  (async function (e) {
                    const t = n.querySelector("#state-text").textContent;
                    (q("简历已保存"),
                      setTimeout(() => {
                        q(t);
                      }, 3e3));
                    for (let t of o.resumeList)
                      if (t.id === o.resumeId) {
                        t.resumeMd = e;
                        break;
                      }
                    await (async function (e, t) {
                      const n = "saveResumeMd",
                        o = { resumeId: e, resumeMd: t };
                      return await C(n, o);
                    })(o.resumeId, e);
                  })(s.value());
              }),
              (x = "success"));
          } catch (e) {
            x = "error";
          }
        })(),
        k(),
        window.addEventListener(
          "resize",
          (function (e, t) {
            let n;
            return function (...o) {
              const s = () => {
                (clearTimeout(n), e(...o));
              };
              (clearTimeout(n), (n = setTimeout(s, t)));
            };
          })(k, 200),
        ));
    } catch (e) {}
  }
  function r(e) {
    const t = document.getElementById("hello-offer-root");
    if (t)
      if ("boolean" != typeof e)
        switch (e) {
          case "show":
            t.style.display = "block";
            break;
          case "auto":
            break;
          case "hidden":
            t.style.display = "none";
        }
      else t.style.display = e ? "block" : "none";
  }
  async function a() {
    try {
      const e =
        !1 !==
        (await chrome.storage.local.get(["highlightEnabled"])).highlightEnabled;
      document.documentElement.style.setProperty(
        "--highlight-enabled",
        e ? "1" : "0",
      );
    } catch (e) {
      document.documentElement.style.setProperty("--highlight-enabled", "1");
    }
  }
  async function c(e) {
    if (n)
      if (e) {
        if (
          (n.classList.add("min"),
          (n.style.display = "flex"),
          (n.style.opacity = "0"),
          await P(10),
          (n.style.opacity = "1"),
          await P(200),
          t && (t.style.display = "none"),
          "init" === x)
        )
          return (
            window.setStateText("初始化中...", "min"),
            void setTimeout(() => {
              l("show");
            }, 1e3)
          );
        if ("error" === x)
          return void window.setStateText(
            "初始化失败！我不行了，靠你咯...",
            "min",
          );
        o
          ? v()
            ? window.setStateText("Hello Offer 已就绪", "show")
            : (window.setStateText("请先填写公司和职位", "show"),
              await P(600),
              n.querySelector("#company-name").focus())
          : (window.setStateText("加载简历...", "min"),
            (o = await (async function () {
              const e = "initResume",
                t = { url: window.location.href };
              return await C(e, t);
            })()),
            "error" == o.status
              ? (o.detail && "用户没有简历" === o.detail
                  ? (await c(!1),
                    confirm("还没有可用简历，是否打开本地简历中心？") &&
                      openResumeEditor().catch(() =>
                        window.setStateText("无法打开简历中心", "show"),
                      ))
                  : window.setStateText(
                      "糟糕！简历请求失败，刷新再试试",
                      "min",
                    ),
                (o = null))
              : o
                ? (!(function (e) {
                    const t = n.querySelector("#company-name"),
                      o = n.querySelector("#position-name");
                    ((t.value = e.company || ""),
                      (o.value = e.position || ""),
                      window.campusSource &&
                        window.campusSource.company &&
                        (t.value = window.campusSource.company),
                      y(e.resumeList, e.resumeId));
                    for (const t of e.resumeList)
                      if (t.id === e.resumeId) {
                        E(t.resumeMd);
                        break;
                      }
                  })(o),
                  v()
                    ? window.setStateText("Hello Offer 已就绪", "show")
                    : (window.setStateText(
                        "请先填写公司和职位",
                        "show",
                      ),
                      await P(600),
                      n.querySelector("#company-name").focus()))
                : window.setStateText("糟糕！简历加载失败，刷新再试试", "min"));
      } else
        (t && (t.style.display = "block"),
          await P(10),
          (n.style.opacity = "0"),
          await P(200),
          (n.style.display = "none"),
          n.classList.add("min"));
  }
  async function l(e = null) {
    const t = n.querySelector(".resume-display");
    (null === e && (e = n.classList.contains("min") ? "show" : "min"),
      "show" === e && n.classList.contains("min")
        ? (n.classList.remove("min"),
          (t.style.display = "block"),
          await P(100),
          (t.style.opacity = "1"))
        : "min" !== e ||
          n.classList.contains("min") ||
          ((t.style.opacity = "0"),
          await P(200),
          (t.style.display = "none"),
          n.classList.add("min")));
  }
  let u = "ready";
  async function d() {
    if ("success" === x) {
      if (!v())
        return (
          alert("要先填写公司和职位，才能生成专岗美化简历哦！"),
          window.setStateText("请先填写公司和职位", "show"),
          void n.querySelector("#company-name").focus()
        );
      if (["ready", "success", "error", "quota"].includes(u)) {
        if (
          (
            await (async function () {
              const e = "getQuota",
                t = {};
              return await C(e, t);
            })()
          ).remainQuota <= 0
        ) {
          return (
            alert("当前模型额度不足或服务不可用，请检查模型配置。"),
            q("模型当前不可用"),
            void m("quota")
          );
        }
        (a(), m("running"));
        const e = n.querySelector("#company-name").value,
          t = n.querySelector("#position-name").value,
          s = n.querySelector("#resume-editor").value,
          i = o.resumeId;
        window.runFillResume(e, t, s, i, S(), (e) => {
          "success" == e.status ? m("success") : m("error");
        });
      } else "running" == u ? m("pause") : "pause" == u && m("running");
    }
  }
  function m(e) {
    u = e;
    const t = n.querySelector("#start-button");
    "running" == e
      ? ((t.innerHTML = '<i class="fas fa-pause"></i>'),
        t.classList.add("paused"))
      : "pause" == e
        ? ((t.innerHTML = '<i class="fas fa-play"></i>'),
          t.classList.remove("paused"))
        : "success" == e
          ? ((t.innerHTML = '<i class="fas fa-calendar-check"></i>'),
            t.classList.remove("paused"))
          : "error" == e
            ? ((t.innerHTML = '<i class="fas fa-bug"></i>'),
              t.classList.remove("paused"))
            : "quota" == e
              ? ((t.innerHTML = '<i class="fas fa-charging-station"></i>'),
                t.classList.remove("paused"))
              : "learning" == e &&
                (t.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i>');
  }
  async function w(e) {
    let t;
    ((o.resumeId = e), E(""), window.setStateText("获取简历中..."));
    for (const n of o.resumeList)
      if (Number(n.id) === Number(e)) {
        t = n;
        break;
      }
    if (t) {
      if (t.resumeMd) E(t.resumeMd);
      else {
        const t = await (async function (e) {
          const t = "getResumeMd",
            n = { resumeId: e };
          return await C(t, n);
        })(e);
        if (!t.resumeMd) return void window.setStateText("糟糕！简历不存在");
        E(t.resumeMd);
      }
      v()
        ? window.setStateText("Hello Offer 已就绪", "show")
        : (window.setStateText("请先填写公司和职位", "show"),
          n.querySelector("#company-name").focus());
    } else window.setStateText("未找到对应的简历");
  }
  function h() {
    const t = n.querySelector("#resume-version");
    if (!t) return;
    const o = t.querySelector(".resume-version-trigger"),
      s = t.querySelector(".resume-version-list");
    (o.addEventListener("click", (e) => {
      (e.stopPropagation(),
        (function () {
          const e = n.querySelector("#resume-version");
          if (!e) return;
          const t = e.classList.contains("open");
          if (t) p();
          else {
            e.classList.add("open");
            const t = e.querySelector(".resume-version-trigger"),
              n = e.querySelector(".resume-version-list");
            (t.setAttribute("aria-expanded", "true"), (n.hidden = !1));
          }
        })());
    }),
      s.addEventListener("click", (e) => {
        const t = e.target.closest(".resume-version-item");
        t &&
          (async function (e) {
            const t = n.querySelector("#resume-version"),
              o = t?.dataset.value;
            if ((p(), String(o) === String(e))) return;
            (g(e), await w(e));
          })(t.dataset.value);
      }),
      e.addEventListener("click", () => {
        p();
      }));
  }
  function p() {
    const e = n.querySelector("#resume-version");
    if (!e) return;
    e.classList.remove("open");
    const t = e.querySelector(".resume-version-trigger"),
      o = e.querySelector(".resume-version-list");
    (t.setAttribute("aria-expanded", "false"), (o.hidden = !0));
  }
  function y(e, t) {
    const o = n.querySelector("#resume-version");
    if (!o) return;
    const s = o.querySelector(".resume-version-list");
    let i = "";
    for (const n of e) {
      const e = String(n.id) === String(t);
      i += `<li class="resume-version-item${e ? " active" : ""}" role="option" data-value="${n.id}" aria-selected="${e}">${f(n)}</li>`;
    }
    ((s.innerHTML = i), g(t, e));
  }
  function g(e, t = null) {
    const s = n.querySelector("#resume-version");
    if (!s) return;
    const i = t || o?.resumeList || [],
      r = s.querySelector(".resume-version-label");
    let a = null;
    for (const t of i)
      if (String(t.id) === String(e)) {
        a = t;
        break;
      }
    ((s.dataset.value = e ?? ""),
      (r.innerHTML = a
        ? f(a)
        : '<span class="resume-version-item-title">请选择简历</span>'));
    s.querySelectorAll(".resume-version-item").forEach((t) => {
      const n = String(t.dataset.value) === String(e);
      (t.classList.toggle("active", n), t.setAttribute("aria-selected", n));
    });
  }
  function f(e) {
    const t = e?.type,
      n = Number(e?.version ?? 0);
    let o = "";
    "normal" === t
      ? 0 === n
        ? (o = "原始")
        : n >= 1 && n <= 3 && (o = "魔改")
      : "ats" === t
        ? (o = "机筛")
        : "special" === t && (o = "专岗");
    let s = "";
    if (o) {
      s = `<span class="resume-version-type ${"原始" === o ? "resume-version-type-origin" : "resume-version-type-purple"}">${o}</span>`;
    }
    return `${s}<span class="resume-version-item-title">${e.title}</span>`;
  }
  function b(e) {
    v()
      ? window.setStateText("Hello Offer 已就绪", "show")
      : (window.setStateText("请先填写公司和职位", "show"),
        n.querySelector("#company-name").focus());
  }
  function v() {
    if (S()) {
      const e = n.querySelector("#company-name"),
        t = n.querySelector("#position-name");
      return e.value && t.value;
    }
    return !0;
  }
  function S() {
    return n.querySelector("#beautify-checkbox").checked;
  }
  let L = null;
  function q(e, t = null) {
    const o = n.querySelector("#state-text");
    if (o.textContent !== e) {
      L && clearTimeout(L);
      let t = 0;
      o.textContent = "";
      const n = () => {
        t < e.length
          ? ((o.textContent += e.charAt(t)),
            t++,
            (L = setTimeout(n, 500 / e.length)))
          : (L = null);
      };
      n();
    }
    t && l(t);
  }
  function k() {
    if (!n) return;
    const t = window.innerHeight - 80;
    let o = 700;
    o > t && (o = Math.max(t, 600));
    const s = e.querySelector(".CodeMirror"),
      i = s.classList.contains("showNewVersion") ? 350 : 310;
    s.style.setProperty("height", o - i + "px", "important");
  }
  let x = "init";
  function E(e) {
    const t = () => {
      null === s ? setTimeout(t, 100) : s.codemirror.setValue(e);
    };
    t();
  }
  let M = null;
  function R(e) {
    M && clearTimeout(M);
    let t = 0;
    s.codemirror.setValue("");
    const n = () => {
      if (t < e.length) {
        const o = s.codemirror.getDoc(),
          i = o.lastLine(),
          r = { line: i, ch: o.getLine(i)?.length || 0 };
        if ((o.replaceRange(e.charAt(t), r), "\n" === e.charAt(t))) {
          s.codemirror
            .getScrollerElement()
            .querySelector(".CodeMirror-sizer")
            .scrollIntoView({ block: "end" });
        }
        (t++, (M = setTimeout(n, Math.floor(1e4 / e.length))));
      } else {
        M = null;
        s.codemirror
          .getScrollerElement()
          .querySelector(".CodeMirror-sizer")
          .scrollIntoView({ block: "start" });
      }
    };
    n();
  }
  async function C(e, t) {
    try {
      return await (async function (e, t = {}) {
        try {
          const n = await chrome.runtime.sendMessage({
            type: "fetchWithJwt",
            url: e,
            options: t,
          });
          if (n.error) throw new Error(n.error);
          return n;
        } catch (e) {
          throw (
            (window.isHttpResponseError = !0),
            (window.httpResponseErrorAct = "fetchWithJwt"),
            e
          );
        }
      })(`${window.config.API_BASE_URL}${e}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
    } catch (e) {
      return { status: "error", detail: e.message || "未知错误" };
    }
  }
  async function openResumeEditor() {
    const e = await chrome.runtime.sendMessage({ type: "openResumeEditor" });
    if (!e?.success) throw new Error(e?.error || "无法打开简历中心");
    return e;
  }
  function T() {
    const e = n.querySelector("#history-table-btn"),
      t = n.querySelector("#campus-table-btn"),
      o = n.querySelector("#my-resume-btn");
    (e &&
      e.addEventListener("click", () => {
        window.open(window.config.HISTORY_URL, "_blank");
      }),
      t &&
        t.addEventListener("click", () => {
          window.open(window.config.CAMPUS_URL, "_blank");
        }),
      o &&
        o.addEventListener("click", async () => {
          try {
            await openResumeEditor();
          } catch (e) {
            window.setStateText(e?.message || "无法打开简历中心", "show");
          }
        }));
  }
  async function I(t) {
    return new Promise(async (n) => {
      const o = e.querySelector("#star-rating-modal-step1");
      if (!o) return void n();
      const s = o.querySelector(".star-rating-overlay"),
        i = o.querySelector("#star-rating-website-count"),
        r = o.querySelector("#star-rating-field-count");
      (i && (i.textContent = t.websiteCount || 0),
        r && (r.textContent = t.fieldCount || 0),
        (o.style.display = "block"));
      const a = s.querySelector("#star-rating-not-interested"),
        c = s.querySelector("#star-rating-go-to-store");
      (a.addEventListener("click", async () => {
        const { websiteCount: e } = await chrome.storage.local.get([
          "websiteCount",
        ]);
        (await chrome.storage.local.set({
          starRatingCancelCount: Number(e) || 0,
        }),
          (o.style.display = "none"),
          n());
      }),
        c.addEventListener("click", async () => {
          o.style.display = "none";
          (navigator.userAgent.includes("Edg")
            ? window.open(
                "https://microsoftedge.microsoft.com/addons/detail/fhefgbbghlmmedjppiglmfkgeggaikno",
                "_blank",
              )
            : window.open(
                "https://chromewebstore.google.com/detail/ohjbldefcgdafflncjpnlajjnbkebjap",
                "_blank",
              ),
            await U(),
            n());
        }));
    });
  }
  async function U() {
    return new Promise(async (t) => {
      const n = e.querySelector("#star-rating-modal-step2");
      if (!n) return void t();
      const o = n.querySelector(".star-rating-overlay");
      n.style.display = "block";
      const s = o.querySelector("#star-rating-file-input"),
        i = o.querySelector("#star-rating-preview"),
        r = o.querySelector("#star-rating-cancel"),
        a = o.querySelector("#star-rating-submit"),
        c = o.querySelector("#star-rating-demo-img");
      c && (c.src = chrome.runtime.getURL("image/starRatingDemo.png"));
      let l = null;
      function u(e) {
        ((l = e),
          (i.innerHTML = `\n        <img src="${e}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">\n      `),
          (a.disabled = !1));
      }
      ((a.disabled = !0),
        (i.innerHTML =
          '\n      <div class="star-rating-preview-placeholder">\n        <div class="star-rating-preview-icon"><i class="fas fa-camera"></i></div>\n        <div>支持粘贴截图 或 上传图片文件</div>\n      </div>\n    '),
        i.addEventListener("click", () => {
          s.click();
        }),
        s.addEventListener("change", (e) => {
          const t = e.target.files[0];
          if (t && t.type.startsWith("image/")) {
            const e = new FileReader();
            ((e.onload = (e) => {
              u(e.target.result);
            }),
              e.readAsDataURL(t));
          }
        }));
      const d = async (e) => {
        const t = e.clipboardData.items;
        for (let n = 0; n < t.length; n++)
          if (-1 !== t[n].type.indexOf("image")) {
            e.preventDefault();
            const o = t[n].getAsFile(),
              s = new FileReader();
            ((s.onload = (e) => {
              u(e.target.result);
            }),
              s.readAsDataURL(o));
            break;
          }
      };
      document.addEventListener("paste", d);
      const m = () => {
        document.removeEventListener("paste", d);
      };
      (r.addEventListener("click", async () => {
        m();
        const { websiteCount: e } = await chrome.storage.local.get([
          "websiteCount",
        ]);
        (await chrome.storage.local.set({
          starRatingCancelCount: Number(e) || 0,
        }),
          (n.style.display = "none"),
          t());
      }),
        a.addEventListener("click", async () => {
          if (l) {
            ((a.disabled = !0), (a.textContent = "上传中..."));
            try {
              const { imageData: e, imageType: o } = await (async function (e) {
                  return new Promise((t, n) => {
                    const o = new Image();
                    ((o.onload = () => {
                      try {
                        const e = document.createElement("canvas");
                        ((e.width = o.width), (e.height = o.height));
                        e.getContext("2d").drawImage(o, 0, 0);
                        const n = e.toDataURL("image/png");
                        t({ imageData: n, imageType: "image/png" });
                      } catch (e) {
                        n(e);
                      }
                    }),
                      (o.onerror = () => {
                        n(new Error("图片加载失败"));
                      }),
                      (o.src = e));
                  });
                })(l),
                s = await chrome.runtime.sendMessage({
                  type: "uploadStarRating",
                  imageData: e,
                  imageType: o,
                });
              s && s.success
                ? (m(),
                  (n.style.display = "none"),
                  await chrome.storage.local.set({ starRatingUploaded: !0 }),
                  await A(),
                  t())
                : (alert("上传失败：" + (s?.error || "未知错误")),
                  (a.disabled = !1),
                  (a.textContent = "提交"));
            } catch (e) {
              (alert("上传失败：" + e.message),
                (a.disabled = !1),
                (a.textContent = "提交"));
            }
          }
        }));
    });
  }
  async function A() {
    return new Promise(async (t) => {
      const n = e.querySelector("#star-rating-modal-step3");
      if (!n) return void t();
      const o = n.querySelector(".star-rating-overlay");
      n.style.display = "block";
      o.querySelector("#star-rating-ok").addEventListener("click", () => {
        ((n.style.display = "none"), t());
      });
    });
  }
  (chrome.runtime.onMessage.addListener((e, t, o) => {
    return "toggleHelloOfferButtonMode" === e.action
      ? (r(e.state), o({ success: !0 }), !0)
      : "toggleHighlight" === e.action
        ? ((s = e.state),
          document.documentElement.style.setProperty(
            "--highlight-enabled",
            s ? "1" : "0",
          ),
          o({ success: !0 }),
          !0)
        : "toggleBeautifyResume" === e.action
          ? ((function (e) {
              const t = n.querySelector("#beautify-checkbox");
              ((e && !t.checked) || (!e && t.checked)) && t.click();
            })(e.state),
            o({ success: !0 }),
            !0)
          : void 0;
    var s;
  }),
    (window.setStateText = q),
    (window.isRunning = function () {
      return "running" === u;
    }),
    (window.bindBeautifyResume = function (e) {
      const { isNew: t, resumeItem: s, resumeId: i, resumeMd: r } = e;
      t
        ? ((s.resumeMd = r),
          o.resumeList.unshift(s),
          (o.resumeId = i),
          (o.company = n.querySelector("#company-name").value || ""),
          (o.position = n.querySelector("#position-name").value || ""),
          y(o.resumeList, i),
          R(r))
        : (g(i), R(r));
    }),
    (window.stopTypeResumeContent = function (e) {
      M && (clearTimeout(M), s.codemirror.setValue(e));
    }),
    (window.breatheJobInfo = async function () {
      const e = n.querySelector("#company-name"),
        t = n.querySelector("#position-name");
      (e.classList.remove("normal-bg"),
        t.classList.remove("normal-bg"),
        e.classList.add("breathing-bg"),
        t.classList.add("breathing-bg"),
        await P(5e3),
        e.classList.remove("breathing-bg"),
        t.classList.remove("breathing-bg"),
        e.classList.add("normal-bg"),
        t.classList.add("normal-bg"));
    }),
    (window.breatheResume = async function (t) {
      const n = e.querySelector(".CodeMirror");
      "begin" === t
        ? (n.classList.remove("normal-bg"), n.classList.add("breathing-bg"))
        : "end" === t &&
          (n.classList.remove("breathing-bg"), n.classList.add("normal-bg"));
    }),
    (window.changeStartButtonState = m),
    (window.initHighlight = a),
    (window.closeHighlight = async function () {
      (await P(500),
        document.documentElement.style.setProperty("--highlight-enabled", "0"));
    }),
    (window.showStarRatingModal = async function (t) {
      if (!e) return;
      const n = e.querySelector("#star-rating-modal-step1"),
        o = e.querySelector("#star-rating-modal-step2"),
        s = e.querySelector("#star-rating-modal-step3");
      (n && "block" === n.style.display) ||
        (o && "block" === o.style.display) ||
        (s && "block" === s.style.display) ||
        (await I(t));
    }),
    (window.campusSource = null));
  async function _() {
    try {
      const e = chrome.runtime.getManifest().version,
        { lastVersionCheck: t, latestVersion: o } =
          await chrome.storage.local.get(["lastVersionCheck", "latestVersion"]),
        s = Date.now();
      let i;
      if (t && o && s - t < 36e5) i = o;
      else
        try {
          const e = `${window.config.VERSION_URL}?t=${Date.now()}`,
            t = await fetch(e);
          if (!t.ok) throw new Error(`获取版本信息失败: ${t.status}`);
          ((i = (await t.text()).trim()),
            await chrome.storage.local.set({
              lastVersionCheck: s,
              latestVersion: i,
            }));
        } catch (e) {
          if (!o) throw e;
          i = o;
        }
      (function (e, t) {
        const n = e.split(".").map(Number),
          o = t.split(".").map(Number);
        for (let e = 0; e < Math.max(n.length, o.length); e++) {
          const t = n[e] || 0,
            s = o[e] || 0;
          if (t > s) return !0;
          if (t < s) return !1;
        }
        return !1;
      })(i, e) &&
        (function () {
          const e = n.querySelector("#version-notification");
          if (e) {
            e.style.display = "block";
            const t = n.querySelector(".CodeMirror");
            t && (t.classList.add("showNewVersion"), k());
            const o = e.querySelector("#update-now-btn");
            o &&
              o.addEventListener("click", () => {
                window.open(
                  `${window.config.AUTOFILL_URL}?newversion=true`,
                  "_blank",
                );
              });
          }
        })();
    } catch (e) {}
  }
  function P(e = 1e3) {
    return new Promise((t) => {
      setTimeout(() => {
        t();
      }, e);
    });
  }
  ((async () => {
    if (
      (window.config ||
        (await new Promise((e) => {
          Object.defineProperty(window, "config", {
            set(t) {
              (delete window.config, (window.config = t), e());
            },
            configurable: !0,
          });
        })),
      (function () {
        const e = new URL(window.location.href);
        return !!window.config.ALL_WEB_URLS.some((t) => e.href.startsWith(t));
      })())
    )
      return (
        (function () {
          const e = new URL(window.location.href);
          window.config.CAMPUS_URL &&
            e.href.startsWith(window.config.CAMPUS_URL) &&
            document.addEventListener(
              "click",
              (e) => {
                const t = e.target.closest("a");
                t?.dataset.campusId &&
                  t?.dataset.company &&
                  chrome.runtime.sendMessage(
                    {
                      type: "clickSource",
                      source: {
                        campusId: t.dataset.campusId,
                        company: t.dataset.company,
                      },
                    },
                    (e) => {},
                  );
              },
              !0,
            );
        })(),
        void (function () {
          const e = new URL(window.location.href);
          window.config.CAMPUS_URL &&
            e.href.startsWith(window.config.CAMPUS_URL) &&
            chrome.runtime.onMessage.addListener((e, t, n) => {
              "addHistoryCampusId" === e.type &&
                window.postMessage(
                  { type: "addHistoryCampusId", data: e.data },
                  "*",
                );
            });
        })()
      );
    (await new Promise((e) => {
      const t = new URL(window.location.href).href;
      function n(e, t) {
        const n = (e) => e.replace(/^https:\/\/www\./, "https://");
        return n(e).startsWith(n(t));
      }
      const o = [
        "https://xyz.51job.com/External/MyResume/FillInResume.aspx",
        "https://xyz.51job.com/consumer/pc/resume/index",
        "https://xiaoyuan.zhaopin.com/scrd/resume2",
      ];
      for (const s of o) if (n(t, s)) return void e(!0);
      const s = [
        "https://chat.deepseek.com/",
        "https://kimi.moonshot.cn/",
        "https://www.doubao.com/",
        "https://yiyan.baidu.com/",
        "https://tongyi.aliyun.com/qianwen/",
        "https://xinghuo.xfyun.cn/",
        "https://chatglm.cn/",
        "https://yuanbao.tencent.com/",
        "https://www.teleai.com.cn/",
        "https://www.baixing.com/",
        "https://chatgpt.com/",
        "https://gemini.google.com/",
        "https://copilot.microsoft.com/",
        "https://claude.ai/",
        "https://www.perplexity.ai/",
        "https://www.douyin.com/",
        "https://www.bilibili.com/",
        "https://www.kuaishou.com/",
        "https://www.xiaohongshu.com/",
        "https://v.qq.com/",
        "https://www.iqiyi.com/",
        "https://www.youku.com/",
        "https://cn.bing.com/",
        "https://www.baidu.com/",
        "https://www.sogou.com/",
        "https://www.so.com/",
        "https://hao.360.com/",
        "https://tieba.baidu.com/",
        "https://baike.baidu.com/",
        "https://wenku.baidu.com/",
        "https://pan.baidu.com/",
        "https://www.zhihu.com/",
        "https://weibo.com/",
        "https://www.douban.com/",
        "https://www.toutiao.com/",
        "https://www.163.com/",
        "https://www.sina.com.cn/",
        "https://www.sohu.com/",
        "https://www.taobao.com/",
        "https://www.jd.com/",
        "https://www.pinduoduo.com/",
        "https://www.meituan.com/",
        "https://www.csdn.net/",
        "https://juejin.cn/",
        "https://www.coze.cn/",
        "https://docs.qq.com/",
        "https://www.kdocs.cn/",
        "https://shimo.im/",
        "https://www.yuque.com/",
        "https://www.feishu.cn/",
        "https://www.dingtalk.com/",
        "https://www.wps.cn/",
        "https://word.cloud.microsoft/",
        "https://excel.cloud.microsoft/",
        "https://mail.qq.com/",
        "https://wx.mail.qq.com/",
        "https://mail.163.com/",
        "https://mail.126.com/",
        "https://qzone.qq.com/",
        "https://mp.weixin.qq.com/",
        "https://app.offerin.cn/",
        "https://www.givemeoc.com/",
        "https://we.51job.com/pc/search",
        "https://www.zhaopin.com/",
        "https://www.zhipin.com/web/geek/jobs",
        "https://www.zhipin.com/web/geek/chat",
        "https://www.zhipin.com/job_detail/",
        "https://www.iguopin.com/job/detail",
        "https://www.liepin.com/zhaopin/",
        "https://www.ncss.cn/student/jobs/index.html",
        "https://www.tatawangshen.com/",
        "https://www.quanzhi.com/",
        "https://www.nowcoder.com/",
        "https://www.qmjianli.com/",
      ];
      for (const o of s) if (n(t, o)) return void e(!1);
      const i = async () => {
          const { helloOfferButtonMode: t = "auto" } = await chrome.storage.local.get([
            "helloOfferButtonMode",
          ]);
          if ("show" === t) return (clearInterval(r), void e(!0));
          const n = document.body.innerText;
          /(?:^|[^\u4e00-\u9fa5])(简历|姓名)|(简历|姓名)(?:[^\u4e00-\u9fa5]|$)/.test(
            n,
          ) && (clearInterval(r), e(!0));
        },
        r = setInterval(i, 2e3);
      i();
    })) &&
      (chrome.runtime.sendMessage({ type: "getSource" }, (e) => {
        e?.source && (window.campusSource = e.source);
      }),
      await i(),
      navigator.userAgent.includes("Edg/") ||
        setTimeout(() => {
          _();
        }, 3e3));
  })(),
    (window.testStarRatingModal = async function (t = {}) {
      const { websiteCount: n = 25, fieldCount: o = 360, step: s = 1 } = t;
      if (!e) return;
      const i = { websiteCount: n, fieldCount: o };
      1 === s ? await I(i) : 2 === s ? await U() : 3 === s && (await A());
    }));
})();
