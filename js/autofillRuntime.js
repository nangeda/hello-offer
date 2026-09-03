"use strict";
(async () => {
  ((window.config = null),
    (window.runFillResume = null),
    (window.isHttpResponseError = !1),
    (window.httpResponseErrorAct = ""));
  let e = null,
    t = null,
    o = "",
    n = [],
    i = null,
    s = [],
    l = [],
    a = [],
    r = [],
    c = [],
    m = { inputDoms: [], selectDoms: [], radioDoms: [] },
    u = { inputItems: [], selectItems: [], radioItems: [] },
    d = [],
    f = [];
  function h() {
    ((t = null),
      (n = []),
      (i = document.body),
      (s = []),
      (l = []),
      (a = []),
      (r = []),
      (c = []),
      (m = { inputDoms: [], selectDoms: [], radioDoms: [] }),
      (u = { inputItems: [], selectItems: [], radioItems: [] }),
      (d = []),
      (f = []),
      b.stopObserveDomChanges(),
      g.resetParams(),
      b.resetParams(),
      y &&
        (clearInterval(y),
        (y = null),
        (k = ""),
        (function () {
          const e = g.cleanHtml(document.body);
          chrome.runtime.sendMessage(
            { type: "stopLearnField", url: window.location.href, html: e },
            (e) => {},
          );
        })()),
      (window.isHttpResponseError = !1),
      (window.httpResponseErrorAct = ""));
  }
  window.runFillResume = async (b, C, I, x, N, T = (e) => {}) => {
    let E = new Date();
    try {
      (window.setStateText("Hello Offer 启动中"),
        (e = w.chooseRuntime()),
        "platform" !== e.mode
          ? await (async function (w, b, y, k, v) {
              ((o = ""), h(), await g.preProcessPage());
              let S = await g.predictFillMode();
              "multistep" != S && (S = await g.fixBlockAddButton());
              "multistep" != S
                ? await (async function (e, o, n, h, p) {
                    const w = g.cleanHtml(document.body);
                    (g.findFieldByServer(w),
                      p && g.beautifyResumeByServer(e, o, n));
                    ((m = await g.getBlankDoms()),
                      (d = g.buildBlankFingerprints(m)),
                      (f = await g.getBlankItemByServer(d)),
                      g.getBlankModalItem(u, m, f),
                      window.setStateText("正在扫描网站...", "min"));
                    for (; !g.isGetModalFinished || !window.isRunning();)
                      (D(), await _(500));
                    (g.saveBlankItemToServer(d, f, u),
                      window.setStateText("尝试理解网站，请稍候...", "min"));
                    for (; !l.length || !window.isRunning();)
                      (D(), await _(500));
                    if (
                      (window.setStateText("正在标记简历字段...", "min"),
                      (s = g.handleFieldResponse(l)),
                      0 == s.length)
                    )
                      throw new Error("服务器返回错误");
                    if (
                      (g.findFieldDoms(s),
                      g.findBlankDoms(s, m),
                      (a = g.addItemsIntoFieldResponse(s, l, m, u)),
                      (a = g.deleteFieldItemsEmptyBlock(a)),
                      p)
                    ) {
                      let i = setInterval(() => {
                        if (t) {
                          if (!(n = t.resumeMd))
                            throw new Error("美化简历生成错误");
                          if (!(h = t.resumeId))
                            throw new Error("美化简历生成错误");
                          (g.fillResumeByServer(r, a, e, o, n, h),
                            i && (clearInterval(i), (i = null)));
                        }
                      }, 500);
                    } else g.fillResumeByServer(r, a, e, o, n, h);
                    g.highlightField(s);
                    for (; !g.isHighlightFinished || !window.isRunning();)
                      (D(), await _(500));
                    if (p) {
                      for (
                        window.setStateText(
                          "上网搜索该公司的岗位要求...",
                          "show",
                        ),
                          await window.breatheJobInfo(),
                          window.setStateText("针对岗位，生成专岗美化简历..."),
                          window.breatheResume("begin");
                        !t;
                      )
                        (D(), await _(500));
                      for (window.breatheResume("end"); !window.isRunning();)
                        (D(), await _(500));
                      (window.setStateText("专岗简历生成中..."),
                        window.bindBeautifyResume(t));
                      let e = 0;
                      for (; !r.length || !window.isRunning();)
                        (D(),
                          await _(500),
                          e++,
                          22 == e
                            ? window.setStateText("开始思考网站填写策略...")
                            : 60 == e
                              ? window.setStateText(
                                  "思考时间稍长，请耐心等候...",
                                )
                              : 90 == e &&
                                window.setStateText(
                                  "快要完成了，我在努力中...",
                                ));
                      window.stopTypeResumeContent(n);
                    } else {
                      (window.setStateText("正在理解简历...", "show"),
                        window.breatheResume("begin"));
                      let e = 0;
                      for (; !r.length || !window.isRunning();)
                        (D(),
                          await _(500),
                          e++,
                          16 == e
                            ? (window.breatheResume("end"),
                              window.setStateText("开始思考网站填写策略..."))
                            : 60 == e
                              ? window.setStateText(
                                  "思考时间稍长，请耐心等候...",
                                )
                              : 90 == e &&
                                window.setStateText(
                                  "快要完成了，我在努力中...",
                                ));
                      window.breatheResume("end");
                    }
                    (window.setStateText("尝试为你填写简历...", "min"),
                      await _(500),
                      (c = g.formatResumeValueJson(r)),
                      (c = g.washBlankValueJson(c)),
                      await g.fillBlankDoms(s, c, i));
                  })(w, b, y, k, v)
                : await (async function (t, o, w, b) {
                    const y = g.cleanHtml(document.body);
                    if (
                      (window.setStateText("尝试理解网站，请稍候...", "min"),
                      await g.findFieldByServer(y),
                      (s = g.handleFieldResponse(l)),
                      0 == s.length)
                    )
                      throw new Error("服务器返回错误");
                    (g.findFieldDoms(s), (n = p.findAllBlocks(s)));
                    for (const y of n) {
                      if ((h(), !p.checkBlockNeedFill(y))) continue;
                      if (((i = await p.findCurrentBlockDom(y)), null == i))
                        continue;
                      let n = g.cleanHtml(i);
                      for (
                        n = p.addBlockNameToHtml(y, n),
                          g.findFieldByServer(n),
                          m = await g.getBlankDoms(),
                          d = g.buildBlankFingerprints(m),
                          f = await g.getBlankItemByServer(d),
                          g.getBlankModalItem(u, m, f),
                          window.setStateText("正在扫描网站...", "min");
                        !g.isGetModalFinished || !window.isRunning();
                      )
                        (D(), await _(500));
                      for (
                        g.saveBlankItemToServer(d, f, u),
                          window.setStateText("尝试理解网站，请稍候...", "min");
                        !l.length || !window.isRunning();
                      )
                        (D(), await _(500));
                      if (0 == l[0].fields.length) {
                        ((await p.tryAutoCancelBlock(y, i)) ||
                          (window.setStateText(
                            "本栏无填写内容，请你点击取消按钮",
                            "show",
                          ),
                          await p.waitForUserClickSubmit(y, i),
                          window.setStateText("继续填写", "min")),
                          await _(1e3));
                        continue;
                      }
                      if (
                        (window.setStateText("正在标记简历字段...", "min"),
                        (s = g.handleFieldResponse(l)),
                        0 == s.length)
                      )
                        throw new Error("服务器返回错误");
                      if (
                        (p.findFieldDomsInBlock(s),
                        g.findBlankDoms(s, m),
                        p.checkAllBlankHaveValue(s))
                      ) {
                        ((await p.tryAutoSubmitBlock(y, i)) ||
                          (window.setStateText(
                            "本栏填完啦，请你保存本栏目",
                            "show",
                          ),
                          await p.waitForUserClickSubmit(y, i),
                          window.setStateText("继续填写", "min")),
                          await _(1e3));
                        continue;
                      }
                      for (
                        a = g.addItemsIntoFieldResponse(s, l, m, u),
                          a = g.deleteFieldItemsEmptyBlock(a),
                          g.fillBlockResumeByServer(r, a, t, o, w, b, e),
                          g.highlightField(s);
                        !g.isHighlightFinished || !window.isRunning();
                      )
                        (D(), await _(500));
                      (window.setStateText("正在理解简历...", "min"),
                        window.breatheResume("begin"));
                      let k = 0;
                      for (; !r.length || !window.isRunning();)
                        (D(),
                          await _(500),
                          k++,
                          16 == k
                            ? (window.breatheResume("end"),
                              window.setStateText("开始思考网站填写策略..."))
                            : 60 == k
                              ? window.setStateText(
                                  "思考时间稍长，请耐心等候...",
                                )
                              : 90 == k &&
                                window.setStateText(
                                  "快要完成了，我在努力中...",
                                ));
                      if (
                        (window.breatheResume("end"),
                        window.setStateText("尝试为你填写简历...", "min"),
                        await _(500),
                        (c = g.formatResumeValueJson(r)),
                        (c = g.washBlankValueJson(c)),
                        p.checkBlankValueJsonEmpty(c))
                      ) {
                        ((await p.tryAutoCancelBlock(y, i)) ||
                          (window.setStateText(
                            "本栏无填写内容，请你点击取消按钮",
                            "show",
                          ),
                          await p.waitForUserClickSubmit(y, i),
                          window.setStateText("继续填写", "min")),
                          await _(1e3));
                        continue;
                      }
                      const v = await p.buildTemplateFieldList(i, s);
                      if (0 == v.length) break;
                      const S = c;
                      for (let e = 0; e < S.length; e++) {
                        const t = S[e];
                        (await g.fillBlankDoms(s, [t], i), await _(500));
                        if (
                          ((await p.tryAutoSubmitBlock(y, i)) ||
                            (window.closeHighlight(),
                            window.setStateText(
                              "本栏我填完啦，请你补全空缺内容",
                              "show",
                            ),
                            await p.waitForUserClickSubmit(y, i),
                            window.setStateText("继续填写", "min"),
                            window.initHighlight()),
                          await _(1e3),
                          e >= S.length - 1)
                        )
                          break;
                        if (((i = document.body), !p.checkBlockRedraw(y)))
                          break;
                        if (
                          ((i = await p.findCurrentBlockDom(y, !0)), null == i)
                        )
                          break;
                        if (
                          (await p.matchTemplateFieldDoms(y, v, s, i),
                          0 == s.length)
                        )
                          break;
                      }
                    }
                  })(w, b, y, k);
            })(b, C, I, x, N)
          : await (async function (e, t, b, y, k) {
              ((o = ""), (n = w.findAllBlocks(k)));
              for (const o of n) {
                if ((h(), !p.checkBlockNeedFill(o))) continue;
                if (((i = await w.findCurrentBlockDom(k, o)), null == i))
                  continue;
                if (
                  ((l = await w.buildFieldResponseInBlock(k, i, o, b)),
                  0 == l[0].fields.length)
                ) {
                  ((await p.tryAutoCancelBlock(o, i)) ||
                    (window.setStateText(
                      "本栏无填写内容，请你点击取消按钮",
                      "show",
                    ),
                    await p.waitForUserClickSubmit(o, i),
                    window.setStateText("继续填写", "min")),
                    await _(1e3));
                  continue;
                }
                for (
                  m = await g.getBlankDoms(),
                    d = g.buildBlankFingerprints(m),
                    f = await g.getBlankItemByServer(d),
                    g.getBlankModalItem(u, m, f),
                    window.setStateText("正在扫描网站...", "min");
                  !g.isGetModalFinished || !window.isRunning();
                )
                  (D(), await _(500));
                for (
                  g.saveBlankItemToServer(d, f, u),
                    window.setStateText("尝试理解网站，请稍候...", "min");
                  !l.length || !window.isRunning();
                )
                  (D(), await _(500));
                if (
                  (window.setStateText("正在标记简历字段...", "min"),
                  (s = g.handleFieldResponse(l)),
                  0 == s.length)
                )
                  throw new Error("服务器返回错误");
                if (
                  (p.findFieldDomsInBlock(s),
                  g.findBlankDoms(s, m),
                  p.checkAllBlankHaveValue(s))
                ) {
                  ((await p.tryAutoSubmitBlock(o, i)) ||
                    (window.setStateText("本栏填完啦，请你保存本栏目", "show"),
                    await p.waitForUserClickSubmit(o, i),
                    window.setStateText("继续填写", "min")),
                    await _(1e3));
                  continue;
                }
                for (
                  a = g.addItemsIntoFieldResponse(s, l, m, u),
                    a = g.deleteFieldItemsEmptyBlock(a),
                    g.fillBlockResumeByServer(r, a, e, t, b, y, k),
                    g.highlightField(s);
                  !g.isHighlightFinished || !window.isRunning();
                )
                  (D(), await _(500));
                (window.setStateText("正在理解简历...", "min"),
                  window.breatheResume("begin"));
                let n = 0;
                for (; !r.length || !window.isRunning();)
                  (D(),
                    await _(500),
                    n++,
                    16 == n
                      ? (window.breatheResume("end"),
                        window.setStateText("开始思考网站填写策略..."))
                      : 60 == n
                        ? window.setStateText("思考时间稍长，请耐心等候...")
                        : 90 == n &&
                          window.setStateText("快要完成了，我在努力中..."));
                if (
                  (window.breatheResume("end"),
                  window.setStateText("尝试为你填写简历...", "min"),
                  await _(500),
                  (c = g.formatResumeValueJson(r)),
                  (c = g.washBlankValueJson(c)),
                  p.checkBlankValueJsonEmpty(c))
                ) {
                  ((await p.tryAutoCancelBlock(o, i)) ||
                    (window.setStateText(
                      "本栏无填写内容，请你点击取消按钮",
                      "show",
                    ),
                    await p.waitForUserClickSubmit(o, i),
                    window.setStateText("继续填写", "min")),
                    await _(1e3));
                  continue;
                }
                const v = await p.buildTemplateFieldList(i, s);
                if (0 == v.length) break;
                const S = c;
                for (let e = 0; e < S.length; e++) {
                  const t = S[e];
                  (await g.fillBlankDoms(s, [t], i),
                    await _(500),
                    "51job" == k.platform &&
                      1 == k.version &&
                      o.titleDom.scrollIntoView({ block: "center" }));
                  if (
                    ((await p.tryAutoSubmitBlock(o, i)) ||
                      (window.setStateText(
                        "本栏我填完啦，请你补全空缺内容",
                        "show",
                      ),
                      await p.waitForUserClickSubmit(o, i),
                      window.setStateText("继续填写", "min")),
                    await _(1e3),
                    e >= S.length - 1)
                  )
                    break;
                  if (
                    ((i = await w.addNextMultiSegment(k, o, v, s)), null == i)
                  )
                    break;
                }
              }
            })(b, C, I, x, e),
        window.setStateText("填写完成！剩下的空就交给你咯~", "show"),
        T({ status: "success" }),
        await (async function () {
          const e = await chrome.storage.local.get([
              "websiteCount",
              "fieldCount",
            ]),
            t = Number(e.websiteCount) || 0,
            o = Number(e.fieldCount) || 0;
          let n = 0;
          for (const e of r) for (const t of e.fields) t.value && n++;
          await chrome.storage.local.set({
            websiteCount: t + 1,
            fieldCount: o + n,
          });
        })(),
        (async function () {
          if (
            ((v = window.location.href),
            !(await (async function () {
              const e = await chrome.storage.local.get(["learningResume"]);
              return !1 !== e.learningResume;
            })()))
          )
            return;
          y ||
            (y = setInterval(() => {
              window.location.href !== v
                ? (clearInterval(y), (y = null), (v = window.location.href))
                : (function () {
                    const e = g.cleanHtml(document.body);
                    if (e === k) return;
                    if ("" === k) return void (k = e);
                    ((k = e),
                      chrome.runtime.sendMessage(
                        {
                          type: "learnField",
                          url: window.location.href,
                          html: e,
                        },
                        (e) => {},
                      ),
                      window.setStateText("正在智能学习你新填写的内容~"),
                      window.changeStartButtonState("learning"));
                  })();
            }, 5e3));
        })(),
        await (async function (e, t) {
          if (window.campusSource) {
            S("campus", { campusId: window.campusSource.campusId });
          } else {
            S("user", {
              url: await (async function () {
                try {
                  const e = window.location.href,
                    t = (
                      await chrome.runtime.sendMessage({
                        type: "getHistoryUrls",
                      })
                    ).filter((t) => t !== e),
                    o = ["position"],
                    n = ["login", "signin", "register", "resume"],
                    i = t.find((e) => {
                      const t = e.toLowerCase();
                      return (
                        o.some((e) => t.includes(e)) &&
                        !n.some((e) => t.includes(e))
                      );
                    });
                  if (i) return i;
                  const s = t.find((e) => {
                    const t = e.toLowerCase();
                    return !n.some((e) => t.includes(e));
                  });
                  return s || e;
                } catch (e) {
                  return window.location.href;
                }
              })(),
              company: e || "未知公司",
              position: t || "未知职位",
            });
          }
        })(b, C),
        await (async function (e, t) {
          try {
            const o = await (async function (e, t) {
              const o = (function (e, t) {
                const o = new Date(),
                  n = Math.floor((o - e) / 1e3);
                let i = 0;
                for (const e of t) for (const t of e.fields) t.value && i++;
                return n >= 6 && i >= 10;
              })(e, t);
              if (!o) return !1;
              const n = await chrome.storage.local.get([
                  "websiteCount",
                  "starRatingCancelCount",
                  "auth",
                ]),
                i = Number(n.websiteCount) || 0,
                s = Number(n.starRatingCancelCount) || 0;
              if (0 !== (Number(n.auth?.userInfo?.orgId) || 0)) return !1;
              if (i <= 20) return !1;
              if (s > 0 && i - s < 20) return !1;
              if (!B().startsWith("Edge")) {
                if (
                  !(await new Promise((e) => {
                    const t = new Image();
                    ((t.onload = () => e(!0)),
                      (t.onerror = () => e(!1)),
                      (t.src =
                        "https://www.google.com/favicon.ico?t=" + Date.now()),
                      setTimeout(() => e(!1), 1e4));
                  }))
                )
                  return !1;
              }
              if (
                await (async function () {
                  const { starRatingUploaded: e } =
                    await chrome.storage.local.get(["starRatingUploaded"]);
                  if (!0 === e) return !0;
                  try {
                    const e = await chrome.runtime.sendMessage({
                      type: "checkStarRating",
                    });
                    return (
                      !(!e || !0 !== e.uploaded) &&
                      (await chrome.storage.local.set({
                        starRatingUploaded: !0,
                      }),
                      !0)
                    );
                  } catch (e) {
                    return !1;
                  }
                })()
              )
                return !1;
              return !0;
            })(e, t);
            if (!o) return;
            const n = await chrome.storage.local.get([
              "websiteCount",
              "fieldCount",
            ]);
            window.showStarRatingModal &&
              window.showStarRatingModal({
                websiteCount: n.websiteCount || 0,
                fieldCount: n.fieldCount || 0,
              });
          } catch (e) {}
        })(E, r),
        window.closeHighlight());
    } catch (e) {
      const t = e.stack || "";
      let o = "未知函数";
      if (window.isHttpResponseError) o = window.httpResponseErrorAct;
      else {
        const e = t.split("\n");
        for (let t = 1; t < e.length; t++) {
          const n = e[t].trim();
          if (!n.includes("at new Error") && !n.includes("at catch")) {
            const e = n.match(/at\s+([^\s(]+)|at\s+[^(]*\(([^)]*)\)/);
            if (e) {
              if (
                ((o = e[1] || e[2] || "未知函数"),
                (o = o.split("/").pop().split(":")[0]),
                o.length <= 3)
              )
                continue;
              break;
            }
          }
        }
      }
      let n = "填写出错！我不行了，靠你咯...";
      (window.isHttpResponseError &&
        "string" == typeof e.message &&
        e.message &&
        e.message.length < 100 &&
        (n = `填写出错：${e.message}`),
        window.setStateText(n, "show"),
        T({ status: "error", error: e }));
      try {
        !(function (e, t, o, n, i) {
          const s = new Date(),
            l = Math.floor((s - o) / 1e3),
            a = B();
          let r = "Unknown";
          try {
            r = chrome.runtime.getManifest().version;
          } catch (e) {}
          chrome.runtime.sendMessage(
            {
              type: "logError",
              functionName: e,
              errorStack: t,
              duration: l,
              browser: a,
              version: r,
              resumeId: i,
              company: n || "",
            },
            (e) => {},
          );
        })(o, String(t), E, b, x);
      } catch (e) {}
    }
    return !0;
  };
  const g = {
      resetParams() {
        ((g.blockRemoveDoms = []),
          (g.isGetModalFinished = !1),
          (g.isHighlightFinished = !1));
      },
      async preProcessPage() {
        const e = window.location.hostname;
        if (window.location.href.includes(".zhaopin.com/zk/")) {
          const e = document.querySelectorAll(".form-box .el-row .deleteBtn");
          for (const t of e) (await b.clickDom(t), await _(10));
        } else if (e.includes("job.chinatelecom.com.cn")) {
          const e = document.querySelectorAll(
            "#myForm .edit-resume-div.itemHidden .wt-icon580-60 p",
          );
          for (const t of e) (await b.clickDom(t), await _(10));
        } else if (e.includes("hr.cabr.com.cn")) {
          const e = document.querySelectorAll(
            ".ivu-collapse .collapseItem:not(.ivu-collapse-item-active) p.fieldSetDesc",
          );
          for (const t of e) (await b.clickDom(t), await _(10));
        }
      },
      async predictFillMode() {
        const e = b.documentQuerySelectorAll();
        let t;
        const o = [];
        for (const t of e) {
          const e = b.washTextSymbol(t.textContent);
          (/^(保存)$/.test(e) ||
            (/^(确定|完成|取消|关闭|\s)+$/.test(e) &&
              /(确定|完成)/.test(e) &&
              /(取消|关闭)/.test(e))) &&
            o.push(t);
        }
        if (
          ((t = b.filterDomsLeaveChildren(o)),
          (t = t.filter(b.isDomVisible)),
          t.length >= 5)
        )
          return "multistep";
        const n = [];
        for (const t of e) {
          const e = b.washTextSymbol(t.textContent);
          /^(编辑|修改)$/.test(e) && n.push(t);
        }
        return (
          (t = b.filterDomsLeaveChildren(n)),
          t.length >= 2 ? "multistep" : "onestep"
        );
      },
      async fixBlockAddButton() {
        const e = b.documentQuerySelectorAll(),
          t = [];
        for (const o of e) {
          const e = o.textContent.trim();
          /^[\+ ]*(继续)?(添加|增加|新增)/.test(e) &&
            !/职位/.test(e) &&
            t.push(o);
        }
        if (0 == t.length)
          for (const o of e) {
            if ("I" != o.tagName) continue;
            const e = o.className ? o.className.toLowerCase() : "";
            /(?:^|[^a-z])(add|plus)(?:[^a-z]|$)/.test(e) &&
              "" === o.parentNode.textContent.trim() &&
              b.isDomVisible(o) &&
              t.push(o.parentNode);
          }
        const o = b.filterDomsLeaveChildren(t);
        for (const e of o) {
          (e.scrollIntoView({ block: "center" }),
            await _(100),
            b.observeDomChanges(),
            await b.clickDom(e),
            await _(200),
            b.stopObserveDomChanges());
          const t = g._getNewBlockDoms();
          if (0 == t.length) continue;
          if (g._hasSaveButtonInBlock(t))
            return (await g._closeBlockDom(t), "multistep");
          g._hasSameDomBefore(t) && (await g._deleteBlockDom(t));
        }
        return (await _(100), "onestep");
      },
      _hasSaveButtonInBlock(e) {
        for (const t of e) {
          const e = t.querySelectorAll("*");
          for (const t of e) {
            const e = b.washTextSymbol(t.textContent);
            if (
              (/^(保存)$/.test(e) ||
                (/^(确定|完成|取消|关闭|\s)+$/.test(e) &&
                  /(确定|完成)/.test(e) &&
                  /(取消|关闭)/.test(e))) &&
              b.isDomVisible(t)
            )
              return !0;
          }
        }
        return !1;
      },
      async _closeBlockDom(e) {
        for (const t of e) {
          const e = t.querySelectorAll("*");
          for (const t of e) {
            const e = b.washTextSymbol(t.textContent);
            if (
              /^(保存|确定|完成|取消|关闭|\s)+$/.test(e) &&
              /(保存|确定|完成)/.test(e) &&
              /(取消|关闭)/.test(e) &&
              b.isDomVisible(t)
            ) {
              const e = t.querySelectorAll("*");
              for (const t of e) {
                const e = b.washTextSymbol(t.textContent);
                if (/^(取消|关闭)$/.test(e))
                  return (await b.clickDom(t), void (await _(100)));
              }
            }
          }
        }
        for (const t of e) {
          const e = t.querySelectorAll("*");
          for (const t of e) {
            const e = b.washTextSymbol(t.textContent);
            if (/^(取消|关闭)$/.test(e) && b.isDomVisible(t))
              return (await b.clickDom(t), void (await _(100)));
          }
        }
        for (const t of e) {
          const e = t.querySelectorAll("i");
          for (const t of e) {
            const e = t.className ? t.className.toLowerCase() : "";
            if (/(?:^|[^a-z])close(?:[^a-z]|$)/.test(e) && b.isDomVisible(t))
              return (await b.clickDom(t), void (await _(100)));
          }
        }
      },
      _getNewBlockDoms() {
        const e = [];
        for (const t of b.observeAddDoms) {
          if (!b.isDomVisible(t)) continue;
          const o = t.textContent.trim();
          /[\u4e00-\u9fa5]/.test(o) && e.push(t);
        }
        g.blockRemoveDoms = [];
        for (const t of e) g._checkBlockRemoveBtn(t);
        return e;
      },
      async _matchTemplateFieldDoms(e, t) {
        const o = [];
        for (const t of e) {
          const e = window.innerHeight,
            n = t.getBoundingClientRect(),
            i = window.scrollY + n.top - e / 2;
          (window.scrollTo({ top: i, left: 0, behavior: "instant" }),
            await _(10));
          const s = g._getCertainInputDoms(t.querySelectorAll("*"));
          let l = s.inputDoms,
            a = s.selectDoms;
          const r = g._getBorderHeightList(l);
          ((l = g._getPossibleInputDoms(l, a, r, t.querySelectorAll("*"))),
            (l = g._uniqueSamePositionInputDoms(l)),
            o.push(...l));
        }
        for (const e of o)
          b.isDomDisabled(e) ||
            b.isDomFilled(e) ||
            (await b.focusDom(e), await _(20), await b.blurDom(e), await _(10));
        await _(600);
        const n = g._findFieldDomInNewBlockDoms(e, t.fields);
        if (!n) return null;
        for (const e of n) {
          e.field.dom && b.setHelloOfferMark(e.field.dom, "yellow");
          for (const t of e.blanks) b.setHelloOfferMark(t.dom, "green");
        }
        return n;
      },
      _findFieldDomInNewBlockDoms(e, t) {
        const o = [];
        for (const t of e) (o.push(t), o.push(...t.querySelectorAll("*")));
        const n = JSON.parse(
          JSON.stringify(t, (e, t) => (t instanceof HTMLElement ? null : t)),
        );
        for (let e = 0; e < t.length; e++) {
          const i = t[e],
            s = n[e];
          let l = null;
          if (i.field.dom) {
            if (((l = g._findSimilarDom(o, i.field.dom)), !l)) return null;
            ((s.field.dom = l), o.splice(0, o.indexOf(l) + 1));
          }
          for (let e = 0; e < i.blanks.length; e++) {
            const t = i.blanks[e],
              n = s.blanks[e];
            if (((l = g._findSimilarDom(o, t.dom)), !l)) return null;
            ((n.dom = l), o.splice(0, o.indexOf(l) + 1));
          }
        }
        return n;
      },
      _findSimilarDom(e, t) {
        for (const o of e) {
          if (o.tagName !== t.tagName) continue;
          if (
            ("string" != typeof o.className ||
              "string" != typeof t.className) &&
            o.className != t.className
          )
            continue;
          if (
            o.className.replace(/\s*hello-offer-mark-\w+/g, "") !==
            t.className.replace(/\s*hello-offer-mark-\w+/g, "")
          )
            continue;
          if (o.textContent.trim() !== t.textContent.trim()) continue;
          let e = t.parentElement,
            n = o.parentElement,
            i = !0;
          for (; e && n && e !== n;) {
            if (e.tagName !== n.tagName) {
              i = !1;
              break;
            }
            if (
              "string" != typeof e.className ||
              "string" != typeof n.className
            ) {
              if (e.className == n.className) {
                ((e = e.parentElement), (n = n.parentElement));
                continue;
              }
              i = !1;
              break;
            }
            const t = e.className.replace(/\s*hello-offer-mark-\w+/g, ""),
              o = n.className.replace(/\s*hello-offer-mark-\w+/g, "");
            if (t === o) {
              ((e = e.parentElement), (n = n.parentElement));
              continue;
            }
            if (t.length === o.length) {
              const i = /[^a-zA-Z0-9]/g;
              let s = [...t.matchAll(i)],
                l = [...o.matchAll(i)];
              const a = s.length === l.length,
                r = s.every((e, t) => {
                  const o = l[t];
                  return e.index === o.index && e[0] === o[0];
                });
              if (a && r) {
                ((e = e.parentElement), (n = n.parentElement));
                continue;
              }
            }
            const s = t.trim().split(/\s+/),
              l = o.trim().split(/\s+/),
              a = s.filter((e) => !l.includes(e)),
              r = l.filter((e) => !s.includes(e));
            let c = !0;
            for (const e of [...a, ...r])
              if (
                !/focus|active|selected|hover|success|error|alert|red|warning/.test(
                  e,
                )
              ) {
                c = !1;
                break;
              }
            if (!c) {
              i = !1;
              break;
            }
            ((e = e.parentElement), (n = n.parentElement));
          }
          if (i) return o;
        }
        return null;
      },
      blockRemoveDoms: [],
      _checkBlockRemoveBtn(e) {
        const t = e.querySelectorAll("*");
        for (const e of t) {
          let t = !1;
          if (!t && e.innerText) {
            const o = e.innerText.trim();
            /^(删\s*除|移\s*除).{0,4}$/.test(o) && (t = !0);
          }
          t && g.blockRemoveDoms.push(e);
        }
        for (const e of t) {
          if (g.blockRemoveDoms.includes(e)) continue;
          let t = !1;
          const o = e.attributes;
          for (const e of o) {
            const o = e.value;
            if (
              /(?:^|\W+)(shanchu|(del|delete|remove|trash)(|btn|button)|删\s*除|移\s*除)(?:[^a-zA-Z]+|$)/i.test(
                o,
              )
            ) {
              t = !0;
              break;
            }
            if (
              /(?:^|\W+)([Ss]hanchu|[Dd]elete|[Rr]emove|[Tt]rash)(?:[A-Z0-9]|$)/.test(
                o,
              )
            ) {
              t = !0;
              break;
            }
          }
          t && g.blockRemoveDoms.push(e);
        }
      },
      _hasSameDomBefore(e) {
        let t = [];
        for (const o of e) {
          t.push(o);
          const e = Array.from(o.querySelectorAll("*"));
          t = t.concat(e);
        }
        t = t.reverse();
        const o = e[0],
          n = b.documentQuerySelectorAll().reverse();
        let i = 0,
          s = !1;
        for (let e = 0; e < n.length; e++) {
          const l = n[e];
          if (l === o) {
            s = !0;
            continue;
          }
          if (!s) continue;
          if (i >= t.length) return !0;
          const a = t[i];
          if (
            l.nodeType === a.nodeType &&
            l.tagName === a.tagName &&
            l.className === a.className
          ) {
            const e = Array.from(l.attributes)
                .filter((e) => "style" !== e.name)
                .map((e) => e.name)
                .sort(),
              t = Array.from(a.attributes)
                .filter((e) => "style" !== e.name)
                .map((e) => e.name)
                .sort();
            if (JSON.stringify(e) === JSON.stringify(t)) {
              i++;
              continue;
            }
          }
          if (
            l.nodeType === a.nodeType &&
            l.tagName === a.tagName &&
            "object" == typeof l.className &&
            "object" == typeof a.className
          ) {
            i++;
            continue;
          }
          if (
            l.nodeType === a.nodeType &&
            l.tagName === a.tagName &&
            "string" == typeof l.className &&
            "string" == typeof a.className
          ) {
            const e = g._isClassNameSimilar(l.className, a.className),
              t = Array.from(l.attributes)
                .map((e) => e.name)
                .sort(),
              o = Array.from(a.attributes)
                .map((e) => e.name)
                .sort(),
              n = JSON.stringify(t) === JSON.stringify(o);
            if (e && n && "" !== l.innerText && "" !== a.innerText) {
              if (l.innerText === a.innerText) {
                i++;
                continue;
              }
              {
                const e = Math.max(l.innerHTML.length, a.innerHTML.length),
                  t = Math.min(l.innerHTML.length, a.innerHTML.length);
                if (e > 100 && t / e > 0.8) {
                  if (g._isDomSimilar(l, a)) {
                    i++;
                    continue;
                  }
                }
              }
            }
          }
          const r = /^[\+\- ]*(添加|增加|新增|删除|移除|收起|展开)/;
          if (
            l.innerText &&
            !r.test(l.innerText) &&
            !g._isActionIconButton(l)
          ) {
            if (
              a.innerText &&
              !r.test(a.innerText) &&
              !g._isActionIconButton(a)
            )
              break;
            (i++, e--);
          }
        }
        return !1;
      },
      _isClassNameSimilar(e, t) {
        if (e.length === t.length) {
          const o = /[^a-zA-Z0-9]/g;
          let n = [...e.matchAll(o)],
            i = [...t.matchAll(o)];
          const s = n.length === i.length,
            l = n.every((e, t) => {
              const o = i[t];
              return e.index === o.index && e[0] === o[0];
            });
          return s && l;
        }
        const [o, n] = e.length < t.length ? [e, t] : [t, e],
          i = o
            .trim()
            .split(/\s+/)
            .filter((e) => e),
          s = n
            .trim()
            .split(/\s+/)
            .filter((e) => e),
          l =
            /(?:^|\W+)(hide|show|hidden|visible|display|opacity|fade|toggle)(|d|ing|ed|able)(?:[^a-zA-Z]+|$)/i,
          a =
            /(?:^|\W+)([Hh]ide|[Ss]how|[Hh]idden|[Vv]isible|[Dd]isplay|[Oo]pacity|[Ff]ade|[Tt]oggle)(?:[A-Z0-9]|$)/,
          r = s.filter((e) => !i.includes(e));
        if (!r.every((e) => l.test(e) || a.test(e))) return !1;
        const c = s.filter((e) => !r.includes(e));
        if (c.length !== i.length) return !1;
        return c.every((e) => i.includes(e));
      },
      _isDomSimilar: (e, t) =>
        g._calculateTextSimilarity(e.innerHTML, t.innerHTML) > 80,
      _calculateTextSimilarity(e, t) {
        ((e = e.replace(/\s+/g, "")), (t = t.replace(/\s+/g, "")));
        Math.max(e.length, t.length);
        if (0 === Math.min(e.length, t.length)) return 0;
        if (e === t) return 100;
        const o = e.match(new RegExp(".{1,1000}", "g")) || [],
          n = t.match(new RegExp(".{1,1000}", "g")) || [];
        let i = 0;
        const s = Math.max(o.length, n.length);
        for (let e = 0; e < s; e++) {
          const t = o[e] || "",
            s = n[e] || "";
          let l = 0;
          const a = Math.min(t.length, s.length);
          for (let e = 0; e < a; e++) t[e] === s[e] && l++;
          i += l;
        }
        return ((2 * i) / (e.length + t.length)) * 100;
      },
      _isActionIconButton(e) {
        if (!e || !e.className || "string" != typeof e.className) return !1;
        const t = e.className,
          o =
            /(?:^|\W+)(shanchu|delete|remove|trash|add|plus|minus|edit|modify|update|save|cancel|confirm)(|btn|button)(?:[^a-zA-Z]+|$)/i.test(
              t,
            ) ||
            /(?:^|\W+)([Ss]hanchu|[Dd]elete|[Rr]emove|[Tt]rash|[Aa]dd|[Pp]lus|[Mm]inus|[Ee]dit|[Mm]odify|[Uu]pdate|[Ss]ave|[Cc]ancel|[Cc]onfirm)(?:[A-Z0-9]|$)/.test(
              t,
            ),
          n =
            /(?:^|\W+)(ico|icon|btn|button|fa|fas|far|iconfont|symbol)(?:[^a-zA-Z]+|$)/i.test(
              t,
            ) ||
            /(?:^|\W+)([Ii]co|[Ii]con|[Bb]tn|[Bb]utton|[Ff]a|[Ff]as|[Ff]ar|[Ii]confont|[Ss]ymbol)(?:[A-Z0-9]|$)/.test(
              t,
            );
        return o && n;
      },
      async _deleteBlockDom(e) {
        const t = b.filterDomsLeaveChildren(g.blockRemoveDoms);
        t.reverse();
        for (const o of t) {
          (b.observeDomChanges(),
            await b.clickDom(o),
            await _(100),
            b.stopObserveDomChanges());
          for (const e of b.observeAddDoms)
            (b.getModalDeleteDoms(e), await b.clickDeleteModal());
          await _(100);
          let t = !0;
          for (const o of e)
            if (b.isDomVisible(o)) {
              t = !1;
              break;
            }
          if (t) return;
        }
      },
      cleanHtml(e) {
        const { clone: t, stylesMap: o } = g._cloneWithStyles(e),
          n = t;
        let i = [];
        g._inlineIframeDoms(e, n, o);
        const s = ["hello-offer-root"];
        for (const e of s) {
          const t = n.querySelector(`#${e}`);
          t && t.parentNode && t.remove();
        }
        i = n.querySelectorAll("*");
        for (const e of i) g._isCloneDomVisible(e, o) || e.remove();
        (g._removeCommentNodes(n),
          (i = n.querySelectorAll(
            "noscript, script, link, style, img, canvas, svg",
          )));
        for (const e of i) e.remove();
        const l = n.querySelectorAll("*");
        for (const e of l)
          if (e.childNodes.length > 0)
            for (const t of e.childNodes)
              t.nodeType === Node.TEXT_NODE &&
                (t.nodeValue = t.nodeValue.replace(/\n\s*\n+/g, " ").trim());
        i = n.querySelectorAll("input, textarea");
        for (const e of i)
          if (e.value) {
            const t = document.createElement("span");
            ((t.textContent = e.value), e.parentNode.replaceChild(t, e));
          }
        i = n.querySelectorAll("select");
        for (const e of i) {
          const t = document.createElement("span"),
            o = e.querySelector(`option[value="${e.value}"]`);
          ((t.textContent = o ? o.textContent : e.value),
            e.parentNode.replaceChild(t, e));
        }
        i = n.querySelectorAll("*");
        for (const e of i) "" === (e.textContent || "").trim() && e.remove();
        i = n.querySelectorAll("*");
        for (const e of i)
          for (const t of Array.from(e.attributes)) e.removeAttribute(t.name);
        return n.innerHTML.trim();
      },
      _inlineIframeDoms(e, t, o) {
        const n = e.querySelectorAll("iframe"),
          i = t.querySelectorAll("iframe"),
          s = Math.min(n.length, i.length);
        for (let e = 0; e < s; e++) {
          const s = n[e],
            l = i[e],
            a = b.getIframeBody(s);
          if (null == a || null == l.parentNode) continue;
          const r = g._cloneWithStyles(a),
            c = r.clone;
          for (const [e, t] of r.stylesMap.entries()) o.set(e, t);
          g._inlineIframeDoms(a, c, o);
          const m = t.ownerDocument.createElement("div");
          for (; c.firstChild;) m.appendChild(c.firstChild);
          l.parentNode.replaceChild(m, l);
          const u = o.get(l) || {
            display: "block",
            visibility: "visible",
            opacity: "1",
          };
          o.set(m, u);
        }
      },
      _removeCommentNodes(e) {
        const t = e.childNodes;
        for (let e = t.length - 1; e >= 0; e--) {
          const o = t[e];
          o.nodeType === Node.COMMENT_NODE ||
          (o.nodeType === Node.TEXT_NODE && "" === (o.nodeValue || "").trim())
            ? o.remove()
            : o.nodeType === Node.ELEMENT_NODE && g._removeCommentNodes(o);
        }
      },
      _cloneWithStyles(e) {
        const t = e.cloneNode(!0),
          o = e.querySelectorAll("*"),
          n = t.querySelectorAll("*"),
          i = new Map();
        let s = 0;
        for (const e of o) {
          const t = b.getComputedStyle(e),
            o = {
              display: t.display,
              visibility: t.visibility,
              opacity: t.opacity,
            };
          (i.set(n[s], o), s++);
        }
        return { clone: t, stylesMap: i };
      },
      _isCloneDomVisible(e, t) {
        const o = t.get(e);
        return (
          !o ||
          ("none" !== o.display &&
            "hidden" !== o.visibility &&
            "0" !== o.opacity &&
            !e.hidden)
        );
      },
      async findFieldByServer(e) {
        try {
          const t = await I(`${window.config.API_BASE_URL}getNeedField`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: o,
              url: window.location.href,
              browser: B(),
              version: chrome.runtime.getManifest().version,
              html: e,
            }),
          });
          ((l = t.fields), (o = t.sessionId));
        } catch (e) {
          throw (
            (window.isHttpResponseError = !0),
            (window.httpResponseErrorAct = "getNeedField"),
            e
          );
        }
        return null;
      },
      async beautifyResumeByServer(e, o, n) {
        try {
          t = await I(`${window.config.API_BASE_URL}beautifyResumeMd`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: window.location.href,
              version: chrome.runtime.getManifest().version,
              company: e,
              position: o,
              resumeMd: n,
            }),
          });
        } catch (e) {
          throw (
            (window.isHttpResponseError = !0),
            (window.httpResponseErrorAct = "beautifyResumeMd"),
            e
          );
        }
        return null;
      },
      async getBlankDoms() {
        (await b.scrollToRealTop(), await _(10));
        const e = g._getCertainInputDoms(b.documentQuerySelectorAll());
        let t = e.inputDoms,
          o = e.selectDoms;
        const n = e.radioDoms;
        let i = g._getBorderHeightList(t);
        if (
          ((t = g._getPossibleInputDoms(t, o, i, b.documentQuerySelectorAll())),
          0 == t.length &&
            ((t = g._getPossibleSelectDoms(b.documentQuerySelectorAll())),
            t.length))
        ) {
          let e = g._getBorderHeightList(t);
          t = g._getPossibleInputDoms(t, o, e, b.documentQuerySelectorAll());
        }
        return (
          (t = g._uniqueSamePositionInputDoms(t)),
          { inputDoms: t, selectDoms: o, radioDoms: n }
        );
      },
      _getCertainInputDoms(e) {
        let t = [],
          o = [],
          n = [];
        for (const i of e) {
          let e = !1,
            s = !1,
            l = !1;
          if (i.getBoundingClientRect().bottom <= 150) continue;
          const a = i.getAttribute("placeholder"),
            r = i.getAttribute("title");
          if (
            ((a &&
              "TEXTAREA" != i.tagName &&
              !/^\s*(搜索|查找)/.test(a) &&
              !/^\s*(搜索|查找)/.test(r)) ||
            i.classList.contains("ant-select")
              ? (e = !0)
              : "INPUT" !== i.tagName ||
                  /^\s*(搜索|查找)/.test(a) ||
                  /^\s*(搜索|查找)/.test(r) ||
                  !["text", "search"].includes(i.type)
                ? "SELECT" === i.tagName
                  ? (s = !0)
                  : b.isRadioDom(i) && (l = !0)
                : (e = !0),
            e || s || l)
          )
            if (b.isDomVisible(i)) e ? t.push(i) : s ? o.push(i) : n.push(i);
            else {
              let o = i.parentElement;
              for (; o && !b.isDomVisible(o);) o = o.parentElement;
              o && (e ? t.push(o) : s || n.push(o));
            }
        }
        return (
          (t = b.filterDomsLeaveChildren(t)),
          (o = b.filterDomsLeaveChildren(o)),
          (n = b.filterDomsLeaveParent(n)),
          { inputDoms: t, selectDoms: o, radioDoms: n }
        );
      },
      _getBorderHeightList(e) {
        let t = [];
        for (const o of e) {
          let e = o;
          for (; e && e.offsetHeight < 40 && e !== document.body;) {
            const o = b.getComputedStyle(e).borderBottom;
            if (
              o &&
              !o.includes("none") &&
              !o.includes("hidden") &&
              !/\b0(\s|$|\w)/.test(o) &&
              !o.includes("transparent")
            ) {
              for (let n = -2; n <= 2; n++) {
                const i = `${o}_${e.offsetHeight + n}`;
                t.includes(i) || t.push(i);
              }
              break;
            }
            e = e.parentElement;
          }
        }
        return t;
      },
      _getPossibleInputDoms(e, t, o, n) {
        let i = [...e],
          s = null;
        for (const e of n) {
          if (i.includes(e)) {
            s = e;
            continue;
          }
          if (t.includes(e)) {
            s = e;
            continue;
          }
          if (s && s.contains(e)) continue;
          if (e.children.length > 0) continue;
          if (e.getBoundingClientRect().bottom <= 100) continue;
          const n = e.innerHTML.trim();
          if (!n || !/[\u4e00-\u9fa5]/.test(n)) continue;
          const l = b.washTextSymbol(n);
          if (
            /^(确定|取消|返回|关闭|提交|报名|投递|预览|保存|暂存|[上下]一步|编辑|\+?(继续)?(添加|增加|新增)|删除|移除|收起|展开|点击|(简历)?上传|立即)\s*/.test(
              l,
            )
          )
            continue;
          let a = e;
          for (; a && a.offsetHeight <= 50 && a !== document.body;) {
            const e = `${b.getComputedStyle(a).borderBottom}_${a.offsetHeight}`;
            if (o.includes(e) && b.isDomVisible(a)) {
              (i.push(a), (s = a));
              break;
            }
            a = a.parentElement;
          }
        }
        return (
          (i = b.filterDomsLeaveChildren(i)),
          i.sort((e, t) =>
            e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1,
          ),
          i
        );
      },
      _getPossibleSelectDoms(e) {
        let t = [];
        for (const o of e) {
          const e = o.textContent ? o.textContent.trim() : "";
          if (!/^请选择/.test(e)) continue;
          const n = o.className || "";
          /select/i.test(n) && b.isDomVisible(o) && t.push(o);
        }
        return ((t = b.filterDomsLeaveChildren(t)), t);
      },
      _uniqueSamePositionInputDoms(e) {
        let t = [],
          o = null;
        for (const n of e) {
          if (!o) {
            ((o = n), t.push(n));
            continue;
          }
          const e = n.getBoundingClientRect(),
            i = o.getBoundingClientRect(),
            s = e.left + e.width / 2,
            l = e.top + e.height / 2,
            a = i.left + i.width / 2,
            r = i.top + i.height / 2;
          if (
            (s >= i.left && s <= i.right && l >= i.top && l <= i.bottom) ||
            (a >= e.left && a <= e.right && r >= e.top && r <= e.bottom)
          ) {
            const e = g._getInputDomText(n),
              i = g._getInputDomText(o);
            if (i.length > 0 && e.length > 0) {
              const e = b.elementFromPoint(o, a, r);
              g._pickCloserInputDomByTargetDom(o, n, e) === n &&
                (t.pop(), t.push(n), (o = n));
            } else
              i.length > 0 || (e.length > 0 && (t.pop(), t.push(n), (o = n)));
          } else (t.push(n), (o = n));
        }
        return t;
      },
      _getInputDomText(e) {
        function t(e) {
          let t = e.trim();
          return ((t = t.replace(/^请?(选择|输入|填写|填入)/g, "")), t);
        }
        const o = [e, ...e.querySelectorAll("*")];
        for (const e of o) {
          const o = e.getAttribute("placeholder")?.trim();
          if (o) return t(o);
        }
        for (const e of o)
          if (0 === e.children.length) {
            const o = e.textContent.trim();
            if (o && /[\u4e00-\u9fa5]/.test(o)) return t(o);
          }
        return "";
      },
      _pickCloserInputDomByTargetDom(e, t, o) {
        if (!o) return e;
        const n = g._getDomHierarchyDistance(e, o),
          i = g._getDomHierarchyDistance(t, o);
        if (n === Number.POSITIVE_INFINITY && i === Number.POSITIVE_INFINITY)
          return e;
        if (n === Number.POSITIVE_INFINITY) return t;
        if (i === Number.POSITIVE_INFINITY) return e;
        if (n < i) return e;
        if (i < n) return t;
        const s = e.contains(o),
          l = t.contains(o);
        return s && !l ? e : l && !s ? t : e;
      },
      _getDomHierarchyDistance(e, t) {
        if (e === t) return 0;
        if (e.contains(t)) {
          let o = 0,
            n = t;
          for (; n && n !== e;) ((n = n.parentElement), o++);
          return o;
        }
        if (t.contains(e)) {
          let o = 0,
            n = e;
          for (; n && n !== t;) ((n = n.parentElement), o++);
          return o;
        }
        return Number.POSITIVE_INFINITY;
      },
      buildBlankFingerprints(e) {
        const { inputDoms: t } = e,
          o = [];
        for (let e = 0; e < t.length; e++) o.push(null);
        const n = new Map();
        function i(e) {
          const t = b.getBody(e);
          if (!n.has(t)) {
            const o = g._buildBlankTextSegments(e);
            n.set(t, o);
          }
          return n.get(t);
        }
        for (let e = 0; e < t.length; e++) {
          const n = t[e],
            s = i(n),
            l = g._getBlankContextTexts(n, s),
            a = b.getBody(n);
          let r = b.getTagChain(n, a).join(">");
          ((r = r.toLowerCase()),
            (r = r.replace(/^(html>|body>)+/g, "")),
            (o[e] = { texts: l, tagLink: r, index: 1 }));
        }
        const s = {};
        for (let e = 0; e < o.length; e++) {
          const t = o[e],
            n = `${t.texts[0]}|${t.texts[1]}|${t.tagLink}`;
          ((s[n] = (s[n] || 0) + 1), (t.index = s[n]));
        }
        return o;
      },
      _buildBlankTextSegments(e) {
        const t = [],
          o = b.getBody(e),
          n = new Map(),
          i = o.ownerDocument.createTreeWalker(o, NodeFilter.SHOW_TEXT);
        let s;
        for (; (s = i.nextNode());) {
          const e = s.parentElement;
          if (!e) continue;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(e.tagName))
            continue;
          if (!n.has(e)) {
            const t = b.isDomVisible(e);
            n.set(e, t);
          }
          if (!n.get(e)) continue;
          const o = s.textContent.trim();
          if (!o) continue;
          const i = b.washTextSymbol(o, !0);
          if (!i) continue;
          const l = b.washTextSymbol(i, !1);
          l &&
            !/^请?(选择|输入|填写|填入)/.test(l) &&
            t.push({ anchor: e, text: i });
        }
        return t;
      },
      _getBlankContextTexts(e, t) {
        const o = [],
          n = [];
        for (const i of t) {
          if (e === i.anchor || e.contains(i.anchor)) continue;
          const t = e.compareDocumentPosition(i.anchor);
          t & Node.DOCUMENT_POSITION_PRECEDING
            ? o.push(i.text)
            : t & Node.DOCUMENT_POSITION_FOLLOWING && n.push(i.text);
        }
        let i = "";
        o.length > 0 && (i = o[o.length - 1]);
        let s = "";
        return (n.length > 0 && (s = n[0]), [i, s]);
      },
      async getBlankItemByServer(e) {
        if (!e.length) return [];
        try {
          const t = await I(`${window.config.API_BASE_URL}getBlankItem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: window.location.href,
              version: chrome.runtime.getManifest().version,
              blanks: e,
            }),
          });
          return t.items && t.items.length === e.length
            ? t.items
            : new Array(e.length).fill(null);
        } catch (t) {
          return new Array(e.length).fill(null);
        }
      },
      isGetModalFinished: !1,
      async getBlankModalItem(e, t, o) {
        g.isGetModalFinished = !1;
        const { inputDoms: n, selectDoms: i, radioDoms: s } = t,
          l = o.slice();
        for (let e = 0; e < n.length; e++) {
          const t = n[e];
          if (null !== l[e]) continue;
          if (b.isDomDisabled(t)) {
            ((l[e] = []), (o[e] = []));
            continue;
          }
          if (b.isDomFilled(t)) {
            ((l[e] = []), (o[e] = []));
            continue;
          }
          const i = b.getHelloOfferMark(t);
          (b.setHelloOfferMark(t, "yellow"),
            t.scrollIntoViewIfNeeded(),
            await _(200),
            b.observeDomChanges(),
            await b.clickDom(t),
            await g._checkModalItemsStable(t),
            b.stopObserveDomChanges(),
            (b.observeAddDoms = g._getValidModalRoots(b.observeAddDoms)));
          const s = g._handleObserveModal();
          (b.observeAddDoms.length > 0 && (await b.clickCloseModal(t)),
            b.setHelloOfferMark(t, i));
          const a = g._washItemsInSelect(s);
          for (l[e] = a, await b.blurDom(t); !window.isRunning();) await _(500);
        }
        const a = [];
        for (const e of i) {
          if (b.isDomDisabled(e)) {
            a.push([]);
            continue;
          }
          if (b.isDomFilled(e)) {
            a.push([]);
            continue;
          }
          const t = b.getSelectItems(e);
          t.length >= 2 ? a.push(g._washItemsInSelect(t)) : a.push([]);
        }
        const r = [];
        for (const e of s) {
          if (b.isDomDisabled(e)) {
            r.push([]);
            continue;
          }
          const t = b.getModalItems(e);
          t.length >= 2 ? r.push(t) : r.push([]);
        }
        ((e.inputItems = l),
          (e.selectItems = a),
          (e.radioItems = r),
          (g.isGetModalFinished = !0));
      },
      async _checkModalItemsStable(e, t = "") {
        const o = performance.now();
        function n() {
          const e = [];
          for (const t of b.observeAddDoms) {
            const o = "string" == typeof t.className ? t.className : "";
            e.push(`${t.tagName}:${o.length}:${t.childElementCount}`);
          }
          return `${b.observeAddDoms.length}|${e.join(";")}`;
        }
        function i(e) {
          return e.join("\0");
        }
        function s(e) {
          const t = [];
          for (const o of e) {
            const e = b.getModalItems(o);
            t.push(...e);
          }
          return [...new Set(t)];
        }
        function l(e, t) {
          for (const t of e) {
            const e = t.querySelectorAll(
              '[aria-busy="true"], [class*="loading"], [class*="spinner"], [class*="skeleton"], [class*="spin"]',
            );
            for (const t of e) {
              if ("true" === t.getAttribute("aria-busy") && b.isDomVisible(t))
                return !0;
              const e = "string" == typeof t.className ? t.className : "";
              if (
                /\b(loading|spin|spinner|skeleton)\b/i.test(e) &&
                b.isDomVisible(t)
              )
                return !0;
            }
          }
          for (const e of t)
            if (/^\s*(正在加载|加载中|等待加载)/.test(e)) return !0;
          return !1;
        }
        function a(t) {
          for (const o of t) {
            const t = o.querySelectorAll(
              'input, textarea, [contenteditable="true"]',
            );
            for (const o of t) {
              if (o === e || e.contains(o)) continue;
              if (!b.isDomEditable(o)) continue;
              const t =
                o.getAttribute("placeholder") ||
                o.getAttribute("aria-label") ||
                "";
              if (/(搜索|检索|输入关键词)/.test(t)) return !0;
            }
          }
          return !1;
        }
        if ((t ? await _(520) : await _(220), 0 === b.observeAddDoms.length))
          return;
        let r = null,
          c = null;
        for (;;) {
          const e = b.filterDomsLeaveParent(b.observeAddDoms),
            m = g._getValidModalRoots(e, t),
            u = n(),
            d = s(m),
            f = i(d),
            h = null !== c && f === c,
            p = null !== r && u === r,
            w = performance.now() - o;
          if (p && h && !l(e, d)) {
            if (0 === m.length) return;
            const e = g._washItemsInSelect(d);
            if (e.length >= 2) return;
            if (!a(m) && w >= 1e3 && e.length < 2) return;
          }
          if (w >= 3e3) return;
          ((r = u), (c = f), await _(200));
        }
      },
      _getValidModalRoots(e, t = "") {
        const o = [];
        if (0 === e.length) return o;
        function n(e) {
          let t = e;
          for (; 1 === t.children.length;) {
            const e = t.children[0];
            if ("svg" === e.tagName.toLowerCase()) return !0;
            t = e;
          }
          return !1;
        }
        function i(e) {
          let t = e;
          const o = [];
          for (; 1 === t.children.length;) {
            o.push(t);
            t = t.children[0];
          }
          if ((o.push(t), t.children.length > 1)) return !1;
          let n = !1;
          for (const e of o) {
            const t =
              "string" == typeof e.className ? e.className.toLowerCase() : "";
            if (/error|alert|red|warning/.test(t)) {
              n = !0;
              break;
            }
          }
          let i = !1;
          if (0 === t.children.length) {
            const e = (t.textContent || "").trim();
            e &&
              (i =
                /^(请|未)(选择|输入|填写|填入|写入)/.test(e) ||
                /(请|未)(选择|输入|填写|填入|写入)$/.test(e));
          }
          return !(!n && !i);
        }
        function s(e, t, o) {
          return (function e(n) {
            const i = n.getBoundingClientRect();
            if (i.width >= t && i.height >= o) return !0;
            for (const t of n.children) if (e(t)) return !0;
            return !1;
          })(e);
        }
        for (const l of e) {
          if (n(l)) {
            b.observeAddDoms.length;
            continue;
          }
          if (i(l)) {
            b.observeAddDoms.length;
            continue;
          }
          if (!b.isDomVisible(l)) continue;
          if (!b.isDomInViewport(l)) continue;
          if (!s(l, 100, 60)) {
            const e = (l.textContent || "").trim(),
              o = (t || "").trim();
            if (!(
              /(开始|正在)(搜索|加载)/.test(e) ||
              /(搜索|加载).*?中/.test(e) ||
              /\b(loading)\b/i.test(e) ||
              (o && e && e.includes(o))
            )) {
              b.observeAddDoms.length;
              continue;
            }
          }
          o.push(l);
        }
        return o;
      },
      _washItemsInSelect(e) {
        let t = e.filter((e) => {
          const t = e.trim();
          return (
            !!t &&
            !/^(开始|正在)(搜索|加载)/.test(t) &&
            !/^(搜索|加载).*?中/.test(t) &&
            !/^(请输入|请填写|请填入|请写入)/.test(t)
          );
        });
        return (
          t.length > 0 && /^[-\s]*请选择/.test(t[0]) && (t = t.slice(1)),
          2 == t.length &&
            (("确定" == t[0] && "取消" == t[1]) ||
              ("取消" == t[0] && "确定" == t[1])) &&
            (t = []),
          t
        );
      },
      _handleObserveModal() {
        let e = [];
        for (const t of b.observeAddDoms) {
          b.getModalCancelDoms(t);
          const o = b.getModalItems(t),
            n = o.map((e) => e.replace(/^0+/, "")).join(";");
          if (o.length >= 40) {
            const t =
                "1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28",
              o = "一;二;三;四;五;六";
            if (n.includes(t) && n.includes(o)) {
              e = ["(请填写日期)"];
              break;
            }
          }
          if (o.length >= 12) {
            const t = "1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月",
              o =
                "一月;二月;三月;四月;五月;六月;七月;八月;九月;十月;十一月;十二月";
            if (n.includes(t) || n.includes(o)) {
              e = ["(请填写年月)"];
              break;
            }
          }
          if (o.length >= 10 && o.length <= 32) {
            const t = "2020;2021;2022;2023;2024;2025;2026;2027;2028;2029",
              o =
                "2020年;2021年;2022年;2023年;2024年;2025年;2026年;2027年;2028年;2029年";
            if (n.includes(t) || n.includes(o)) {
              e = ["(请填写年份)"];
              break;
            }
          }
          if (o.length >= 30) {
            const t = [
              "北京",
              "天津",
              "上海",
              "重庆",
              "河北",
              "山西",
              "辽宁",
              "吉林",
              "黑龙江",
              "江苏",
              "浙江",
              "安徽",
              "福建",
              "江西",
              "山东",
              "河南",
              "湖北",
              "湖南",
              "广东",
              "海南",
              "四川",
              "贵州",
              "云南",
              "陕西",
              "甘肃",
              "青海",
              "台湾",
              "内蒙古",
              "广西",
              "西藏",
              "宁夏",
              "新疆",
              "香港",
              "澳门",
            ];
            let n = 0;
            for (const e of t) o.some((t) => t.includes(e)) && n++;
            if (n >= 30) {
              e = ["(请填写省份)"];
              break;
            }
          }
          if (o.length >= 30) {
            const t = [
              "汉族",
              "蒙古族",
              "回族",
              "藏族",
              "维吾尔族",
              "苗族",
              "彝族",
              "壮族",
              "布依族",
              "朝鲜族",
              "满族",
              "侗族",
              "瑶族",
              "白族",
              "土家族",
              "哈尼族",
              "哈萨克族",
              "傣族",
              "黎族",
              "傈僳族",
              "佤族",
              "畲族",
              "高山族",
              "拉祜族",
              "水族",
              "东乡族",
              "纳西族",
              "景颇族",
              "柯尔克孜族",
              "土族",
              "达斡尔族",
              "仫佬族",
              "羌族",
              "布朗族",
              "撒拉族",
              "毛南族",
              "仡佬族",
              "锡伯族",
              "阿昌族",
              "普米族",
              "塔吉克族",
              "怒族",
              "乌孜别克族",
              "俄罗斯族",
              "鄂温克族",
              "德昂族",
              "保安族",
              "裕固族",
              "京族",
              "塔塔尔族",
              "独龙族",
              "鄂伦春族",
              "赫哲族",
              "门巴族",
              "珞巴族",
              "基诺族",
            ];
            let n = 0;
            for (const e of t) o.some((t) => t.includes(e)) && n++;
            if (n >= 30) {
              e = ["(请填写民族)"];
              break;
            }
          }
          if (o.length >= 30) {
            const t = [
              "中国",
              "美国",
              "日本",
              "德国",
              "英国",
              "法国",
              "意大利",
              "加拿大",
              "澳大利亚",
              "俄罗斯",
              "印度",
              "巴西",
              "韩国",
              "西班牙",
              "墨西哥",
              "印度尼西亚",
              "土耳其",
              "沙特阿拉伯",
              "瑞士",
              "波兰",
              "泰国",
              "瑞典",
              "比利时",
              "奥地利",
              "挪威",
              "丹麦",
              "芬兰",
              "新加坡",
              "马来西亚",
              "菲律宾",
              "越南",
              "缅甸",
              "柬埔寨",
              "老挝",
              "文莱",
              "东帝汶",
              "尼泊尔",
              "不丹",
              "孟加拉国",
              "斯里兰卡",
              "马尔代夫",
              "巴基斯坦",
              "阿富汗",
              "伊朗",
              "伊拉克",
              "叙利亚",
              "约旦",
              "黎巴嫩",
              "以色列",
              "巴勒斯坦",
              "埃及",
              "利比亚",
              "突尼斯",
              "阿尔及利亚",
              "摩洛哥",
              "苏丹",
              "南苏丹",
              "埃塞俄比亚",
              "索马里",
              "肯尼亚",
              "乌干达",
              "坦桑尼亚",
              "卢旺达",
              "布隆迪",
              "刚果",
              "刚果民主共和国",
              "中非共和国",
              "乍得",
              "喀麦隆",
              "尼日利亚",
              "尼日尔",
              "马里",
              "布基纳法索",
              "塞内加尔",
              "冈比亚",
              "几内亚比绍",
              "几内亚",
              "塞拉利昂",
              "利比里亚",
              "科特迪瓦",
              "加纳",
              "多哥",
              "贝宁",
              "加蓬",
              "赤道几内亚",
              "圣多美和普林西比",
              "安哥拉",
              "赞比亚",
              "津巴布韦",
              "博茨瓦纳",
              "纳米比亚",
              "南非",
              "莱索托",
              "斯威士兰",
              "马达加斯加",
              "毛里求斯",
              "塞舌尔",
              "科摩罗",
              "马约特",
              "留尼汪",
            ];
            let n = 0;
            for (const e of t) o.some((t) => t.includes(e)) && n++;
            if (n >= 30) {
              e = ["(请填写国家)"];
              break;
            }
          }
          if (o.length >= 10) {
            const t = [];
            for (const e of o) {
              const o = parseInt(e.trim());
              isNaN(o) || t.push(o);
            }
            if (t.length >= 0.8 * o.length) {
              t.sort((e, t) => e - t);
              let o = !0;
              for (let e = 1; e < t.length; e++)
                if (t[e] !== t[e - 1] + 1) {
                  o = !1;
                  break;
                }
              if (o && t.length > 0) {
                const o = t[0],
                  n = t[t.length - 1];
                if (n - o >= 10) {
                  e = [`(请填写${o}-${n}中的一个数字)`];
                  break;
                }
              }
            }
          }
          o.length >= 2 && (e = o.join(";").length > 1e3 ? o.slice(0, 100) : o);
        }
        return e;
      },
      async saveBlankItemToServer(e, t, o) {
        const n = [];
        for (let i = 0; i < t.length; i++)
          null === t[i] && n.push({ ...e[i], items: o.inputItems[i] });
        if (!n.length) return null;
        try {
          await I(`${window.config.API_BASE_URL}saveBlankItem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: window.location.href,
              version: chrome.runtime.getManifest().version,
              blanks: n,
            }),
          });
        } catch (e) {}
        return null;
      },
      handleFieldResponse(e) {
        const t = [];
        try {
          if (0 == e.length) throw new Error("服务器返回错误");
          for (const o of e) {
            const e = { name: o.name, dom: null, fields: [] };
            t.push(e);
            for (const t of o.fields) {
              const o = { name: t.name, field: { dom: null }, blanks: [] };
              e.fields.push(o);
            }
          }
        } catch (e) {}
        return t;
      },
      findFieldDoms(e) {
        try {
          const t = e.map((e) => e.name);
          let o = null;
          const n = b.documentQuerySelectorAll();
          for (const e of n) {
            const n = e.childNodes;
            if (n.length < 5) continue;
            let i = 0;
            for (const e of n) {
              let o = b.washTextSymbol(e.textContent);
              o && t.some((e) => o.startsWith(e)) && i++;
              if (o.replace(/[(（\[【].*?[)）\]】]/g, "").length > 20) {
                i = 0;
                break;
              }
            }
            if (i >= 5) {
              o = e;
              break;
            }
          }
          let i = null;
          for (const t of e) {
            ((t.dom = g._findOneDom(t.name, i, n, o)), t.dom && (i = t.dom));
            for (const e of t.fields)
              ((e.field.dom = g._findOneDom(e.name, i, n, o)),
                e.field.dom && (i = e.field.dom));
          }
          if (e.every((e) => e.dom)) return;
          let s = g._buildPrevBoundMap(e),
            l = g._buildNextBoundMap(e);
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            if (i.dom) continue;
            const a = s[t],
              r = l[t],
              c = b
                .washTextSymbol(i.name, !0)
                .replace(/[.*+?^${}()|\[\]\\]/g, "\\$&"),
              m = new RegExp(`^[^a-zA-Z0-9\\u4e00-\\u9fa5]*${c}`);
            ((i.dom = g._findOneDomByRegex(n, o, m, a, r)), i.dom);
          }
          if (e.every((e) => e.dom)) return;
          ((s = g._buildPrevBoundMap(e)), (l = g._buildNextBoundMap(e)));
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            if (i.dom) continue;
            const a = s[t],
              r = l[t],
              c = b.washTextSymbol(i.name, !0);
            ((i.dom = g._findOneDomByCharCount(n, o, c, a, r)), i.dom);
          }
          if (e.every((e) => e.dom)) return;
          ((s = g._buildPrevBoundMap(e)), (l = g._buildNextBoundMap(e)));
          for (let t = 0; t < e.length; t++) {
            const i = e[t];
            if (i.dom) continue;
            const a = s[t],
              r = l[t];
            r
              ? ((i.dom = g._findOneDomByContain(n, o, a, r)),
                i.dom || (i.dom = r))
              : (i.dom = a);
          }
        } catch (e) {}
      },
      _findOneDom(e, t, o, n) {
        let i = b.washTextSymbol(e, !0).replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
        const s = new RegExp(
          `^[^a-zA-Z0-9\\u4e00-\\u9fa5]*${i}[\\?？i:：]*([(（\\[【].*?[)）\\]】])?[\\?？i:：]*$`,
        );
        return g._findOneDomByRegex(o, n, s, t);
      },
      _findOneDomByRegex(e, t, o, n, i = null) {
        function s(e) {
          const t = b.washTextSymbol(e, !0);
          return 0 != t.length && !(t.length > 30) && o.test(t);
        }
        let l = !n;
        for (const a of e)
          if (!t || !t.contains(a))
            if (a !== n) {
              if (l) {
                if (i && a === i) break;
                if ("OPTION" !== a.tagName && b.isDomVisible(a)) {
                  if (s(a.textContent)) return b.findMinDomInDom(a, o);
                  for (const e of a.childNodes)
                    if (e.nodeType === Node.TEXT_NODE && s(e.textContent))
                      return b.findMinDomInDom(a, o);
                }
              }
            } else l = !0;
        return null;
      },
      _findOneDomByCharCount(e, t, o, n, i = null) {
        let s = !n,
          l = null,
          a = 0,
          r = Number.MAX_SAFE_INTEGER;
        const c = Array.from(o || "");
        for (const o of e) {
          if (t && t.contains(o)) continue;
          if (o === n) {
            s = !0;
            continue;
          }
          if (!s) continue;
          if (i && o === i) break;
          if ("OPTION" === o.tagName) continue;
          if (!b.isDomVisible(o)) continue;
          let e = b.washTextSymbol(o.textContent, !0);
          if (0 == e.length) continue;
          if (e.length > 30) continue;
          let m = 0;
          const u = Array.from(e);
          for (const e of c) {
            const t = u.indexOf(e);
            -1 != t && (m++, u.splice(t, 1));
          }
          m < 2 ||
            ((m > a || (m == a && e.length < r)) &&
              ((l = o), (a = m), (r = e.length)));
        }
        return l;
      },
      _findOneDomByContain(e, t, o, n) {
        let i = !o;
        for (const s of e)
          if (!t || !t.contains(s))
            if (s !== o) {
              if (i) {
                if (s === n) break;
                if (
                  "OPTION" !== s.tagName &&
                  b.isDomVisible(s) &&
                  s.contains(n)
                )
                  return s;
              }
            } else i = !0;
        return null;
      },
      _buildPrevBoundMap(e) {
        const t = [];
        let o = null;
        for (const n of e) {
          (t.push(o), n.dom && (o = n.dom));
          for (const e of n.fields) e.field.dom && (o = e.field.dom);
        }
        return t;
      },
      _buildNextBoundMap(e) {
        const t = [];
        let o = null;
        for (let n = e.length - 1; n >= 0; n--) {
          const i = e[n];
          let s = i.dom;
          if (!s)
            for (const e of i.fields)
              if (e.field.dom) {
                s = e.field.dom;
                break;
              }
          ((t[n] = s || o), s && (o = s));
        }
        return t;
      },
      findBlankDoms(e, t) {
        try {
          const o = [],
            n = [],
            i = [];
          for (const t of e)
            for (const e of t.fields)
              if (e.field.dom) {
                (o.push(e.field.dom), n.push([]));
                const s = t.fields.indexOf(e) == t.fields.length - 1;
                i.push(s);
              }
          const s = b.documentQuerySelectorAll();
          let l = null,
            a = 0,
            r = null,
            c = null,
            m = [];
          for (const e of s) {
            if (o.includes(e)) {
              if (!n[a].length && m.length)
                for (const e of m) {
                  let t = e.parentElement;
                  for (; t && !b.isDomVisible(t);) t = t.parentElement;
                  t && n[a].push(t);
                }
              ((m = []),
                (l = e),
                (a = o.indexOf(e)),
                (r = a + 1 < o.length ? o[a + 1] : null));
              continue;
            }
            if (!l) continue;
            if (c && c.contains(e)) continue;
            if (r && e.contains(r)) continue;
            let i = !1;
            ((("INPUT" === e.tagName &&
              ["text", "search", "number"].includes(e.type)) ||
              "TEXTAREA" === e.tagName ||
              "SELECT" === e.tagName ||
              e.isContentEditable) &&
              (i = !0),
              t.inputDoms.includes(e) && (i = !0),
              i
                ? b.isDomVisible(e)
                  ? n[a].push(e)
                  : m.push(e)
                : (t.selectDoms.includes(e) && ((i = !0), n[a].push(e)),
                  t.radioDoms.includes(e) && ((i = !0), n[a].push(e))));
          }
          for (const e in n) n[e] = b.filterDomsLeaveChildren(n[e]);
          for (const e in n) n[e] = g._uniqueSamePositionInputDoms(n[e]);
          for (const e in n)
            (n[e].length > 4 || (i[e] && n[e].length > 2)) &&
              (n[e] = n[e].slice(0, 1));
          const u = [];
          for (let e = 0; e < o.length; e++) {
            o[e];
            const t = n[e];
            if (((u[e] = []), 0 != t.length))
              if (1 == t.length) u[e].push(t[0]);
              else {
                for (const o of t)
                  if (b.isRadioDom(o)) {
                    u[e].push(o);
                    break;
                  }
                if (u[e].length) continue;
                u[e] = t;
              }
          }
          for (let n = 0; n < u.length; n++)
            if (0 != u[n].length)
              for (const i of e)
                for (const e of i.fields)
                  if (e.field.dom === o[n])
                    if (1 === u[n].length) {
                      const o = u[n][0];
                      e.blanks.push({
                        name: "",
                        dom: o,
                        type: t.radioDoms.includes(o)
                          ? "radio"
                          : t.selectDoms.includes(o)
                            ? "select"
                            : "input",
                      });
                    } else
                      for (const o of u[n])
                        e.blanks.push({
                          name: g._getInputDomText(o),
                          dom: o,
                          type: t.radioDoms.includes(o)
                            ? "radio"
                            : t.selectDoms.includes(o)
                              ? "select"
                              : "input",
                        });
        } catch (e) {}
      },
      addItemsIntoFieldResponse(e, t, o, n) {
        try {
          const i = [];
          for (const e of t) i.push({ name: e.name, fields: [] });
          for (let t = 0; t < e.length; t++) {
            const s = e[t],
              l = [];
            i[t].fields = l;
            for (let e = 0; e < s.fields.length; e++) {
              const t = s.fields[e];
              if (
                0 == t.blanks.length ||
                (1 == t.blanks.length && /时间|日期|年月/.test(t.name))
              ) {
                const e = { name: t.name };
                l.push(e);
              } else {
                if (t.blanks.length > 1) {
                  let e = !0;
                  for (const o of t.blanks)
                    if (
                      "" !== o.name &&
                      !/(请选择|请输入|请填写|请填入|请写入)/.test(o.name)
                    ) {
                      e = !1;
                      break;
                    }
                  /(身份证|证件号码)/.test(t.name) &&
                  /(身份证|证件号码)/.test(t.blanks[0].name) &&
                  "" === t.blanks[1].name &&
                  2 == t.blanks.length
                    ? ((t.blanks[0].name = "证件类型"),
                      (t.blanks[1].name = "身份证号码"))
                    : e &&
                      (/(居住地|籍贯|户籍|户口|生源地|所在地|省份|城市|地点)/i.test(
                        t.name,
                      ) &&
                        (2 == t.blanks.length
                          ? ((t.blanks[0].name = "省/直辖市"),
                            (t.blanks[1].name = "市"))
                          : 3 == t.blanks.length &&
                            ((t.blanks[0].name = "省/直辖市"),
                            (t.blanks[1].name = "市"),
                            (t.blanks[2].name = "区"))),
                      /(手机号|电话号码|手机号码|联系电话)/i.test(t.name) &&
                        2 == t.blanks.length &&
                        ((t.blanks[0].name = "国家"),
                        (t.blanks[1].name = "号码")),
                      /(身份证|证件号码)/i.test(t.name) &&
                        2 == t.blanks.length &&
                        ((t.blanks[0].name = "证件类型"),
                        (t.blanks[1].name = "身份证号码")),
                      /(期望薪资|期望月薪|期望年薪)/i.test(t.name) &&
                        2 == t.blanks.length &&
                        ((t.blanks[0].name = "下限"),
                        (t.blanks[1].name = "上限")));
                }
                for (const e of t.blanks) {
                  const i = {
                    name:
                      1 == t.blanks.length ? t.name : `${t.name} - ${e.name}`,
                  };
                  l.push(i);
                  let s = -1;
                  ((s = o.inputDoms.indexOf(e.dom)),
                    -1 !== s && n.inputItems[s] && n.inputItems[s].length > 0
                      ? (i.items = n.inputItems[s])
                      : ((s = o.selectDoms.indexOf(e.dom)),
                        -1 !== s &&
                        n.selectItems[s] &&
                        n.selectItems[s].length > 0
                          ? (i.items = n.selectItems[s])
                          : ((s = o.radioDoms.indexOf(e.dom)),
                            -1 !== s &&
                              n.radioItems[s] &&
                              n.radioItems[s].length > 0 &&
                              (i.items = n.radioItems[s]))));
                }
              }
            }
          }
          return i;
        } catch (e) {
          throw e;
        }
      },
      deleteFieldItemsEmptyBlock(e) {
        const t = e.filter((e) => e.fields.length > 0);
        return (t.length, t);
      },
      isHighlightFinished: !1,
      async highlightField(e) {
        g.isHighlightFinished = !1;
        try {
          await b.scrollToRealTop();
          for (const t of e) {
            null == t.dom ||
              (t.dom.scrollIntoView({ block: "center" }),
              b.setHelloOfferMark(t.dom, "purple"),
              await _(100));
            for (const e of t.fields)
              if (null != e.field.dom) {
                (e.field.dom.scrollIntoView({ block: "center" }),
                  b.setHelloOfferMark(e.field.dom, "yellow"));
                for (const t of e.blanks)
                  (b.setHelloOfferMark(t.dom, "green"), await _(100));
              }
          }
        } catch (e) {
        } finally {
          e.length > 0
            ? e[0].fields.length > 0 && e[0].fields[0].field.dom
              ? e[0].fields[0].field.dom.scrollIntoView({ block: "center" })
              : e[0].dom && e[0].dom.scrollIntoView({ block: "center" })
            : await b.scrollToRealTop();
        }
        g.isHighlightFinished = !0;
      },
      async fillResumeByServer(e, t, n, i, s, l) {
        try {
          const a = await I(`${window.config.API_BASE_URL}fillResumeValue`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: o,
              url: window.location.href,
              browser: B(),
              version: chrome.runtime.getManifest().version,
              fields: t,
              company: n,
              position: i,
              resumeMd: s,
              resumeId: l,
              webType: g.buildWebType("page"),
            }),
          });
          ((e.length = 0), Array.isArray(a.values) && e.push(...a.values));
        } catch (e) {
          throw (
            (window.isHttpResponseError = !0),
            (window.httpResponseErrorAct = "fillResumeValue"),
            e
          );
        }
        return null;
      },
      async fillBlockResumeByServer(e, t, n, i, s, l, a) {
        try {
          const r = await I(
            `${window.config.API_BASE_URL}fillBlockResumeValue`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId: o,
                url: window.location.href,
                browser: B(),
                version: chrome.runtime.getManifest().version,
                fields: t,
                company: n,
                position: i,
                resumeMd: s,
                resumeId: l,
                webType: g.buildWebType("block", a),
              }),
            },
          );
          ((e.length = 0),
            Array.isArray(r.values) && e.push(...r.values),
            r.sessionId && (o = r.sessionId));
        } catch (e) {
          throw (
            (window.isHttpResponseError = !0),
            (window.httpResponseErrorAct = "fillBlockResumeValue"),
            e
          );
        }
        return null;
      },
      buildWebType: (e, t) =>
        "page" === e
          ? "onestep:1"
          : "platform" === t.mode
            ? `${t.platform}:${t.version}`
            : "multistep:1",
      formatResumeValueJson(e) {
        const t = [];
        for (const o of e) {
          const e = { name: o.name, fields: [] };
          for (const t of o.fields)
            if (t.name.includes(" - ")) {
              const [o, n] = t.name.split(" - ");
              let i = e.fields.find((e) => e.name === o);
              (i || ((i = { name: o, blanks: [] }), e.fields.push(i)),
                i.blanks.push({ name: n, value: t.value }));
            } else
              e.fields.push({
                name: t.name,
                blanks: [{ name: "", value: t.value }],
              });
          t.push(e);
        }
        return t;
      },
      washBlankValueJson(e) {
        for (const t of e)
          for (const e of t.fields) {
            if (
              /(手机号|电话号码|手机号码|联系电话)/i.test(e.name) &&
              e.blanks.length > 0
            )
              for (const t of e.blanks)
                t.value &&
                  "string" == typeof t.value &&
                  t.value.startsWith("+86") &&
                  (t.value = t.value.substring(3));
            if (/(身高|体重)/i.test(e.name) && e.blanks.length > 0)
              for (const t of e.blanks)
                t.value &&
                  "string" == typeof t.value &&
                  (t.value = t.value.replace(/(cm|厘米|kg|千克|公斤)/gi, ""));
            if (/(时间|日期)/i.test(e.name) && e.blanks.length > 0)
              for (const t of e.blanks)
                t.value &&
                  "string" == typeof t.value &&
                  /^20\d{2}-\d{2}$/.test(t.value) &&
                  (t.value = `${t.value}-01`);
          }
        return e;
      },
      async fillBlankDoms(e, t, o) {
        try {
          let n = 0;
          for (; n < e.length; n++) {
            const i = e[n],
              s = [];
            for (const e of t) e.name == i.name && s.push(e.fields);
            if (0 == s.length) continue;
            const l = [i.fields];
            for (let t = 1; t < s.length; t++) {
              let t = null;
              n + 1 < e.length && (t = e[n + 1].dom);
              const o = g._findAddDomBetweenDoms(i.dom, t);
              if (!o) break;
              (b.observeDomChanges(),
                await b.clickDom(o),
                await _(100),
                b.stopObserveDomChanges());
              const s = g._getNewBlockDoms();
              if (0 == s.length) break;
              g.blockRemoveDoms = [];
              const a = await g._matchTemplateFieldDoms(s, i);
              if (!a) break;
              l.push(a);
            }
            for (let e = 0; e < l.length && !(e >= s.length); e++) {
              const t = l[e],
                n = s[e];
              for (let e of t) {
                if (
                  !b.isDomInBody(e.field.dom) ||
                  (e.blanks.length > 0 && !b.isDomInBody(e.blanks[0].dom))
                ) {
                  const t = g._findFieldDomInNewBlockDoms([o], [e]);
                  if (!t) continue;
                  e = t[0];
                }
                let t = 0;
                for (const o of e.blanks) {
                  if (b.isDomDisabled(o.dom)) continue;
                  if (b.isDomFilled(o.dom)) continue;
                  let i = "";
                  for (const s of n) {
                    for (let n = t; n < s.blanks.length; n++) {
                      const l = s.blanks[n];
                      if (s.name == e.name && l.name == o.name) {
                        ((i = l.value), (t = n + 1));
                        break;
                      }
                    }
                    if ("" != i) break;
                  }
                  if ("" == i) continue;
                  const s = `尝试为你填写 ${e.name.substring(0, 8)}...`;
                  (window.setStateText(s),
                    o.dom.scrollIntoView({ block: "center" }),
                    await _(100));
                  const l = b.getHelloOfferMark(o.dom);
                  if (
                    (b.setHelloOfferMark(o.dom, "red"),
                    await _(200),
                    "input" == o.type)
                  ) {
                    (b.observeDomChanges(),
                      await b.clickDom(o.dom),
                      await g._checkModalItemsStable(o.dom),
                      b.stopObserveDomChanges(),
                      (b.observeAddDoms = g._getValidModalRoots(
                        b.observeAddDoms,
                      )));
                    let s = !1;
                    if (b.observeAddDoms.length > 0) {
                      if (g._checkDoubleDateModal(e.blanks, t)) {
                        let t = "";
                        for (const o of n)
                          o.name == e.name &&
                            2 == o.blanks.length &&
                            (t = o.blanks[1].value);
                        if ("" == t) continue;
                        (await g._chooseDoubleDateModal(e.blanks, i, t),
                          (s = !0));
                      } else {
                        const e = g._checkDateModal();
                        if (e) (await g._chooseDateModal(e, i), (s = !0));
                        else {
                          const e = g._checkSpecialDateModal();
                          e &&
                            (await g._chooseSpecialDateModal(o.dom, i, e),
                            (s = !0));
                        }
                      }
                      if (!s) {
                        const e = g._getObserveModalItemDom(i);
                        if (e) {
                          (b.modalSubmitDoms.length > 0 &&
                          b.modalCancelDoms.length > 0
                            ? await g._handleComplexModal(i)
                            : (await b.clickDom(e), await _(200)),
                            (s = !0));
                        }
                      }
                      (await b.clickSubmitModal(),
                        (await g._checkModalClosed(o.dom, i)) ||
                          (await b.clickCloseModal(o.dom)));
                    }
                    if (!s) {
                      let e = !1;
                      if (
                        (("INPUT" === o.dom.tagName ||
                          "TEXTAREA" === o.dom.tagName ||
                          o.dom.isContentEditable) &&
                          (e = !0),
                        e)
                      ) {
                        if (
                          (b.observeDomChanges(),
                          await b.focusDom(o.dom),
                          await _(50),
                          "INPUT" === o.dom.tagName ||
                            "TEXTAREA" === o.dom.tagName)
                        )
                          if ("number" === o.dom.type) {
                            const e = parseFloat(i);
                            isNaN(e) || (o.dom.value = e);
                          } else o.dom.value = i;
                        else o.dom.isContentEditable && (o.dom.textContent = i);
                        const e = b.createEvent(o.dom, "input", {
                          bubbles: !0,
                        });
                        o.dom.dispatchEvent(e);
                        const t = b.createEvent(o.dom, "change", {
                          bubbles: !0,
                        });
                        if (
                          (o.dom.dispatchEvent(t),
                          await g._checkModalItemsStable(o.dom, i),
                          b.stopObserveDomChanges(),
                          (b.observeAddDoms = g._getValidModalRoots(
                            b.observeAddDoms,
                            i,
                          )),
                          b.observeAddDoms.length > 0)
                        ) {
                          const e = g._getObserveModalItemDom(i);
                          (e &&
                            (await _(200), await b.clickDom(e), await _(200)),
                            await b.clickSubmitModal(),
                            (await g._checkModalClosed(o.dom, i)) ||
                              (await b.clickCloseModal(o.dom)));
                        }
                      }
                    }
                    for (
                      b.setHelloOfferMark(o.dom, l),
                        await b.blurDom(o.dom),
                        await _(200);
                      !window.isRunning();
                    )
                      await _(500);
                  } else if ("select" == o.type) {
                    const e = g._getModalItemDomByValue(o.dom, i, !0, !1);
                    if (e) {
                      const t = e.value;
                      (null !== t &&
                        ((o.dom.value = t), await b.changeDom(o.dom, t)),
                        await _(50));
                    }
                    for (b.setHelloOfferMark(o.dom, l); !window.isRunning();)
                      await _(500);
                  } else if ("radio" == o.type) {
                    let e = g._getModalItemDomByValue(o.dom, i);
                    if (e && ("LABEL" === e.tagName || "SPAN" === e.tagName)) {
                      let t = e.previousElementSibling;
                      for (; t;) {
                        if ("INPUT" === t.tagName && "radio" === t.type) {
                          e = t;
                          break;
                        }
                        t = t.previousElementSibling;
                      }
                    }
                    for (
                      e && (await b.clickDom(e), await _(50)),
                        b.setHelloOfferMark(o.dom, l);
                      !window.isRunning();
                    )
                      await _(500);
                  }
                }
              }
            }
          }
        } catch (e) {
        } finally {
          e.length > 0 &&
            (e[0].fields.length > 0 && e[0].fields[0].field.dom
              ? e[0].fields[0].field.dom.scrollIntoView({ block: "center" })
              : e[0].dom && e[0].dom.scrollIntoView({ block: "center" }));
        }
      },
      _findAddDomBetweenDoms(e, t) {
        const o = b.documentQuerySelectorAll().reverse();
        let n = !t;
        for (let i = 0; i < o.length; i++) {
          const s = o[i];
          if (s === t || s.contains(t)) {
            n = !0;
            continue;
          }
          if (!n) continue;
          if (s === e) return null;
          const l = new RegExp("^[\\s\\*\\+]*(继续)?(添加|增加|新增).{0,10}$");
          if (l.test(s.textContent)) return b.findMinDomInDom(s, l);
        }
        return null;
      },
      _checkDateModal() {
        for (const e of b.observeAddDoms)
          if (g._checkDomIsDateModal(e)) return e;
        return null;
      },
      _checkDomIsDateModal(e) {
        const t = b.getModalItems(e);
        if (t.length < 12) return !1;
        let o = t[0].replace(/\s+/g, ""),
          n = t[1].replace(/\s+/g, ""),
          i = t[2].replace(/\s+/g, "");
        return (/^(19|20)\d{2}(年)?$/.test(o) &&
          /^(0?[1-9]|1[0-2]|一|二|三|四|五|六|七|八|九|十.?)月$/.test(n)) ||
          (/^(19|20)\d{2}(年)?$/.test(n) &&
            /^(0?[1-9]|1[0-2]|一|二|三|四|五|六|七|八|九|十.?)月$/.test(o))
          ? (/^(19|20)\d{2}(年)?\-(19|20)\d{2}(年)?$/.test(i), !0)
          : !(
              !/^(19|20)\d{2}(年)?(0?[1-9]|1[0-2]|一|二|三|四|五|六|七|八|九|十.?)月$/.test(
                o,
              ) &&
              !/^(0?[1-9]|1[0-2]|一|二|三|四|五|六|七|八|九|十.?)月(19|20)\d{2}(年)?$/.test(
                o,
              )
            ) ||
              !(
                !/^(19|20)\d{2}(年)?\-(19|20)\d{2}(年)?$/.test(o) ||
                !/^((19|20)\d{2}|(0?[1-9]|1[0-2]|一|二|三|四|五|六|七|八|九|十.?)月)$/.test(
                  n,
                )
              );
      },
      _checkDoubleDateModal(e, t) {
        for (const o of b.observeAddDoms)
          if (
            2 ==
              o.querySelectorAll(".ant-picker-range-wrapper .ant-picker-panel")
                .length &&
            1 == t &&
            e.length >= 2
          )
            return !0;
        return !1;
      },
      async _chooseDoubleDateModal(e, t, o) {
        const n = e[0].dom,
          i = e[1].dom;
        "INPUT" === n.tagName || "TEXTAREA" === n.tagName
          ? (n.value = t)
          : n.isContentEditable && (n.textContent = t);
        let s = b.createEvent(n, "input", { bubbles: !0 });
        n.dispatchEvent(s);
        let l = b.createEvent(n, "change", { bubbles: !0 });
        (n.dispatchEvent(l),
          await _(10),
          "INPUT" === i.tagName || "TEXTAREA" === i.tagName
            ? (i.value = o)
            : i.isContentEditable && (i.textContent = o),
          (s = b.createEvent(i, "input", { bubbles: !0 })),
          i.dispatchEvent(s),
          (l = b.createEvent(i, "change", { bubbles: !0 })),
          i.dispatchEvent(l),
          await _(300));
      },
      _checkSpecialDateModal() {
        for (const e of b.observeAddDoms) {
          if ("_my97DP" === e.id) return "-";
          if (e.querySelector("iframe")) {
            const t = e.querySelector("iframe");
            if (
              "9" == t.getAttribute("width") &&
              "7" == t.getAttribute("height")
            )
              return "/";
          }
        }
        return null;
      },
      async _chooseSpecialDateModal(e, t, o = "-") {
        let n,
          i,
          s = "1";
        if ("至今" === t)
          ((n = new Date().getFullYear()),
            (i = new Date().getMonth() + 1),
            (s = new Date().getDate()));
        else {
          const e = t.match(
            /^(\d{4})(-|\.|年)(\d{1,2})(?:月)?(?:(-|\.|月)(\d{1,2})(日)?)?$/,
          );
          if (!e) return;
          ((n = e[1]), (i = e[3]), (s = e[5] || "01"));
        }
        let l = "";
        "INPUT" === e.tagName || "TEXTAREA" === e.tagName
          ? (l = e.value || l)
          : e.isContentEditable && (l = e.textContent || l);
        const a = `${n}${o}${i}${o}${s}`;
        "INPUT" === e.tagName || "TEXTAREA" === e.tagName
          ? (e.value = a)
          : e.isContentEditable && (e.textContent = a);
        const r = b.createEvent(e, "input", { bubbles: !0 });
        e.dispatchEvent(r);
        const c = b.createEvent(e, "change", { bubbles: !0 });
        (e.dispatchEvent(c), await _(300));
      },
      async _chooseDateModal(e, t) {
        let o,
          n,
          i = "1";
        if ("至今" === t)
          ((o = new Date().getFullYear()),
            (n = new Date().getMonth() + 1),
            (i = new Date().getDate()));
        else {
          const e = t.match(
            /^(\d{4})(-|\.|年)(\d{1,2})(?:月)?(?:(-|\.|月)(\d{1,2})(日)?)?$/,
          );
          if (!e) return;
          ((o = e[1]),
            (n = e[3]),
            (i = e[5] || "1"),
            n.startsWith("0") && (n = n.slice(1)),
            i.startsWith("0") && (i = i.slice(1)));
        }
        try {
          let t = b.getModalItems(e),
            s = g._washDateItems(t),
            l = s.join(";");
          if (/(^|;)(19|20)\d{2}(年)?\-(19|20)\d{2}(年)?/.test(l)) {
            let n = 0;
            for (; n < 10; n++) {
              let n = s.indexOf(o + "年");
              if ((-1 === n && (n = s.indexOf(o)), -1 !== n)) {
                const o = g._getModalItemDomByValue(e, t[n]);
                (await b.clickDom(o),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
                break;
              }
              {
                const n = g._getModalItemDomByValue(e, t[0]),
                  [i, a] = g._findDateLeftAndRight(e, n);
                if (!i || !a) return;
                let r = null;
                for (let e = 0; e < s.length - 2; e++) {
                  const t = s[e].match(/^(19|20)\d{2}$/),
                    o = s[e + 1].match(/^(19|20)\d{2}$/),
                    n = s[e + 2].match(/^(19|20)\d{2}$/);
                  if (t && o && n) {
                    const e = parseInt(t[0]),
                      i = parseInt(o[0]),
                      s = parseInt(n[0]);
                    if (i === e + 1 && s === i + 1) {
                      r = e;
                      break;
                    }
                  }
                }
                if (null === r) return;
                const c = parseInt(o) < r ? i : a;
                (await b.clickDom(c),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
              }
            }
            if (10 === n) return;
          } else {
            if (
              /1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28/.test(
                l,
              ) &&
              /^.{1,2}月\s*20\d{2}(年)?;/.test(l)
            ) {
              let a = "Y-M",
                r = t[0],
                c = g._getModalItemDomByValue(e, r);
              if (
                (await b.clickDom(c),
                await _(50),
                (t = b.getModalItems(e)),
                (s = g._washDateItems(t)),
                (l = s.join(";")),
                !/1月;2月;3月;4月;5月;6月;7月;8月;9月/.test(l) ||
                  !/^20\d{2}(年)?$/.test(s[0]))
              )
                return;
              ((r = t[0]),
                (c = g._getModalItemDomByValue(e, r)),
                await b.clickDom(c),
                await _(50),
                (t = b.getModalItems(e)),
                (s = g._washDateItems(t)),
                (l = s.join(";")));
              let m = 0;
              for (; m < 10; m++) {
                let n = s.indexOf(o + "年");
                if ((-1 === n && (n = s.indexOf(o)), -1 !== n)) {
                  const o = g._getModalItemDomByValue(e, t[n]);
                  (await b.clickDom(o),
                    await _(50),
                    (t = b.getModalItems(e)),
                    (s = g._washDateItems(t)),
                    (l = s.join(";")));
                  break;
                }
                {
                  let n = "Y-M" === a ? t[0] : t[1];
                  const i = g._getModalItemDomByValue(e, n),
                    [r, c] = g._findDateLeftAndRight(e, i);
                  if (!r || !c) return;
                  let m = null;
                  for (let e = 0; e < s.length - 2; e++) {
                    const t = s[e].match(/^(19|20)\d{2}$/),
                      o = s[e + 1].match(/^(19|20)\d{2}$/),
                      n = s[e + 2].match(/^(19|20)\d{2}$/);
                    if (t && o && n) {
                      const e = parseInt(t[0]),
                        i = parseInt(o[0]),
                        s = parseInt(n[0]);
                      if (i === e + 1 && s === i + 1) {
                        m = e;
                        break;
                      }
                    }
                  }
                  if (null === m) return;
                  const u = parseInt(o) < m ? r : c;
                  (await b.clickDom(u),
                    await _(50),
                    (t = b.getModalItems(e)),
                    (s = g._washDateItems(t)),
                    (l = s.join(";")));
                }
              }
              if (10 === m) return;
              let u = !1;
              if (
                /1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28/.test(
                  l,
                )
              ) {
                let o = !1;
                for (let n = 0; n < s.length - 1; n++)
                  if ("14" === s[n] && "15" === s[n + 1]) {
                    const i = g._getModalItemDomByValue(e, t[n]),
                      s = g._getModalItemDomByValue(e, t[n + 1]);
                    g._checkDomByViewport(i) &&
                      g._checkDomByViewport(s) &&
                      (o = !0);
                    break;
                  }
                if (o) {
                  if (s[1] !== n + "月") {
                    let o = "Y-M" === a ? t[1] : t[0];
                    const n = g._getModalItemDomByValue(e, o);
                    (await b.clickDom(n),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")),
                      (u = !0));
                  }
                } else u = !0;
              } else u = !0;
              if (u) {
                const o = s.indexOf(n + "月"),
                  i = g._getModalItemDomByValue(e, t[o]);
                (await b.clickDom(i),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
              }
              let d = Number(i) < 15;
              const f = g._getModalItemDomByValue(e, i, d);
              return (await b.clickDom(f), void (await _(50)));
            }
            if (
              /1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28/.test(
                l,
              )
            ) {
              let a = "Y-M";
              ((s[0] && s[0].includes("月")) ||
                (s[1] && s[1].includes("年"))) &&
                (a = "M-Y");
              let r = "Y-M" === a ? s[0] : s[1],
                c = "Y-M" === a ? t[0] : t[1];
              if (r.replace(/年$/, "") !== o) {
                const n = g._getModalItemDomByValue(e, c);
                (await b.clickDom(n),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
                let i = 0;
                for (; i < 10; i++) {
                  let n = s.indexOf(o + "年");
                  if ((-1 === n && (n = s.indexOf(o)), -1 !== n)) {
                    const o = g._getModalItemDomByValue(e, t[n]);
                    (await b.clickDom(o),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")));
                    break;
                  }
                  {
                    let n = "Y-M" === a ? t[0] : t[1];
                    const i = g._getModalItemDomByValue(e, n),
                      [r, c] = g._findDateLeftAndRight(e, i);
                    if (!r || !c) return;
                    let m = null;
                    for (let e = 0; e < s.length - 2; e++) {
                      const t = s[e].match(/^(19|20)\d{2}$/),
                        o = s[e + 1].match(/^(19|20)\d{2}$/),
                        n = s[e + 2].match(/^(19|20)\d{2}$/);
                      if (t && o && n) {
                        const e = parseInt(t[0]),
                          i = parseInt(o[0]),
                          s = parseInt(n[0]);
                        if (i === e + 1 && s === i + 1) {
                          m = e;
                          break;
                        }
                      }
                    }
                    if (null === m) return;
                    const u = parseInt(o) < m ? r : c;
                    (await b.clickDom(u),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")));
                  }
                }
                if (10 === i) return;
              }
              let m = !1;
              if (
                /1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23;24;25;26;27;28/.test(
                  l,
                )
              ) {
                let o = !1;
                for (let n = 0; n < s.length - 1; n++)
                  if ("14" === s[n] && "15" === s[n + 1]) {
                    const i = g._getModalItemDomByValue(e, t[n]),
                      s = g._getModalItemDomByValue(e, t[n + 1]);
                    g._checkDomByViewport(i) &&
                      g._checkDomByViewport(s) &&
                      (o = !0);
                    break;
                  }
                if (o) {
                  if (s[1] !== n + "月") {
                    let o = "Y-M" === a ? t[1] : t[0];
                    const n = g._getModalItemDomByValue(e, o);
                    (await b.clickDom(n),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")),
                      (m = !0));
                  }
                } else m = !0;
              } else m = !0;
              if (m) {
                const o = s.indexOf(n + "月"),
                  i = g._getModalItemDomByValue(e, t[o]);
                (await b.clickDom(i),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
              }
              let u = Number(i) < 15;
              const d = g._getModalItemDomByValue(e, i, u);
              return (await b.clickDom(d), void (await _(50)));
            }
            if (/1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月/.test(l)) {
              let i = "Y-M";
              ((s[0] && s[0].includes("月")) ||
                (s[1] && s[1].includes("年"))) &&
                (i = "M-Y");
              let a = "Y-M" === i ? s[0] : s[1],
                r = "Y-M" === i ? t[0] : t[1];
              if (a.replace(/年$/, "") !== o) {
                let n = r;
                s.length > 3 && /^(19|20)\d{2}$/.test(s[2]) && (n = t[2]);
                const a = g._getModalItemDomByValue(e, n);
                (await b.clickDom(a),
                  await _(50),
                  (t = b.getModalItems(e)),
                  (s = g._washDateItems(t)),
                  (l = s.join(";")));
                let c = 0;
                for (; c < 10; c++) {
                  let n = s.indexOf(o + "年");
                  if ((-1 === n && (n = s.indexOf(o)), -1 !== n)) {
                    const o = g._getModalItemDomByValue(e, t[n]);
                    if (
                      (await b.clickDom(o),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")),
                      /^(19|20)\d{2}(年)?\-(19|20)\d{2}(年)?/.test(l) &&
                        !/1月;2月;3月;4月;5月;6月;7月;8月;9月;10月;11月;12月/.test(
                          l,
                        ))
                    )
                      continue;
                    break;
                  }
                  {
                    let n = "Y-M" === i ? t[0] : t[1];
                    const a = g._getModalItemDomByValue(e, n),
                      [r, c] = g._findDateLeftAndRight(e, a);
                    if (!r || !c) return;
                    let m = null;
                    for (let e = 0; e < s.length - 2; e++) {
                      const t = s[e].match(/^(19|20)\d{2}$/),
                        o = s[e + 1].match(/^(19|20)\d{2}$/),
                        n = s[e + 2].match(/^(19|20)\d{2}$/);
                      if (t && o && n) {
                        const e = parseInt(t[0]),
                          i = parseInt(o[0]),
                          s = parseInt(n[0]);
                        if (i === e + 1 && s === i + 1) {
                          m = e;
                          break;
                        }
                      }
                    }
                    if (null === m) return;
                    const u = parseInt(o) < m ? r : c;
                    (await b.clickDom(u),
                      await _(50),
                      (t = b.getModalItems(e)),
                      (s = g._washDateItems(t)),
                      (l = s.join(";")));
                  }
                }
                if (10 === c) return;
              }
              let c = s.lastIndexOf(n + "月");
              if (-1 === c) return;
              const m = g._getModalItemDomByValue(e, t[c], !1);
              return (await b.clickDom(m), void (await _(50)));
            }
          }
        } catch (e) {}
      },
      _washDateItems(e) {
        const t = [];
        for (const o of e) {
          let e = o.replace(/\s+/g, "");
          ((e = e
            .replace(/十一月/, "11月")
            .replace(/十二月/, "12月")
            .replace(/一月/, "1月")
            .replace(/二月/, "2月")
            .replace(/三月/, "3月")
            .replace(/四月/, "4月")
            .replace(/五月/, "5月")
            .replace(/六月/, "6月")
            .replace(/七月/, "7月")
            .replace(/八月/, "8月")
            .replace(/九月/, "9月")
            .replace(/十月/, "10月")),
            (e = e.replace(/^0(\d+)月/, "$1月")),
            (e = e.replace(/^0(\d+)$/, "$1")),
            t.push(e));
        }
        return t;
      },
      _checkDomByViewport(e) {
        const t = e.getBoundingClientRect();
        if (
          t.top < 0 ||
          t.left < 0 ||
          t.bottom > window.innerHeight ||
          t.right > window.innerWidth
        )
          return !1;
        const o = b.elementFromPoint(
          e,
          t.left + t.width / 2,
          t.top + t.height / 2,
        );
        return !!o && (o === e || e.contains(o) || o.contains(e));
      },
      _findDateLeftAndRight(e, t) {
        const o = t.getBoundingClientRect(),
          n = e.querySelectorAll("*");
        let i = [],
          s = [];
        for (const e of n) {
          if (e instanceof SVGElement || e.closest("svg")) continue;
          const t = e.getBoundingClientRect();
          t.width > 50 ||
            t.height > 50 ||
            t.top < o.top - 20 ||
            t.bottom > o.bottom + 20 ||
            (t.left < o.left && t.right < o.left && i.push(e),
            t.left > o.right && t.right > o.right && s.push(e));
        }
        if (
          ((i = b.filterDomsLeaveChildren(i)),
          (s = b.filterDomsLeaveChildren(s)),
          0 === s.length)
        )
          return [null, null];
        if (0 === i.length) {
          if (1 === s.length) return [null, null];
          return [s[s.length - 2], s[s.length - 1]];
        }
        return [i[0], s[s.length - 1]];
      },
      async _handleComplexModal(e) {
        const t = [];
        for (const e of b.observeAddDoms) t.push(...b.getModalItems(e));
        await _(100);
        const o = g._getObserveModalItemDom(e);
        if (!o) return !1;
        (await b.clickDom(o), await _(200));
        const n = [];
        for (const e of b.observeAddDoms) n.push(...b.getModalItems(e));
        if (t.length === n.length && t.join(",") === n.join(",")) {
          const t = [];
          for (const e of b.observeAddDoms) t.push(...e.querySelectorAll("*"));
          t.reverse();
          const n = t.indexOf(o);
          if (-1 === n) return !1;
          let i = null,
            s = null;
          for (let l = n + 1; l < t.length; l++) {
            const n = t[l];
            if (!n.contains(o)) {
              if (n.textContent && n.textContent !== e) break;
              if (
                "INPUT" === n.tagName &&
                ("radio" === n.type || "checkbox" === n.type)
              ) {
                i = n;
                break;
              }
              if (
                n.className &&
                "g" !== n.tagName &&
                "svg" !== n.tagName &&
                (/(?:^|\W+)([Rr]adio|[Cc]heckbox)(?:[A-Z0-9]|[^a-z]+|$)/.test(
                  n.className,
                ) ||
                  /(?:^|\W+)(radio|checkbox)(?:[^a-zA-Z]+|$)/i.test(
                    n.className,
                  ))
              ) {
                i = n;
                break;
              }
              "svg" !== n.tagName || s || (s = n);
            }
          }
          return (
            !i && s && (i = s),
            !!i && (await b.clickDom(i), await _(200), !0)
          );
        }
        {
          let e = !1;
          const o = 0.1,
            i = (t.length + n.length) / 2;
          if (Math.abs(t.length - n.length) / i < o) {
            let s = 0;
            const l = t.slice();
            for (const e of n) {
              const t = l.indexOf(e);
              -1 !== t ? l.splice(t, 1) : s++;
            }
            s / i < o && (e = !0);
          }
          if (e) return !0;
        }
        return !1;
      },
      _getObserveModalItemDom(e) {
        let t = null;
        for (const o of b.observeAddDoms)
          (t || (t = g._getModalItemDomByValue(o, e)),
            b.getModalSubmitDoms(o),
            b.getModalCancelDoms(o));
        return t;
      },
      _getModalItemDomByValue(e, t, o = !0, n = !0) {
        const i = e.querySelectorAll("*");
        let s = [],
          l = null,
          a = null;
        function r(e) {
          if (!e || 0 === e.childNodes.length) return !1;
          let t = !1;
          for (const o of e.childNodes)
            if (o.nodeType === Node.TEXT_NODE)
              "" !== o.textContent.trim() && (t = !0);
            else {
              if (o.nodeType === Node.COMMENT_NODE) continue;
              if (o.nodeType !== Node.ELEMENT_NODE) return !1;
              if ("" !== o.textContent.trim()) return !1;
            }
          return t;
        }
        for (const e of i) {
          if (0 == e.childNodes.length) continue;
          if (!r(e)) continue;
          const i = e.textContent.trim();
          if (
            (i !== t || (n && !b.isDomVisible(e))
              ? /^\d+$/.test(i) &&
                /^\d+$/.test(t) &&
                parseInt(i, 10) === parseInt(t, 10) &&
                (!n || b.isDomVisible(e))
                ? (l && o) || (l = e)
                : !e.textContent.startsWith(t) ||
                  (n && !b.isDomVisible(e)) ||
                  (a && o) ||
                  (a = e)
              : s.push(e),
            t.endsWith("省") || t.endsWith("市"))
          ) {
            const i = t.slice(0, -1);
            i &&
              e.textContent.startsWith(i) &&
              (!n || b.isDomVisible(e)) &&
              ((a && o) || (a = e));
          }
        }
        if (0 === s.length) return l || a || null;
        if (1 == s.length) return s[0];
        let c = [];
        for (const e of s) {
          let t = !0;
          const n = e.previousSibling;
          n && n.nodeType === Node.ELEMENT_NODE && r(n) && (t = !1);
          const i = e.nextSibling;
          if (
            (i && i.nodeType === Node.ELEMENT_NODE && r(i) && (t = !1),
            t && (c.push(e), o))
          )
            return e;
        }
        return c.length > 0
          ? o
            ? c[0]
            : c[c.length - 1]
          : o
            ? s[0]
            : s[s.length - 1];
      },
      async _checkModalClosed(e, t) {
        for (let o = 0; o < 10; o++) {
          if ((await _(100), e.value === t || e.textContent === t)) return !0;
          {
            let e = !0;
            for (const t of b.observeAddDoms)
              if (b.isDomVisible(t)) {
                e = !1;
                break;
              }
            if (e) return !0;
          }
        }
        return !1;
      },
    },
    p = {
      findAllBlocks(e) {
        const t = [];
        let o = null;
        for (const n of e) {
          const e = n.name,
            i = n.dom,
            s = b.getTagChain(i);
          o && ((o.nextTitleDom = i), (o.nextTitleDomTagChain = s));
          const l = {
            name: e,
            titleDom: i,
            titleDomTagChain: s,
            nextTitleDom: null,
            nextTitleDomTagChain: null,
            buttonDom: null,
            cancelButtonDom: null,
            submitButtonDom: null,
          };
          (t.push(l), (o = l));
        }
        return t;
      },
      checkBlockNeedFill(e) {
        const t = b.washTextSymbol(e.name);
        return !/附件/.test(t);
      },
      async findCurrentBlockDom(e, t = !1) {
        let o = [],
          n = !e.titleDom;
        const i = b.documentQuerySelectorAll();
        for (const t of i)
          if (t != e.titleDom) {
            if (n) {
              if (t == e.nextTitleDom) break;
              if (e.titleDom && e.nextTitleDom && t.contains(e.nextTitleDom))
                break;
              o.push(t);
            }
          } else n = !0;
        function s(e) {
          let t = "read",
            o = null,
            n = null;
          for (const i of e) {
            if (null == i.textContent) continue;
            const e = b.washTextSymbol(i.textContent);
            if (
              /^(保存|确定|完成|取消|关闭|\s)+$/.test(e) &&
              /(保存|确定|完成)/.test(e) &&
              /(取消|关闭)/.test(e) &&
              b.isDomVisible(i)
            ) {
              t = "write";
              const e = i.querySelectorAll("*");
              for (const t of e) {
                const e = b.washTextSymbol(t.textContent);
                /^(保存|确定|完成)$/.test(e)
                  ? (o = t)
                  : /^(取消|关闭)$/.test(e) && (n = t);
              }
              break;
            }
          }
          if ("read" == t)
            for (const i of e) {
              const e = b.washTextSymbol(i.textContent);
              /^(保存|确定|完成)$/.test(e) && b.isDomVisible(i)
                ? ((o = i), (t = "write"))
                : /^(取消|关闭)$/.test(e) && b.isDomVisible(i) && (n = i);
            }
          if ("write" == t && !n)
            for (const t of e) {
              if ("I" != t.tagName) continue;
              const e = t.className ? t.className.toLowerCase() : "";
              if (
                /(?:^|[^a-z])close(?:[^a-z]|$)/.test(e) &&
                b.isDomVisible(t)
              ) {
                n = t;
                break;
              }
            }
          return { saveDom: o, cancelDom: n, status: t };
        }
        function l(e) {
          if (1 == e.length) return e[0];
          let t = null;
          for (const o of e) {
            const e = o.parentNode;
            if (t) {
              if (t != e) {
                t = null;
                break;
              }
            } else t = e;
          }
          if (t && t.children.length == e.length) return t;
          let o = null;
          for (const t of e)
            o
              ? t.textContent.length > o.textContent.length && (o = t)
              : (o = t);
          return o;
        }
        let a = "",
          r = null,
          c = null,
          m = null;
        if ((({ saveDom: r, cancelDom: c, status: a } = s(o)), "write" == a)) {
          ((e.submitButtonDom = r), (e.cancelButtonDom = c));
          return ((m = l(b.filterDomsLeaveParent(o))), m);
        }
        let u = null;
        for (const e of o) {
          const o = b.washTextSymbol(e.textContent);
          if (!t && /^(编辑|修改)$/.test(o)) u = e;
          else if (/^(继续)?(添加|增加|新增)/.test(o)) {
            u = e;
            break;
          }
        }
        if (!u)
          for (const e of o) {
            if ("I" != e.tagName) continue;
            const o = e.className ? e.className.toLowerCase() : "";
            if (
              !t &&
              /(?:^|[^a-z])edit(?:[^a-z]|$)/.test(o) &&
              b.isDomVisible(e)
            )
              u = e;
            else if (
              /(?:^|[^a-z])(add|plus)(?:[^a-z]|$)/.test(o) &&
              b.isDomVisible(e)
            ) {
              u = e;
              break;
            }
          }
        if (!u)
          for (const e of o) {
            if (
              "SPAN" != e.tagName ||
              0 != e.children.length ||
              "" != e.textContent.trim()
            )
              continue;
            const o = e.className ? e.className.toLowerCase() : "";
            if (
              !t &&
              /(?:^|[^a-z])edit(?:[^a-z]|$)/.test(o) &&
              b.isDomVisible(e)
            )
              u = e;
            else if (
              /(?:^|[^a-z])(add|plus)(?:[^a-z]|$)/.test(o) &&
              b.isDomVisible(e)
            ) {
              u = e;
              break;
            }
          }
        if (!u) return null;
        ((e.buttonDom = u),
          b.observeDomChanges(),
          await b.clickDom(u),
          await _(1e3),
          b.stopObserveDomChanges());
        let d = g._getNewBlockDoms();
        if (0 == d.length) return null;
        ((d = b.filterDomsLeaveParent(d)), (o = []));
        for (const e of d) o.push(...e.querySelectorAll("*"));
        return (
          ({ saveDom: r, cancelDom: c, status: a } = s(o)),
          "read" == a
            ? null
            : ((e.submitButtonDom = r), (e.cancelButtonDom = c), (m = l(d)), m)
        );
      },
      addBlockNameToHtml: (e, t) => `<h2>${e.name}</h2>${t}`,
      findFieldDomsInBlock(e) {
        try {
          e.map((e) => e.name);
          const t = b.documentQuerySelectorAll();
          let o = null,
            n = null;
          for (const i of e)
            for (const e of i.fields)
              ((e.field.dom = g._findOneDom(e.name, n, t, o)),
                e.field.dom && (n = e.field.dom));
        } catch (e) {}
      },
      checkAllBlankHaveValue(e) {
        try {
          let t = !1;
          for (const o of e)
            for (const e of o.fields)
              for (const o of e.blanks) {
                if (!o || !o.dom) continue;
                if (!b.isDomInBody(o.dom)) return !1;
                if (b.isDomDisabled(o.dom)) continue;
                t = !0;
                let e = !1;
                if ("radio" == o.type) {
                  if (o.dom.querySelector('input[type="radio"]:checked'))
                    e = !0;
                  else if ("true" === o.dom.getAttribute("aria-checked"))
                    e = !0;
                  else {
                    e = null !== o.dom.querySelector('[aria-checked="true"]');
                  }
                } else
                  e = o.dom.isContentEditable
                    ? b.isTextValueFilled(o.dom.textContent || "")
                    : b.isDomFilled(o.dom);
                if (!e) return !1;
              }
          return t;
        } catch (e) {}
        return !1;
      },
      checkBlockRedraw(e) {
        function t(e) {
          if (!e || 1 !== e.nodeType) return null;
          for (const o of e.childNodes) {
            if (o.nodeType === Node.TEXT_NODE) {
              if ((o.textContent || "").replace(/\s+/g, "").trim().length > 0)
                return e;
              continue;
            }
            if (o.nodeType !== Node.ELEMENT_NODE) continue;
            const n = t(o);
            if (n) return n;
          }
          return null;
        }
        function o(e) {
          const t = ((e && e.textContent) || "").replace(/\s+/g, "").trim();
          return t.length < 2 ? "" : t.substring(0, 2);
        }
        function n(e, t) {
          return !(!e || !t) && e.join(";") === t.join(";");
        }
        if (!b.isDomInBody(e.titleDom)) {
          const i = e.titleDom;
          if (
            ((e.titleDom = (function (e, i) {
              if (!e || 1 !== e.nodeType || !i || 0 === i.length) return null;
              const s = o(e);
              let l = [];
              const a = b.documentQuerySelectorAll();
              for (const t of a) {
                if (t === e) return e;
                if (s.length >= 2 && o(t) !== s) continue;
                const a = b.getTagChain(t, document.body);
                0 !== a.length && n(a, i) && l.push(t);
              }
              if (0 === l.length) return null;
              if (1 === l.length) return l[0];
              const r = t(e),
                c = b.getTagChain(r, e),
                m = [];
              for (const e of l) {
                const o = t(e);
                n(b.getTagChain(o, e), c) && m.push(e);
              }
              return (m.length > 0 && (l = m), l.length, l[0]);
            })(i, e.titleDomTagChain)),
            !e.titleDom)
          )
            return !1;
        }
        return !0;
      },
      checkBlankValueJsonEmpty(e) {
        if (!e || 1 !== e.length) return !1;
        const t = e[0];
        if (!t.fields || !t.fields.length) return !0;
        for (const e of t.fields)
          if (e.blanks && e.blanks.length)
            for (const t of e.blanks) if ("" !== t.value) return !1;
        return !0;
      },
      async buildTemplateFieldList(e, t) {
        const o = t[0],
          n = e.cloneNode(!0),
          i = await g._matchTemplateFieldDoms([n], o);
        return i ? [{ name: o.name, fields: i }] : [];
      },
      async tryAutoSubmitBlock(e, t) {
        const { cancelButtonDom: o, submitButtonDom: n } =
          p._getBlockSubmitCancelDoms(t, e);
        if (!n) return !0;
        let i = null;
        const s = b.getBody(n || t),
          l = { bubbles: !0, cancelable: !0, view: b.getWindow(s) };
        ((i = b.createMouseEvent(s, "mousedown", l)),
          s.dispatchEvent(i),
          (i = b.createFocusEvent(s, "focus", l)),
          s.dispatchEvent(i),
          (i = b.createMouseEvent(s, "mouseup", l)),
          s.dispatchEvent(i),
          (i = b.createMouseEvent(s, "click", l)),
          s.dispatchEvent(i),
          await _(100),
          await b.clickDom(n));
        return await p._waitForBlockSubmitSuccess(t, n, o);
      },
      async tryAutoCancelBlock(e, t) {
        const { cancelButtonDom: o, submitButtonDom: n } =
          p._getBlockSubmitCancelDoms(t, e);
        if (!o) return !1;
        await b.clickDom(o);
        return await p._waitForBlockSubmitSuccess(t, n, o);
      },
      _getBlockSubmitCancelDoms: (e, t) =>
        t.submitButtonDom
          ? {
              cancelButtonDom: t.cancelButtonDom || null,
              submitButtonDom: t.submitButtonDom,
            }
          : void 0 !== t.cancelButtonSelector &&
              void 0 !== t.submitButtonSelector
            ? {
                cancelButtonDom: t.cancelButtonSelector
                  ? e.querySelector(t.cancelButtonSelector)
                  : null,
                submitButtonDom: t.submitButtonSelector
                  ? e.querySelector(t.submitButtonSelector)
                  : null,
              }
            : { cancelButtonDom: null, submitButtonDom: null },
      async _waitForBlockSubmitSuccess(e, t, o) {
        for (let n = 0; n < 6; n++) {
          const n = !b.isDomInBody(e),
            i = !e.contains(o),
            s = !e.contains(t),
            l = !b.isDomVisible(t),
            a = b.washTextSymbol(t.textContent),
            r = /^(编辑|修改)$/.test(a);
          if (n || (i && s) || l || r) return !0;
          await _(500);
        }
        return !1;
      },
      async waitForUserClickSubmit(e, t) {
        const { cancelButtonDom: o, submitButtonDom: n } =
          p._getBlockSubmitCancelDoms(t, e);
        if (!n) throw new Error("未找到保存按钮");
        try {
          for (;;) {
            D();
            if (await p._waitForBlockSubmitSuccess(t, n, o)) return;
          }
        } finally {
        }
      },
      async matchTemplateFieldDoms(e, t, o, n) {
        const i = await g._matchTemplateFieldDoms([n], t[0]);
        if (!i) return null;
        o[0].fields = i;
      },
    },
    w = {
      chooseRuntime() {
        const e = location.hostname.toLowerCase(),
          t = location.pathname;
        return "c.iguopin.com" === e &&
          (t.includes("/apply") || t.includes("/resume"))
          ? { mode: "platform", platform: "guopin", version: 1 }
          : "xiaoyuan.zhaopin.com" === e && t.includes("/scrd/")
            ? { mode: "platform", platform: "zhilian", version: 1 }
            : "i.zhaopin.com" === e && t.includes("/resume")
              ? { mode: "platform", platform: "zhilian", version: 2 }
              : "xyz.51job.com" === e && t.includes("/External/MyResume/")
                ? { mode: "platform", platform: "51job", version: 1 }
                : "q.yingjiesheng.com" === e && t.includes("/pc/myresume")
                  ? { mode: "platform", platform: "51job", version: 2 }
                  : { mode: "company", platform: null, version: null };
      },
      findAllBlocks(e) {
        let t = [];
        if ("guopin" == e.platform && 1 == e.version)
          t = w._findAllBlocksGuopin();
        else if ("zhilian" == e.platform && 1 == e.version)
          t = w._findAllBlocksZhilian();
        else if ("zhilian" == e.platform && 2 == e.version)
          t = w._findAllBlocksZhilian2();
        else if ("51job" == e.platform && 1 == e.version)
          t = w._findAllBlocks51job();
        else {
          if ("51job" != e.platform || 2 != e.version)
            throw new Error(`未识别平台: ${e.platform} ${e.version}`);
          t = w._findAllBlocks51job2();
        }
        return t;
      },
      _findAllBlocksGuopin() {
        const e = [],
          t = document
            .querySelector(".resume-left")
            .querySelectorAll(".item-section, .base");
        for (const o of t) {
          const t = o.querySelector(".section-title-content h2"),
            n = t.textContent.trim(),
            i = o.querySelector(".section-title-content .title-right button");
          if (!i) continue;
          const s = i.textContent.trim();
          let l = "";
          if ("添加" == s) l = "multi";
          else {
            if ("编辑" != s) continue;
            l = "single";
          }
          e.push({
            name: n,
            type: l,
            titleDom: t,
            mainContentDom: o,
            buttonDom: i,
            cancelButtonSelector: ".cancel-btn",
            submitButtonSelector: ".submit-btn",
          });
        }
        return e;
      },
      _findAllBlocksZhilian() {
        const e = [],
          t = document
            .querySelector(".apply-resume-menu")
            .querySelectorAll(".resume-menu-item__title");
        for (const o of t) {
          const t = o,
            n = t.textContent.trim();
          e.push({
            name: n,
            type: "",
            titleDom: t,
            mainContentDom: null,
            buttonDom: null,
            cancelButtonSelector: ".btn-box .el-button--default",
            submitButtonSelector: ".btn-box .el-button--primary",
          });
        }
        return e;
      },
      _findAllBlocksZhilian2() {
        const e = [],
          t = document
            .querySelector(".student")
            .querySelectorAll(":scope > div.jump-to");
        for (const o of t) {
          let t = o.querySelector(
            ".profile-pre-name, .zp-evalution-title span.fl, .edu-title-container span.edu-experience, .job-exp-title, .project-exp-title, .training-title, .zp-language span.zp-language-title, .professional-skills-container span.professional-skills-experience, .zp-certificate-title span.fl, .student-cadre-index__header h4",
          );
          if (!t) continue;
          const n = t.firstChild.textContent.trim();
          o.querySelector(".icon-resume-add, .icon-resume-edit") &&
            e.push({
              name: n,
              type: "",
              titleDom: t,
              mainContentDom: o,
              buttonDom: "",
              cancelButtonSelector:
                ".edu-edit-bottom .quit-btn, .zp-evalution-edit-btn div span, .job-exp-edit-btns .job-exp-edit-btns-cancel, .project-exp-edit-btns .project-exp-edit-btns-cancel, .training-edit-bottom .quit-btn, .language-edit-bottom .quit-btn, .edit-panel-bottom .edit-panel-bottom-quit-btn, .edit-status-btn div span, .cadre-edit-index__buttons .cadre-edit-index__buttons-cancel, .profile-edit-btns .profile-edit-btns-cancel",
              submitButtonSelector:
                ".edu-edit-bottom .save-btn, .zp-evalution-edit-btn .zp-evalution-edit-btn__sure, .job-exp-edit-btns .job-exp-edit-btns-sure, .project-exp-edit-btns .project-exp-edit-btns-sure, .training-edit-bottom .save-btn, .language-edit-bottom .save-btn, .edit-panel-bottom .edit-panel-bottom-save-btn, .edit-status-btn .zp-blue-button, .cadre-edit-index__buttons .cadre-edit-index__buttons-sure, .profile-edit-btns .profile-edit-btns-sure",
            });
        }
        return e;
      },
      _findAllBlocks51job() {
        const e = [],
          t = document.querySelectorAll(".cornercol1 h1");
        for (const o of t) {
          const t = o,
            n = t.textContent.trim();
          e.push({
            name: n,
            type: "",
            titleDom: t,
            mainContentDom: null,
            buttonDom: null,
            cancelButtonSelector: null,
            submitButtonSelector: null,
          });
        }
        return e;
      },
      _findAllBlocks51job2() {
        const e = [],
          t = document
            .querySelector(".resume-main")
            .querySelectorAll(".title-info");
        for (const o of t) {
          const t = o.querySelector(".item-name"),
            n = t.textContent.trim(),
            i = o.querySelector(".op-add");
          if (!i) continue;
          const s = i.textContent.trim();
          let l = "";
          if ("添加" == s) l = "multi";
          else {
            if ("编辑" != s) continue;
            l = "single";
          }
          e.push({
            name: n,
            type: l,
            titleDom: t,
            mainContentDom: o.parentNode,
            buttonDom: i,
            cancelButtonSelector:
              ".footer_btn .el-button.cancel, .btn-wrap .el-button.cancel",
            submitButtonSelector:
              ".footer_btn .el-button.el-button--primary, .btn-wrap .el-button.el-button--primary",
          });
        }
        return e;
      },
      findCurrentBlockDom: async (e, t) =>
        "guopin" == e.platform && 1 == e.version
          ? await w._findCurrentBlockDomGuopin(t)
          : "zhilian" == e.platform && 1 == e.version
            ? await w._findCurrentBlockDomZhilian(t)
            : "zhilian" == e.platform && 2 == e.version
              ? await w._findCurrentBlockDomZhilian2(t)
              : "51job" == e.platform && 1 == e.version
                ? await w._findCurrentBlockDom51job(t)
                : "51job" == e.platform && 2 == e.version
                  ? await w._findCurrentBlockDom51job2(t)
                  : void 0,
      async _findCurrentBlockDomGuopin(e) {
        (b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(1e3),
          b.stopObserveDomChanges());
        const t = g._getNewBlockDoms();
        if (0 == t.length) return null;
        return t[0];
      },
      async _findCurrentBlockDomZhilian(e) {
        (await b.clickDom(e.titleDom), await _(100));
        const t = document.querySelector(".apply-module");
        if (!t) return;
        const o = t.querySelector(".icon-box .icon-text");
        if (!o) return;
        let n = "";
        if ("编辑" == o.textContent.trim()) n = "single";
        else {
          if ("添加" != o.textContent.trim()) return;
          n = "multi";
        }
        return (
          (e.type = n),
          (e.mainContentDom = t),
          (e.buttonDom = o),
          await b.clickDom(e.buttonDom),
          await _(100),
          t
        );
      },
      async _findCurrentBlockDomZhilian2(e) {
        let t = e.mainContentDom.querySelector(
          ".icon-resume-add, .icon-resume-edit",
        );
        if (!t) return null;
        t = t.parentNode;
        const o = t.textContent.trim();
        let n = "";
        if (o.startsWith("添加")) n = "multi";
        else {
          if (!o.startsWith("编辑")) return null;
          n = "single";
        }
        ((e.type = n),
          (e.buttonDom = t),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(1e3),
          b.stopObserveDomChanges());
        const i = g._getNewBlockDoms();
        if (0 == i.length) return null;
        let s = i[0];
        return (
          s.classList.contains("zp-evalution-edit-content") &&
            (s = s.parentNode),
          s
        );
      },
      async _findCurrentBlockDom51job(e) {
        const t = document.querySelector(".cornercol1 .ci");
        if (!t) return;
        const o = t.querySelector(".tb .btnAppend");
        let n = "";
        return (
          (n = o ? "multi" : "single"),
          (e.type = n),
          (e.mainContentDom = t),
          (e.buttonDom = o),
          t
        );
      },
      async _findCurrentBlockDom51job2(e) {
        ((e.buttonDom = e.mainContentDom.querySelector(".op-add")),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(1e3),
          b.stopObserveDomChanges());
        const t = g._getNewBlockDoms();
        if (0 == t.length) return null;
        return t[0];
      },
      async buildFieldResponseInBlock(e, t, o, n) {
        let i = [];
        "guopin" == e.platform && 1 == e.version
          ? (i = w._buildFieldResponseInBlockGuopin(t))
          : "zhilian" == e.platform && 1 == e.version
            ? (i = w._buildFieldResponseInBlockZhilian(t))
            : "zhilian" == e.platform && 2 == e.version
              ? (i = await w._buildFieldResponseInBlockZhilian2(t, n))
              : "51job" == e.platform && 1 == e.version
                ? (i = await w._buildFieldResponseInBlock51job(t, n))
                : "51job" == e.platform &&
                  2 == e.version &&
                  (i = w._buildFieldResponseInBlock51job2(t));
        return [{ name: o.name, fields: i.map((e) => ({ name: e })) }];
      },
      _buildFieldResponseInBlockGuopin(e) {
        const t = e.querySelectorAll(".resume-common-form-item");
        t.length;
        const o = [];
        for (const e of t) {
          if (!b.isDomVisible(e)) continue;
          const t = e.querySelector(".ant-form-item-label label");
          if (!t) continue;
          const n = t.textContent.trim();
          o.push(n);
        }
        return o;
      },
      _buildFieldResponseInBlockZhilian(e) {
        const t = e.querySelectorAll(".el-form-item");
        t.length;
        const o = [];
        for (const e of t) {
          if (!b.isDomVisible(e)) continue;
          const t = e.querySelector("label span");
          if (!t) continue;
          const n = t.textContent.trim();
          o.push(n);
        }
        return o;
      },
      async _buildFieldResponseInBlockZhilian2(e, t) {
        let o = e.querySelectorAll(".edu-edit__eduBackground");
        if (o.length > 0) {
          const e = o[0],
            n = e.querySelector(".edu-edit-title"),
            i = e.querySelector(".ivu-select-selection");
          if (n && i) {
            const o = i.querySelector("input");
            let s = n.textContent.trim();
            s = s.replace(/：$/g, "").trim();
            let l = o.value;
            if ("最高学历" == s && "" == l) {
              let o = "";
              ((o = /博士/.test(t)
                ? "博士"
                : /硕士/.test(t)
                  ? "硕士"
                  : /大专/.test(t) && !/本科/.test(t)
                    ? "大专"
                    : "本科"),
                await b.clickDom(i),
                await _(100));
              const n = [
                ...e.querySelectorAll(".ivu-select-dropdown-list li"),
              ].find((e) => e.textContent.trim() == o);
              n && (await b.clickDom(n), await _(100));
            }
          }
        }
        let n = e.querySelectorAll(
          "span.profileLib__item-label, span.profile-edit-item-label, p.description, span.edu-edit-title, span.job-target-edit__lab, span.project-exp-edit-label, span.training-edit-title, span.language-edit-title, span.edit-panel-title, span.zp-certificate-title-name, label.cadre-edit-index__label",
        );
        n.length;
        const i = [];
        for (const e of n) {
          if (!b.isDomVisible(e)) continue;
          const t = e.textContent.trim();
          t && i.push(t);
        }
        return i;
      },
      async _buildFieldResponseInBlock51job(e, t) {
        let o = e.querySelectorAll("dl");
        if ((o.length, o.length > 1)) {
          const e = o[0],
            n = e.querySelector("dt"),
            i = e.querySelector("dd select");
          if (n && i) {
            let e = n.textContent.trim();
            e = e.replace(/\*+$/g, "").trim();
            let o = i.value;
            if ("最高学历" == e && "" == o) {
              let e = "";
              ((e = /博士/.test(t)
                ? "8"
                : /硕士/.test(t)
                  ? "7"
                  : /大专/.test(t) && !/本科/.test(t)
                    ? "5"
                    : "6"),
                (i.value = e),
                await b.changeDom(i),
                await _(100));
            }
          }
        }
        ((o = e.querySelectorAll("dl")), o.length);
        const n = [];
        for (const e of o) {
          if (!b.isDomVisible(e)) continue;
          const t = e.querySelector("dt");
          if (!t) continue;
          let o = t.textContent.trim();
          ((o = o.replace(/\*+$/g, "").trim()), n.push(o));
        }
        return n;
      },
      _buildFieldResponseInBlock51job2(e) {
        const t = e.querySelectorAll(".el-form-item, .edit_intention-item");
        t.length;
        const o = [];
        for (const e of t) {
          if (!b.isDomVisible(e)) continue;
          const t = e.querySelector(".el-form-item__label, .item_title-title");
          if (!t) continue;
          const n = t.textContent.trim();
          o.push(n);
        }
        return o;
      },
      addNextMultiSegment: async (e, t, o, n) =>
        "guopin" == e.platform && 1 == e.version
          ? await w._addNextMultiSegmentGuopin(t, o, n)
          : "zhilian" == e.platform && 1 == e.version
            ? await w._addNextMultiSegmentZhilian(t, o, n)
            : "zhilian" == e.platform && 2 == e.version
              ? await w._addNextMultiSegmentZhilian2(t, o, n)
              : "51job" == e.platform && 1 == e.version
                ? await w._addNextMultiSegment51job(t, o, n)
                : "51job" == e.platform && 2 == e.version
                  ? await w._addNextMultiSegment51job2(t, o, n)
                  : null,
      async _addNextMultiSegmentGuopin(e, t, o) {
        ((e.buttonDom = e.mainContentDom.querySelector(
          ".section-title-content .title-right button",
        )),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(200),
          b.stopObserveDomChanges());
        const n = g._getNewBlockDoms();
        if (0 == n.length) return null;
        const i = await g._matchTemplateFieldDoms(n, t[0]);
        if (!i) return null;
        o[0].fields = i;
        return n[0];
      },
      async _addNextMultiSegmentZhilian(e, t, o) {
        if (!b.isDomInBody(e.mainContentDom)) {
          const t = e.mainContentDom && e.mainContentDom.ownerDocument;
          e.mainContentDom =
            (t && t.querySelector(".apply-module")) ||
            document.querySelector(".apply-module");
        }
        ((e.buttonDom = e.mainContentDom.querySelector(".icon-box .icon-text")),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(200),
          b.stopObserveDomChanges());
        const n = g._getNewBlockDoms();
        if (0 == n.length) return null;
        const i = await g._matchTemplateFieldDoms(n, t[0]);
        return i ? ((o[0].fields = i), e.mainContentDom) : null;
      },
      async _addNextMultiSegmentZhilian2(e, t, o) {
        let n = e.mainContentDom.querySelector(".icon-resume-add");
        if (!n) return null;
        ((e.buttonDom = n.parentNode),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(200),
          b.stopObserveDomChanges());
        const i = g._getNewBlockDoms();
        if (0 == i.length) return null;
        const s = await g._matchTemplateFieldDoms(i, t[0]);
        if (!s) return null;
        o[0].fields = s;
        return i[0];
      },
      async _addNextMultiSegment51job(e, t, o) {
        (b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(200),
          b.stopObserveDomChanges());
        const n = g._getNewBlockDoms();
        if (0 == n.length) return null;
        const i = await g._matchTemplateFieldDoms(n, t[0]);
        return i ? ((o[0].fields = i), e.mainContentDom) : null;
      },
      async _addNextMultiSegment51job2(e, t, o) {
        ((e.buttonDom = e.mainContentDom.querySelector(".op-add")),
          b.observeDomChanges(),
          await b.clickDom(e.buttonDom),
          await _(200),
          b.stopObserveDomChanges());
        const n = g._getNewBlockDoms();
        if (0 == n.length) return null;
        const i = await g._matchTemplateFieldDoms(n, t[0]);
        if (!i) return null;
        o[0].fields = i;
        return n[0];
      },
    },
    b = {
      resetParams() {
        ((b.domObserverContexts = []),
          (b.observeIframeLoadBindings = []),
          (b.observeAddDoms = []),
          (b.oldComputedStyles = new WeakMap()),
          (b.modalCancelDoms = []),
          (b.modalSubmitDoms = []),
          (b.modalDeleteDoms = []));
      },
      washTextSymbol(e, t = !1) {
        let o = String(e || "").trim();
        return t
          ? ((o = o.replace(/(\s|\*)/g, "")),
            (o = o.replace(/^[^a-zA-Z0-9\u4e00-\u9fa5]+/g, "")),
            o)
          : o.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
      },
      getWindow: (e) =>
        (e && e.ownerDocument && e.ownerDocument.defaultView) || window,
      getBody: (e) =>
        (e && e.ownerDocument && e.ownerDocument.body) || document.body,
      getIframeBody(e) {
        try {
          const t =
            e.contentDocument || (e.contentWindow && e.contentWindow.document);
          return null == t || null == t.body ? null : t.body;
        } catch (e) {
          return null;
        }
      },
      elementFromPoint(e, t, o) {
        const n = e && e.ownerDocument;
        return n && "function" == typeof n.elementFromPoint
          ? n.elementFromPoint(t, o)
          : document.elementFromPoint(t, o);
      },
      getComputedStyle(e) {
        const t = e && e.ownerDocument && e.ownerDocument.defaultView;
        return t && "function" == typeof t.getComputedStyle
          ? t.getComputedStyle(e)
          : getComputedStyle(e);
      },
      documentQuerySelectorAll() {
        const e = [];
        return (
          (function t(o) {
            const n = o.querySelectorAll("*");
            for (const o of n) {
              if ((e.push(o), "IFRAME" !== o.tagName)) continue;
              const n = b.getIframeBody(o);
              null != n && t(n);
            }
          })(i),
          e
        );
      },
      getTagChain(e, t = document.body) {
        if (!e || 1 !== e.nodeType || !t || 1 !== t.nodeType) return [];
        const o = [];
        let n = e,
          i = !1;
        for (; n;) {
          if ((o.push(n.tagName), n === t)) {
            i = !0;
            break;
          }
          const e = n.parentElement;
          if (e) {
            n = e;
            continue;
          }
          const s = n.ownerDocument && n.ownerDocument.defaultView,
            l = s && s.frameElement;
          if (!l) break;
          n = l;
        }
        return i ? (o.reverse(), o) : [];
      },
      async clickDom(e) {
        let t = e;
        if (
          (e.scrollIntoViewIfNeeded(),
          e.offsetWidth > 0 &&
            e.offsetHeight > 0 &&
            "hidden" !== b.getComputedStyle(e).visibility)
        ) {
          const o = e.getBoundingClientRect(),
            n = o.left + o.width / 2,
            i = o.top + o.height / 2;
          t = b.elementFromPoint(e, n, i);
        }
        if (
          (t &&
            (e.contains(t) ||
              t.contains(e) ||
              e.parentNode == t.parentNode ||
              (t = null)),
          t)
        )
          for (; t && "function" != typeof t.click;) t = t.parentElement;
        else t = e;
        let o = null;
        const n = { bubbles: !0, cancelable: !0, view: b.getWindow(t) };
        ((o = b.createMouseEvent(t, "mousedown", n)),
          t.dispatchEvent(o),
          (o = b.createFocusEvent(t, "focus", n)),
          t.dispatchEvent(o),
          (o = b.createMouseEvent(t, "mouseup", n)),
          t.dispatchEvent(o),
          (o = b.createMouseEvent(t, "click", n)),
          t.dispatchEvent(o),
          await _(10));
      },
      async focusDom(e) {
        const t = b.createFocusEvent(e, "focus", {
          bubbles: !0,
          cancelable: !0,
          view: b.getWindow(e),
        });
        (e.dispatchEvent(t), await _(10));
      },
      async blurDom(e) {
        const t = b.createFocusEvent(e, "blur", {
          bubbles: !0,
          cancelable: !0,
          view: b.getWindow(e),
        });
        (e.dispatchEvent(t), await _(10));
      },
      async changeDom(e) {
        const t = b.createEvent(e, "change", { bubbles: !0, cancelable: !0 });
        (e.dispatchEvent(t), await _(10));
      },
      async keydownDom(e, t) {
        const o =
          {
            ArrowDown: 40,
            ArrowUp: 38,
            ArrowLeft: 37,
            ArrowRight: 39,
            Enter: 13,
            Escape: 27,
            Tab: 9,
            Space: 32,
            Backspace: 8,
            Delete: 46,
            Home: 36,
            End: 35,
            PageUp: 33,
            PageDown: 34,
          }[t] || 0;
        if (0 === o) return;
        const n = b.createKeyboardEvent(e, "keydown", {
          bubbles: !0,
          cancelable: !0,
          key: t,
          keyCode: o,
          code: t,
          which: o,
        });
        (e.dispatchEvent(n), await _(10));
      },
      createMouseEvent: (e, t, o) =>
        new (b.getWindow(e).MouseEvent || MouseEvent)(t, o),
      createFocusEvent: (e, t, o) =>
        new (b.getWindow(e).FocusEvent || FocusEvent)(t, o),
      createKeyboardEvent: (e, t, o) =>
        new (b.getWindow(e).KeyboardEvent || KeyboardEvent)(t, o),
      createEvent: (e, t, o) => new (b.getWindow(e).Event || Event)(t, o),
      isDomDisabled: (e) =>
        e.disabled ||
        (void 0 !== e.classList &&
          (e.classList.contains("disabled") ||
            e.classList.contains("ant-input-disabled") ||
            e.classList.contains("ant-select-disabled") ||
            e.classList.contains("ant-radio-disabled"))),
      isDomEditable(e) {
        if (!e) return !1;
        const t = e.tagName ? e.tagName.toLowerCase() : "";
        if ("input" === t) {
          return "hidden" !== (e.type || "").toLowerCase() && !e.disabled;
        }
        return "textarea" === t ? !e.disabled : !!e.isContentEditable;
      },
      isDomFilled(e) {
        const t = e.tagName ? e.tagName.toLowerCase() : "";
        if ("input" !== t && "select" !== t && "textarea" !== t) {
          const t = e.querySelector(
            'input:not([type="radio"]), select, textarea',
          );
          if (!t) return !1;
          e = t;
        }
        return b.isTextValueFilled(e.value || "");
      },
      isTextValueFilled(e) {
        const t = b.washTextSymbol(e);
        return !(
          !t ||
          /(请选择|请输入|请填写|请填入|请写入)/.test(t) ||
          /^(选择|输入|填写|填入|写入)/.test(t) ||
          /^(无|空|未知|否|0|[-—]+|男)$/.test(t)
        );
      },
      isDomInBody(e) {
        const t = b.getBody(e);
        return !(!t || !t.contains(e));
      },
      isDomInViewport(e) {
        const t = e.getBoundingClientRect();
        if (
          t.x >= 0 &&
          t.y >= 0 &&
          t.right <= window.innerWidth &&
          t.bottom <= window.innerHeight
        )
          return !0;
        for (const t of e.children) if (b.isDomInViewport(t)) return !0;
        return !1;
      },
      isDomVisible(e) {
        if (!e.ownerDocument.contains(e)) return !1;
        let t = e;
        for (; t;) {
          const e = b.getComputedStyle(t);
          if (
            "none" === e.display ||
            "hidden" === e.visibility ||
            "0" === e.opacity ||
            t.hidden ||
            (0 === t.offsetWidth &&
              0 === t.offsetHeight &&
              "hidden" === e.overflow)
          )
            return !1;
          t = t.parentElement;
        }
        if (
          (function e(t) {
            const o = b.getComputedStyle(t);
            if (
              "none" === o.display ||
              "hidden" === o.visibility ||
              "0" === o.opacity ||
              t.hidden ||
              (0 === t.offsetWidth &&
                0 === t.offsetHeight &&
                "hidden" === o.overflow)
            )
              return !0;
            if (0 === t.offsetHeight || 0 === t.offsetWidth) {
              for (const o of t.children) if (!e(o)) return !1;
              return !0;
            }
            return !1;
          })(e)
        )
          return !1;
        function o(e) {
          const t = e.getBoundingClientRect();
          if (0 == t.height) return !0;
          let o = e.parentElement;
          for (; o && "BODY" !== o.tagName;) {
            const e = b.getComputedStyle(o);
            if ("hidden" === e.overflow || "hidden" === e.overflowY) {
              const e = o.getBoundingClientRect(),
                n = t.top,
                i = t.bottom,
                s = e.top,
                l = e.bottom;
              if (i <= s || n >= l) return !1;
              if ((Math.min(i, l) - Math.max(n, s)) / t.height < 0.1) return !1;
            }
            o = o.parentElement;
          }
          return !0;
        }
        return !(
          !o(e) &&
          (e.scrollIntoView({ block: "center", behavior: "instant" }), !o(e))
        );
      },
      isRadioDom(e) {
        if (
          (/(?:^|\W+)(radio)(?:[^a-zA-Z]+|$)/i.test(e.className) ||
            /(?:^|\W+)([Rr]adio)(?:[A-Z0-9]|[^a-z]+|$)/.test(e.className)) &&
          b.getModalItems(e).length >= 2
        )
          return !0;
        const t = e.querySelectorAll('input[type="radio"]');
        if (t.length < 2) return !1;
        const o = t[0].name;
        if (!o) return !1;
        for (let e = 1; e < t.length; e++) if (t[e].name !== o) return !1;
        let n = t[0];
        for (; n;) {
          let e = !0;
          for (const o of t)
            if (!n.contains(o)) {
              e = !1;
              break;
            }
          if (e) break;
          n = n.parentElement;
        }
        return n === e;
      },
      isRedColor(e) {
        let t, o, n;
        if (e.startsWith("rgb")) {
          const i = e.match(/\d+/g);
          if (!i || i.length < 3) return !1;
          [t, o, n] = i.map(Number);
        } else {
          if (!e.startsWith("#")) return !1;
          ((t = parseInt(e.slice(1, 3), 16)),
            (o = parseInt(e.slice(3, 5), 16)),
            (n = parseInt(e.slice(5, 7), 16)));
        }
        return t > 1.5 * o && t > 1.5 * n;
      },
      filterDomsLeaveParent(e) {
        const t = [];
        for (const o of e) {
          let n = !0;
          for (const t of e)
            if (t !== o && t.contains(o)) {
              n = !1;
              break;
            }
          n && t.push(o);
        }
        return t;
      },
      filterDomsLeaveChildren(e) {
        const t = [];
        for (const o of e) {
          let n = !0;
          for (const t of e)
            if (t !== o && o.contains(t)) {
              n = !1;
              break;
            }
          n && t.push(o);
        }
        return t;
      },
      findMinDomInDom(e, t) {
        let o = e;
        const n = Array.from(e.querySelectorAll("*")).reverse();
        for (const e of n) {
          const n = b.washTextSymbol(e.textContent, !0);
          if (0 != n.length && t.test(n)) {
            o = e;
            break;
          }
        }
        return o;
      },
      getSelectItems(e) {
        const t = [],
          o = e.querySelectorAll("*");
        for (const e of o) {
          let o = !0;
          for (const t of e.childNodes)
            if (t.nodeType !== Node.TEXT_NODE) {
              o = !1;
              break;
            }
          if (o && e.childNodes.length > 0) {
            const o = e.textContent.trim();
            "" !== o && t.push(o);
          }
        }
        return t;
      },
      getModalItems(e) {
        const t = [],
          o = new Map();
        let n = null;
        const i = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_TEXT),
          s = [];
        let l;
        for (; (l = i.nextNode());) s.push(l);
        s.reverse();
        for (const e of s) {
          const i = e.parentElement;
          if (!i) continue;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(i.tagName))
            continue;
          if (!o.has(i)) {
            const e = b.isDomVisible(i);
            o.set(i, e);
          }
          if (!o.get(i)) continue;
          const s = e.textContent.trim();
          if (!s) continue;
          let l = !0;
          for (const e of i.childNodes)
            if (e.nodeType !== Node.TEXT_NODE) {
              l = !1;
              break;
            }
          l
            ? n !== i && (t.push(i.textContent.trim()), (n = i))
            : (t.push(s), (n = null));
        }
        return (t.reverse(), t);
      },
      modalSubmitDoms: [],
      getModalSubmitDoms(e) {
        const t = e.querySelectorAll("*");
        for (const e of t)
          if ("确定" === e.innerHTML.replace(/\s+/g, "") && b.isDomVisible(e)) {
            b.modalSubmitDoms.push(e);
            break;
          }
      },
      modalCancelDoms: [],
      getModalCancelDoms(e) {
        const t = e.querySelectorAll("*");
        for (const e of t)
          if ("取消" === e.innerHTML.replace(/\s+/g, "") && b.isDomVisible(e)) {
            b.modalCancelDoms.push(e);
            break;
          }
        for (const e of t) {
          let t = !1;
          const o = e.attributes;
          for (const e of o) {
            const o = e.value;
            if (
              /(?:^|\W+)(guanbi|(close|shut|exit|quit)(|btn|button)|关闭|退出|取消)(?:[^a-zA-Z]+|$)/i.test(
                o,
              )
            ) {
              t = !0;
              break;
            }
            if (
              /(?:^|\W+)([Gg]uanbi|[Cc]lose|[Ss]hut|[Ee]xit|[Qq]uit)(?:[A-Z0-9]|[^a-z]+|$)/.test(
                o,
              )
            ) {
              t = !0;
              break;
            }
          }
          t && b.isDomVisible(e) && b.modalCancelDoms.push(e);
        }
        for (const e of t) {
          const t = e.getBoundingClientRect();
          if (t.width === window.innerWidth && t.height === window.innerHeight)
            b.isDomVisible(e) && b.modalCancelDoms.push(e);
          else if (b.modalCancelDoms.length > 0) break;
        }
      },
      modalDeleteDoms: [],
      getModalDeleteDoms(e) {
        const t = e.querySelectorAll("*");
        for (const e of t) {
          const t = e.innerHTML.replace(/\s+/g, "");
          if (/^(确定)?删除$/.test(t) && b.isDomVisible(e)) {
            b.modalDeleteDoms.push(e);
            break;
          }
        }
      },
      async clickSubmitModal() {
        if (b.modalSubmitDoms.length > 0)
          for (const e of b.modalSubmitDoms)
            b.isDomVisible(e) && (await b.clickDom(e));
      },
      async clickCloseModal(e) {
        if (b.modalCancelDoms.length > 0)
          for (const e of b.modalCancelDoms)
            b.isDomVisible(e) && (await b.clickDom(e));
        else await b.clickDom(e);
        (await _(10), await b.blurDom(e));
        let t = !1;
        for (let e = 0; e < 20; e++) {
          t = !0;
          for (const e of b.observeAddDoms)
            if (b.isDomVisible(e)) {
              t = !1;
              break;
            }
          if (t) break;
          await _(50);
        }
        if (!t) {
          let t;
          ((t = b.createEvent(e, "mousedown", { bubbles: !0 })),
            b.getBody(e).dispatchEvent(t),
            (t = b.createEvent(e, "mouseup", { bubbles: !0 })),
            b.getBody(e).dispatchEvent(t),
            await _(10));
        }
      },
      async clickDeleteModal() {
        if (b.modalDeleteDoms.length > 0)
          for (const e of b.modalDeleteDoms)
            b.isDomVisible(e) && (await b.clickDom(e));
      },
      domObserverContexts: [],
      observeIframeLoadBindings: [],
      observeAddDoms: [],
      oldComputedStyles: new WeakMap(),
      observeDomChanges() {
        performance.now();
        ((b.observeAddDoms = []),
          (b.modalCancelDoms = []),
          (b.modalSubmitDoms = []),
          (b.modalDeleteDoms = []),
          b.stopObserveDomChanges());
        const e = {
            childList: !0,
            subtree: !0,
            attributeFilter: ["class", "style"],
            attributeOldValue: !0,
          },
          t = new WeakSet(),
          o = new WeakSet();
        function n(t) {
          const n = t && t.ownerDocument;
          if (null == n || o.has(n)) return;
          (o.add(n),
            (function (e) {
              const t = Array.from(e.querySelectorAll("*"));
              t.push(e);
              for (const e of t) {
                if (e.nodeType !== Node.ELEMENT_NODE) continue;
                const t = b.getComputedStyle(e);
                b.oldComputedStyles.set(e, {
                  display: t.display,
                  visibility: t.visibility,
                  opacity: t.opacity,
                });
              }
            })(t));
          const s = new MutationObserver(i);
          (s.observe(t, e),
            t.addEventListener("transitionrun", r, !0),
            t.addEventListener("animationstart", c, !0),
            b.domObserverContexts.push({
              observer: s,
              targetNode: t,
              transitionRunListener: r,
              animationStartListener: c,
            }),
            l(t));
        }
        function i(e) {
          for (const o of e)
            if ("childList" === o.type)
              for (const e of o.addedNodes)
                e.nodeType !== Node.ELEMENT_NODE || t.has(e) || (l(e), s(e));
            else if ("attributes" === o.type) {
              const e = o.target;
              if (e.nodeType !== Node.ELEMENT_NODE || t.has(e)) continue;
              const n = b.oldComputedStyles.get(e) || {},
                i = b.getComputedStyle(e),
                l = parseFloat(n.opacity),
                a = parseFloat(i.opacity),
                r = Number.isFinite(l),
                c = Number.isFinite(a),
                m = r && c && a > l,
                u =
                  "none" === n.display ||
                  "hidden" === n.visibility ||
                  0 === parseFloat(n.opacity),
                d =
                  "none" !== i.display &&
                  "hidden" !== i.visibility &&
                  0 !== parseFloat(i.opacity);
              if (
                (b.oldComputedStyles.set(e, {
                  display: i.display,
                  visibility: i.visibility,
                  opacity: i.opacity,
                }),
                !d)
              )
                continue;
              if (u || m) {
                s(e);
                continue;
              }
              const f = e.querySelectorAll("div, ul");
              for (const e of f) {
                if (t.has(e)) continue;
                const o = b.oldComputedStyles.get(e) || {},
                  n = b.getComputedStyle(e),
                  i =
                    "none" === o.display ||
                    "hidden" === o.visibility ||
                    0 === parseFloat(o.opacity),
                  l =
                    "none" !== n.display &&
                    "hidden" !== n.visibility &&
                    0 !== parseFloat(n.opacity);
                (b.oldComputedStyles.set(e, {
                  display: n.display,
                  visibility: n.visibility,
                  opacity: n.opacity,
                }),
                  i && l && s(e));
              }
            }
        }
        function s(e) {
          if (e.nodeType !== Node.ELEMENT_NODE || t.has(e)) return !1;
          (t.add(e), b.observeAddDoms.push(e));
          for (const o of e.querySelectorAll("*")) t.add(o);
          return !0;
        }
        function l(e) {
          "IFRAME" === e.tagName && a(e);
          for (const t of e.querySelectorAll("iframe")) a(t);
        }
        function a(e) {
          !(function (e) {
            for (const t of b.observeIframeLoadBindings)
              if (t.iframeDom === e) return;
            function t() {
              a(e);
            }
            (e.addEventListener("load", t, !0),
              b.observeIframeLoadBindings.push({
                iframeDom: e,
                iframeLoadListener: t,
              }));
          })(e);
          const t = b.getIframeBody(e);
          null != t && n(t);
        }
        function r(e) {
          if ("opacity" !== e.propertyName) return;
          const o = e.target;
          if (!o || o.nodeType !== Node.ELEMENT_NODE || t.has(o)) return;
          const n = b.oldComputedStyles.get(o) || {},
            i = parseFloat(n.opacity),
            l = parseFloat(b.getComputedStyle(o).opacity);
          Number.isFinite(i) && Number.isFinite(l) && l > i && s(o);
        }
        function c(e) {
          const o = e.target;
          if (!o || o.nodeType !== Node.ELEMENT_NODE || t.has(o)) return;
          const n = b.oldComputedStyles.get(o) || {},
            i = parseFloat(n.opacity),
            l = parseFloat(b.getComputedStyle(o).opacity);
          Number.isFinite(i) && Number.isFinite(l) && l > i && s(o);
        }
        n(document.body);
      },
      stopObserveDomChanges() {
        for (const e of b.domObserverContexts)
          (e.observer.disconnect(),
            e.targetNode.removeEventListener(
              "transitionrun",
              e.transitionRunListener,
              !0,
            ),
            e.targetNode.removeEventListener(
              "animationstart",
              e.animationStartListener,
              !0,
            ));
        b.domObserverContexts = [];
        for (const e of b.observeIframeLoadBindings)
          e.iframeDom.removeEventListener("load", e.iframeLoadListener, !0);
        ((b.observeIframeLoadBindings = []),
          (b.oldComputedStyles = new WeakMap()),
          (b.observeAddDoms = b.filterDomsLeaveParent(b.observeAddDoms)));
      },
      getHelloOfferMark(e) {
        const t = [
          "hello-offer-mark-yellow",
          "hello-offer-mark-green",
          "hello-offer-mark-red",
          "hello-offer-mark-blue",
          "hello-offer-mark-purple",
        ];
        for (const o of t)
          if (e.classList.contains(o)) return o.replace("hello-offer-mark-", "");
        return null;
      },
      setHelloOfferMark(e, t = "") {
        const o = [
          "hello-offer-mark-yellow",
          "hello-offer-mark-green",
          "hello-offer-mark-red",
          "hello-offer-mark-blue",
          "hello-offer-mark-purple",
        ];
        for (const t of o) e.classList.remove(t);
        if (!t) return;
        const n = `hello-offer-mark-${t}`;
        o.includes(n) && e.classList.add(n);
      },
      async scrollToRealTop() {
        try {
          (window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
            await _(50));
          const e = [
            "body",
            "html",
            "main",
            '[role="main"]',
            ".main-content",
            ".content",
            ".container",
            "section",
            "article",
            "div",
          ];
          for (const t of e) {
            const e = document.querySelectorAll(t);
            for (const t of e) {
              const e = b.getComputedStyle(t);
              (t.scrollHeight > t.clientHeight ||
                "scroll" === e.overflowY ||
                "auto" === e.overflowY ||
                "scroll" === e.overflow ||
                "auto" === e.overflow) &&
                t.scrollTop > 0 &&
                ((t.scrollTop = 0), await _(10));
            }
          }
          const t = document.querySelectorAll("*");
          for (const e of t)
            if (e.offsetHeight > 1.2 * window.innerHeight && e.scrollTop > 0) {
              const t = b.getComputedStyle(e);
              "fixed" !== t.position &&
                "absolute" !== t.position &&
                ((e.scrollTop = 0), await _(10));
            }
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        } catch (e) {
          try {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          } catch (e) {}
        }
      },
    };
  function D() {
    if (window.isHttpResponseError) throw new Error("网络响应不正常");
  }
  let y = null,
    k = "",
    v = "";
  function S(e, t) {
    chrome.runtime.sendMessage(
      { type: "addHistory", source: e, data: t },
      (e) => {},
    );
  }
  let C = null;
  function B() {
    if (C) return C;
    function e(e) {
      if (!e) return "";
      return String(e).split(".")[0] || "";
    }
    return (
      (C =
        (function () {
          const t = navigator.userAgent,
            o = t.match(/Chrome\/([\d.]+)/),
            n = o ? e(o[1]) : "",
            i = [
              { regex: /QuarkPC\/([\d.]+)/i, name: "Quark" },
              { regex: /Quark\/([\d.]+)/i, name: "Quark" },
              {
                regex: /QIHU\s*360(?:SE|EE)|360(?:SE|EE)/i,
                name: "360",
                version: () => n,
              },
              { regex: /QihooBrowserHD\/([\d.]+)/i, name: "360" },
              { regex: /QQBrowser\/([\d.]+)/i, name: "QQ" },
              { regex: /MetaSr\s([\d.]+)/i, name: "Sogou" },
              { regex: /SogouMobileBrowser\/([\d.]+)/i, name: "Sogou" },
              { regex: /UCBrowser\/([\d.]+)/i, name: "UC" },
              { regex: /BIDUBrowser\/([\d.]+)/i, name: "Baidu" },
              { regex: /baidubrowser\/([\d.]+)/i, name: "Baidu" },
              { regex: /LBBROWSER/i, name: "Liebao", version: () => n },
              { regex: /Edg\/([\d.]+)/, name: "Edge" },
              { regex: /OPR\/([\d.]+)/, name: "Opera" },
              { regex: /Vivaldi\/([\d.]+)/, name: "Vivaldi" },
              { regex: /Brave\/([\d.]+)/, name: "Brave" },
              {
                regex: /Version\/([\d.]+).*Safari/i,
                name: "Safari",
                exclude: () =>
                  /Chrome|Chromium|Edg|OPR|CriOS|Quark|UCBrowser|QQBrowser|360/i.test(
                    t,
                  ),
              },
              { regex: /Firefox\/([\d.]+)/i, name: "Firefox" },
              { regex: /FxiOS\/([\d.]+)/i, name: "Firefox" },
              { regex: /Chrome\/([\d.]+)/, name: "Chrome" },
            ];
          for (const o of i) {
            if ("function" == typeof o.exclude && o.exclude()) continue;
            const n = t.match(o.regex);
            if (!n) continue;
            let i = "";
            return (
              "function" == typeof o.version
                ? (i = o.version())
                : n[1] && (i = e(n[1])),
              i ? `${o.name} ${i}` : o.name
            );
          }
          return null;
        })() ||
        (function () {
          const t = navigator.userAgentData;
          if (!t || !Array.isArray(t.brands)) return null;
          const o = /^(Chromium|Not\.?A\/Brand|Not\)?A;Brand|Not_A Brand)$/i,
            n = t.brands.find((e) => !o.test(e.brand));
          if (!n) return null;
          const i =
              { "Google Chrome": "Chrome", "Microsoft Edge": "Edge" }[
                n.brand
              ] || n.brand,
            s = e(n.version);
          return s ? `${i} ${s}` : i;
        })() ||
        "Unknown"),
      C
    );
  }
  async function I(e, t = {}) {
    try {
      const o = await chrome.runtime.sendMessage({
        type: "fetchWithJwt",
        url: e,
        options: t,
      });
      if (o.error) throw new Error(o.error);
      return o;
    } catch (e) {
      throw (
        (window.isHttpResponseError = !0),
        (window.httpResponseErrorAct = "fetchWithJwt"),
        e
      );
    }
  }
  function _(e = 1e3) {
    return new Promise((t) => {
      setTimeout(() => {
        t();
      }, e);
    });
  }
  (async () => {
    await (async function () {
      const e = await chrome.storage.local.get(["config"]);
      window.config = e.config;
    })();
  })();
})();
