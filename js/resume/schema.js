const YES_NO = ["是", "否"];
function nowISO() { return new Date().toISOString(); }

function emptyDuration() { return { startTime: "", endTime: "" }; }

function emptyBasicInfo() {
  return {
    name: "", surname: "", givenName: "", surnamePin: "", givenNamePin: "",
    idType: "", idNumber: "", idPhoto: "", lifePhoto: "",
    gender: "", birthDate: "", age: 0, height: 0, weight: 0,
    country: "", ethnicity: "", birthOrigin: "", birthOriginDistrict: "",
    birthPlace: "", nativePlace: "", province: "", currentAddress: "",
    currentAddressDistrict: "", detailedAddress: "",
    maritalStatus: "", politicalStatus: "", religiousBelief: "", healthStatus: "",
    phone: "", wechat: "", qq: "", email: "", homepage: "", personalWebsite: "",
    currentIdentity: "", jobStatus: "", employmentStatus: "",
    highestEducation: "", highestDegree: "", highestMajor: "",
    undergraduateSchool: "", undergraduateMajor: "",
    graduationSchool: "", graduationDate: "",
    expectedPosition: "", expectedIndustry: "", expectedCity: "", expectedSalary: "",
    availability: "", employmentType: "", acceptOvertime: "",
    acceptBusinessTrip: "", cityFlexible: "", adjustable: "",
    acceptJobTransfer: "", isReferred: "", recruitmentChannel: "",
    workExperience: "", emergencyContact: "", emergencyPhone: "",
    hobbies: [], driverLicense: "", selfEvaluation: "",
    languageLevel: "", languageScore: "",
    educationAwards: { competitionExperience: "", rewardsAndHonors: "" }
  };
}

function emptyJobIntention() {
  return {
    position: "", industry: "", city: "", salary: "", availability: "",
    currentSalary: "", acceptOvertime: "", acceptBusinessTrip: "",
    employmentType: "", cityFlexible: "", obeyAssignment: ""
  };
}

function emptyEducation() {
  return {
    school: "", currentAddress: "", department: "",
    level: "", educationType: "", degree: "",
    major: "", majorCategory: "", startTime: "", endTime: "",
    duration: emptyDuration(), gpa: 0, ranking: "", scholarships: [],
    competitions: [], researchProjects: [], campusExperience: "",
    certificates: [], honors: "", majorCourses: "", majorDescription: ""
  };
}

function emptyWork() {
  return {
    company: "", position: "", department: "", industryCategory: "",
    workLocation: "", employmentType: "", startTime: "", endTime: "",
    duration: emptyDuration(), responsibilities: [], achievements: [],
    detailedContent: ""
  };
}

function emptyIntern() {
  return {
    company: "", position: "", department: "", employmentType: "",
    startTime: "", endTime: "", duration: emptyDuration(),
    responsibilities: [], achievements: [], detailedContent: "",
    contribution: "", result: "", techStack: ""
  };
}

function emptyProject() {
  return {
    name: "", role: "", startTime: "", endTime: "", duration: emptyDuration(),
    background: "", contributions: [], result: "", techStack: "",
    details: "", link: "", responsibilities: "", achievements: ""
  };
}

function emptyPublication() {
  return {
    title: "", journal: "", publishTime: "", publishYear: 0, journalLevel: "",
    description: "", authorRole: "", impactFactor: "", link: ""
  };
}

function emptyPatent() {
  return {
    name: "", number: "", publishTime: "", year: 0, type: "", result: ""
  };
}

function emptyAward() {
  return {
    awardCategory: "", awardName: "", awardTime: "", awardLevel: "",
    awardGrade: "", awardDescription: ""
  };
}

function emptyLanguage() {
  return {
    language: "", level: "", proficiency: "", listeningSpeaking: "",
    readingWriting: "", score: ""
  };
}

function emptyCertificate() {
  return {
    certificateName: "", obtainedTime: "", description: "",
    languageCert: "", computerCert: "", professionalCert: "", driverLicense: ""
  };
}

function emptyFamily() {
  return {
    name: "", relationship: "", employer: "", phone: "", position: "",
    birthDate: "", age: "", homeAddress: "", politicalStatus: "", employerAndPosition: ""
  };
}

function emptyCampusLead() {
  return {
    title: "", level: "", projectName: "", startTime: "", endTime: "",
    description: "", duration: emptyDuration()
  };
}

function emptyCampusAct() {
  return {
    activityName: "", role: "", practiceType: "", startTime: "", endTime: "",
    contentDescription: "", duration: emptyDuration()
  };
}

function emptyResume() {
  return {
    createdAt: nowISO(),
    updatedAt: nowISO(),
    basicInfo: emptyBasicInfo(),
    jobIntention: emptyJobIntention(),
    education: [emptyEducation()],
    workExperience: [],
    internshipExperience: [emptyIntern()],
    projectExperience: [emptyProject()],
    publications: [],
    patents: [],
    awards: [emptyAward()],
    languageSkills: [emptyLanguage()],
    otherLanguageSkills: [],
    certificates: [],
    familyMembers: [],
    campusLeadership: [],
    campusActivities: [],
    customFields: {},
    selfIntroduction: { selfIntroduction: "", adjustable: "" }
  };
}


const MODULE_CONFIG = [
  { id: "basic", title: "基本信息", icon: "👤", desc: "个人身份、联系方式、户籍地址等基础资料", type: "object" },
  { id: "intention", title: "求职意向", icon: "🎯", desc: "期望岗位、城市、薪酬与工作性质", type: "object" },
  { id: "education", title: "教育背景", icon: "🎓", desc: "建议从最高学历开始添加大学及以上经历", type: "list", listKey: "education", itemTitle: "学历", factory: emptyEducation },
  { id: "intern", title: "实习经历", icon: "💼", desc: "校外实习及兼职实践经验（网申核心重点）", type: "list", listKey: "internshipExperience", itemTitle: "实习", factory: emptyIntern },
  { id: "work", title: "工作经历", icon: "🏢", desc: "全职工作经验（应届生无全职可留空）", type: "list", listKey: "workExperience", itemTitle: "工作", factory: emptyWork },
  { id: "project", title: "项目经历", icon: "🚀", desc: "科研课题、工程实战、开源作品等", type: "list", listKey: "projectExperience", itemTitle: "项目", factory: emptyProject },
  { id: "awards", title: "荣誉奖项", icon: "🏆", desc: "国家级/省级/校级学科竞赛与奖学金荣誉", type: "list", listKey: "awards", itemTitle: "奖项", factory: emptyAward },
  { id: "language", title: "语言能力", icon: "🌐", desc: "英语四六级、托福雅思及多语种掌握情况", type: "list", listKey: "languageSkills", itemTitle: "语种", factory: emptyLanguage },
  { id: "cert", title: "技能证书", icon: "📜", desc: "专业资格认证、计算机等级及驾驶证等", type: "list", listKey: "certificates", itemTitle: "证书", factory: emptyCertificate },
  { id: "paper", title: "论文成果", icon: "📑", desc: "已发表或录用的期刊会议学术论文", type: "list", listKey: "publications", itemTitle: "论文", factory: emptyPublication },
  { id: "patent", title: "专利成果", icon: "💡", desc: "已申请或获得授权的发明/实用新型专利", type: "list", listKey: "patents", itemTitle: "专利", factory: emptyPatent },
  { id: "lead", title: "在校职务", icon: "👔", desc: "学生会、社团或班级干部任职经历", type: "list", listKey: "campusLeadership", itemTitle: "职务", factory: emptyCampusLead },
  { id: "campus", title: "校园活动", icon: "🎪", desc: "志愿服务、社会实践、文艺体育等校园活动", type: "list", listKey: "campusActivities", itemTitle: "活动", factory: emptyCampusAct },
  { id: "family", title: "家庭成员", icon: "👨‍👩‍👧", desc: "直系亲属及主要社会关系（部分国企/大厂要求）", type: "list", listKey: "familyMembers", itemTitle: "成员", factory: emptyFamily },
  { id: "self", title: "自我评价", icon: "✍️", desc: "个人优势总结、综合素质与调剂意向", type: "object" }
];

function field(label, path, type = "text", extra = {}) {
  return { label, path, type, ...extra };
}

const FIELD_DEFINITIONS = {
  basic: [
    field("姓名", "basicInfo.name", "text", { required: true }),
    field("姓氏", "basicInfo.surname"),
    field("名", "basicInfo.givenName"),
    field("姓氏拼音", "basicInfo.surnamePin"),
    field("名字拼音", "basicInfo.givenNamePin"),
    field("性别", "basicInfo.gender", "select", { options: ["男", "女"] }),
    field("出生日期", "basicInfo.birthDate", "date"),
    field("年龄", "basicInfo.age", "number"),
    field("证件类型", "basicInfo.idType", "select", { options: ["身份证", "护照", "港澳居民来往内地通行证", "台湾居民来往大陆通行证", "其他"] }),
    field("证件号码", "basicInfo.idNumber"),
    field("民族", "basicInfo.ethnicity"),
    field("国籍/地区", "basicInfo.country"),
    field("政治面貌", "basicInfo.politicalStatus", "select", { options: ["", "中共党员", "中共预备党员", "共青团员", "群众", "民主党派", "无党派人士"] }),
    field("婚姻状况", "basicInfo.maritalStatus", "select", { options: ["未婚", "已婚", "离异", "保密"] }),
    field("健康状况", "basicInfo.healthStatus"),
    field("身高 (cm)", "basicInfo.height", "number"),
    field("体重 (kg)", "basicInfo.weight", "number"),
    field("手机号码", "basicInfo.phone", "text", { required: true }),
    field("电子邮箱", "basicInfo.email", "email", { required: true }),
    field("微信号", "basicInfo.wechat"),
    field("QQ号", "basicInfo.qq"),
    field("个人主页/GitHub", "basicInfo.personalWebsite", "text", { span: 2 }),
    field("籍贯 / 出生地", "basicInfo.birthOrigin"),
    field("出生地区县", "basicInfo.birthOriginDistrict"),
    field("户籍省份", "basicInfo.province"),
    field("户籍所在地", "basicInfo.nativePlace"),
    field("现居城市", "basicInfo.currentAddress"),
    field("现居区县", "basicInfo.currentAddressDistrict"),
    field("现居住详细地址", "basicInfo.detailedAddress", "text", { span: 3 }),
    field("当前身份", "basicInfo.employmentStatus", "select", { options: ["应届生", "在校生", "在职", "离职"] }),
    field("求职状态", "basicInfo.jobStatus"),
    field("最高学历", "basicInfo.highestEducation", "select", { options: ["", "博士", "硕士", "本科", "大专", "高中"] }),
    field("最高学位", "basicInfo.highestDegree", "select", { options: ["", "博士", "硕士", "学士", "无"] }),
    field("最高学历毕业院校", "basicInfo.graduationSchool"),
    field("最高学历专业", "basicInfo.highestMajor"),
    field("预计毕业时间", "basicInfo.graduationDate", "month"),
    field("本科毕业院校", "basicInfo.undergraduateSchool"),
    field("本科专业", "basicInfo.undergraduateMajor"),
    field("紧急联系人姓名", "basicInfo.emergencyContact"),
    field("紧急联系人电话", "basicInfo.emergencyPhone"),
    field("驾驶证类型", "basicInfo.driverLicense"),
    field("招聘获知渠道", "basicInfo.recruitmentChannel"),
    field("是否接受调剂", "basicInfo.acceptJobTransfer", "select", { options: YES_NO }),
    field("是否有熟人内推", "basicInfo.isReferred", "select", { options: YES_NO })
  ],
  intention: [
    field("期望职位", "jobIntention.position", "text", { required: true }),
    field("期望行业", "jobIntention.industry"),
    field("期望工作城市", "jobIntention.city", "text", { required: true }),
    field("期望薪资", "jobIntention.salary"),
    field("可到岗时间", "jobIntention.availability"),
    field("工作性质", "jobIntention.employmentType", "select", { options: ["全职", "实习", "兼职"] }),
    field("是否接受加班", "jobIntention.acceptOvertime", "select", { options: YES_NO }),
    field("是否接受出差", "jobIntention.acceptBusinessTrip", "select", { options: YES_NO }),
    field("是否服从城市调剂", "jobIntention.cityFlexible", "select", { options: YES_NO }),
    field("是否服从岗位调配", "jobIntention.obeyAssignment", "select", { options: YES_NO })
  ],
  education: [
    field("学校名称", "school", "text", { required: true }),
    field("学历层次", "level", "select", { options: ["博士", "硕士", "本科", "大专", "高中"] }),
    field("学位", "degree", "select", { options: ["博士", "硕士", "学士", "无"] }),
    field("就读专业", "major", "text", { required: true }),
    field("专业大类", "majorCategory"),
    field("院系名称", "department"),
    field("培养类型", "educationType", "select", { options: ["全日制", "非全日制", "海外留学", "自考/成教"] }),
    field("入学时间", "startTime", "month", { required: true }),
    field("毕业时间", "endTime", "month", { required: true }),
    field("平均绩点 (GPA)", "gpa"),
    field("专业排名", "ranking"),
    field("学校所在城市", "currentAddress"),
    field("主修核心课程", "majorCourses", "textarea", { span: 3 }),
    field("专业研究方向 / 经历描述", "majorDescription", "textarea", { span: 3 }),
    field("获得奖学金情况", "scholarships", "list", { span: 3, placeholder: "每行一条奖学金记录" }),
    field("所获奖项及荣誉", "honors", "textarea", { span: 3 })
  ],
  intern: [
    field("公司 / 组织名称", "company", "text", { required: true }),
    field("实习岗位", "position", "text", { required: true }),
    field("所在部门", "department"),
    field("实习性质", "employmentType", "select", { options: ["实习", "全职", "兼职"] }),
    field("开始时间", "startTime", "month", { required: true }),
    field("结束时间", "endTime", "month", { required: true }),
    field("核心技术栈 / 工具", "techStack", "text", { span: 2 }),
    field("工作量化成果", "result"),
    field("实习工作内容详细描述", "detailedContent", "textarea", { span: 3 }),
    field("核心职责清单", "responsibilities", "list", { span: 3, placeholder: "每行一条职责描述" }),
    field("个人主要贡献", "contribution", "textarea", { span: 3 })
  ],
  work: [
    field("公司名称", "company", "text", { required: true }),
    field("担任职位", "position", "text", { required: true }),
    field("所属部门", "department"),
    field("所属行业", "industryCategory"),
    field("工作地点", "workLocation"),
    field("工作性质", "employmentType", "select", { options: ["全职", "兼职"] }),
    field("入职时间", "startTime", "month", { required: true }),
    field("离职时间", "endTime", "month", { required: true }),
    field("工作详细内容", "detailedContent", "textarea", { span: 3 }),
    field("主要职责", "responsibilities", "list", { span: 3, placeholder: "每行一条职责" }),
    field("工作主要业绩与产出", "achievements", "list", { span: 3, placeholder: "每行一条业绩" })
  ],
  project: [
    field("项目名称", "name", "text", { required: true }),
    field("担任角色", "role", "text", { required: true }),
    field("开始时间", "startTime", "month", { required: true }),
    field("结束时间", "endTime", "month", { required: true }),
    field("主要技术栈", "techStack", "text", { span: 2 }),
    field("项目链接 / Demo", "link"),
    field("项目背景与目标", "background", "textarea", { span: 3 }),
    field("项目核心架构与实现细节", "details", "textarea", { span: 3 }),
    field("个人核心贡献清单", "contributions", "list", { span: 3, placeholder: "每行一条贡献说明" }),
    field("量化成果与价值", "result", "textarea", { span: 3 })
  ],
  awards: [
    field("奖项类别", "awardCategory", "select", { options: ["竞赛获奖", "奖学金", "荣誉称号", "其他"] }),
    field("奖项名称", "awardName", "text", { required: true }),
    field("获奖时间", "awardTime", "month"),
    field("获奖级别", "awardLevel", "select", { options: ["国际级", "国家级", "省级", "市级", "校级", "院级"] }),
    field("奖项等级", "awardGrade", "text", { placeholder: "如: 一等奖 / 金奖 / 特等" }),
    field("奖项说明 / 评选背景", "awardDescription", "textarea", { span: 3 })
  ],
  language: [
    field("掌握语种", "language", "text", { required: true }),
    field("证书/等级", "level", "text", { placeholder: "如: CET-6 / 托福 / 雅思" }),
    field("熟练程度", "proficiency", "select", { options: ["精通", "熟练", "良好", "一般", "入门"] }),
    field("听说水平", "listeningSpeaking"),
    field("读写水平", "readingWriting"),
    field("考试分数", "score")
  ],
  cert: [
    field("证书名称", "certificateName", "text", { required: true }),
    field("颁发时间", "obtainedTime", "month"),
    field("证书类别", "professionalCert", "text", { placeholder: "如: 软考高级 / 教师资格证" }),
    field("计算机技能认证", "computerCert"),
    field("驾驶证", "driverLicense"),
    field("证书详细说明", "description", "textarea", { span: 3 })
  ],
  paper: [
    field("论文标题", "title", "text", { required: true, span: 2 }),
    field("发表期刊 / 会议", "journal", "text", { required: true }),
    field("发表年月", "publishTime", "month"),
    field("发表年份", "publishYear", "number"),
    field("刊物级别", "journalLevel", "text", { placeholder: "如: SCI 1区 / CCF-A" }),
    field("作者位次", "authorRole", "text", { placeholder: "如: 第一作者 / 通讯作者" }),
    field("影响因子 (IF)", "impactFactor"),
    field("DOI / 论文链接", "link"),
    field("论文摘要与核心贡献", "description", "textarea", { span: 3 })
  ],
  patent: [
    field("专利名称", "name", "text", { required: true, span: 2 }),
    field("申请 / 授权号", "number", "text", { required: true }),
    field("专利类型", "type", "select", { options: ["发明专利", "实用新型专利", "外观设计专利", "软件著作权"] }),
    field("公开/授权时间", "publishTime", "month"),
    field("专利当前状态", "result", "text", { placeholder: "如: 已授权 / 实质审查中" })
  ],
  lead: [
    field("职务名称", "title", "text", { required: true }),
    field("所属组织 / 级别", "projectName", "text", { placeholder: "如: 校学生会 / 院团委" }),
    field("任职级别", "level", "select", { options: ["校级", "院级", "班级", "其他"] }),
    field("任职开始", "startTime", "month"),
    field("任职结束", "endTime", "month"),
    field("主要工作职责与成就", "description", "textarea", { span: 3 })
  ],
  campus: [
    field("活动名称", "activityName", "text", { required: true }),
    field("担任角色", "role", "text", { placeholder: "如: 组织者 / 志愿者" }),
    field("实践类型", "practiceType", "select", { options: ["志愿服务", "社会实践", "文体竞赛", "学术科技", "其他"] }),
    field("开始时间", "startTime", "month"),
    field("结束时间", "endTime", "month"),
    field("活动内容与总结", "contentDescription", "textarea", { span: 3 })
  ],
  family: [
    field("姓名", "name", "text", { required: true }),
    field("与本人关系", "relationship", "select", { options: ["父亲", "母亲", "配偶", "兄弟", "姐妹", "其他"] }),
    field("工作单位", "employer"),
    field("担任职务", "position"),
    field("联系电话", "phone"),
    field("出生日期", "birthDate", "date"),
    field("政治面貌", "politicalStatus"),
    field("家庭常住城市", "homeAddress", "text", { span: 2 })
  ],
  self: [
    field("自我评价 / 个人优势", "selfIntroduction.selfIntroduction", "textarea", { span: 3 }),
    field("是否服从调剂安排", "selfIntroduction.adjustable", "select", { options: YES_NO })
  ]
};

export {
  FIELD_DEFINITIONS,
  MODULE_CONFIG,
  emptyBasicInfo,
  emptyDuration,
  emptyJobIntention,
  emptyResume,
};

