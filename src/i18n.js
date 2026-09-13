import baseContent from "./content";

export const detectSystemLocale = () => {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
};

const messages = {
  en: {
    awards: "Awards",
    blogPreparing: "The blog is still being prepared. Please check back soon.",
    closeDialog: "Close dialog",
    comingSoon: "Coming soon",
    contactHeading: "Let's make something thoughtful.",
    contactLinks: "Contact links",
    education: "Education",
    experience: "Internships",
    exploreProject: "Explore project",
    findMeOnline: "Find me online",
    hello: "Hi, I'm",
    home: "Home",
    language: "Language",
    loading: "Loading",
    movementControls: "Movement controls",
    openDetails: (title) => `Open ${title} details`,
    or: "or",
    portfolioSections: "Portfolio sections",
    projectPreviewAlt: "Monochrome Uslike landing-page composition with matching cards and conversation prompts",
    projectTechnologies: (title) => `${title} technologies`,
    projects: "Projects",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    themeTooltip: "Click to change mode",
    touchHint: "Swipe sideways, or hold a screen edge to travel.",
    useChinese: "Use Chinese",
    useEnglish: "Use English",
    viewDetails: "View details",
    preview: {
      uslike: ["MATCH", "MUTUAL REVEAL", "ROOM"],
      urbantrip: ["CONSTRAINT", "ROUTE", "VALID"],
      dashboard: ["HOME", "GADGET", "DELIVER"],
      "mobile-agent": ["CAPTURE", "OCR", "CLASSIFY"],
    },
  },
  zh: {
    awards: "获奖",
    blogPreparing: "博客还在准备中，欢迎之后再来看看。",
    closeDialog: "关闭对话框",
    comingSoon: "即将上线",
    contactHeading: "一起做点有意思的东西吧。",
    contactLinks: "联系方式",
    education: "教育经历",
    experience: "实习经历",
    exploreProject: "查看项目",
    findMeOnline: "联系我",
    hello: "你好，我是",
    home: "首页",
    language: "语言",
    loading: "加载中",
    movementControls: "移动控制",
    openDetails: (title) => `查看 ${title} 详情`,
    or: "或",
    portfolioSections: "作品集栏目",
    projectPreviewAlt: "Uslike 黑白落地页构图，包含匹配卡片和对话提示",
    projectTechnologies: (title) => `${title} 使用的技术`,
    projects: "项目",
    switchToDark: "切换到深色模式",
    switchToLight: "切换到浅色模式",
    themeTooltip: "点击切换模式",
    touchHint: "左右滑动，或按住屏幕边缘移动。",
    useChinese: "使用中文",
    useEnglish: "Use English",
    viewDetails: "查看详情",
    preview: {
      uslike: ["匹配", "双向揭晓", "房间"],
      urbantrip: ["约束", "路线", "可行"],
      dashboard: ["首页", "组件", "交付"],
      "mobile-agent": ["截图", "识别", "分类"],
    },
  },
};

const zhTranslations = {
  sections: {
    home: {
      label: "首页",
      eyebrow: "白昼 / 01",
      description: "一个用于自我介绍与分享链接的小空间。",
    },
    experience: {
      label: "实习经历",
      eyebrow: "夜晚 / 02",
      description: "AI Agent、RAG 与工业大模型方向的实习经历。",
    },
    projects: {
      label: "项目",
      eyebrow: "白昼 / 03",
      description: "AI Agent、产品原型与企业工具项目。",
    },
    awards: {
      label: "获奖",
      eyebrow: "夜晚 / 04",
      description: "陈列在午夜展厅里的两项竞赛成果。",
    },
  },
  profile: {
    headline: "一个喜欢探索的计算机专业学生^^",
    introduction: "除此之外，我也喜欢电子游戏和桌游！",
    location: "澳大利亚悉尼",
    education: [
      {
        institution: "新南威尔士大学（UNSW）",
        program: "计算机科学学士",
        period: "2024年5月 – 2027年10月（三年制）",
        detail: "软件工程、算法等",
      },
      {
        institution: "佐治亚理工学院",
        program: "交换学期",
        period: "2026年1月 – 2026年5月",
        detail: "机器学习、自然语言处理、机器人学导论",
      },
    ],
    links: [
      { label: "邮箱" },
      { label: "GitHub" },
      { label: "博客" },
    ],
  },
  awards: {
    "agentic-travel": {
      placement: "第一名",
      title: "智能体 AI 旅行规划挑战赛",
      organization: "南京大学",
      date: "2026年7月",
      detail: "使用 Python 构建约束驱动的任务规划流程，通过候选搜索、确定性验证、有限重试与回退机制，在预算和行程约束下生成可行计划。",
    },
    "ai-pioneer": {
      placement: "前三名",
      title: "字节跳动 & 米连AI 先锋未来人才大赛",
      organization: "字节跳动 & 米连",
      date: "2026年8月",
      detail: "构建实时后端流程，包含持久客户端连接、基于 Redis 的事件接入和异步任务处理。",
    },
  },
  projects: {
    urbantrip: {
      eyebrow: "智能体系统",
      title: "UrbanTrip · TPC@IJCAI 第一名",
      summary: "面向复杂现实约束生成可执行旅行方案的端到端 AI 规划 Agent。",
      detail: "UrbanTrip 将自然语言旅行需求转化为可执行、可验证的规划，同时处理预算、酒店条件、景点开放时间、交通方式与访问顺序等约束。",
      details: [
        "面向预算、酒店条件、景点开放时间、交通方式及访问顺序等复杂约束，开发端到端 AI 规划 Agent；将自然语言需求解析为结构化 Task State，并构建 Retrieval → Planning → Tool / API Execution → Validation → Fallback 的完整执行链路。",
        "使用 JSON Schema、Structured Output、Validator 与 Timeout Handling 建立 Agent 执行质量控制机制；区分格式失败、约束失败及执行失败，并将错误原因反馈至后续规划流程，提升复杂任务执行稳定性。",
        "构建覆盖 1000 条 Query 的自动化 Evaluation / Regression Test，对格式错误、Constraint Violation、时间冲突、预算超限及执行超时进行分类统计，通过实验结果持续分析 Agent 策略效果。",
      ],
      tags: ["Python", "LLM 智能体", "结构化输出", "自动化评估"],
      links: [{ label: "查看源码" }],
    },
    "atlassian-home-dashboard": {
      eyebrow: "企业合作项目",
      title: "Atlassian Home Dashboard Gadget",
      organization: "Atlassian 企业合作项目",
      date: "2026年6月 – 2026年8月",
      summary: "将 Jira Space Gadget 迁移至 Atlassian Home Dashboard，并基于 Forge 完成全栈集成。",
      detail: "使用 Atlassian Forge、Figma 与 AI 辅助设计开发流程交付的企业级 Dashboard Gadget。",
      details: [
        "与 Atlassian 企业团队合作，将已有 Jira Space Gadget 迁移并适配至 Atlassian Home Dashboard；复用 Atlassian 官方组件，并基于 Atlassian Forge 独立实现其余前后端业务逻辑与页面集成。",
        "使用 Figma 设计产品 Storyboard 与交互流程，并通过 Codex + Figma MCP 将设计上下文接入开发流程；完成从需求梳理、产品设计、AI 全栈实现到最终交付的端到端流程，并与 Atlassian 产品负责人协同推进项目落地。",
      ],
      tags: ["Figma", "Codex", "全栈开发"],
      links: [{ label: "最终报告" }],
    },
    uslike: {
      eyebrow: "AI 匹配产品 · 4000 队中入围 300 强",
      title: "互像 Uslike",
      organization: "飞书比赛 · 米连企业命题",
      date: "2026年7月 – 至今",
      summary: "通过产品探索、前端原型和比赛反馈持续迭代的 AI 匹配与关系生成平台。",
      detail: "Uslike 通过共同兴趣和脑电波式问题匹配用户，再以双向揭晓和房间作为自然的破冰方式，帮助双方展开更深入的交流与连接。",
      details: [
        "担任项目队长，从零拆解完整 AI 产品链路，负责 AI 能力设计、应用流程设计、前端原型实现及方案迭代；与企业产品经理直接沟通，根据用户价值、技术可实现性及比赛反馈持续调整方案，项目最终入围 300 强 / 4000 队。",
      ],
      tags: ["React", "FastAPI", "AI 产品设计", "前端原型"],
      links: [
        { label: "查看产品文档" },
        { label: "打开前端原型", note: "托管额度暂停时，部署可能暂时无法访问。" },
        { label: "查看源码" },
      ],
    },
    "mobile-ad-agent": {
      eyebrow: "移动端 AI 自动化 · 个人项目",
      title: "跨 App 移动端广告识别 Agent",
      organization: "个人项目",
      date: "2026年7月 – 2026年8月",
      summary: "面向社交与短视频信息流的模块化移动端广告识别系统。",
      detail: "面向微博、小红书及短视频信息流，自动完成滑动、截图、UI Tree / OCR 解析与广告分类。",
      details: [
        "将不同 App 页面结构抽象为统一的 Observation / Action / Extraction Interface。",
        "将 UI Tree、OCR、视觉 Embedding 与 AI Model 设计为可独立替换的感知和推理模块，组合页面文本与视觉信息进行判断，并比较 Rule-based、Retrieval / ML 与 AI Model 在不同平台上的识别效果与运行成本。",
        "构建 session-based 数据处理 Pipeline，管理截图、UI 文本、OCR 输出、内容区域及 Metadata，通过跨帧去重减少重复数据；累计采集并人工复核约 400 条帖子及视频，用于模型开发与测试。",
        "建立 Precision、Recall、F1、False Positive Rate 和 Invalid Output Rate 等评测指标，并对 Badcase 进行结构化归因。",
      ],
      tags: ["移动端自动化", "OCR", "视觉 Embedding", "评估体系"],
      links: [{ label: "查看源码" }],
    },
  },
  experiences: {
    "pikpop-ai-agent": {
      title: "AI Agent 开发实习生",
      organization: "杭州智贸星途公司（PikPop）",
      location: "中国杭州",
      date: "2026年8月 – 至今",
      summary: "参与跨境电商一站式 AI Commerce 平台的全栈 Agent 开发与线上问题排查。",
      details: [
        "参与开发面向跨境电商的一站式 AI Commerce 平台，通过 Multi-Agent Workflow 覆盖市场选品、供应商匹配、商品设计及营销素材生成等核心业务；作为 AI 全栈实习生，直接参与前端交互、后端服务、Agent Workflow 与线上问题排查。",
        "针对 Agent 运行态、消息队列、附件上传、Inquiry 与 Workflow 等复杂状态组合，重构核心 Prompt Composer；将分散的提交行为抽象为统一决策逻辑，打通消息从编辑、入队、自动出队到最终发送的完整生命周期，并完善失败、限流及取消场景下的用户状态保留机制。",
        "参与线上核心 Agent 功能的 Badcase 排查与回归定位，结合异常会话、前后端状态流与 Git 历史追踪行为变化来源，定位附件处理、页面渲染等历史回归问题，并根据现有产品流程设计兼容性修复方案。",
      ],
      links: [{ label: "产品链接" }],
    },
    "tpg-llm-application": {
      title: "大模型应用实习生",
      organization: "TPG Telecom",
      location: "澳大利亚",
      date: "2025年11月 – 2026年1月",
      summary: "参与企业知识库 RAG / LLM 应用的数据处理与评估链路建设。",
      details: [
        "参与开发企业知识库 RAG / LLM 应用，负责知识库数据处理 Pipeline：完成 PDF / Word 文档解析、Chunk 切分及 Metadata 建模，参与从企业知识数据到模型可检索上下文的完整链路建设。",
        "参与建立 Query – Expected Answer – Badcase 测试集，从 Retrieval Recall、Answer Accuracy、信息完整性、引用正确性与输出稳定性等维度评估模型表现；将失败样例归因为检索缺失、错误召回、上下文冲突及错误引用等类型，支持后续策略优化。",
      ],
    },
    "shengruan-llm": {
      title: "大模型实习生",
      organization: "胜软科技 · 油气压裂智能化项目",
      date: "2025年8月 – 2025年10月",
      summary: "负责工业时序模型的训练数据与离线评估 Pipeline。",
      details: [
        "负责工业时序模型的 Training Data Pipeline，针对字段口径不统一、时间戳错位、缺失值及异常噪声，完成数据清洗、时间对齐、异常检测与特征构造，将原始工业数据转换为稳定训练输入。",
        "构建训练集、验证集及 Offline Evaluation Pipeline，批量比较不同数据处理及特征配置下的 MAE / RMSE / MAPE / R²，通过实验结果进行模型与参数方案选择。",
      ],
    },
  },
};

const mergeByIndex = (items, translations = []) => items.map((item, index) => ({
  ...item,
  ...(translations[index] ?? {}),
}));

const mergeById = (items, translations) => items.map((item) => {
  const translated = translations[item.id] ?? {};
  return {
    ...item,
    ...translated,
    details: translated.details ?? item.details,
    tags: translated.tags ?? item.tags,
    links: item.links ? mergeByIndex(item.links, translated.links) : item.links,
  };
});

export const getMessages = (locale) => messages[locale] ?? messages.en;

export const getLocalizedContent = (locale) => {
  if (locale !== "zh") return baseContent;

  return {
    ...baseContent,
    sections: mergeById(baseContent.sections, zhTranslations.sections),
    profile: {
      ...baseContent.profile,
      ...zhTranslations.profile,
      education: mergeByIndex(baseContent.profile.education, zhTranslations.profile.education),
      links: mergeByIndex(baseContent.profile.links, zhTranslations.profile.links),
    },
    awards: mergeById(baseContent.awards, zhTranslations.awards),
    projects: mergeById(baseContent.projects, zhTranslations.projects),
    experiences: mergeById(baseContent.experiences, zhTranslations.experiences),
  };
};
