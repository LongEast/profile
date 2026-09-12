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
    cat: "#111111",
  },
  night: {
    id: "night",
    label: "Night",
    background: "#111111",
    ink: "#eeeeea",
    muted: "#aaa9a4",
    surface: "#1a1a19",
    line: "#777773",
    cat: "#f2f2ee",
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
    label: "Experience",
    hash: "#experience",
    theme: "night",
    anchor: 42,
    eyebrow: "Night / 02",
    description: "Learning, teaching, and quantitative-program milestones.",
  },
  {
    id: "projects",
    label: "Projects",
    hash: "#projects",
    theme: "day",
    anchor: 72,
    eyebrow: "Day / 03",
    description: "Things made for people, plans, and data.",
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
    id: "uslike",
    eyebrow: "Relationship product",
    title: "Uslike",
    summary:
      "A relationship-matching website designed to turn a match into a better conversation.",
    detail:
      "Uslike pairs people through shared interests and brainwave-style questions, then uses mutual reveals and rooms as gentle icebreakers for deeper conversation and connection.",
    tags: ["React", "FastAPI", "Tailwind CSS", "Matching flows"],
    art: "uslike",
    links: [
      {
        label: "View landing page",
        href: "https://uslike-landing-public.vercel.app/",
        external: true,
      },
      {
        label: "Open live app",
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
    id: "urbantrip",
    eyebrow: "Agent systems",
    title: "UrbanTrip",
    summary:
      "A constraint-aware agent for building feasible multi-city itineraries across China.",
    detail:
      "UrbanTrip turns natural-language travel constraints into coherent plans that account for intercity travel, local routing, timing, budgets, and recommendations.",
    tags: ["Python", "LLM agents", "Constraint planning"],
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
    id: "cohort-builder",
    eyebrow: "Clinical data tooling",
    title: "Hip Fracture Cohort Builder",
    summary:
      "A clinical data exploration tool with Boolean cohort search and visual analysis.",
    detail:
      "A focused interface for defining hip-fracture cohorts with Boolean logic, then examining the resulting population through visual analysis.",
    tags: ["Boolean search", "Clinical data", "Visual analysis"],
    art: "cohort",
    links: [
      {
        label: "Open project",
        href: "https://hip-fracture-cohort-builder.vercel.app/",
        external: true,
      },
    ],
  },
];

export const experiences = [
  {
    id: "eth-exchange",
    title: "ETH Zürich Exchange",
    organization: "ETH Zürich · Department of Computer Science (D-INFK)",
    location: "Zürich, Switzerland",
    date: "2026",
    summary: "Exchange Semester · GPA 5.9/6.",
    details: ["Awarded the highest-tier Alumni Exchange Scholarship."],
    exhibit: "alpine-window",
  },
  {
    id: "unsw-tutoring",
    title: "UNSW Tutoring",
    organization: "University of New South Wales",
    location: "Sydney, Australia",
    date: null,
    summary: "Tutor for Algorithm Design (COMP3121) and Database Systems (COMP3311).",
    details: [],
    exhibit: "chalkboard",
  },
  {
    id: "optiver-futurefocus",
    title: "Optiver FutureFocus Program",
    organization: "Optiver",
    location: "Sydney, Australia",
    date: "May 2026",
    summary:
      "Implemented components of a high-throughput exchange backend.",
    details: [
      "Worked on deterministic order-book processing, TCP client/server communication, and Protobuf-based market-data messaging.",
      "Stress-tested the exchange at 5,000+ messages per second while validating order-state consistency and reliable market-data delivery.",
    ],
    exhibit: "order-book",
  },
  {
    id: "jane-street-see",
    title: "Jane Street SEE Program",
    organization: "Jane Street",
    location: "Hong Kong",
    date: "Jul 2026",
    summary: "Participated in the Jane Street SEE Program.",
    details: [],
    exhibit: "probability-table",
  },
  {
    id: "sig-visiting",
    title: "Susquehanna International Group Visiting Program",
    organization: "Susquehanna International Group (SIG)",
    location: "Sydney, Australia",
    date: "Aug 2026",
    summary: "Participated in the SIG Visiting Program.",
    details: [],
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
