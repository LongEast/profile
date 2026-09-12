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
    experience: "Experience",
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
    experience: "经历",
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
      label: "经历",
      eyebrow: "夜晚 / 02",
      description: "学习、教学与量化项目经历。",
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
        { label: "查看落地页" },
        { label: "打开在线应用", note: "托管额度暂停时，部署可能暂时无法访问。" },
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
    "eth-exchange": {
      title: "ETH Zürich 交换项目",
      organization: "ETH Zürich · 计算机科学系（D-INFK）",
      location: "瑞士苏黎世",
      summary: "交换学期 · GPA 5.9/6",
      details: ["获得最高等级的校友交换奖学金。"],
    },
    "unsw-tutoring": {
      title: "UNSW 课程辅导",
      organization: "新南威尔士大学",
      location: "澳大利亚悉尼",
      summary: "担任算法设计（COMP3121）和数据库系统（COMP3311）课程辅导教师。",
    },
    "optiver-futurefocus": {
      title: "Optiver FutureFocus 项目",
      location: "澳大利亚悉尼",
      date: "2026年5月",
      summary: "实现高吞吐量交易所后端的核心组件。",
      details: [
        "开发确定性订单簿处理、TCP 客户端/服务器通信和基于 Protobuf 的市场数据消息传输。",
        "以每秒 5,000 条以上消息对交易所进行压力测试，同时验证订单状态一致性和市场数据可靠传输。",
      ],
    },
    "jane-street-see": {
      title: "Jane Street SEE 项目",
      location: "中国香港",
      date: "2026年7月",
      summary: "参加 Jane Street SEE 项目。",
    },
    "sig-visiting": {
      title: "SIG 访问项目",
      organization: "Susquehanna International Group（SIG）",
      location: "澳大利亚悉尼",
      date: "2026年8月",
      summary: "参加 SIG 访问项目。",
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
