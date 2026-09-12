export const TRACK_LENGTH = 288;
export const TILE_WIDTH = 12;
export const SLOT_WRAP_BUFFER = 12;

export const MOVE_SPEED = 5;
export const MOVE_ACCELERATION = 9;
export const MOVE_MAX_SPEED = 22;
export const SCROLL_SENSITIVITY = 0.15;
export const SCROLL_FRICTION = 4;
export const SWIPE_SENSITIVITY = 0.3;
export const FLING_SENSITIVITY = 0.06;
export const TOUCH_MOMENTUM_FRICTION = 2.5;

export const AUTOPILOT_MAX_SPEED = 100;
export const AUTOPILOT_DECEL_DISTANCE = 60;
export const AUTOPILOT_MIN_SPEED = 2;
export const AUTOPILOT_WALK_DISTANCE = 3;
export const AUTOPILOT_WALK_SPEED = 4;
export const ARRIVAL_THRESHOLD = 0.3;

// Sorted by rangeStart. The final Home range wraps across the end of the track.
export const WORLD_SECTIONS = [
  { id: "experience", anchor: 42, rangeStart: 34, phase: "night" },
  { id: "projects", anchor: 72, rangeStart: 58, phase: "day" },
  { id: "awards", anchor: 144, rangeStart: 132, phase: "night" },
  { id: "home", anchor: 0, rangeStart: 258, phase: "day" },
];

// Every exhibit owns its own circular slot. Sections are navigation ranges only.
export const EXHIBIT_LAYOUT = {
  home: {
    title: 0,
    contact: 9,
    education: 21,
  },
  experience: {
    sign: 32,
    items: [33, 42, 51],
  },
  projects: {
    sign: 59,
    items: [72, 96, 120],
  },
  awards: {
    sign: 134,
    items: [144, 168, 192, 216, 240],
  },
};

export function wrapPosition(x, length = TRACK_LENGTH) {
  return ((x % length) + length) % length;
}

export function circularDelta(from, to, length = TRACK_LENGTH) {
  const raw = to - from;
  return raw - length * Math.round(raw / length);
}

export function resolveWrappedX(baseX, referenceX, length = TRACK_LENGTH) {
  const ringReference = wrapPosition(referenceX, length);
  const difference = baseX - ringReference;
  const wrappedDifference = difference - length * Math.floor((difference + length / 2) / length);
  return referenceX + wrappedDifference;
}

export function resolveSlotPosition(currentX, playerX, length = TRACK_LENGTH, buffer = SLOT_WRAP_BUFFER) {
  const distance = currentX - playerX;
  const threshold = length / 2 + buffer;
  if (distance > threshold) return currentX - length;
  if (distance < -threshold) return currentX + length;
  return currentX;
}

export function sectionAtPosition(x) {
  const wrapped = wrapPosition(x);
  let result = WORLD_SECTIONS[WORLD_SECTIONS.length - 1];
  for (const section of WORLD_SECTIONS) {
    if (section.rangeStart <= wrapped) result = section;
  }
  return result.id;
}

export function sectionAnchor(sectionId) {
  return WORLD_SECTIONS.find((section) => section.id === sectionId)?.anchor ?? 0;
}

export function applyWheelImpulse(velocity, deltaX, deltaY) {
  return velocity + (deltaX + deltaY) * SCROLL_SENSITIVITY;
}

export function acceleratedMoveSpeed(heldSeconds) {
  const duration = Math.max(0, Number.isFinite(heldSeconds) ? heldSeconds : 0);
  return Math.min(MOVE_MAX_SPEED, MOVE_SPEED + duration * MOVE_ACCELERATION);
}

export function applyFriction(velocity, deltaSeconds, friction = SCROLL_FRICTION) {
  const next = velocity * Math.exp(-friction * deltaSeconds);
  return Math.abs(next) < 0.01 ? 0 : next;
}

export function autopilotSpeed(distance) {
  if (distance <= ARRIVAL_THRESHOLD) return 0;
  if (distance < AUTOPILOT_WALK_DISTANCE) {
    const progress = (distance - ARRIVAL_THRESHOLD) / (AUTOPILOT_WALK_DISTANCE - ARRIVAL_THRESHOLD);
    const inverse = 1 - progress;
    const eased = 1 - inverse * inverse * inverse;
    return AUTOPILOT_MIN_SPEED + (AUTOPILOT_WALK_SPEED - AUTOPILOT_MIN_SPEED) * eased;
  }
  if (distance < AUTOPILOT_DECEL_DISTANCE) {
    return Math.max(AUTOPILOT_MAX_SPEED * Math.sqrt(distance / AUTOPILOT_DECEL_DISTANCE), AUTOPILOT_MIN_SPEED);
  }
  return AUTOPILOT_MAX_SPEED;
}

export function circularNavEntries(activeSection, order) {
  const activeIndex = Math.max(0, order.indexOf(activeSection));
  return [
    order[(activeIndex - 1 + order.length) % order.length],
    order[activeIndex],
    order[(activeIndex + 1) % order.length],
  ];
}

// drei Html's transform mode maps CSS pixels to world units at distanceFactor / 400.
export function htmlPixelsToWorld(pixels, distanceFactor) {
  return pixels * distanceFactor / 400;
}

export function perspectiveVisibleWidth(aspect, depth = 25, fovDegrees = 30) {
  return 2 * depth * Math.tan((fovDegrees * Math.PI / 180) / 2) * aspect;
}

export function clampCameraCenter(cameraX, playerX, visibleWidth, edgeMargin = 0.1) {
  const halfVisible = visibleWidth / 2;
  const margin = visibleWidth * edgeMargin;
  return Math.max(
    playerX - halfVisible + margin,
    Math.min(playerX + halfVisible - margin, cameraX),
  );
}
