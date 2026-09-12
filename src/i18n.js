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
      cohort: ["COHORT", "BOOLEAN", "ANALYSE"],
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
      cohort: ["队列", "布尔检索", "分析"],
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
      description: "为人、计划与数据打造的作品。",
    },
    awards: {
      label: "获奖",
      eyebrow: "夜晚 / 04",
      description: "陈列在午夜展厅里的五个里程碑。",
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
    "imc-trading": {
      placement: "第一名",
      title: "IMC 交易挑战赛",
      organization: "ETH Zürich MindPhair",
      date: "2026年4月",
      detail: "获得 IMC 交易挑战赛第一名。",
    },
    "ai-pioneer": {
      placement: "前三名",
      title: "字节跳动 & Milian AI 先锋未来人才大赛",
      organization: "字节跳动 & Milian",
      date: "2026年8月",
      detail: "构建实时后端流程，包含持久客户端连接、基于 Redis 的事件接入和异步任务处理。",
    },
    "deans-award": {
      placement: "获奖者",
      title: "院长奖",
      organization: "新南威尔士大学",
      detail: "获得院长奖。",
    },
    icpc: {
      placement: "前15名",
      title: "ICPC 澳大利亚预选赛",
      organization: "澳大利亚",
      detail: "获得澳大利亚赛区前15名。",
    },
  },
  projects: {
    uslike: {
      eyebrow: "关系匹配产品",
      summary: "一个帮助用户把匹配转化为更好交流的关系匹配网站。",
      detail: "Uslike 通过共同兴趣和脑电波式问题匹配用户，再以双向揭晓和房间作为自然的破冰方式，帮助双方展开更深入的交流与连接。",
      tags: ["React", "FastAPI", "Tailwind CSS", "匹配流程"],
      links: [
        { label: "查看产品文档" },
        { label: "打开前端原型", note: "托管额度暂停时，部署可能暂时无法访问。" },
        { label: "查看源码" },
      ],
    },
    urbantrip: {
      eyebrow: "智能体系统",
      summary: "一个面向中国多城市旅行、能够理解约束条件的行程规划智能体。",
      detail: "UrbanTrip 将自然语言旅行需求转化为连贯方案，并综合考虑城际交通、市内路线、时间、预算和推荐内容。",
      tags: ["Python", "LLM 智能体", "约束规划"],
      links: [{ label: "查看源码" }],
    },
    "cohort-builder": {
      eyebrow: "临床数据工具",
      title: "髋部骨折队列构建器",
      summary: "一个支持布尔队列检索与可视化分析的临床数据探索工具。",
      detail: "通过布尔逻辑定义髋部骨折患者队列，并利用可视化分析检查所得人群。",
      tags: ["布尔检索", "临床数据", "可视化分析"],
      links: [{ label: "打开项目" }],
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
