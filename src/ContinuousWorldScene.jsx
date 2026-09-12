/* eslint-disable react-hooks/immutability -- Three Fiber animation intentionally updates scene refs. */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import GalleryWorld from "./GalleryWorld";
import {
  ARRIVAL_THRESHOLD,
  FLING_SENSITIVITY,
  MOVE_SPEED,
  SCROLL_FRICTION,
  SCROLL_SENSITIVITY,
  SWIPE_SENSITIVITY,
  TOUCH_MOMENTUM_FRICTION,
  TRACK_LENGTH,
  acceleratedMoveSpeed,
  applyFriction,
  autopilotSpeed,
  clampCameraCenter,
  circularDelta,
  perspectiveVisibleWidth,
  sectionAnchor,
  sectionAtPosition,
} from "./worldLayout";

const DAY_BACKGROUND = "#ffffff";
const NIGHT_BACKGROUND = "#111111";
const TOUCH_SWIPE_THRESHOLD = 8;
const TOUCH_HOLD_EDGE = 0.2;
const FLING_SAMPLE_WINDOW = 100;

const safeDelta = (delta) => Math.min(delta, 0.05);

function SceneAtmosphere({ activeNight }) {
  const { scene } = useThree();
  const current = useRef(new THREE.Color(activeNight ? NIGHT_BACKGROUND : DAY_BACKGROUND));
  const day = useMemo(() => new THREE.Color(DAY_BACKGROUND), []);
  const night = useMemo(() => new THREE.Color(NIGHT_BACKGROUND), []);

  useEffect(() => {
    const previousBackground = scene.background;
    const previousFog = scene.fog;
    scene.background = current.current;
    scene.fog = null;

    return () => {
      scene.background = previousBackground;
      scene.fog = previousFog;
    };
  }, [scene]);

  useFrame((_, delta) => {
    current.current.lerp(activeNight ? night : day, 1 - Math.exp(-8 * safeDelta(delta)));
  });

  return null;
}

function MovingLights({ activeNight, playerRef }) {
  const ambientRef = useRef(null);
  const directionalRef = useRef(null);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const dayLight = useMemo(() => new THREE.Color("#ffffff"), []);
  const nightLight = useMemo(() => new THREE.Color("#eeeeee"), []);

  useEffect(() => {
    const light = directionalRef.current;
    if (!light) return undefined;
    light.target = lightTarget;
    light.parent?.add(lightTarget);
    light.shadow.camera.updateProjectionMatrix();
    return () => lightTarget.removeFromParent();
  }, [lightTarget]);

  useFrame((_, delta) => {
    const player = playerRef.current;
    const light = directionalRef.current;
    const ambient = ambientRef.current;
    if (!player || !light || !ambient) return;

    const blend = 1 - Math.exp(-8 * safeDelta(delta));
    ambient.intensity += ((activeNight ? 1.45 : 1.85) - ambient.intensity) * blend;
    light.intensity += ((activeNight ? 2.2 : 2.65) - light.intensity) * blend;
    light.color.lerp(activeNight ? nightLight : dayLight, blend);

    const x = player.position.x;
    light.position.set(x + 5, 10, 5);
    lightTarget.position.set(x, 0, 0);
    lightTarget.updateMatrixWorld();
  });

  return (
    <>
      <ambientLight intensity={1.85} ref={ambientRef} />
      <directionalLight
        castShadow
        intensity={2.65}
        position={[5, 10, 5]}
        ref={directionalRef}
        shadow-bias={-0.002}
        shadow-camera-bottom={-15}
        shadow-camera-far={60}
        shadow-camera-left={-35}
        shadow-camera-near={1}
        shadow-camera-right={35}
        shadow-camera-top={25}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />
    </>
  );
}

function ShadowFloor({ activeNight, playerRef }) {
  const planeRef = useRef(null);
  const materialRef = useRef(null);

  useFrame((_, delta) => {
    if (planeRef.current && playerRef.current) planeRef.current.position.x = playerRef.current.position.x;
    if (!materialRef.current) return;
    const target = activeNight ? 0.34 : 0.18;
    materialRef.current.opacity += (target - materialRef.current.opacity) * (1 - Math.exp(-8 * safeDelta(delta)));
  });

  return (
    <mesh position={[0, 0.012, 0]} receiveShadow ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[200, 50]} />
      <shadowMaterial opacity={activeNight ? 0.34 : 0.18} ref={materialRef} transparent />
    </mesh>
  );
}

function CameraRig({ motionRef, playerRef, reducedMotion, testStateRef }) {
  const { camera, size } = useThree();
  const state = useRef({ x: 0, velocity: 0, initialized: false });

  useFrame((_, rawDelta) => {
    const player = playerRef.current;
    if (!player) return;

    const delta = safeDelta(rawDelta);
    const cameraState = state.current;
    const aspect = Math.max(0.1, size.width / Math.max(1, size.height));
    const visibleWidth = perspectiveVisibleWidth(aspect);
    const direction = motionRef.current.moving ? motionRef.current.direction : 0;
    const targetX = player.position.x + direction * visibleWidth * 0.25;

    if (!cameraState.initialized || reducedMotion) {
      cameraState.x = targetX;
      cameraState.velocity = 0;
      cameraState.initialized = true;
    } else {
      const acceleration = (targetX - cameraState.x) * 25 - cameraState.velocity * 10;
      cameraState.velocity += acceleration * delta;
      cameraState.x += cameraState.velocity * delta;
    }

    const clampedX = clampCameraCenter(cameraState.x, player.position.x, visibleWidth);
    if (clampedX !== cameraState.x) {
      cameraState.x = clampedX;
      cameraState.velocity = 0;
    }

    const lookHeight = size.height < 500 ? 3 : 4;
    camera.position.set(cameraState.x, player.position.y + 5.5, player.position.z + 25);
    // Look at the spring centre rather than the dog: the room never yaws while catching up.
    camera.lookAt(cameraState.x, player.position.y + lookHeight, player.position.z);
    testStateRef.current.cameraX = cameraState.x;
    testStateRef.current.cameraYaw = camera.rotation.y;
    testStateRef.current.visibleWidth = visibleWidth;
  });

  return null;
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

function isBlockedTouchTarget(target) {
  return target instanceof HTMLElement && Boolean(target.closest("[data-block-game-touch]"));
}

function forEachChangedTouch(event, callback) {
  for (let index = 0; index < event.changedTouches.length; index += 1) {
    callback(event.changedTouches.item(index));
  }
}

function useContinuousInput({ blocked, inputRef }) {
  useEffect(() => {
    const input = inputRef.current;

    const setKey = (event, pressed) => {
      if (blocked || isEditableTarget(event.target)) return;
      if (event.code === "KeyA" || event.code === "ArrowLeft") {
        event.preventDefault();
        input.left = pressed;
      }
      if (event.code === "KeyD" || event.code === "ArrowRight") {
        event.preventDefault();
        input.right = pressed;
      }
    };
    const onKeyDown = (event) => setKey(event, true);
    const onKeyUp = (event) => setKey(event, false);
    const onWheel = (event) => {
      if (blocked) return;
      const combined = event.deltaY + event.deltaX;
      input.wheelVelocity += combined * SCROLL_SENSITIVITY;
      input.pendingWheel += combined;
    };
    const resetInput = () => {
      input.left = false;
      input.right = false;
      input.touchLeft = false;
      input.touchRight = false;
      input.pinching = false;
      input.touches.clear();
    };
    const refreshTouchHold = () => {
      input.touchLeft = false;
      input.touchRight = false;
      for (const touch of input.touches.values()) {
        if (touch.isSwiping) continue;
        if (touch.side < 0) input.touchLeft = true;
        if (touch.side > 0) input.touchRight = true;
      }
    };
    const onTouchStart = (event) => {
      if (blocked) return;
      if (input.pinching || event.touches.length >= 2) {
        input.pinching = true;
        input.touchLeft = false;
        input.touchRight = false;
        input.touches.clear();
        return;
      }
      if (input.touches.size === 0) {
        input.velocitySamples = [];
        input.flingVelocity = 0;
        input.freshTouch = true;
      }
      const leftEdge = window.innerWidth * TOUCH_HOLD_EDGE;
      const rightEdge = window.innerWidth * (1 - TOUCH_HOLD_EDGE);
      forEachChangedTouch(event, (touch) => {
        if (!touch || isBlockedTouchTarget(touch.target)) return;
        const inLeft = touch.clientX < leftEdge;
        const inRight = touch.clientX > rightEdge;
        input.touches.set(touch.identifier, {
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          isSwiping: !(inLeft || inRight),
          side: inLeft ? -1 : 1,
        });
      });
      refreshTouchHold();
    };
    const onTouchMove = (event) => {
      if (blocked) return;
      if (input.pinching || event.touches.length >= 2) return;
      if ([...input.touches.values()].some((touch) => touch.isSwiping)) event.preventDefault();
      const now = performance.now();
      let eventDelta = 0;

      forEachChangedTouch(event, (touch) => {
        if (!touch) return;
        const tracked = input.touches.get(touch.identifier);
        if (!tracked) return;
        const dx = touch.clientX - tracked.lastX;
        const dy = touch.clientY - tracked.lastY;
        tracked.lastX = touch.clientX;
        tracked.lastY = touch.clientY;

        if (!tracked.isSwiping) {
          const driftX = Math.abs(touch.clientX - tracked.startX);
          const driftY = Math.abs(touch.clientY - tracked.startY);
          if (driftX >= TOUCH_SWIPE_THRESHOLD || driftY >= TOUCH_SWIPE_THRESHOLD) {
            tracked.isSwiping = true;
            refreshTouchHold();
          }
        }

        const contribution = -dx - dy;
        input.swipeDelta += contribution;
        eventDelta += contribution;
      });

      if (eventDelta !== 0) {
        input.velocitySamples.push({ dx: eventDelta, time: now });
        input.velocitySamples = input.velocitySamples.filter((sample) => sample.time >= now - FLING_SAMPLE_WINDOW);
      }
    };
    const onTouchEnd = (event) => {
      if (input.pinching) {
        if (event.touches.length === 0) input.pinching = false;
        input.touches.clear();
        input.touchLeft = false;
        input.touchRight = false;
        input.velocitySamples = [];
        return;
      }
      forEachChangedTouch(event, (touch) => {
        if (touch) input.touches.delete(touch.identifier);
      });
      if (event.touches.length === 0) input.touches.clear();
      refreshTouchHold();

      if (input.touches.size === 0 && input.velocitySamples.length >= 2) {
        const now = performance.now();
        const recent = input.velocitySamples.filter((sample) => sample.time >= now - FLING_SAMPLE_WINDOW);
        if (recent.length >= 2) {
          const totalDx = recent.reduce((sum, sample) => sum + sample.dx, 0);
          const timeSpan = (recent.at(-1).time - recent[0].time) / 1000;
          if (timeSpan > 0.001) input.flingVelocity = totalDx / timeSpan;
        }
      }
      input.velocitySamples = [];
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", resetInput);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      resetInput();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", resetInput);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [blocked, inputRef]);
}

function updateMotion(motionRef, velocity) {
  const speed = Math.abs(velocity);
  motionRef.current.speed = speed;
  motionRef.current.moving = speed > 0.01;
  if (speed > 0.01) motionRef.current.direction = Math.sign(velocity);
}

function reportPosition({ autopilotRef, lastSectionRef, motionRef, onSectionChange, player, testStateRef, velocity }) {
  const section = sectionAtPosition(player.position.x);
  if (section !== lastSectionRef.current) {
    lastSectionRef.current = section;
    onSectionChange?.(section);
  }
  Object.assign(testStateRef.current, {
    playerX: player.position.x,
    velocity,
    moving: motionRef.current.moving,
    direction: motionRef.current.direction,
    activeSection: section,
    autopilot: autopilotRef.current ? { ...autopilotRef.current } : null,
  });
}

function MovementController({
  blocked,
  initialSection,
  motionRef,
  navigationRequest,
  onSectionChange,
  playerRef,
  reducedMotion,
  testStateRef,
}) {
  const inputRef = useRef({
    left: false,
    right: false,
    touchLeft: false,
    touchRight: false,
    wheelVelocity: 0,
    touchMomentum: 0,
    pendingWheel: 0,
    swipeDelta: 0,
    flingVelocity: 0,
    freshTouch: false,
    pinching: false,
    velocitySamples: [],
    touches: new Map(),
  });
  const autopilotRef = useRef(null);
  const requestNonceRef = useRef(null);
  const initializedRef = useRef(false);
  const lastSectionRef = useRef(initialSection);
  const heldMoveRef = useRef({ direction: 0, seconds: 0 });

  useContinuousInput({ blocked, inputRef });

  useEffect(() => {
    if (!navigationRequest || navigationRequest.nonce === requestNonceRef.current) return;
    requestNonceRef.current = navigationRequest.nonce;
    const player = playerRef.current;
    const targetX = sectionAnchor(navigationRequest.sectionId);
    let direction = Math.sign(navigationRequest.direction || 0);
    if (!direction && player) direction = Math.sign(circularDelta(player.position.x, targetX, TRACK_LENGTH)) || 1;

    if (reducedMotion && player) {
      const shortDelta = circularDelta(player.position.x, targetX, TRACK_LENGTH);
      const signedDistance = direction === Math.sign(shortDelta)
        ? shortDelta
        : direction * (TRACK_LENGTH - Math.abs(shortDelta));
      player.position.x += signedDistance;
      autopilotRef.current = null;
      return;
    }
    autopilotRef.current = { targetX, direction };
  }, [navigationRequest, playerRef, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) return;

    const input = inputRef.current;
    input.wheelVelocity = 0;
    input.touchMomentum = 0;
    input.pendingWheel = 0;
    input.swipeDelta = 0;
    input.flingVelocity = 0;

    const player = playerRef.current;
    const autopilot = autopilotRef.current;
    if (!player || !autopilot) return;

    const shortDelta = circularDelta(player.position.x, autopilot.targetX, TRACK_LENGTH);
    const signedDistance = autopilot.direction === Math.sign(shortDelta)
      ? shortDelta
      : autopilot.direction * (TRACK_LENGTH - Math.abs(shortDelta));
    player.position.x += signedDistance;
    autopilotRef.current = null;
    updateMotion(motionRef, 0);
  }, [motionRef, playerRef, reducedMotion]);

  useFrame((_, rawDelta) => {
    const player = playerRef.current;
    if (!player) return;
    const delta = safeDelta(rawDelta);
    const heldDelta = Math.min(rawDelta, 0.25);
    const input = inputRef.current;

    if (!initializedRef.current) {
      player.position.x = sectionAnchor(initialSection);
      initializedRef.current = true;
      lastSectionRef.current = sectionAtPosition(player.position.x);
      onSectionChange?.(lastSectionRef.current);
    }

    if (blocked) {
      input.wheelVelocity = 0;
      input.touchMomentum = 0;
      input.pendingWheel = 0;
      input.swipeDelta = 0;
      heldMoveRef.current.direction = 0;
      heldMoveRef.current.seconds = 0;
      updateMotion(motionRef, 0);
      reportPosition({ autopilotRef, lastSectionRef, motionRef, onSectionChange, player, testStateRef, velocity: 0 });
      return;
    }

    const userKeyed = input.left || input.right || input.touchLeft || input.touchRight;
    const userScrolled = Math.abs(input.pendingWheel) > 0;
    const userSwiped = input.swipeDelta !== 0;
    input.pendingWheel = 0;

    if (input.freshTouch) {
      input.freshTouch = false;
      input.wheelVelocity = 0;
      input.touchMomentum = 0;
    }

    const autopilot = autopilotRef.current;
    if (autopilot && (userKeyed || userScrolled || userSwiped)) {
      autopilotRef.current = null;
    } else if (autopilot) {
      const shortDelta = circularDelta(player.position.x, autopilot.targetX, TRACK_LENGTH);
      const shortDistance = Math.abs(shortDelta);
      const distance = autopilot.direction === Math.sign(shortDelta)
        ? shortDistance
        : TRACK_LENGTH - shortDistance;

      if (shortDistance < ARRIVAL_THRESHOLD) {
        autopilotRef.current = null;
      } else {
        const velocity = autopilot.direction * autopilotSpeed(distance);
        input.wheelVelocity = velocity;
        input.touchMomentum = 0;
        player.position.x += velocity * delta;
        updateMotion(motionRef, velocity);
        reportPosition({ autopilotRef, lastSectionRef, motionRef, onSectionChange, player, testStateRef, velocity });
        return;
      }
    }

    const keyboardDirection = Number(input.right || input.touchRight) - Number(input.left || input.touchLeft);
    const heldMove = heldMoveRef.current;
    if (keyboardDirection === 0) {
      heldMove.direction = 0;
      heldMove.seconds = 0;
    } else if (keyboardDirection !== heldMove.direction) {
      heldMove.direction = keyboardDirection;
      heldMove.seconds = 0;
    } else if (!reducedMotion) {
      heldMove.seconds += heldDelta;
    }
    input.wheelVelocity = applyFriction(input.wheelVelocity, delta, SCROLL_FRICTION);
    if (input.swipeDelta !== 0) {
      input.wheelVelocity += input.swipeDelta * SWIPE_SENSITIVITY;
      input.swipeDelta = 0;
      input.touchMomentum = 0;
    }
    if (input.flingVelocity !== 0) {
      const flingGameVelocity = input.flingVelocity * FLING_SENSITIVITY;
      const sign = Math.sign(flingGameVelocity) || Math.sign(input.wheelVelocity);
      input.touchMomentum = sign * Math.max(Math.abs(flingGameVelocity), Math.abs(input.wheelVelocity));
      input.wheelVelocity = 0;
      input.flingVelocity = 0;
    }
    input.touchMomentum = applyFriction(input.touchMomentum, delta, TOUCH_MOMENTUM_FRICTION);

    const heldSpeed = reducedMotion ? MOVE_SPEED : acceleratedMoveSpeed(heldMove.seconds);
    let velocity = keyboardDirection * heldSpeed + input.wheelVelocity + input.touchMomentum;
    if (reducedMotion) velocity = keyboardDirection * MOVE_SPEED;
    player.position.x += velocity * delta;
    updateMotion(motionRef, velocity);
    reportPosition({ autopilotRef, lastSectionRef, motionRef, onSectionChange, player, testStateRef, velocity });
  });

  return null;
}

function TestBridge({ activeNight, testStateRef }) {
  const { camera, gl, scene, size } = useThree();
  const projectedDog = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    testStateRef.current.phase = activeNight ? "night" : "day";
    const color = scene.background?.isColor
      ? scene.background
      : gl.getClearColor(new THREE.Color());
    testStateRef.current.clearColor = `#${color.getHexString()}`;
    const dogBody = scene.getObjectByName("v3-dog-body");
    if (dogBody?.material?.color) {
      testStateRef.current.dogColor = `#${dogBody.material.color.getHexString()}`;
      dogBody.getWorldPosition(projectedDog);
      projectedDog.project(camera);
      testStateRef.current.dogScreenX = (projectedDog.x + 1) * size.width / 2;
      testStateRef.current.dogScreenY = (1 - projectedDog.y) * size.height / 2;
    }
  });

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("e2e")) return undefined;
    window.__V3_TEST__ = { snapshot: () => ({ ...testStateRef.current }) };
    return () => {
      delete window.__V3_TEST__;
    };
  }, [testStateRef]);

  return null;
}

function SceneContents({
  activeSection,
  blocked,
  initialSection,
  navigationRequest,
  onOpenAward,
  onOpenExperience,
  onOpenProject,
  onOpenUnavailableLink,
  onSectionChange,
  reducedMotion,
}) {
  const activeNight = activeSection === "awards" || activeSection === "experience";
  const playerRef = useRef(null);
  const motionRef = useRef({ moving: false, direction: 1, speed: 0 });
  const testStateRef = useRef({
    playerX: sectionAnchor(initialSection),
    cameraX: sectionAnchor(initialSection),
    cameraYaw: 0,
    velocity: 0,
    moving: false,
    direction: 1,
    activeSection: initialSection,
    phase: activeNight ? "night" : "day",
    clearColor: activeNight ? NIGHT_BACKGROUND : DAY_BACKGROUND,
    dogColor: activeNight ? "#f2f2ee" : "#111111",
    autopilot: null,
  });

  return (
    <>
      <SceneAtmosphere activeNight={activeNight} />
      <MovingLights activeNight={activeNight} playerRef={playerRef} />
      <ShadowFloor activeNight={activeNight} playerRef={playerRef} />
      <GalleryWorld
        activeNight={activeNight}
        motionRef={motionRef}
        onOpenAward={onOpenAward}
        onOpenExperience={onOpenExperience}
        onOpenProject={onOpenProject}
        onOpenUnavailableLink={onOpenUnavailableLink}
        playerRef={playerRef}
        reducedMotion={reducedMotion}
      />
      <MovementController
        blocked={blocked}
        initialSection={initialSection}
        motionRef={motionRef}
        navigationRequest={navigationRequest}
        onSectionChange={onSectionChange}
        playerRef={playerRef}
        reducedMotion={reducedMotion}
        testStateRef={testStateRef}
      />
      <CameraRig
        motionRef={motionRef}
        playerRef={playerRef}
        reducedMotion={reducedMotion}
        testStateRef={testStateRef}
      />
      <TestBridge activeNight={activeNight} testStateRef={testStateRef} />
    </>
  );
}

export default function ContinuousWorldScene({
  activeSection = "home",
  blocked = false,
  initialSection = "home",
  navigationRequest = null,
  onOpenAward,
  onOpenExperience,
  onOpenProject,
  onOpenUnavailableLink,
  onSectionChange,
  reducedMotion = false,
}) {
  return (
    <Canvas
      camera={{ far: 1000, fov: 30, near: 0.1, position: [sectionAnchor(initialSection), 5.5, 25] }}
      className="v3-world-canvas"
      dpr={[1, 1.65]}
      flat
      gl={{ antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <SceneContents
        activeSection={activeSection}
        blocked={blocked}
        initialSection={initialSection}
        navigationRequest={navigationRequest}
        onOpenAward={onOpenAward}
        onOpenExperience={onOpenExperience}
        onOpenProject={onOpenProject}
        onOpenUnavailableLink={onOpenUnavailableLink}
        onSectionChange={onSectionChange}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
