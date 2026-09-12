/**
 * Content for the Day & Night portfolio world.
 *
 * This module intentionally contains no React or Three.js imports so the
 * canvas experience and the accessible DOM fallback always share one source
 * of truth.
 */

export const SECTION_ORDER = ["home", "experience", "projects", "awards"];

export const palettes = {
  day: {
    id: "day",
    label: "Day",
    background: "#ffffff",
    ink: "#181817",
    muted: "#77736c",
    surface: "#ffffff",
    line: "#aaa69e",
    dog: "#111111",
  },
  night: {
    id: "night",
    label: "Night",
    background: "#111111",
    ink: "#eeeeea",
    muted: "#aaa9a4",
    surface: "#1a1a19",
    line: "#777773",
    dog: "#f2f2ee",
  },
};

/**
 * `anchor` is the section's navigation target on the continuous world track.
 * Exhibits between anchors remain independently positioned and independently wrapped.
 */
export const sections = [
  {
    id: "home",
    label: "Home",
    hash: "#home",
    theme: "day",
    anchor: 0,
    eyebrow: "Day / 01",
    description: "A small studio for introductions and links.",
  },
  {
    id: "experience",
    label: "Internships",
    hash: "#experience",
    theme: "night",
    anchor: 42,
    eyebrow: "Night / 02",
    description: "Full-stack AI agent, RAG, and industrial LLM internships.",
  },
  {
    id: "projects",
    label: "Projects",
    hash: "#projects",
    theme: "day",
    anchor: 72,
    eyebrow: "Day / 03",
    description: "AI agents, product prototypes, and enterprise tools.",
  },
  {
    id: "awards",
    label: "Awards",
    hash: "#awards",
    theme: "night",
    anchor: 144,
    eyebrow: "Night / 04",
    description: "Five milestones, arranged as a midnight gallery.",
  },
];

export const profile = {
  name: "Junyi(Je)",
  pronouns: "she/her",
  headline: "a comp sci student likes to explore^^",
  introduction:
    "beside, I like video games and board games!",
  location: "Sydney, Australia",
  education: [
    {
      institution: "University of New South Wales (UNSW)",
      program: "Bachelor of Computer Science",
      period: "May 2024 – Oct 2027(3 years degree)",
      detail: "software engineering, Algorithm, etc.",
    },
    {
      institution: "Georgia Institute of Technology",
      program: "Exchange Semester",
      period: "Jan 2026 - May 2026",
      detail: "Machine Learning, NLP, Intro to robotics",
    },
  ],
  skills: {
    programming: ["Python", "C++", "C", "Bash", "JavaScript/TypeScript"],
    systems: ["Linux/Unix", "TCP/IP", "Protobuf", "PostgreSQL", "Redis", "REST APIs", "Git"],
    mlAndLlm: ["SQL", "NumPy", "Pandas", "PyTorch", "vLLM"],
  },
  links: [
    {
      id: "email",
      label: "Email",
      value: "junyiliu0608@gmail.com",
      href: "mailto:junyiliu0608@gmail.com",
      external: false,
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/LongEat",
      href: "https://github.com/LongEast",
      external: true,
    },
    {
      id: "blog",
      label: "Blog",
      value: "junyi",
      href: "",
      external: true,
    },
  ],
};

export const awards = [
  {
    id: "agentic-travel",
    placement: "1st Place",
    title: "Agentic AI Travel Planning Challenge",
    organization: "Nanjing University",
    date: "Jul 2026",
    detail:
      "Built a constraint-driven Python task-planning pipeline with candidate search, deterministic validation, bounded retries, and fallbacks for feasible plans under budget and itinerary constraints.",
    exhibit: "route-map",
  },
  {
    id: "imc-trading",
    placement: "1st Place",
    title: "IMC Trading Challenge",
    organization: "MindPhair at ETH Zürich",
    date: "Apr 2026",
    detail: "First place in the IMC Trading Challenge.",
    exhibit: "trading-board",
  },
  {
    id: "ai-pioneer",
    placement: "Top 3",
    title: "ByteDance & Milian AI Pioneer Future Talent Competition",
    organization: "ByteDance & Milian",
    date: "Aug 2026",
    detail:
      "Built a real-time backend pipeline with persistent client connections, Redis-backed event ingestion, and asynchronous task processing.",
    exhibit: "signal-stack",
  },
  {
    id: "deans-award",
    placement: "Winner",
    title: "Dean’s Award",
    organization: "University of New South Wales",
    date: "2025",
    detail: "Dean’s Award Winner.",
    exhibit: "laurel",
  },
  {
    id: "icpc",
    placement: "Top 15",
    title: "ICPC Australia Preliminary Round",
    organization: "Australia",
    date: null,
    detail: "Placed in the top 15 in Australia.",
    exhibit: "code-grid",
  },
];

export const projects = [
  {
    id: "urbantrip",
    eyebrow: "Agent systems",
    title: "UrbanTrip · TPC@IJCAI 1st Place",
    summary:
      "An end-to-end AI planning agent for feasible travel itineraries under complex real-world constraints.",
    detail:
      "UrbanTrip converts natural-language travel requirements into executable, validated plans while accounting for budgets, hotel requirements, attraction opening hours, transport modes, and visit order.",
    details: [
      "Developed an end-to-end AI planning agent that parses natural-language requirements into a structured Task State, then executes a complete Retrieval → Planning → Tool/API Execution → Validation → Fallback workflow.",
      "Established agent quality controls with JSON Schema, Structured Output, validators, and timeout handling. Distinguished formatting, constraint, and execution failures, then fed the error causes back into subsequent planning to improve stability on complex tasks.",
      "Built automated evaluation and regression tests covering 1,000 queries. Categorised formatting errors, constraint violations, time conflicts, budget overruns, and execution timeouts to continuously analyse agent strategy performance.",
    ],
    tags: ["Python", "LLM agents", "Structured output", "Evaluation"],
    art: "urbantrip",
    links: [
      {
        label: "View source",
        href: "https://github.com/suzuran555/travel",
        external: true,
      },
    ],
  },
  {
    id: "atlassian-home-dashboard",
    eyebrow: "Enterprise collaboration",
    title: "Atlassian Home Dashboard Gadget",
    organization: "Atlassian Industry Collaboration Project",
    date: "Jun 2026 – Aug 2026",
    summary:
      "Migrated a Jira Space Gadget to Atlassian Home Dashboard and delivered the remaining full-stack integration with Forge.",
    detail:
      "A full-stack enterprise dashboard gadget delivered with Atlassian Forge, Figma, and an AI-assisted design-to-development workflow.",
    details: [
      "Worked with Atlassian’s enterprise team to migrate and adapt an existing Jira Space Gadget for Atlassian Home Dashboard. Reused official Atlassian components and independently implemented the remaining frontend, backend, and page-integration logic with Atlassian Forge.",
      "Designed the product storyboard and interaction flow in Figma, then connected design context to development through Codex + Figma MCP. Completed the end-to-end process from requirement analysis and product design to AI-assisted full-stack implementation and final delivery, collaborating directly with Atlassian product owners throughout rollout.",
    ],
    tags: ["Figma", "Codex", "Full-stack"],
    art: "dashboard",
    links: [
      {
        label: "Watch group demo",
        href: "https://drive.google.com/file/d/1bm0b-WfXO7EZiwS5iTcek602-Nzea1_Z/view?usp=drive_link",
        external: true,
      },
    ],
  },
  {
    id: "uslike",
    eyebrow: "AI matching product · Top 300 / 4,000 teams",
    title: "Uslike",
    organization: "Feishu Competition · Milian Industry Challenge",
    date: "Jul 2026 – Present",
    summary:
      "An AI matching and relationship-building platform shaped through product discovery, prototyping, and competition feedback.",
    detail:
      "Uslike pairs people through shared interests and brainwave-style questions, then uses mutual reveals and rooms as gentle icebreakers for deeper conversation and connection.",
    details: [
      "Led the project and decomposed the complete AI product workflow from scratch, owning AI capability design, application-flow design, frontend prototype implementation, and solution iteration. Worked directly with corporate product managers to refine the product around user value, technical feasibility, and competition feedback; the project advanced to the top 300 out of 4,000 teams.",
    ],
    tags: ["React", "FastAPI", "AI product design", "Frontend prototype"],
    art: "uslike",
    links: [
      {
        label: "View product documentation",
        href: "https://jcnj02b8aim1.feishu.cn/wiki/If03wW7ybiuwkxkorCMcMK38n0e",
        external: true,
      },
      {
        label: "Open frontend prototype",
        href: "https://uslike-dat0.onrender.com/",
        external: true,
        note: "The deployment may be unavailable while its hosting credits are paused.",
      },
      {
        label: "View source",
        href: "https://github.com/LongEast/uslike",
        external: true,
      },
    ],
  },
  {
    id: "mobile-ad-agent",
    eyebrow: "Mobile AI automation · Independent project",
    title: "Cross-App Mobile Ad Recognition Agent",
    organization: "Independent Project",
    date: "Jul 2026 – Aug 2026",
    summary:
      "A modular mobile AI automation system for detecting ads across social and short-video feeds.",
    detail:
      "The agent automates scrolling, screenshots, UI Tree/OCR parsing, and ad classification across Weibo, Xiaohongshu, and short-video feeds.",
    details: [
      "Abstracted heterogeneous app page structures behind unified Observation, Action, and Extraction interfaces.",
      "Designed UI Tree, OCR, visual embeddings, and AI models as independently replaceable perception and reasoning modules. Combined page text with visual signals, then compared rule-based, retrieval/ML, and AI-model approaches across platforms for recognition quality and runtime cost.",
      "Built a session-based data pipeline for screenshots, UI text, OCR output, content regions, and metadata. Reduced duplicates through cross-frame deduplication and collected and manually reviewed about 400 posts and videos for model development and testing.",
      "Established Precision, Recall, F1, False Positive Rate, and Invalid Output Rate metrics, and performed structured root-cause analysis on bad cases.",
    ],
    tags: ["Mobile automation", "OCR", "Visual embeddings", "Evaluation"],
    art: "mobile-agent",
    links: [
      {
        label: "View source",
        href: "https://github.com/LongEast/mobile-ad-agent",
        external: true,
      },
    ],
  },
];

export const experiences = [
  {
    id: "pikpop-ai-agent",
    title: "AI Agent Development Intern",
    organization: "PikPop · Hangzhou Zhimao Xingtu",
    location: "Hangzhou, China",
    date: "Aug 2026 – Present",
    summary:
      "Built and debugged full-stack AI agent workflows for a cross-border commerce platform.",
    details: [
      "Helped develop an all-in-one AI commerce platform for cross-border e-commerce. Multi-agent workflows covered product discovery, supplier matching, product design, and marketing asset generation; contributed across frontend interactions, backend services, agent workflows, and production debugging.",
      "Refactored the core Prompt Composer for complex combinations of agent runtime, message-queue, attachment-upload, inquiry, and workflow states. Unified scattered submission paths and connected the full message lifecycle from editing and enqueueing through automatic dequeueing and final delivery, while preserving user state across failures, rate limits, and cancellations.",
      "Investigated production bad cases and regressions by tracing abnormal conversations, frontend/backend state flows, and Git history. Identified historical issues in attachment handling and page rendering, then designed compatibility fixes aligned with existing product flows.",
    ],
    links: [
      {
        label: "View product",
        href: "https://pikpop.ai/en/home",
        external: true,
      },
    ],
    exhibit: "signal-stack",
  },
  {
    id: "tpg-llm-application",
    title: "LLM Application Intern",
    organization: "TPG Telecom",
    location: "Australia",
    date: "Nov 2025 – Jan 2026",
    summary:
      "Built data and evaluation pipelines for an enterprise knowledge-base RAG/LLM application.",
    details: [
      "Built the knowledge-base data pipeline for an enterprise RAG/LLM application, including PDF and Word parsing, chunking, metadata modelling, and the end-to-end path from enterprise documents to model-retrievable context.",
      "Helped create a Query–Expected Answer–Badcase evaluation set and assessed retrieval recall, answer accuracy, completeness, citation correctness, and output stability. Categorised failures into missing retrieval, incorrect retrieval, context conflicts, and incorrect citations to support strategy improvements.",
    ],
    exhibit: "probability-table",
  },
  {
    id: "shengruan-llm",
    title: "Large Language Model Intern",
    organization: "Shengruan Technology · Intelligent Oil & Gas Fracturing Project",
    date: "Aug 2025 – Oct 2025",
    summary:
      "Built training-data and offline-evaluation pipelines for industrial time-series models.",
    details: [
      "Owned the training-data pipeline for industrial time-series models. Resolved inconsistent field definitions, timestamp misalignment, missing values, and anomalous noise through data cleaning, temporal alignment, anomaly detection, and feature construction.",
      "Built training and validation datasets plus an offline evaluation pipeline to compare data-processing and feature configurations using MAE, RMSE, MAPE, and R², then used experiment results to select models and parameters.",
    ],
    exhibit: "market-ticker",
  },
];

export const content = {
  sectionOrder: SECTION_ORDER,
  palettes,
  sections,
  profile,
  awards,
  projects,
  experiences,
};

export default content;
