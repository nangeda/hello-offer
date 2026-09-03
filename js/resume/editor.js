import { resumeToMarkdown } from "./serializer.js";
import { escapeHtml } from "./sanitize.js";
import {
  FIELD_DEFINITIONS,
  MODULE_CONFIG,
  emptyBasicInfo,
  emptyDuration,
  emptyJobIntention,
  emptyResume,
} from "./schema.js";

(function () {
  const STORAGE_CURRENT = "currentResume";
  const STORAGE_MULTI = "multiResumeData";
  const STORAGE_INDEX = "pluginActiveResumeIndex";
  const STORAGE_LOCAL_MD = "localResumeMd";
  const STORAGE_LOCAL_NAME = "localResumeName";

  let state = {
    resumeList: [],
    activeIndex: 0,
    currentView: "edit",
    saveTimer: null,
    activeSection: "basic"
  };

  function nowISO() { return new Date().toISOString(); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj || {})); }
  function getByPath(obj, path) {
    if (!obj || !path) return "";
    return path.split(".").reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);
  }

  function setByPath(obj, path, val) {
    if (!obj || !path) return;
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function listToText(v) {
    if (Array.isArray(v)) return v.join("\n");
    return v == null ? "" : String(v);
  }
  function textToList(v) {
    return String(v || "").split(/\n+/).map(s => s.trim()).filter(Boolean);
  }

  function activeResume() {
    if (!state.resumeList.length) {
      state.resumeList = [{ name: "我的简历", data: emptyResume() }];
      state.activeIndex = 0;
    }
    const item = state.resumeList[state.activeIndex];
    return item && item.data ? item.data : emptyResume();
  }

  function syncDerived(resume) {
    const b = resume.basicInfo || (resume.basicInfo = emptyBasicInfo());
    const j = resume.jobIntention || (resume.jobIntention = emptyJobIntention());

    const curName = (state.resumeList[state.activeIndex] && state.resumeList[state.activeIndex].name) || b.name || "我的简历";
    b.resumeName = curName;

    if (j.position) b.expectedPosition = j.position;
    if (j.industry) b.expectedIndustry = j.industry;
    if (j.city) b.expectedCity = j.city;
    if (j.salary) b.expectedSalary = j.salary;
    if (j.availability) b.availability = j.availability;
    b.employmentType = j.employmentType || b.employmentType;
    b.acceptOvertime = j.acceptOvertime || b.acceptOvertime;
    b.acceptBusinessTrip = j.acceptBusinessTrip || b.acceptBusinessTrip;
    b.cityFlexible = j.cityFlexible || b.cityFlexible;

    if (resume.selfIntroduction && resume.selfIntroduction.selfIntroduction) {
      b.selfEvaluation = resume.selfIntroduction.selfIntroduction;
    }

    function syncTimes(arr) {
      (arr || []).forEach(item => {
        if (!item) return;
        item.duration = item.duration || emptyDuration();
        if (item.startTime) item.duration.startTime = item.startTime;
        if (item.endTime) item.duration.endTime = item.endTime;
      });
    }
    ["education", "workExperience", "internshipExperience", "projectExperience", "campusLeadership", "campusActivities"].forEach(k => {
      syncTimes(resume[k]);
    });

    resume.updatedAt = nowISO();
    return resume;
  }

  function mergeDefaults(data) {
    const base = emptyResume();
    if (!data || typeof data !== "object") return base;
    function mergeObj(target, src) {
      if (!src || typeof src !== "object" || Array.isArray(src)) return target;
      Object.keys(src).forEach(k => {
        if (Array.isArray(target[k])) {
          target[k] = Array.isArray(src[k]) ? src[k] : target[k];
        } else if (target[k] && typeof target[k] === "object" && !Array.isArray(target[k])) {
          target[k] = mergeObj(target[k], src[k]);
        } else if (src[k] !== undefined) {
          target[k] = src[k];
        }
      });
      return target;
    }
    return mergeObj(base, data);
  }

  function toast(msg, type = "info") {
    const box = document.getElementById("toastBox");
    if (!box) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span>${type === "error" ? "❌" : (type === "success" ? "✅" : "ℹ️")}</span><span>${escapeHtml(msg)}</span>`;
    box.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.2s ease";
      setTimeout(() => el.remove(), 200);
    }, 2500);
  }

  function setSaveStatus(status, text) {
    const dot = document.getElementById("saveDot");
    const txt = document.getElementById("saveStatusText");
    if (!dot || !txt) return;
    if (status === "saving") {
      dot.className = "save-dot saving";
      txt.textContent = text || "正在保存...";
    } else {
      dot.className = "save-dot";
      txt.textContent = text || "已自动保存";
    }
  }

  function storageGet(keys) {
    return new Promise(resolve => {
      try {
        if (typeof chrome !== "undefined" && chrome && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(keys, res => resolve(res || {}));
        } else {
          const res = {};
          keys.forEach(k => {
            try {
              const val = localStorage.getItem(k);
              if (val) res[k] = JSON.parse(val);
            } catch (e) {}
          });
          resolve(res);
        }
      } catch (e) {
        resolve({});
      }
    });
  }

  function storageSet(obj) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof chrome !== "undefined" && chrome && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set(obj, () => {
            if (chrome.runtime && chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
            else resolve();
          });
        } else {
          try {
            Object.keys(obj).forEach(k => {
              localStorage.setItem(k, JSON.stringify(obj[k]));
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async function persist() {
    const resume = syncDerived(clone(activeResume()));
    if (state.resumeList[state.activeIndex]) {
      state.resumeList[state.activeIndex].data = resume;
    }

    const multiPayload = {
      resumeList: state.resumeList.map(item => ({ name: item.name, data: item.data })),
      currentResumeIndex: state.activeIndex
    };

    const toSave = {
      [STORAGE_MULTI]: multiPayload,
      [STORAGE_INDEX]: state.activeIndex,
      [STORAGE_CURRENT]: resume,
      [STORAGE_LOCAL_NAME]: state.resumeList[state.activeIndex]?.name || "本地简历",
      [STORAGE_LOCAL_MD]: resumeToMarkdown(
        resume,
        state.resumeList[state.activeIndex]?.name,
        MODULE_CONFIG,
        FIELD_DEFINITIONS
      )
    };

    setSaveStatus("saving");
    try {
      await storageSet(toSave);
      setSaveStatus("saved", "已自动保存 " + new Date().toLocaleTimeString());
      updateHeroBanner();
      updateCompletion();
    } catch (err) {
      setSaveStatus("error", "保存失败: " + err.message);
      toast("保存失败: " + err.message, "error");
    }
  }

  function scheduleSave() {
    setSaveStatus("saving", "保存中...");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => persist(), 400);
  }

  function updateCompletion() {
    const r = activeResume();
    let total = 10;
    let filled = 0;
    if (r.basicInfo && r.basicInfo.name && r.basicInfo.phone && r.basicInfo.email) filled += 2;
    if (r.jobIntention && r.jobIntention.position && r.jobIntention.city) filled += 1;
    if (Array.isArray(r.education) && r.education.length && r.education[0].school) filled += 2;
    if (Array.isArray(r.internshipExperience) && r.internshipExperience.length && r.internshipExperience[0].company) filled += 2;
    if (Array.isArray(r.projectExperience) && r.projectExperience.length && r.projectExperience[0].name) filled += 1.5;
    if (Array.isArray(r.awards) && r.awards.length && r.awards[0].awardName) filled += 0.5;
    if (Array.isArray(r.languageSkills) && r.languageSkills.length) filled += 0.5;
    if (r.selfIntroduction && r.selfIntroduction.selfIntroduction) filled += 0.5;

    const pct = Math.min(100, Math.round((filled / total) * 100));
    const pctEl = document.getElementById("completionPercent");
    const barEl = document.getElementById("completionBar");
    if (pctEl) pctEl.textContent = pct + "%";
    if (barEl) barEl.style.width = pct + "%";

    const tipEl = document.getElementById("completionTip");
    if (tipEl) {
      if (pct >= 90) tipEl.textContent = "🎉 简历非常完整，匹配度极高！";
      else if (pct >= 60) tipEl.textContent = "👍 已达到标准水平，建议补充项目/实习成果";
      else tipEl.textContent = "⚡ 建议优先完善基本信息、教育与实习经验";
    }
  }

  function updateHeroBanner() {
    const r = activeResume();
    const name = (r.basicInfo && r.basicInfo.name) || state.resumeList[state.activeIndex]?.name || "我的简历";
    const nameEl = document.getElementById("heroName");
    if (nameEl) nameEl.textContent = name;
    
    const avatarText = name.length > 2 ? name.slice(-2) : (name[0] || "用");
    const avatarEl = document.getElementById("heroAvatar");
    if (avatarEl) avatarEl.textContent = avatarText;

    const jobPos = (r.jobIntention && r.jobIntention.position) || (r.basicInfo && r.basicInfo.expectedPosition);
    const jobCity = (r.jobIntention && r.jobIntention.city) || (r.basicInfo && r.basicInfo.expectedCity);
    const tagJob = document.getElementById("heroTagJob");
    if (tagJob) {
      if (jobPos || jobCity) {
        tagJob.textContent = `🎯 期望: ${jobPos || "职位未定"} · ${jobCity || "城市未定"}`;
      } else {
        tagJob.textContent = "🎯 求职意向未填";
      }
    }

    const eduSchool = (r.education && r.education[0] && r.education[0].school) || (r.basicInfo && r.basicInfo.graduationSchool);
    const eduLevel = (r.education && r.education[0] && r.education[0].level) || (r.basicInfo && r.basicInfo.highestEducation);
    const tagEdu = document.getElementById("heroTagEdu");
    if (tagEdu) {
      if (eduSchool || eduLevel) {
        tagEdu.textContent = `🎓 ${eduSchool || ""} ${eduLevel || ""}`.trim();
      } else {
        tagEdu.textContent = "🎓 学历未填";
      }
    }

    const status = (r.basicInfo && r.basicInfo.employmentStatus) || "应届生";
    const tagStatus = document.getElementById("heroTagStatus");
    if (tagStatus) tagStatus.textContent = `💼 ${status}`;
  }

  function renderSidebarNav() {
    const nav = document.getElementById("sidebarNav");
    if (!nav) return;
    nav.innerHTML = "";
    const resume = activeResume();

    MODULE_CONFIG.forEach(mod => {
      const btn = document.createElement("button");
      btn.className = `nav-link ${state.activeSection === mod.id ? "active" : ""}`;
      btn.type = "button";

      let count = 0;
      if (mod.type === "list") {
        const list = resume[mod.listKey] || [];
        count = list.length;
      }

      btn.innerHTML = `
        <div class="nav-link-left">
          <span class="nav-icon">${mod.icon}</span>
          <span>${mod.title}</span>
        </div>
        ${mod.type === "list" ? `<span class="nav-badge">${count}</span>` : ""}
      `;

      btn.addEventListener("click", () => {
        state.activeSection = mod.id;
        renderSidebarNav();
        const target = document.getElementById("sec-" + mod.id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      nav.appendChild(btn);
    });
  }

  function renderTabs() {
    const container = document.getElementById("resumeTabs");
    if (!container) return;
    container.innerHTML = "";
    state.resumeList.forEach((item, idx) => {
      const tab = document.createElement("button");
      tab.className = `resume-tab ${idx === state.activeIndex ? "active" : ""}`;
      tab.textContent = item.name || `简历 ${idx + 1}`;
      tab.type = "button";
      tab.addEventListener("click", async () => {
        if (idx === state.activeIndex) return;
        await persist();
        state.activeIndex = idx;
        renderAll();
        persist();
      });
      container.appendChild(tab);
    });
  }

  function createFormField(meta, targetObj) {
    const itemWrap = document.createElement("div");
    let spanClass = "";
    if (meta.span === 2) spanClass = " span-2";
    else if (meta.span === 3) spanClass = " span-3";
    else if (meta.span === 4) spanClass = " span-4";
    itemWrap.className = "form-item" + spanClass;

    const label = document.createElement("label");
    label.className = "form-label";
    label.innerHTML = `${meta.label}${meta.required ? '<span class="required">*</span>' : ""}`;
    itemWrap.appendChild(label);

    let inputEl;
    const currentVal = getByPath(targetObj, meta.path);

    if (meta.type === "select") {
      inputEl = document.createElement("select");
      inputEl.className = "form-select";
      const options = meta.options || [];
      if (!options.includes("")) {
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "（请选择）";
        inputEl.appendChild(blank);
      }
      options.forEach(opt => {
        const op = document.createElement("option");
        op.value = opt;
        op.textContent = opt || "（请选择）";
        if (opt === currentVal) op.selected = true;
        inputEl.appendChild(op);
      });
    } else if (meta.type === "textarea") {
      inputEl = document.createElement("textarea");
      inputEl.className = "form-textarea";
      inputEl.placeholder = meta.placeholder || `请输入${meta.label}`;
      inputEl.value = currentVal || "";
    } else if (meta.type === "list") {
      inputEl = document.createElement("textarea");
      inputEl.className = "form-textarea";
      inputEl.placeholder = meta.placeholder || `每行一条${meta.label}`;
      inputEl.value = listToText(currentVal);
    } else {
      inputEl = document.createElement("input");
      inputEl.className = "form-input";
      inputEl.type = meta.type || "text";
      inputEl.placeholder = meta.placeholder || `请输入${meta.label}`;
      inputEl.value = currentVal == null ? "" : currentVal;
    }

    const handleChange = () => {
      let val = inputEl.value;
      if (meta.type === "list") val = textToList(val);
      else if (meta.type === "number") val = val === "" ? 0 : Number(val);
      setByPath(targetObj, meta.path, val);
      scheduleSave();
    };

    inputEl.addEventListener("input", handleChange);
    inputEl.addEventListener("change", handleChange);

    itemWrap.appendChild(inputEl);
    return itemWrap;
  }

  function renderObjectSection(box, mod, resume) {
    const body = document.createElement("div");
    body.className = "module-body";
    const grid = document.createElement("div");
    grid.className = "form-grid";

    (FIELD_DEFINITIONS[mod.id] || []).forEach(meta => {
      grid.appendChild(createFormField(meta, resume));
    });

    body.appendChild(grid);
    box.appendChild(body);
  }

  function renderListSection(box, mod, resume) {
    const body = document.createElement("div");
    body.className = "module-body";

    if (!Array.isArray(resume[mod.listKey])) resume[mod.listKey] = [];
    const list = resume[mod.listKey];

    const listWrap = document.createElement("div");
    listWrap.className = "exp-list";

    list.forEach((item, idx) => {
      const itemCard = document.createElement("div");
      itemCard.className = "exp-item";

      const head = document.createElement("div");
      head.className = "exp-header";

      const titleRow = document.createElement("div");
      titleRow.className = "exp-title-row";
      
      let displayTitle = item.school || item.company || item.name || item.awardName || item.language || item.title || item.certificateName || item.activityName || `${mod.itemTitle} ${idx + 1}`;
      let subTitle = item.major || item.position || item.role || item.level || "";
      let timeRange = item.startTime && item.endTime ? ` (${item.startTime} ~ ${item.endTime})` : "";

      titleRow.innerHTML = `
        <div class="exp-num-badge">${idx + 1}</div>
        <div>
          <span class="exp-main-title">${escapeHtml(displayTitle)}</span>
          ${subTitle ? `<span style="font-size:13px;color:var(--text-secondary);margin-left:8px;">${escapeHtml(subTitle)}</span>` : ""}
          ${timeRange ? `<span style="font-size:12px;color:var(--text-muted);margin-left:6px;">${escapeHtml(timeRange)}</span>` : ""}
        </div>
      `;

      const actions = document.createElement("div");
      actions.className = "exp-item-actions";

      if (idx > 0) {
        const upBtn = document.createElement("button");
        upBtn.className = "btn btn-action-sm";
        upBtn.textContent = "↑ 上移";
        upBtn.type = "button";
        upBtn.addEventListener("click", () => {
          const temp = list[idx - 1];
          list[idx - 1] = list[idx];
          list[idx] = temp;
          renderAll();
          scheduleSave();
        });
        actions.appendChild(upBtn);
      }

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-action-sm btn-danger-outline";
      delBtn.textContent = "删除";
      delBtn.type = "button";
      delBtn.addEventListener("click", () => {
        list.splice(idx, 1);
        renderAll();
        scheduleSave();
      });
      actions.appendChild(delBtn);

      head.appendChild(titleRow);
      head.appendChild(actions);
      itemCard.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "form-grid";
      (FIELD_DEFINITIONS[mod.id] || []).forEach(meta => {
        grid.appendChild(createFormField(meta, item));
      });
      itemCard.appendChild(grid);

      listWrap.appendChild(itemCard);
    });

    body.appendChild(listWrap);

    const addBtn = document.createElement("button");
    addBtn.className = "add-exp-btn";
    addBtn.type = "button";
    addBtn.innerHTML = `<span>+</span><span>添加一条新的${mod.itemTitle}经历</span>`;
    addBtn.addEventListener("click", () => {
      list.push(mod.factory ? mod.factory() : {});
      renderAll();
      scheduleSave();
    });
    body.appendChild(addBtn);

    box.appendChild(body);
  }

  function renderSections() {
    const container = document.getElementById("sectionsContainer");
    if (!container) return;
    container.innerHTML = "";
    const resume = activeResume();

    MODULE_CONFIG.forEach(mod => {
      const card = document.createElement("section");
      card.className = "module-card";
      card.id = "sec-" + mod.id;

      const header = document.createElement("div");
      header.className = "module-header";
      header.innerHTML = `
        <div class="module-title-group">
          <div class="module-icon-box">${mod.icon}</div>
          <div class="module-title-text">
            <h3>${mod.title}</h3>
            <p>${mod.desc}</p>
          </div>
        </div>
      `;

      card.appendChild(header);

      if (mod.type === "list") {
        renderListSection(card, mod, resume);
      } else {
        renderObjectSection(card, mod, resume);
      }

      container.appendChild(card);
    });
  }

  function renderPreview() {
    const r = activeResume();
    const paper = document.getElementById("previewPaper");
    if (!paper) return;
    const b = r.basicInfo || {};

    let html = `
      <div class="preview-header">
        <div>
          <div class="preview-name">${escapeHtml(b.name || "姓名未填写")}</div>
          <div class="preview-contact">
            ${b.phone ? `<span>📱 ${escapeHtml(b.phone)}</span>` : ""}
            ${b.email ? `<span>✉️ ${escapeHtml(b.email)}</span>` : ""}
            ${b.currentAddress ? `<span>📍 ${escapeHtml(b.currentAddress)}</span>` : ""}
            ${b.gender ? `<span>🚻 ${escapeHtml(b.gender)}</span>` : ""}
            ${b.age ? `<span>🎂 ${escapeHtml(b.age)}岁</span>` : ""}
            ${b.politicalStatus ? `<span>🏛️ ${escapeHtml(b.politicalStatus)}</span>` : ""}
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; color: var(--primary); font-size: 15px;">求职意向：${escapeHtml((r.jobIntention && r.jobIntention.position) || b.expectedPosition || "未填写")}</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">期望城市：${escapeHtml((r.jobIntention && r.jobIntention.city) || b.expectedCity || "未填写")} · ${escapeHtml(b.employmentType || "未填写")}</div>
        </div>
      </div>
    `;

    if (Array.isArray(r.education) && r.education.length) {
      html += `<div class="preview-section"><div class="preview-sec-title">🎓 教育背景</div>`;
      r.education.forEach(e => {
        if (!e.school) return;
        html += `
          <div class="preview-item">
            <div class="preview-item-head">
              <span><strong>${escapeHtml(e.school)}</strong> · ${escapeHtml(e.major || "")} (${escapeHtml(e.level || "")} / ${escapeHtml(e.degree || "")})</span>
              <span>${escapeHtml(e.startTime || "")} ~ ${escapeHtml(e.endTime || "")}</span>
            </div>
            ${e.gpa || e.ranking ? `<div class="preview-item-sub">GPA: ${escapeHtml(e.gpa || "-")} | 排名: ${escapeHtml(e.ranking || "-")}</div>` : ""}
            ${e.majorCourses ? `<div class="preview-item-desc"><strong>主修课程:</strong> ${escapeHtml(e.majorCourses)}</div>` : ""}
            ${e.honors ? `<div class="preview-item-desc"><strong>学术荣誉:</strong> ${escapeHtml(e.honors)}</div>` : ""}
          </div>
        `;
      });
      html += `</div>`;
    }

    if (Array.isArray(r.internshipExperience) && r.internshipExperience.length) {
      html += `<div class="preview-section"><div class="preview-sec-title">💼 实习经历</div>`;
      r.internshipExperience.forEach(exp => {
        if (!exp.company) return;
        html += `
          <div class="preview-item">
            <div class="preview-item-head">
              <span><strong>${escapeHtml(exp.company)}</strong> · ${escapeHtml(exp.position || "")} ${exp.department ? `(${escapeHtml(exp.department)})` : ""}</span>
              <span>${escapeHtml(exp.startTime || "")} ~ ${escapeHtml(exp.endTime || "")}</span>
            </div>
            ${exp.techStack ? `<div class="preview-item-sub"><strong>技术栈:</strong> ${escapeHtml(exp.techStack)}</div>` : ""}
            ${exp.detailedContent ? `<div class="preview-item-desc">${escapeHtml(exp.detailedContent)}</div>` : ""}
            ${Array.isArray(exp.responsibilities) && exp.responsibilities.length ? `<div class="preview-item-desc">${exp.responsibilities.map(item => `• ${escapeHtml(item)}`).join("<br>")}</div>` : ""}
          </div>
        `;
      });
      html += `</div>`;
    }

    if (Array.isArray(r.projectExperience) && r.projectExperience.length) {
      html += `<div class="preview-section"><div class="preview-sec-title">🚀 项目经历</div>`;
      r.projectExperience.forEach(p => {
        if (!p.name) return;
        html += `
          <div class="preview-item">
            <div class="preview-item-head">
              <span><strong>${escapeHtml(p.name)}</strong> · ${escapeHtml(p.role || "")}</span>
              <span>${escapeHtml(p.startTime || "")} ~ ${escapeHtml(p.endTime || "")}</span>
            </div>
            ${p.techStack ? `<div class="preview-item-sub"><strong>技术栈:</strong> ${escapeHtml(p.techStack)}</div>` : ""}
            ${p.background ? `<div class="preview-item-desc"><strong>项目背景:</strong> ${escapeHtml(p.background)}</div>` : ""}
            ${Array.isArray(p.contributions) && p.contributions.length ? `<div class="preview-item-desc">${p.contributions.map(item => `• ${escapeHtml(item)}`).join("<br>")}</div>` : ""}
            ${p.result ? `<div class="preview-item-desc"><strong>项目成果:</strong> ${escapeHtml(p.result)}</div>` : ""}
          </div>
        `;
      });
      html += `</div>`;
    }

    if (Array.isArray(r.awards) && r.awards.length) {
      html += `<div class="preview-section"><div class="preview-sec-title">🏆 荣誉奖项</div>`;
      r.awards.forEach(a => {
        if (!a.awardName) return;
        html += `<div class="preview-item-desc">• <strong>${escapeHtml(a.awardName)}</strong> (${escapeHtml(a.awardTime || "")}) - ${escapeHtml(a.awardLevel || "")} ${escapeHtml(a.awardGrade || "")} ${escapeHtml(a.awardDescription || "")}</div>`;
      });
      html += `</div>`;
    }

    if (r.selfIntroduction && r.selfIntroduction.selfIntroduction) {
      html += `<div class="preview-section"><div class="preview-sec-title">✍️ 自我评价</div><div class="preview-item-desc">${escapeHtml(r.selfIntroduction.selfIntroduction)}</div></div>`;
    }

    paper.innerHTML = html;
  }

  function renderAll() {
    renderTabs();
    renderSidebarNav();
    updateHeroBanner();
    updateCompletion();
    renderSections();
    renderPreview();
  }

  function bindHeaderEvents() {
    // Add resume
    const addBtn = document.getElementById("addResumeBtn");
    if (addBtn) {
      addBtn.onclick = async () => {
        await persist();
        const name = prompt("请输入新简历名称", `简历 ${state.resumeList.length + 1}`);
        if (!name) return;
        state.resumeList.push({ name, data: emptyResume() });
        state.activeIndex = state.resumeList.length - 1;
        renderAll();
        persist();
        toast("已创建新简历: " + name, "success");
      };
    }

    // Rename
    const renameBtn = document.getElementById("renameResumeBtn");
    if (renameBtn) {
      renameBtn.onclick = () => {
        const cur = state.resumeList[state.activeIndex];
        if (!cur) return;
        const name = prompt("修改简历名称", cur.name || "");
        if (!name) return;
        cur.name = name;
        renderTabs();
        updateHeroBanner();
        scheduleSave();
        toast("已重命名为: " + name, "success");
      };
    }

    // Delete
    const delBtn = document.getElementById("deleteResumeBtn");
    if (delBtn) {
      delBtn.onclick = () => {
        if (state.resumeList.length <= 1) {
          toast("至少需要保留一份简历！", "error");
          return;
        }
        if (!confirm("确定删除当前这份简历吗？此操作无法撤销。")) return;
        state.resumeList.splice(state.activeIndex, 1);
        state.activeIndex = Math.min(state.activeIndex, state.resumeList.length - 1);
        renderAll();
        persist();
        toast("已删除简历", "success");
      };
    }

    // Manual Save
    const saveBtn = document.getElementById("saveManualBtn");
    if (saveBtn) {
      saveBtn.onclick = () => {
        persist();
        toast("简历数据已保存至插件本地存储！", "success");
      };
    }


    // Export JSON
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.onclick = () => {
        const payload = {
          resumeList: state.resumeList,
          currentResumeIndex: state.activeIndex,
          exportedAt: nowISO()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${state.resumeList[state.activeIndex]?.name || "my-resume"}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast("已导出 JSON 备份文件", "success");
      };
    }

    // Import JSON
    const importBtn = document.getElementById("importBtn");
    const fileInput = document.getElementById("importFileInput");
    if (importBtn && fileInput) {
      importBtn.onclick = () => fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || "{}"));
            if (Array.isArray(parsed.resumeList) && parsed.resumeList.length) {
              state.resumeList = parsed.resumeList.map((item, i) => ({
                name: item.name || `简历 ${i + 1}`,
                data: mergeDefaults(item.data)
              }));
              state.activeIndex = Math.min(parsed.currentResumeIndex || 0, state.resumeList.length - 1);
            } else {
              state.resumeList[state.activeIndex].data = mergeDefaults(parsed.data || parsed);
            }
            renderAll();
            persist();
            toast("简历导入成功！", "success");
          } catch (err) {
            toast("导入失败: " + err.message, "error");
          }
        };
        reader.readAsText(file);
      };
    }

    // View Switcher
    const editTab = document.getElementById("viewEditTab");
    const prevTab = document.getElementById("viewPreviewTab");
    if (editTab && prevTab) {
      editTab.onclick = () => {
        state.currentView = "edit";
        editTab.className = "view-tab-btn active";
        prevTab.className = "view-tab-btn";
        document.getElementById("editorView").style.display = "flex";
        document.getElementById("previewView").style.display = "none";
      };
      prevTab.onclick = () => {
        state.currentView = "preview";
        prevTab.className = "view-tab-btn active";
        editTab.className = "view-tab-btn";
        document.getElementById("editorView").style.display = "none";
        document.getElementById("previewView").style.display = "block";
        renderPreview();
      };
    }

    // Expand / Collapse all
    const expAll = document.getElementById("expandAllBtn");
    const colAll = document.getElementById("collapseAllBtn");
    if (expAll) {
      expAll.onclick = () => {
        document.querySelectorAll(".module-card").forEach(c => {
          const body = c.querySelector(".module-body");
          if (body) body.style.display = "block";
        });
      };
    }
    if (colAll) {
      colAll.onclick = () => {
        document.querySelectorAll(".module-card").forEach(c => {
          const body = c.querySelector(".module-body");
          if (body) body.style.display = "none";
        });
      };
    }
  }

  async function init() {
    bindHeaderEvents();
    try {
      const res = await storageGet([STORAGE_MULTI, STORAGE_INDEX, STORAGE_CURRENT]);
      const multi = res[STORAGE_MULTI];
      let list = multi && Array.isArray(multi.resumeList) ? multi.resumeList : [];
      if (!list.length) {
        const current = res[STORAGE_CURRENT];
        list = [{
          name: (current && current.basicInfo && current.basicInfo.name) ? current.basicInfo.name + "的简历" : "我的简历",
          data: mergeDefaults(current)
        }];
      } else {
        list = list.map((item, i) => ({
          name: item.name || `简历 ${i + 1}`,
          data: mergeDefaults(item.data)
        }));
      }

      let idx = res[STORAGE_INDEX];
      if (typeof idx !== "number" || idx < 0 || idx >= list.length) {
        idx = (multi && typeof multi.currentResumeIndex === "number") ? multi.currentResumeIndex : 0;
      }

      state.resumeList = list;
      state.activeIndex = Math.min(Math.max(0, idx || 0), list.length - 1);
      renderAll();
    } catch (e) {
      state.resumeList = [{ name: "我的简历", data: emptyResume() }];
      state.activeIndex = 0;
      renderAll();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
