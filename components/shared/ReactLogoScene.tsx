"use client";

/* eslint-disable react/no-unknown-property -- react-three-fiber uses lowercase elements with Three.js props (emissiveIntensity, toneMapped, ...) */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "motion/react";

/**
 * Three.js can't read oklch(), so this is a hex approximation of your
 * --primary (oklch(0.78 0.14 210)). Change it here if you change the theme.
 */
const PRIMARY = "#00cfe8";

/* Logo shape: three ellipses plus a nucleus, like the React logo */
const RX = 2.6;
const RY = 1.0;

/* Camera: used to size the logo in real pixels on every screen */
const CAMERA_Z = 9;
const CAMERA_FOV = 50;

/* Logo size in pixels: large screens vs. stacked (phone / tablet) layout */
const LOGO_PX_WIDE = 330;
const LOGO_PX_MAX_STACKED = 220;
/* Stacked layout: distance from the top of the hero to the logo's center.
   Keep in sync with the hero's top padding (pt-[21rem] = 336px). */
const LOGO_CENTER_Y_STACKED = 150;

/* Entrance animation length (seconds) */
const INTRO_SECONDS = 1.8;

/* Starfield: a long tunnel of stars that flows toward the viewer */
const STAR_COUNT = 2500;
const STAR_DEPTH = 150;
const STAR_FRONT = 30;
const STAR_BASE_SPEED = 1.2; // units per second when idle
const STAR_BOOST_SPEED = 45; // extra units per second at full drag speed

/** Small seeded random generator: the star layout is identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft round glow used for the stars and the halo behind the logo */
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/** True from Tailwind's `lg` breakpoint up (exactly in sync with the lg: classes). */
function subscribeWide(onChange: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function useIsWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

type Controls = { getAzimuthalAngle(): number; getPolarAngle(): number };
type Ref<T> = { current: T };

const GLOW_SHELLS = [
  { radius: 0.15, opacity: 0.2 },
  { radius: 0.3, opacity: 0.08 },
];

function ReactLogo({ spin }: { spin: boolean }) {
  const group = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const steps = 96;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(t) * RX, Math.sin(t) * RY, 0));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !spin) return;
    group.current.rotation.y += delta * 0.35; // slow spin
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.25; // gentle wobble
  });

  return (
    <group ref={group}>
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle) => (
        <group key={angle} rotation={[0, 0, angle]}>
          {/* Bright core */}
          <mesh>
            <tubeGeometry args={[curve, 160, 0.07, 16, true]} />
            <meshStandardMaterial
              color={PRIMARY}
              emissive={PRIMARY}
              emissiveIntensity={1.6}
              roughness={0.35}
              metalness={0.4}
              toneMapped={false}
            />
          </mesh>
          {/* Two soft additive shells fake a bloom glow */}
          {GLOW_SHELLS.map((shell) => (
            <mesh key={shell.radius}>
              <tubeGeometry args={[curve, 120, shell.radius, 12, true]} />
              <meshBasicMaterial
                color={PRIMARY}
                transparent
                opacity={shell.opacity}
                depthWrite={false}
                toneMapped={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={PRIMARY}
          emissive={PRIMARY}
          emissiveIntensity={2}
          roughness={0.3}
          metalness={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial
          color={PRIMARY}
          transparent
          opacity={0.18}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Stars({ boost, still }: { boost: Ref<number>; still: boolean }) {
  const geometry = useRef<THREE.BufferGeometry>(null);

  const { positions, colors } = useMemo(() => {
    const random = mulberry32(1337);
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const cyan = new THREE.Color(PRIMARY);
    const white = new THREE.Color("#ffffff");
    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 3 + random() * 45;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = STAR_FRONT - random() * STAR_DEPTH;
      const base = random() < 0.35 ? cyan : white;
      const brightness = 0.8 + random() * 0.2;
      colors[i * 3] = base.r * brightness;
      colors[i * 3 + 1] = base.g * brightness;
      colors[i * 3 + 2] = base.b * brightness;
    }
    return { positions, colors };
  }, []);

  const sprite = useMemo(() => createGlowTexture(), []);

  useFrame((_, delta) => {
    if (still || !geometry.current) return;
    const attr = geometry.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const speed = STAR_BASE_SPEED + boost.current * STAR_BOOST_SPEED;
    for (let i = 0; i < STAR_COUNT; i++) {
      const zi = i * 3 + 2;
      arr[zi] += speed * delta;
      if (arr[zi] > STAR_FRONT) arr[zi] -= STAR_DEPTH;
    }
    attr.needsUpdate = true;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.42}
        sizeAttenuation
        map={sprite}
        vertexColors
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ reduce }: { reduce: boolean }) {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as Controls | null;

  const starGroup = useRef<THREE.Group>(null);
  const intro = useRef<THREE.Group>(null);
  const introStart = useRef<number | null>(null);
  const boost = useRef(0);
  const last = useRef<{ az: number; pol: number } | null>(null);

  const isWide = useIsWide();

  // Size the logo in pixels so it looks the same whatever the hero's height is
  const pxPerUnit =
    Math.max(size.height, 1) /
    (2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)));
  const targetPx = isWide
    ? LOGO_PX_WIDE
    : Math.min(size.width * 0.55, LOGO_PX_MAX_STACKED);
  const logoScale = targetPx / (pxPerUnit * 2 * RX);
  const halo = useMemo(() => createGlowTexture(), []);

  // Position the logo by shifting the rendered image (the orbit target stays at
  // the origin, so dragging still rotates the logo in place):
  //  - wide screens: right of center, next to the text
  //  - phones / tablets: centered in the band above the text
  useEffect(() => {
    const x = isWide ? -size.width * 0.22 : 0;
    const y = isWide ? 0 : size.height / 2 - LOGO_CENTER_Y_STACKED;
    camera.setViewOffset(
      size.width,
      size.height,
      x,
      y,
      size.width,
      size.height,
    );
    return () => camera.clearViewOffset();
  }, [camera, size.width, size.height, isWide]);

  // Entrance: the logo grows and turns into place instead of popping in.
  useFrame((state) => {
    const group = intro.current;
    if (!group) return;
    if (reduce) {
      group.scale.setScalar(1);
      group.rotation.y = 0;
      return;
    }
    if (introStart.current === null)
      introStart.current = state.clock.elapsedTime;
    const t = Math.min(
      (state.clock.elapsedTime - introStart.current) / INTRO_SECONDS,
      1,
    );
    const ease = 1 - Math.pow(1 - t, 3); // ease-out
    group.scale.setScalar(0.3 + 0.7 * ease);
    group.rotation.y = (1 - ease) * Math.PI;
  });

  // Read how fast the user is dragging and feed it to the stars.
  useFrame((_, delta) => {
    if (!controls) return;
    const az = controls.getAzimuthalAngle();
    const pol = controls.getPolarAngle();
    if (!last.current) {
      last.current = { az, pol };
      return;
    }
    let dAz = az - last.current.az;
    if (dAz > Math.PI) dAz -= Math.PI * 2;
    else if (dAz < -Math.PI) dAz += Math.PI * 2;
    const dPol = pol - last.current.pol;
    last.current = { az, pol };

    const velocity = Math.hypot(dAz, dPol) / Math.max(delta, 1 / 120); // rad/s
    boost.current = THREE.MathUtils.damp(
      boost.current,
      Math.min(velocity / 2, 1),
      5,
      delta,
    );

    // Extra drift so the stars turn along with the logo
    if (starGroup.current) {
      starGroup.current.rotation.y -= dAz * 0.8;
      starGroup.current.rotation.x -= dPol * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />

      <group scale={logoScale}>
        <group ref={intro}>
          {/* Soft halo behind the logo (always faces the camera) */}
          <sprite scale={[10, 10, 1]}>
            <spriteMaterial
              map={halo}
              color={PRIMARY}
              transparent
              opacity={0.35}
              depthWrite={false}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <ReactLogo spin={!reduce} />
        </group>
      </group>

      <group ref={starGroup}>
        <Stars boost={boost} still={reduce} />
      </group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
      />
    </>
  );
}

export default function ReactLogoScene() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  // Stop rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // touch-pan-y! lets vertical swipes scroll the page while horizontal drags
    // rotate the logo (the ! beats the inline touch-action that OrbitControls sets).
    <div
      ref={ref}
      className={`absolute inset-0 cursor-grab transition-opacity duration-1000 active:cursor-grabbing motion-reduce:transition-none [&_canvas]:touch-pan-y! ${
        ready ? "opacity-100" : "opacity-0"
      }`}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}>
        <Scene reduce={reduce} />
      </Canvas>
    </div>
  );
}
