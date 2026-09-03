<p align="center">
  <img src="image/icon128.png" width="96" height="96" alt="Hello Offer logo">
</p>

<h1 align="center">Hello Offer</h1>

<p align="center">本地优先、人工确认的 Chrome 智能简历填充扩展</p>

## 项目简介

Hello Offer 用一份结构化本地简历辅助填写不同招聘网站的在线表单。扩展先扫描当前页面中的可见字段，再通过用户配置的 OpenAI 兼容模型完成字段理解与简历值映射，最后在浏览器中执行填写并保留结果供用户核对。

项目采用 Chrome Manifest V3，不提供自动投递或自动提交功能。招聘网站的组件实现差异很大，因此所有填写结果都应在提交前由用户检查。

## 主要功能

- 本地管理多份结构化简历，并选择当前使用的简历。
- 覆盖基本信息、求职意向、教育、实习、工作、项目、奖项、语言、证书、论文、专利、校园经历和家庭成员等字段。
- 自动保存编辑内容，支持 PDF、Markdown、TXT 和 JSON 导入，以及 JSON 导出备份。
- 扫描可见招聘表单，识别文本框、文本域、单选、多选、下拉框和日期等常见控件。
- 使用原生输入 setter 与浏览器事件驱动页面控件，填写后保留高亮供人工确认。
- 支持 DeepSeek，以及其他实现 OpenAI Chat Completions 协议的模型服务。
- API Key 不在弹窗中回显，留空保存时会保留已有配置。

## 工作流程

```text
本地结构化简历
      │
      ├─ 转换为精简 Markdown
      │
招聘页面 ── 可见表单扫描 ── 模型字段理解与值映射
                                      │
                                      ▼
                              页面控件定位与填写
                                      │
                                      ▼
                                用户检查后提交
```

## 安装

### 从源码加载

1. 克隆仓库：

   ```bash
   git clone https://github.com/nangeda/hello-offer.git
   cd hello-offer
   ```

2. 在 Chrome 地址栏打开 `chrome://extensions`。
3. 开启右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”，选择仓库根目录。
5. 修改扩展代码后，在扩展管理页点击“重新加载”，并刷新已经打开的招聘页面。

项目当前没有构建步骤，也不需要安装运行时依赖。

## 使用方法

1. 点击浏览器工具栏中的 Hello Offer 图标。
2. 打开“编辑本地简历”，可以手动创建，也可以导入 PDF、Markdown、TXT 或 JSON 简历。
3. 在弹窗中填写模型 Base URL、模型名称和 API Key。
4. 点击“测试连接”，确认模型服务可用。
5. 打开招聘网站的简历表单，刷新页面后点击 Hello Offer 悬浮按钮。
6. 等待字段识别与填写结束，逐项检查高亮字段，再由你决定是否保存或提交。

默认模型配置：

```text
Base URL: https://api.deepseek.com
Model:    deepseek-chat
```

也可以填写完整的 `/chat/completions` 地址；扩展会避免重复追加路径。

## 数据与隐私

- 简历、模型地址、模型名称和 API Key 保存在 `chrome.storage.local` 中。
- 仓库不包含用户简历、API Key 或模型响应记录。
- 简历中心会对预览文本进行 HTML 转义，降低导入内容破坏页面的风险。
- PDF、Markdown 和 TXT 会先在本地读取；手机号、邮箱和身份证号会先替换为占位符，模型返回结构化结果后再在本地还原。
- Hello Offer 是“本地优先”而不是“完全离线”：启动智能填写时，精简后的当前简历、字段信息以及脱水后的可见表单结构会发送给用户配置的模型服务。
- API Key 由 Chrome 扩展存储管理，但不应视作硬件级或系统钥匙串级加密。请使用权限受限、可撤销的独立 Key。
- 扩展不会主动点击招聘网站的最终提交按钮。

## 兼容性边界

普通文本控件通常可以直接填写。搜索式下拉框、级联地区、日期区间、弹窗选项、虚拟列表以及前后依赖字段的行为由招聘网站自身组件决定，仍可能需要人工处理。

当前策略是先进行通用扫描、语义匹配和控件操作，再保留人工核对入口；不会承诺对所有网站或所有字段完全兼容。

PDF 导入最多读取 30 页、文件上限为 25 MB，并以 4 页并发方式提取文本。扫描图片型 PDF 当前没有 OCR，需要先转换为可复制文字的 PDF，或者导出为 Markdown/TXT 后导入。

## 目录结构

```text
hello-offer/
├── manifest.json
├── package.json
├── html/
│   ├── popup.html
│   ├── localResume.html
│   └── floatingPanel.html
├── css/
├── image/
├── assets/lib/              # PDF.js，选择 PDF 时按需加载
├── js/
│   ├── autofillRuntime.js   # 页面扫描、字段定位与填写执行
│   ├── floatingPanel.js     # 招聘页面悬浮界面
│   ├── background.js        # MV3 Service Worker 与消息路由
│   ├── modelGateway.js      # OpenAI 兼容模型请求与响应规范化
│   ├── runtimeConfig.js     # 扩展内部路由配置
│   └── resume/
│       ├── editor.js        # 多简历编辑器
│       ├── schema.js        # 结构化简历字段定义
│       ├── serializer.js    # 结构化简历转模型上下文
│       ├── document-importer.js # PDF/Markdown/TXT 导入编排
│       ├── pdf-extractor.js # PDF 本地文本提取
│       ├── pii-masker.js    # 敏感字段本地掩码与还原
│       └── sanitize.js      # 预览文本安全转义
└── tests/
```

## 开发与验证

需要 Node.js 18 或更高版本。仓库测试使用 Node 内置测试运行器，不依赖第三方测试框架。

```bash
npm test
npm run check
```

- `npm test`：验证模型地址处理、JSON 解析、简历 Schema、文档导入、敏感字段掩码、序列化、安全转义、品牌检查和 Manifest 本地资源。
- `npm run check`：对扩展主要 JavaScript 入口执行语法检查。

测试通过只代表静态逻辑和本地用例通过，不等同于已经验证所有真实招聘网站。涉及真实表单时，应重新加载扩展、刷新页面，并以页面回读结果为准。

## 安全提醒

- 不要把个人简历 JSON、真实 API Key、身份证号码等敏感信息提交到仓库。
- 不要在未核对结果的情况下提交求职申请。
- 如果招聘网站更新了控件结构，请先记录失败控件和可见回读结果，再定位兼容问题。

## 当前状态

Hello Offer 目前处于个人测试阶段，适合在人工复核下辅助填写招聘表单。欢迎通过 Issue 提交可复现的问题；请删除截图和日志中的姓名、手机号、身份证号、邮箱、住址及 API Key。
