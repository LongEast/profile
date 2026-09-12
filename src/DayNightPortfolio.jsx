import { Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@fontsource/patrick-hand/latin-400.css";
import WorldScene from "./WorldScene";
import {
  palettes,
  SECTION_ORDER,
  sections,
} from "./content";
import { detectSystemLocale, getLocalizedContent, getMessages } from "./i18n";
import "./day-night-portfolio.css";

const SECTION_BY_ID = Object.fromEntries(
  sections.map((section) => [section.id, section]),
);

const getSystemTheme = () => {
  if (typeof window === "undefined") return "day";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "night" : "day";
};

const getSectionFromHash = () => {
  if (typeof window === "undefined") return "home";

  const hashId = window.location.hash.replace(/^#/, "");
  const pathId = window.location.pathname.match(/\/(home|awards|projects|experience)\/?$/)?.[1];
  const requestedId = hashId || pathId;

  return sections.find((section) => section.id === requestedId || section.hash === `#${requestedId}`)?.id ?? "home";
};

const canUseWebGL = () => {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("forceFallback")) return false;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
};

const shouldShowTouchHint = () => {
  if (typeof window === "undefined") return false;

  try {
    return window.matchMedia?.("(pointer: coarse)").matches &&
      window.localStorage.getItem("v3-touch-hint-seen") !== "yes";
  } catch {
    return Boolean(window.matchMedia?.("(pointer: coarse)").matches);
  }
};

const updateHash = (sectionId) => {
  const section = SECTION_BY_ID[sectionId];
  if (!section || typeof window === "undefined") return;

  if (window.location.hash !== section.hash || /\/(home|awards|projects|experience)\/?$/.test(window.location.pathname)) {
    const basePath = window.location.pathname
      .replace(/\/(home|awards|projects|experience)\/?$/, "")
      .replace(/\/$/, "") || "/";
    window.history.replaceState(null, "", `${basePath}${window.location.search}${section.hash}`);
  }
};

class WorldErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function Modal({ closeButtonRef, item, type, onClose, dialogRef, messages }) {
  const isProject = type === "project";
  const isNotice = type === "notice";
  const headingId = `${type}-${item.id}-title`;

  return (
    <div className="v3-modal-backdrop" data-block-game-touch onMouseDown={onClose} role="presentation">
      <section
        aria-labelledby={headingId}
        aria-modal="true"
        className={`v3-modal${isNotice ? " v3-modal--notice" : ""}`}
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex="-1"
      >
        <button
          aria-label={messages.closeDialog}
          className="v3-modal__close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          ×
        </button>

        {isNotice ? (
          <>
            <p className="v3-modal__eyebrow">{item.label}</p>
            <h2 id={headingId}>{messages.comingSoon}</h2>
            <p className="v3-modal__body">{messages.blogPreparing}</p>
          </>
        ) : (
          <>
            {isProject ? <ProjectPreview kind={item.art} messages={messages} /> : <ExhibitMark kind={item.exhibit} />}

            <p className="v3-modal__eyebrow">
              {isProject ? item.eyebrow : item.placement ?? item.date ?? messages.experience}
            </p>
            <h2 id={headingId}>{item.title}</h2>
            <p className="v3-modal__meta">
              {[item.organization, item.location, item.date].filter(Boolean).join(" · ")}
            </p>
            <p className="v3-modal__body">{item.detail ?? item.summary}</p>

            {item.details?.length ? (
              <ul className="v3-modal__list">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}

            {item.tags?.length ? (
              <div aria-label={messages.projectTechnologies(item.title)} className="v3-modal__tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}

            {item.links?.length ? (
              <div className="v3-modal__links">
                {item.links.map((link) => (
                  <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function ExhibitMark({ kind }) {
  const glyphs = {
    "route-map": "↗",
    "trading-board": "≈",
    "signal-stack": "⌁",
    laurel: "✦",
    "code-grid": "⌘",
    "alpine-window": "△",
    chalkboard: "∑",
    "order-book": "▤",
    "probability-table": "◫",
    "market-ticker": "⌁",
  };

  return <div aria-hidden="true" className="v3-exhibit-mark">{glyphs[kind] ?? "•"}</div>;
}

function ProjectPreview({ kind, messages }) {
  return (
    <div aria-hidden="true" className={`v3-project-preview v3-project-preview--${kind}`}>
      <div className="v3-project-preview__bar">
        <span />
        <span />
        <span />
      </div>
      <div className="v3-project-preview__screen">
        <div className="v3-project-preview__side" />
        <div className="v3-project-preview__content">
          {messages.preview[kind].map((label, index) => (
            <div className={`v3-project-preview__row row-${index + 1}`} key={label}>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterNav({ activeSection, messages, onNavigate, sections: localizedSections }) {
  const activeIndex = SECTION_ORDER.indexOf(activeSection);
  const previous = SECTION_ORDER[(activeIndex + SECTION_ORDER.length - 1) % SECTION_ORDER.length];
  const next = SECTION_ORDER[(activeIndex + 1) % SECTION_ORDER.length];
  const entries = [previous, activeSection, next];
  const localizedById = Object.fromEntries(localizedSections.map((section) => [section.id, section]));

  return (
    <nav aria-label={messages.portfolioSections} className="v3-footer-nav">
      <div className="v3-footer-nav__track">
        {entries.map((id, index) => {
          const section = localizedById[id];
          const isActive = id === activeSection;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "is-active" : ""}
              key={id}
              onClick={() => {
                if (!isActive) onNavigate(id, index === 0 ? -1 : 1);
              }}
              type="button"
            >
              {section.label}
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ControlsHint({ messages }) {
  return (
    <aside aria-label={messages.movementControls} className="v3-controls-hint">
      <span className="v3-control-pair"><kbd>A</kbd><kbd>D</kbd></span>
      <i aria-hidden="true" />
      <span className="v3-control-pair"><kbd>←</kbd><kbd>→</kbd></span>
      <em>{messages.or}</em>
      <span aria-hidden="true" className="v3-mouse-mark"><b /></span>
    </aside>
  );
}

function CelestialSticker({ activeTheme, messages, onToggleTheme, reducedMotion }) {
  const previousThemeRef = useRef(activeTheme);
  const sequenceRef = useRef(0);
  const [transition, setTransition] = useState({
    from: null,
    key: 0,
    to: activeTheme,
  });

  useEffect(() => {
    const previousTheme = previousThemeRef.current;
    if (previousTheme === activeTheme) return undefined;

    previousThemeRef.current = activeTheme;
    sequenceRef.current += 1;

    if (reducedMotion) {
      setTransition({ from: null, key: sequenceRef.current, to: activeTheme });
      return undefined;
    }

    const nextTransition = {
      from: previousTheme,
      key: sequenceRef.current,
      to: activeTheme,
    };
    setTransition(nextTransition);

    const timer = window.setTimeout(() => {
      setTransition((current) => (
        current.key === nextTransition.key
          ? { ...current, from: null }
          : current
      ));
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [activeTheme, reducedMotion]);

  const roleFor = (theme) => {
    if (transition.from === theme) return "is-lifting";
    if (transition.to === theme && transition.from) return "is-dropping";
    if (transition.to === theme) return "is-current";
    return "is-stowed";
  };

  return (
    <button
      aria-label={activeTheme === "day" ? messages.switchToDark : messages.switchToLight}
      className="v3-celestial-pulley"
      data-active={activeTheme}
      data-block-game-touch
      data-transition={transition.from ? `${transition.from}-to-${transition.to}` : "settled"}
      onClick={onToggleTheme}
      type="button"
    >
      <span className="v3-celestial-pulley__bar"><i /><b /></span>

      <div
        className={`v3-celestial-puppet v3-celestial-puppet--sun ${roleFor("day")}`}
        key={`sun-${transition.key}-${roleFor("day")}`}
      >
        <svg viewBox="0 0 104 142" role="presentation">
          <path className="v3-celestial-string" d="M35 0 C35 14 37 28 39 45 M69 0 C69 14 67 29 65 45" />
          <path className="v3-celestial-knot" d="M35 5 l-5 5 m39-5 l5 5" />
          <g className="v3-celestial-sticker" transform="translate(0 39)">
            <path className="v3-sun-ray" d="M52 2 l0 13 M52 89 l0 13 M8 52 l13 0 M83 52 l13 0 M20 20 l9 9 M75 75 l9 9 M84 20 l-9 9 M29 75 l-9 9" />
            <path className="v3-sun-body" d="M52 17 C71 16 86 31 87 51 C88 70 72 86 52 87 C32 87 17 72 17 52 C17 32 32 18 52 17 Z" />
            <path className="v3-celestial-face" d="M39 49 q4-5 8 0 M59 49 q4-5 8 0 M43 64 q9 8 18 0" />
          </g>
        </svg>
      </div>

      <div
        className={`v3-celestial-puppet v3-celestial-puppet--moon ${roleFor("night")}`}
        key={`moon-${transition.key}-${roleFor("night")}`}
      >
        <svg viewBox="0 0 104 142" role="presentation">
          <path className="v3-celestial-string" d="M34 0 C35 15 38 29 40 46 M70 0 C69 15 67 29 64 46" />
          <path className="v3-celestial-knot" d="M34 5 l-5 5 m41-5 l5 5" />
          <g className="v3-celestial-sticker" transform="translate(0 38)">
            <path className="v3-moon-body" d="M72 18 C58 22 49 36 50 51 C51 68 62 79 77 83 C70 87 62 89 54 88 C34 86 19 70 19 50 C20 29 36 14 56 14 C62 14 68 15 72 18 Z" />
            <path className="v3-moon-detail" d="M36 44 q4-5 8 0 M40 60 q7 6 13 0" />
            <path className="v3-moon-star" d="M75 28 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z M82 58 l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
          </g>
        </svg>
      </div>

      <span aria-hidden="true" className="v3-theme-tooltip">{messages.themeTooltip}</span>
    </button>
  );
}

function LanguageSwitcher({ locale, messages, onLocaleChange }) {
  return (
    <div
      aria-label={messages.language}
      className="v3-language-switcher"
      data-block-game-touch
      role="group"
    >
      <button
        aria-label={messages.useEnglish}
        aria-pressed={locale === "en"}
        className={locale === "en" ? "is-active" : ""}
        lang="en"
        onClick={() => onLocaleChange("en")}
        type="button"
      >
        EN
      </button>
      <button
        aria-label={messages.useChinese}
        aria-pressed={locale === "zh"}
        className={locale === "zh" ? "is-active" : ""}
        lang="zh-CN"
        onClick={() => onLocaleChange("zh")}
        type="button"
      >
        中文
      </button>
    </div>
  );
}

function FallbackPortfolio({
  activeSection,
  activeTheme,
  content,
  messages,
  onNavigate,
  onOpenAward,
  onOpenExperience,
  onOpenProject,
  onOpenUnavailableLink,
}) {
  const { awards, experiences, profile, projects, sections: localizedSections } = content;

  useEffect(() => {
    document.getElementById(activeSection)?.scrollIntoView({ block: "start" });
  }, [activeSection]);

  return (
    <main className="v3-fallback" data-phase={activeTheme}>
      <header id="home">
        <p>DAY &amp; NIGHT / V3</p>
        <h1>{profile.name}</h1>
        <p>{profile.headline}</p>
      </header>

      <FooterNav
        activeSection={activeSection}
        messages={messages}
        onNavigate={onNavigate}
        sections={localizedSections}
      />

      <section aria-labelledby="v3-fallback-home-title">
        <h2 id="v3-fallback-home-title">{messages.home}</h2>
        <p>{profile.introduction}</p>
        <p>{profile.education.map((education) => `${education.institution} — ${education.program}`).join(" · ")}</p>
        <div className="v3-fallback__links">
          {profile.links.map((link) => (
            link.href ? (
              <a href={link.href} key={link.id} rel={link.external ? "noreferrer" : undefined} target={link.external ? "_blank" : undefined}>{link.label}</a>
            ) : (
              <button aria-haspopup="dialog" key={link.id} onClick={() => onOpenUnavailableLink(link)} type="button">{link.label}</button>
            )
          ))}
        </div>
      </section>

      <section aria-labelledby="v3-fallback-experience-title" id="experience">
        <h2 id="v3-fallback-experience-title">{messages.experience}</h2>
        {experiences.map((experience) => <button key={experience.id} onClick={() => onOpenExperience(experience)} type="button">{experience.title}</button>)}
      </section>
      <section aria-labelledby="v3-fallback-projects-title" id="projects">
        <h2 id="v3-fallback-projects-title">{messages.projects}</h2>
        {projects.map((project) => <button key={project.id} onClick={() => onOpenProject(project)} type="button">{project.title}</button>)}
      </section>
      <section aria-labelledby="v3-fallback-awards-title" id="awards">
        <h2 id="v3-fallback-awards-title">{messages.awards}</h2>
        {awards.map((award) => <button key={award.id} onClick={() => onOpenAward(award)} type="button">{award.placement} · {award.title}</button>)}
      </section>
    </main>
  );
}

export default function DayNightPortfolio() {
  const [initialSection] = useState(getSectionFromHash);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [activeTheme, setActiveTheme] = useState(getSystemTheme);
  const [locale, setLocale] = useState(detectSystemLocale);
  const [navigationRequest, setNavigationRequest] = useState(null);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedUnavailableLink, setSelectedUnavailableLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [webglSupported, setWebglSupported] = useState(canUseWebGL);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showTouchHint, setShowTouchHint] = useState(shouldShowTouchHint);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const modalOpenerRef = useRef(null);
  const navigationNonceRef = useRef(0);

  const palette = palettes[activeTheme];
  const localizedContent = useMemo(() => getLocalizedContent(locale), [locale]);
  const messages = getMessages(locale);
  const modal = useMemo(() => (
    selectedProject
      ? { item: selectedProject, type: "project" }
      : selectedAward
        ? { item: selectedAward, type: "award" }
        : selectedExperience
          ? { item: selectedExperience, type: "experience" }
          : selectedUnavailableLink
            ? { item: selectedUnavailableLink, type: "notice" }
            : null
  ), [selectedAward, selectedExperience, selectedProject, selectedUnavailableLink]);

  const closeModal = useCallback(() => {
    const opener = modalOpenerRef.current;
    setSelectedAward(null);
    setSelectedProject(null);
    setSelectedExperience(null);
    setSelectedUnavailableLink(null);

    window.setTimeout(() => {
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
      modalOpenerRef.current = null;
    }, 0);
  }, []);

  const rememberOpener = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      modalOpenerRef.current = document.activeElement;
    }
  }, []);

  const openAward = useCallback((award) => {
    rememberOpener();
    setSelectedAward(award);
  }, [rememberOpener]);

  const openProject = useCallback((project) => {
    rememberOpener();
    setSelectedProject(project);
  }, [rememberOpener]);

  const openExperience = useCallback((experience) => {
    rememberOpener();
    setSelectedExperience(experience);
  }, [rememberOpener]);

  const openUnavailableLink = useCallback((link) => {
    rememberOpener();
    setSelectedUnavailableLink(link);
  }, [rememberOpener]);

  const fallback = !webglSupported;

  const toggleTheme = useCallback(() => {
    setActiveTheme((current) => current === "day" ? "night" : "day");
  }, []);

  const commitSection = useCallback((sectionId, shouldUpdateHash = true) => {
    if (!SECTION_BY_ID[sectionId]) return;
    setActiveSection(sectionId);
    if (shouldUpdateHash) updateHash(sectionId);
  }, []);

  const requestNavigation = useCallback((sectionId, direction = 0) => {
    if (!SECTION_BY_ID[sectionId]) return;
    if (fallback) {
      commitSection(sectionId);
      return;
    }
    navigationNonceRef.current += 1;
    setNavigationRequest({
      direction,
      nonce: navigationNonceRef.current,
      sectionId,
    });
  }, [commitSection, fallback]);

  useEffect(() => {
    document.documentElement.classList.add("v3-document");
    document.body.classList.add("v3-page");

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(Boolean(motionQuery?.matches));
    syncMotionPreference();
    motionQuery?.addEventListener?.("change", syncMotionPreference);

    const onHashChange = () => {
      const sectionId = getSectionFromHash();
      if (fallback) commitSection(sectionId, false);
      else requestNavigation(sectionId);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.documentElement.classList.remove("v3-document");
      document.body.classList.remove("v3-page");
      motionQuery?.removeEventListener?.("change", syncMotionPreference);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [commitSection, fallback, requestNavigation]);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), reducedMotion ? 0 : 750);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!showTouchHint) return undefined;

    const timer = window.setTimeout(() => {
      setShowTouchHint(false);
      try {
        window.localStorage.setItem("v3-touch-hint-seen", "yes");
      } catch {
        // The hint is still harmless when storage is unavailable.
      }
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [showTouchHint]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && modal) {
        closeModal();
        return;
      }

      if (modal) {
        if (event.key !== "Tab") return;
        const dialog = dialogRef.current;
        const focusable = dialog?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const focusIsOutside = !dialog.contains(document.activeElement);
        if (focusIsOutside || (event.shiftKey && document.activeElement === first)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal, modal]);

  useEffect(() => {
    if (!modal) return undefined;
    const timer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [modal]);

  const shellStyle = useMemo(() => ({
    "--v3-background": palette.background,
    "--v3-ink": palette.ink,
    "--v3-muted": palette.muted,
    "--v3-surface": palette.surface,
    "--v3-line": palette.line,
  }), [palette]);

  return (
    <div
      className="v3-portfolio"
      data-active-section={activeSection}
      data-locale={locale}
      data-phase={activeTheme}
      style={shellStyle}
    >
      <div
        aria-hidden={modal ? "true" : undefined}
        className="v3-scene-layer"
        inert={Boolean(modal)}
      >
        <CelestialSticker
          activeTheme={activeTheme}
          messages={messages}
          onToggleTheme={toggleTheme}
          reducedMotion={reducedMotion}
        />
        <LanguageSwitcher locale={locale} messages={messages} onLocaleChange={setLocale} />

        {fallback ? (
          <FallbackPortfolio
            activeSection={activeSection}
            activeTheme={activeTheme}
            content={localizedContent}
            messages={messages}
            onNavigate={requestNavigation}
            onOpenAward={openAward}
            onOpenExperience={openExperience}
            onOpenProject={openProject}
            onOpenUnavailableLink={openUnavailableLink}
          />
        ) : (
          <WorldErrorBoundary onError={() => setWebglSupported(false)}>
            <WorldScene
              activeSection={activeSection}
              activeTheme={activeTheme}
              blocked={Boolean(modal)}
              initialSection={initialSection}
              locale={locale}
              navigationRequest={navigationRequest}
              onOpenAward={openAward}
              onOpenExperience={openExperience}
              onOpenProject={openProject}
              onOpenUnavailableLink={openUnavailableLink}
              onSectionChange={commitSection}
              reducedMotion={reducedMotion}
            />
          </WorldErrorBoundary>
        )}

        {!fallback ? (
          <>
            {activeSection === "home" ? <ControlsHint messages={messages} /> : null}
            {showTouchHint ? <p className="v3-touch-hint">{messages.touchHint}</p> : null}
            <FooterNav
              activeSection={activeSection}
              messages={messages}
              onNavigate={requestNavigation}
              sections={localizedContent.sections}
            />
          </>
        ) : null}

        {isLoading && !fallback ? (
          <div aria-live="polite" className="v3-loading-screen">
            <div aria-hidden="true" className="v3-loading-dog" />
            <p>{messages.loading}<span aria-hidden="true">...</span></p>
          </div>
        ) : null}
      </div>

      {modal ? (
        <Modal
          closeButtonRef={closeButtonRef}
          dialogRef={dialogRef}
          item={modal.item}
          messages={messages}
          onClose={closeModal}
          type={modal.type}
        />
      ) : null}
    </div>
  );
}
