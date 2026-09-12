import { useMemo, useRef } from "react";
import { Edges, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { awards, experiences, profile, projects } from "./content";
import {
  EXHIBIT_LAYOUT,
  TILE_WIDTH,
  TRACK_LENGTH,
  resolveSlotPosition,
} from "./worldLayout";

const DAY = {
  ink: "#181817",
  line: "#343432",
  muted: "#77736c",
  paper: "#fdfdfc",
  button: "#f5f5f3",
  border: "#1a1a1a",
  chip: "#e8e8e5",
  stone: "#aaa69e",
  stoneDark: "#77736d",
  cat: "#111111",
  eye: "#fbfbf8",
};

const NIGHT = {
  ink: "#eeeeea",
  line: "#c8c8c2",
  muted: "#aaa9a4",
  paper: "#1a1a19",
  button: "#333332",
  border: "#888884",
  chip: "#333332",
  stone: "#b9b9b3",
  stoneDark: "#777773",
  cat: "#f2f2ee",
  eye: "#151515",
};

const GROUND_TILE_COUNT = TRACK_LENGTH / TILE_WIDTH;
const GROUND_TILE_POSITIONS = Array.from(
  { length: GROUND_TILE_COUNT },
  (_, index) => index * TILE_WIDTH + TILE_WIDTH / 2,
);

const damping = (rate, delta) => 1 - Math.exp(-rate * Math.min(delta, 0.1));

function paletteColour(activeNight, kind) {
  return (activeNight ? NIGHT : DAY)[kind] ?? (activeNight ? NIGHT.ink : DAY.ink);
}

function ThemeToonMaterial({ activeNight, kind = "stone", ...props }) {
  const materialRef = useRef(null);
  const dayColour = useMemo(() => new THREE.Color(DAY[kind] ?? DAY.stone), [kind]);
  const nightColour = useMemo(() => new THREE.Color(NIGHT[kind] ?? NIGHT.stone), [kind]);

  useFrame((_, delta) => {
    materialRef.current?.color.lerp(activeNight ? nightColour : dayColour, damping(8, delta));
  });

  return (
    <meshToonMaterial
      color={activeNight ? nightColour : dayColour}
      polygonOffset
      polygonOffsetFactor={1}
      polygonOffsetUnits={1}
      ref={materialRef}
      {...props}
    />
  );
}

function ThemeLineMaterial({ activeNight, opacity = 0.72 }) {
  const materialRef = useRef(null);
  const dayColour = useMemo(() => new THREE.Color(DAY.line), []);
  const nightColour = useMemo(() => new THREE.Color(NIGHT.line), []);

  useFrame((_, delta) => {
    materialRef.current?.color.lerp(activeNight ? nightColour : dayColour, damping(8, delta));
  });

  return (
    <lineBasicMaterial
      color={activeNight ? nightColour : dayColour}
      depthWrite={false}
      opacity={opacity}
      ref={materialRef}
      transparent
    />
  );
}

function seededNoise(value) {
  const raw = Math.sin(value * 91.173 + 17.719) * 43758.5453;
  return raw - Math.floor(raw) - 0.5;
}

function brokenLineGeometry(from, to, seed, density = 1) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const length = start.distanceTo(end);
  const segmentCount = Math.max(8, Math.ceil(length * 3.1 * density));
  const positions = [];

  for (let index = 0; index < segmentCount; index += 1) {
    const gapNoise = seededNoise(seed * 101 + index * 7.3);
    if (gapNoise > 0.28 || index % 13 === 8) continue;

    const t0 = index / segmentCount;
    const t1 = Math.min(1, (index + 0.76 + seededNoise(seed + index) * 0.16) / segmentCount);
    const first = start.clone().lerp(end, t0);
    const second = start.clone().lerp(end, t1);
    const jitter = 0.018;

    first.x += seededNoise(seed + index * 2.1) * jitter;
    first.y += seededNoise(seed + index * 3.7) * jitter;
    first.z += seededNoise(seed + index * 5.9) * jitter;
    second.x += seededNoise(seed + index * 7.1) * jitter;
    second.y += seededNoise(seed + index * 11.3) * jitter;
    second.z += seededNoise(seed + index * 13.7) * jitter;
    positions.push(first.x, first.y, first.z, second.x, second.y, second.z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function BrokenLine({ activeNight, density, from, opacity, seed, to }) {
  const geometry = useMemo(
    () => brokenLineGeometry(from, to, seed, density),
    [density, from, seed, to],
  );

  return (
    <lineSegments geometry={geometry} renderOrder={2}>
      <ThemeLineMaterial activeNight={activeNight} opacity={opacity} />
    </lineSegments>
  );
}

function CircularSlot({ baseX, children, playerRef }) {
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current || !playerRef.current) return;
    groupRef.current.position.x = resolveSlotPosition(
      groupRef.current.position.x,
      playerRef.current.position.x,
    );
  });

  return (
    <group position={[baseX, 0, 0]} ref={groupRef}>
      {children}
    </group>
  );
}

function Outline({ activeNight, threshold = 24 }) {
  return (
    <Edges
      color={paletteColour(activeNight, "ink")}
      lineWidth={1}
      threshold={threshold}
    />
  );
}

function OutlinedBox({
  activeNight,
  castShadow = true,
  kind = "stone",
  position,
  rotation,
  scale,
}) {
  return (
    <mesh castShadow={castShadow} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <ThemeToonMaterial activeNight={activeNight} kind={kind} roughness={1} />
      <Outline activeNight={activeNight} />
    </mesh>
  );
}

function OutlinedCylinder({
  activeNight,
  kind = "stone",
  position,
  rotation,
  scale,
  sides = 7,
}) {
  return (
    <mesh castShadow position={position} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[0.5, 0.5, 1, sides]} />
      <ThemeToonMaterial activeNight={activeNight} kind={kind} roughness={1} />
      <Outline activeNight={activeNight} threshold={18} />
    </mesh>
  );
}

function WorldHtml({ activeNight, children, className, distanceFactor = 10, position }) {
  const contentRef = useRef(null);
  const visibilityRef = useRef(null);
  const visibilityClockRef = useRef(0);

  useFrame((state, delta) => {
    visibilityClockRef.current += delta;
    if (visibilityClockRef.current < 0.1) return;
    visibilityClockRef.current = 0;

    const content = contentRef.current;
    if (!content) return;
    const rect = content.getBoundingClientRect();
    const visible = (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.right >= 0 &&
      rect.left <= state.size.width &&
      rect.bottom >= 7 &&
      rect.top <= state.size.height - 58
    );
    if (visible === visibilityRef.current) return;

    visibilityRef.current = visible;
    content.inert = !visible;
    if (visible) content.removeAttribute("aria-hidden");
    else content.setAttribute("aria-hidden", "true");
  });

  return (
    <Html
      center
      distanceFactor={distanceFactor}
      position={position}
      transform
      zIndexRange={[0, 0]}
    >
      <div
        className={`v3-world-html ${activeNight ? "is-night" : "is-day"} ${className ?? ""}`}
        ref={contentRef}
        style={{
          "--v3-world-ink": paletteColour(activeNight, "ink"),
          "--v3-world-muted": paletteColour(activeNight, "muted"),
          "--v3-world-paper": paletteColour(activeNight, "paper"),
          "--v3-world-button": paletteColour(activeNight, "button"),
          "--v3-world-border": paletteColour(activeNight, "border"),
          "--v3-world-chip": paletteColour(activeNight, "chip"),
        }}
      >
        {children}
      </div>
    </Html>
  );
}

function GalleryTile({ activeNight, baseX, index, playerRef }) {
  const backLineStart = useMemo(() => [-TILE_WIDTH / 2, 0.025, -7], []);
  const backLineEnd = useMemo(() => [TILE_WIDTH / 2, 0.025, -7], []);
  const wallLineStart = useMemo(() => [-TILE_WIDTH / 2, 0, -6.99], []);
  const wallLineEnd = useMemo(() => [-TILE_WIDTH / 2, 10.8, -6.99], []);
  const floorLineStart = useMemo(() => [-TILE_WIDTH / 2, 0.02, -7], []);
  const floorLineEnd = useMemo(() => [-TILE_WIDTH / 2, 0.02, 7], []);

  return (
    <CircularSlot baseX={baseX} playerRef={playerRef}>
      <BrokenLine
        activeNight={activeNight}
        from={backLineStart}
        opacity={0.58}
        seed={index * 13 + 1}
        to={backLineEnd}
      />
      <BrokenLine
        activeNight={activeNight}
        density={0.64}
        from={wallLineStart}
        opacity={0.58}
        seed={index * 13 + 3}
        to={wallLineEnd}
      />
      <BrokenLine
        activeNight={activeNight}
        density={0.72}
        from={floorLineStart}
        opacity={0.5}
        seed={index * 13 + 7}
        to={floorLineEnd}
      />
    </CircularSlot>
  );
}

function HeroExhibit({ activeNight, playerRef }) {
  const { size } = useThree();
  const isNarrow = size.width <= 680;

  return (
    <CircularSlot baseX={EXHIBIT_LAYOUT.home.title} playerRef={playerRef}>
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-hero"
        distanceFactor={11}
        position={[isNarrow ? 0 : -5.1, isNarrow ? 5.9 : 6.25, -6.72]}
      >
        <p className="v3-world-hero-kicker">Hi, 我是</p>
        <h1>{profile.name}</h1>
        <p className="v3-world-hero-headline">{profile.headline}</p>
        <p className="v3-world-hero-intro">{profile.introduction}</p>
      </WorldHtml>
    </CircularSlot>
  );
}

function EducationExhibit({ activeNight, playerRef }) {
  return (
    <CircularSlot baseX={EXHIBIT_LAYOUT.home.education} playerRef={playerRef}>
      <OutlinedBox
        activeNight={activeNight}
        castShadow={false}
        kind="paper"
        position={[0, 5.05, -6.78]}
        scale={[7.8, 5.7, 0.12]}
      />
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-education"
        distanceFactor={10}
        position={[0, 5.05, -6.6]}
      >
        <p className="v3-world-eyebrow">Education</p>
        {profile.education.map((item) => (
          <section key={item.institution}>
            <h2>{item.institution}</h2>
            <p>{item.program}</p>
            <p className="v3-world-meta">{item.period} · {item.detail}</p>
          </section>
        ))}
      </WorldHtml>
    </CircularSlot>
  );
}

function ContactExhibit({ activeNight, playerRef }) {
  return (
    <CircularSlot baseX={EXHIBIT_LAYOUT.home.contact} playerRef={playerRef}>
      <OutlinedBox
        activeNight={activeNight}
        kind="stoneDark"
        position={[0, 2.65, -4.4]}
        scale={[7.6, 0.22, 0.3]}
      />
      <OutlinedCylinder
        activeNight={activeNight}
        kind="stoneDark"
        position={[-3.4, 1.35, -4.4]}
        scale={[0.22, 2.7, 0.22]}
      />
      <OutlinedCylinder
        activeNight={activeNight}
        kind="stoneDark"
        position={[3.4, 1.35, -4.4]}
        scale={[0.22, 2.7, 0.22]}
      />
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-contact"
        distanceFactor={9}
        position={[0, 4.55, -6.2]}
      >
        <p className="v3-world-eyebrow">Find me online</p>
        <h2>Let&apos;s make something thoughtful.</h2>
        <nav aria-label="Zhuolin Li contact links">
          {profile.links.map((link) => (
            <a
              href={link.href}
              key={link.id}
              rel={link.external ? "noreferrer" : undefined}
              target={link.external ? "_blank" : undefined}
            >
              <span className="v3-world-control-label">{link.label} <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </nav>
      </WorldHtml>
    </CircularSlot>
  );
}

function DirectionSign({ activeNight, baseX, label, playerRef }) {
  return (
    <CircularSlot baseX={baseX} playerRef={playerRef}>
      <OutlinedCylinder
        activeNight={activeNight}
        kind="stoneDark"
        position={[0, 0.95, -2.8]}
        scale={[0.16, 1.9, 0.16]}
      />
      <OutlinedBox
        activeNight={activeNight}
        kind="stone"
        position={[0, 2.05, -2.8]}
        rotation={[0, 0, -0.015]}
        scale={[3.5, 1.05, 0.18]}
      />
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-sign"
        distanceFactor={8}
        position={[0, 2.08, -2.6]}
      >
        <span>{label} →</span>
      </WorldHtml>
    </CircularSlot>
  );
}

function AwardSculpture({ activeNight, index }) {
  const shape = index % 3;

  if (shape === 0) {
    return (
      <mesh castShadow position={[0, 2.35, -2.35]} rotation={[0.2, index * 0.61, 0.1]}>
        <icosahedronGeometry args={[0.58, 0]} />
        <ThemeToonMaterial activeNight={activeNight} kind="stone" roughness={0.8} />
        <Outline activeNight={activeNight} />
      </mesh>
    );
  }

  if (shape === 1) {
    return (
      <mesh castShadow position={[0, 2.38, -2.35]} rotation={[Math.PI / 2, 0, index * 0.28]}>
        <torusGeometry args={[0.48, 0.12, 7, 14]} />
        <ThemeToonMaterial activeNight={activeNight} kind="stone" roughness={0.8} />
        <Outline activeNight={activeNight} />
      </mesh>
    );
  }

  return (
    <mesh castShadow position={[0, 2.32, -2.35]} rotation={[0.12, index * 0.45, 0]}>
      <octahedronGeometry args={[0.62, 0]} />
      <ThemeToonMaterial activeNight={activeNight} kind="stone" roughness={0.8} />
      <Outline activeNight={activeNight} />
    </mesh>
  );
}

function AwardExhibit({ activeNight, award, baseX, index, onOpen, playerRef }) {
  const open = () => onOpen?.(award);

  return (
    <CircularSlot baseX={baseX} playerRef={playerRef}>
      <group
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
      >
        <OutlinedBox
          activeNight={activeNight}
          kind="stone"
          position={[0, 0.18, -2.35]}
          scale={[1.75, 0.35, 1.35]}
        />
        <OutlinedCylinder
          activeNight={activeNight}
          kind="stone"
          position={[0, 0.92, -2.35]}
          scale={[1.16, 1.48, 1.06]}
          sides={6 + (index % 3)}
        />
        <OutlinedBox
          activeNight={activeNight}
          kind="stone"
          position={[0, 1.72, -2.35]}
          scale={[1.55, 0.18, 1.2]}
        />
        <AwardSculpture activeNight={activeNight} index={index} />
      </group>
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-award-label"
        distanceFactor={8.5}
        position={[0, 3.55 + (index % 2) * 0.2, -3.25]}
      >
        <button aria-label={`Open ${award.title} details`} onClick={open} type="button">
          <strong>{award.title}</strong>
          <span>{award.placement}{award.date ? ` · ${award.date}` : ""}</span>
        </button>
      </WorldHtml>
    </CircularSlot>
  );
}

function ProjectDiagram({ art }) {
  if (art === "uslike") {
    return (
      <div className="v3-world-project-art v3-world-project-art--uslike">
        <img
          alt="Monochrome Uslike landing-page composition with matching cards and conversation prompts"
          src="/assets/v3/uslike-interface.svg"
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={`v3-world-project-art v3-world-project-art--${art}`}>
      <span className="v3-world-art-node v3-world-art-node--a" />
      <span className="v3-world-art-node v3-world-art-node--b" />
      <span className="v3-world-art-node v3-world-art-node--c" />
      <span className="v3-world-art-line v3-world-art-line--a" />
      <span className="v3-world-art-line v3-world-art-line--b" />
    </div>
  );
}

function ProjectExhibit({ activeNight, baseX, onOpen, playerRef, project }) {
  const open = () => onOpen?.(project);

  return (
    <CircularSlot baseX={baseX} playerRef={playerRef}>
      <group
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
      >
        <OutlinedBox
          activeNight={activeNight}
          castShadow={false}
          kind="stoneDark"
          position={[0, 5.25, -6.72]}
          scale={[13.2, 6.35, 0.2]}
        />
        <OutlinedBox
          activeNight={activeNight}
          castShadow={false}
          kind="paper"
          position={[0, 5.25, -6.55]}
          scale={[12.55, 5.72, 0.12]}
        />
      </group>
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-project"
        distanceFactor={10.5}
        position={[0, 5.25, -6.35]}
      >
        <div className="v3-world-project-copy">
          <p className="v3-world-eyebrow">{project.eyebrow}</p>
          <h2>{project.title}</h2>
          <p>{project.summary}</p>
          <ul aria-label={`${project.title} technologies`}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="v3-world-project-actions">
            <button onClick={open} type="button"><span className="v3-world-control-label">Explore project</span></button>
            {project.links.map((link) => (
              <a
                href={link.href}
                key={`${project.id}-${link.href}`}
                rel="noreferrer"
                target="_blank"
              >
                <span className="v3-world-control-label">{link.label} <span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
        </div>
        <ProjectDiagram art={project.art} />
      </WorldHtml>
    </CircularSlot>
  );
}

function ExperienceGlyph({ activeNight, index }) {
  if (index % 2 === 0) {
    return (
      <mesh castShadow position={[0, 2.2, -3.25]} rotation={[0.4, index * 0.8, 0.25]}>
        <octahedronGeometry args={[0.55, 0]} />
        <ThemeToonMaterial activeNight={activeNight} kind="stone" roughness={0.9} />
        <Outline activeNight={activeNight} />
      </mesh>
    );
  }

  return (
    <mesh castShadow position={[0, 2.2, -3.25]} rotation={[Math.PI / 2, 0, index * 0.31]}>
      <torusKnotGeometry args={[0.38, 0.1, 32, 5]} />
      <ThemeToonMaterial activeNight={activeNight} kind="stone" roughness={0.9} />
      <Outline activeNight={activeNight} />
    </mesh>
  );
}

function ExperienceExhibit({ activeNight, baseX, experience, index, onOpen, playerRef }) {
  const open = () => onOpen?.(experience);

  return (
    <CircularSlot baseX={baseX} playerRef={playerRef}>
      <OutlinedCylinder
        activeNight={activeNight}
        kind="stoneDark"
        position={[0, 0.95, -3.25]}
        scale={[0.16, 1.9, 0.16]}
      />
      <ExperienceGlyph activeNight={activeNight} index={index} />
      <OutlinedBox
        activeNight={activeNight}
        castShadow={false}
        kind="paper"
        position={[0, 6.1, -6.78]}
        scale={[10.4, 5.45, 0.12]}
      />
      <WorldHtml
        activeNight={activeNight}
        className="v3-world-experience"
        distanceFactor={10}
        position={[0, 6.1, -6.6]}
      >
        <button aria-label={`Open ${experience.title} details`} onClick={open} type="button">
          <span className="v3-world-eyebrow">{experience.date ?? "Experience"}</span>
          <strong>{experience.title}</strong>
          <span>{experience.organization}</span>
          <span className="v3-world-meta">{experience.location}</span>
          <span>{experience.summary}</span>
          <span className="v3-world-open-label">View details →</span>
        </button>
      </WorldHtml>
    </CircularSlot>
  );
}

function CatPart({
  activeNight,
  args,
  kind = "cat",
  name,
  position,
  rotation,
  scale,
  shape = "sphere",
}) {
  return (
    <mesh castShadow name={name} position={position} rotation={rotation} scale={scale}>
      {shape === "sphere" ? <sphereGeometry args={args ?? [1, 9, 6]} /> : null}
      {shape === "cone" ? <coneGeometry args={args ?? [0.2, 0.5, 4]} /> : null}
      {shape === "cylinder" ? <cylinderGeometry args={args ?? [0.14, 0.16, 0.6, 6]} /> : null}
      <ThemeToonMaterial activeNight={activeNight} kind={kind} roughness={0.94} />
      <Outline activeNight={activeNight} threshold={16} />
    </mesh>
  );
}

function GeometryCat({ activeNight, motionRef, reducedMotion }) {
  const visualRef = useRef(null);
  const bodyRef = useRef(null);
  const tailRef = useRef(null);
  const legRefs = useRef([]);
  const lastDirectionRef = useRef(1);

  useFrame(({ clock }) => {
    const motion = motionRef.current ?? {};
    const moving = !reducedMotion && Boolean(motion.moving) && Math.abs(motion.speed ?? 0) > 0.02;
    if (motion.direction) lastDirectionRef.current = Math.sign(motion.direction);

    if (visualRef.current) visualRef.current.scale.x = lastDirectionRef.current * 0.72;

    const pace = Math.min(15, 8 + Math.abs(motion.speed ?? 0) * 0.42);
    const stride = moving ? Math.sin(clock.elapsedTime * pace) * 0.5 : 0;
    if (bodyRef.current) {
      bodyRef.current.position.y = moving
        ? Math.abs(Math.sin(clock.elapsedTime * pace)) * 0.045
        : 0;
    }
    legRefs.current.forEach((leg, index) => {
      if (leg) leg.rotation.z = index % 2 === 0 ? stride : -stride;
    });
    if (tailRef.current) {
      tailRef.current.rotation.z = -0.65 + (moving ? Math.sin(clock.elapsedTime * pace * 0.62) * 0.16 : 0);
    }
  });

  return (
    <group position={[0, 0.03, 0]} ref={visualRef} scale={[0.72, 0.72, 0.72]}>
      <group ref={bodyRef}>
        <CatPart activeNight={activeNight} name="v3-cat-body" position={[-0.06, 0.82, 0]} scale={[1.02, 0.55, 0.48]} />
        <CatPart activeNight={activeNight} position={[0.62, 1.25, 0]} scale={[0.52, 0.5, 0.45]} />
        <CatPart activeNight={activeNight} position={[0.96, 1.17, 0]} scale={[0.27, 0.2, 0.25]} />
        <CatPart
          activeNight={activeNight}
          args={[0.19, 0.44, 4]}
          position={[0.39, 1.72, -0.14]}
          rotation={[0, 0, -0.12]}
          shape="cone"
        />
        <CatPart
          activeNight={activeNight}
          args={[0.19, 0.44, 4]}
          position={[0.78, 1.72, -0.14]}
          rotation={[0, 0, 0.14]}
          shape="cone"
        />
        <CatPart
          activeNight={activeNight}
          args={[0.12, 7, 5]}
          kind="eye"
          position={[0.78, 1.36, 0.4]}
          scale={[1, 1, 0.38]}
        />
        <CatPart
          activeNight={activeNight}
          args={[0.052, 7, 5]}
          kind="cat"
          position={[0.81, 1.36, 0.45]}
          scale={[1, 1, 0.35]}
        />
      </group>
      {[
        [-0.48, -0.23],
        [0.38, -0.23],
        [-0.48, 0.23],
        [0.38, 0.23],
      ].map(([x, z], index) => (
        <group
          key={`${x}-${z}`}
          position={[x, 0.49, z]}
          ref={(node) => { legRefs.current[index] = node; }}
        >
          <CatPart
            activeNight={activeNight}
            args={[0.1, 0.13, 0.52, 6]}
            position={[0, -0.25, 0]}
            shape="cylinder"
          />
          <CatPart activeNight={activeNight} position={[0.08, -0.51, 0]} scale={[0.2, 0.1, 0.16]} />
        </group>
      ))}
      <group position={[-0.86, 1.02, 0]} ref={tailRef} rotation={[0, 0, -0.65]}>
        <CatPart
          activeNight={activeNight}
          args={[0.12, 0.15, 0.72, 6]}
          position={[-0.08, 0.35, 0]}
          rotation={[0, 0, 0.18]}
          shape="cylinder"
        />
        <CatPart
          activeNight={activeNight}
          args={[0.1, 0.12, 0.55, 6]}
          position={[-0.23, 0.82, 0]}
          rotation={[0, 0, 0.43]}
          shape="cylinder"
        />
      </group>
    </group>
  );
}

export function PlayerCat({ activeNight, motionRef, playerRef, reducedMotion }) {
  return (
    <group position={[0, 0, 0]} ref={playerRef}>
      <GeometryCat activeNight={activeNight} motionRef={motionRef} reducedMotion={reducedMotion} />
    </group>
  );
}

export function GalleryWorld({
  activeNight,
  motionRef,
  onOpenAward,
  onOpenExperience,
  onOpenProject,
  playerRef,
  reducedMotion,
}) {
  return (
    <>
      {GROUND_TILE_POSITIONS.map((baseX, index) => (
        <GalleryTile
          activeNight={activeNight}
          baseX={baseX}
          index={index}
          key={`gallery-tile-${baseX}`}
          playerRef={playerRef}
        />
      ))}

      <HeroExhibit activeNight={activeNight} playerRef={playerRef} />
      <EducationExhibit activeNight={activeNight} playerRef={playerRef} />
      <ContactExhibit activeNight={activeNight} playerRef={playerRef} />

      <DirectionSign
        activeNight={activeNight}
        baseX={EXHIBIT_LAYOUT.awards.sign}
        label="Awards"
        playerRef={playerRef}
      />
      {awards.slice(0, EXHIBIT_LAYOUT.awards.items.length).map((award, index) => (
        <AwardExhibit
          activeNight={activeNight}
          award={award}
          baseX={EXHIBIT_LAYOUT.awards.items[index]}
          index={index}
          key={award.id}
          onOpen={onOpenAward}
          playerRef={playerRef}
        />
      ))}

      <DirectionSign
        activeNight={activeNight}
        baseX={EXHIBIT_LAYOUT.projects.sign}
        label="Projects"
        playerRef={playerRef}
      />
      {projects.slice(0, EXHIBIT_LAYOUT.projects.items.length).map((project, index) => (
        <ProjectExhibit
          activeNight={activeNight}
          baseX={EXHIBIT_LAYOUT.projects.items[index]}
          key={project.id}
          onOpen={onOpenProject}
          playerRef={playerRef}
          project={project}
        />
      ))}

      <DirectionSign
        activeNight={activeNight}
        baseX={EXHIBIT_LAYOUT.experience.sign}
        label="Experience"
        playerRef={playerRef}
      />
      {experiences.slice(0, EXHIBIT_LAYOUT.experience.items.length).map((experience, index) => (
        <ExperienceExhibit
          activeNight={activeNight}
          baseX={EXHIBIT_LAYOUT.experience.items[index]}
          experience={experience}
          index={index}
          key={experience.id}
          onOpen={onOpenExperience}
          playerRef={playerRef}
        />
      ))}

      <PlayerCat
        activeNight={activeNight}
        motionRef={motionRef}
        playerRef={playerRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default GalleryWorld;
