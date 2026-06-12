import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ── The trailblazing journey of a maker — blueprint → built ──────────────────
// Ten scenes, age 5 → a built life. Each stands in the world as a glowing
// wireframe blueprint; when the spark of curiosity arrives, the real thing
// materializes inside it and starts moving. The arc: first tower → teardown →
// circuit → code → solder → print → competition → college → his own venture →
// an amazing life, where he hands the spark to the next kid. Show, don't tell.

const CREAM = '#F2EAD9';
const CREAM_2 = '#EAE1CC';
const CREAM_3 = '#E2D7BE';
const GROUND = '#EDE4D0';
const INK = '#3A322A';
const ACCENT = '#FF5A00';
const KID_GREY = '#A99F8E';
const KID_WARM = '#FF8A4D';

const SCALE = 2.1;

const STATIONS = [
  [-59, 6], [-46, -6], [-33, 6], [-20, -6], [-7, 6], [6, -6], [19, 6], [32, -6], [45, 6], [58, -5],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

const N = STATIONS.length;
const ST = (i) => i / (N - 1);

// Photoreal pass: PBR materials — painted plastic, wood, anodized metal,
// glossy product-orange — lit by an environment map and a shadow-casting sun.
const M = {
  cream: new THREE.MeshPhysicalMaterial({ color: '#F5EFE2', roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
  cream2: new THREE.MeshPhysicalMaterial({ color: '#E7DDC6', roughness: 0.62 }),
  cream3: new THREE.MeshPhysicalMaterial({ color: '#B68B5E', roughness: 0.55, clearcoat: 0.12, clearcoatRoughness: 0.6 }), // worked wood
  ink: new THREE.MeshPhysicalMaterial({ color: '#2E2A26', roughness: 0.35, metalness: 0.72 }), // anodized metal
  accent: new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, emissive: ACCENT, emissiveIntensity: 0.06 }),
  glow: new THREE.MeshBasicMaterial({ color: ACCENT }),
  screen: new THREE.MeshBasicMaterial({ color: '#FFF2E2' }),
  trunk: new THREE.MeshPhysicalMaterial({ color: '#6E4F33', roughness: 0.8 }),
  leaf: new THREE.MeshPhysicalMaterial({ color: '#6B8456', roughness: 0.7 }),
};

const WIRE = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.22 });

const ease = (k) => k * k * (3 - 2 * k);

// Dwell pacing: the spark rests at each station for the last 30% of the leg
// before it and the first 30% of the leg after it — a centered pause at every
// scene, including the first and the last. Travel happens in the middle 40%.
const rawToT = (raw) => THREE.MathUtils.clamp((raw - 0.08) / 0.8, 0, 1);
const dwellT = (t) => {
  const seg = t * (N - 1);
  const i = Math.min(Math.floor(seg), N - 2);
  const f = seg - i;
  const travel = f < 0.3 ? 0 : f > 0.7 ? 1 : ease((f - 0.3) / 0.4);
  return (i + travel) / (N - 1);
};
// Scroll-segment at which the spark arrives at station idx
const arrivalSeg = (idx) => (idx === 0 ? 0 : idx - 0.3);
const backOut = (k) => {
  const c = 1.70158;
  const x = k - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};

function Box({ p, s, m = M.cream, r = 0, rx = 0, rz = 0 }) {
  return (
    <mesh position={p} rotation={[rx, r, rz]} material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

function useActivation(progress, idx) {
  const ref = useRef(0);
  useFrame(() => {
    const seg = rawToT(progress.get()) * (N - 1);
    ref.current = ease(THREE.MathUtils.clamp((seg - arrivalSeg(idx)) / 0.28, 0, 1));
  });
  return ref;
}

// ── Blueprint → built ────────────────────────────────────────────────────────
// Children render solid; a one-time wireframe clone is the standing blueprint.
// On activation the solid pops in (back-out overshoot) inside the blueprint.
function Materialize({ progress, idx, children }) {
  const solid = useRef();
  const wires = useRef();
  const act = useActivation(progress, idx);

  useEffect(() => {
    if (!solid.current || !wires.current || wires.current.children.length) return;
    const clone = solid.current.clone(true);
    const strip = [];
    clone.traverse((o) => {
      if (o.isLight || o.isInstancedMesh) strip.push(o);
      else if (o.isMesh) o.material = WIRE;
    });
    strip.forEach((o) => o.parent && o.parent.remove(o));
    wires.current.add(clone);
  }, []);

  useFrame(() => {
    const k = act.current;
    if (solid.current) {
      const s = k < 0.02 ? 0.001 : backOut(k);
      solid.current.scale.setScalar(Math.max(s, 0.001));
      solid.current.visible = k > 0.02;
    }
    if (wires.current) {
      wires.current.visible = k < 0.97;
      wires.current.scale.setScalar(1 + (1 - k) * 0.02);
    }
  });

  return (
    <>
      <group ref={solid}>{children}</group>
      <group ref={wires} />
    </>
  );
}

// ── The child, posed and aging ───────────────────────────────────────────────
function Kid({ p, scale = 1, rotY = 0, pose = 'stand', kidMat }) {
  const arms = {
    stand: { l: [0, 0, 0.25], r: [0, 0, -0.25] },
    reach: { l: [-2.4, 0, 0.2], r: [-2.6, 0, -0.1] },
    kneel: { l: [-1.2, 0, 0.3], r: [-1.4, 0, -0.3] },
    work: { l: [-1.5, 0, 0.15], r: [-1.7, 0, -0.2] },
    type: { l: [-1.6, 0, 0.1], r: [-1.6, 0, -0.1] },
    raise: { l: [-2.9, 0, 0.5], r: [-2.9, 0, -0.5] },
    give: { l: [-1.9, 0, 0.4], r: [0, 0, -0.25] },
  }[pose] || { l: [0, 0, 0.25], r: [0, 0, -0.25] };
  const kneeling = pose === 'kneel';
  const bodyH = kneeling ? 0.3 : 0.42;
  const baseY = kneeling ? 0.3 : 0.42;
  return (
    <group position={p} rotation={[0, rotY, 0]} scale={scale}>
      <mesh material={kidMat} position={[0, baseY, 0]}>
        <capsuleGeometry args={[0.17, bodyH, 6, 12]} />
      </mesh>
      <mesh material={kidMat} position={[0, baseY + bodyH / 2 + 0.33, 0]}>
        <sphereGeometry args={[0.165, 12, 12]} />
      </mesh>
      <mesh material={kidMat} position={[-0.21, baseY + bodyH / 2 + 0.05, 0]} rotation={arms.l}>
        <capsuleGeometry args={[0.055, 0.34, 4, 8]} />
      </mesh>
      <mesh material={kidMat} position={[0.21, baseY + bodyH / 2 + 0.05, 0]} rotation={arms.r}>
        <capsuleGeometry args={[0.055, 0.34, 4, 8]} />
      </mesh>
    </group>
  );
}

// ── 01 · Age 5 — blocks stack themselves ─────────────────────────────────────
function TowerScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const scattered = useMemo(() => [[1.4, 0.14, 0.7, 0.8], [1.7, 0.12, -0.4, 0.3], [0.9, 0.13, -0.9, 1.2], [2, 0.12, 0.2, 0.6]], []);
  const stacked = useMemo(() => [[0.55, 0.14, 0, 0], [0.55, 0.42, 0, 0.25], [0.55, 0.7, 0, 0.5], [0.55, 0.98, 0, 0.1]], []);
  useFrame((state) => {
    refs.forEach((r, i) => {
      if (!r.current) return;
      const k = ease(THREE.MathUtils.clamp(act.current * 4 - i * 0.85, 0, 1));
      const s = scattered[i], t = stacked[i];
      const lift = Math.sin(k * Math.PI) * 0.8;
      r.current.position.set(
        THREE.MathUtils.lerp(s[0], t[0], k),
        THREE.MathUtils.lerp(s[1], t[1], k) + lift,
        THREE.MathUtils.lerp(s[2], t[2], k)
      );
      r.current.rotation.y = THREE.MathUtils.lerp(s[3], t[3], k);
      if (i === 3 && k === 1) r.current.rotation.z = Math.sin(state.clock.elapsedTime * 2.4) * 0.05;
    });
  });
  const mats = [M.accent, M.cream3, M.ink, M.accent];
  return (
    <group>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} material={mats[i]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
        </mesh>
      ))}
      <Kid p={[-0.25, 0, 0]} scale={0.55} rotY={Math.PI / 2.2} pose="reach" kidMat={kidMat} />
    </group>
  );
}

// ── 02 · Age 7 — the toy explodes apart ──────────────────────────────────────
function TeardownScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const shell = useRef(), chassis = useRef(), w1 = useRef(), w2 = useRef(), gear = useRef();
  useFrame((_, delta) => {
    const k = act.current;
    if (shell.current) shell.current.position.set(0.6, 0.3 + k * 0.85, 0);
    if (chassis.current) chassis.current.position.set(0.6, 0.18 + k * 0.35, 0);
    if (w1.current) { w1.current.position.set(0.25 - k * 0.55, 0.16 + k * 0.45, 0.3 + k * 0.5); w1.current.rotation.y += delta * k * 4; }
    if (w2.current) { w2.current.position.set(0.95 + k * 0.55, 0.16 + k * 0.45, -0.3 - k * 0.5); w2.current.rotation.y += delta * k * 4; }
    if (gear.current) { gear.current.position.set(0.6, 0.2 + k * 1.45, 0); gear.current.rotation.z += delta * k * 2; }
  });
  return (
    <group>
      <mesh ref={shell} material={M.accent}><boxGeometry args={[0.9, 0.26, 0.5]} /></mesh>
      <mesh ref={chassis} material={M.cream3}><boxGeometry args={[0.84, 0.1, 0.42]} /></mesh>
      <mesh ref={w1} material={M.ink} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.09, 14]} /></mesh>
      <mesh ref={w2} material={M.ink} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.09, 14]} /></mesh>
      <mesh ref={gear} material={M.ink} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.14, 0.05, 8, 16]} /></mesh>
      <Kid p={[-0.35, 0, 0]} scale={0.62} rotY={Math.PI / 2} pose="kneel" kidMat={kidMat} />
    </group>
  );
}

// ── 03 · Age 8 — the wire connects, the LED floods on ────────────────────────
function CircuitScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const led = useRef(), bulb = useRef(), wire = useRef(), halo = useRef();
  useFrame((state) => {
    const k = act.current;
    if (wire.current) wire.current.scale.x = Math.max(k, 0.001);
    const on = k > 0.85 ? 1 : 0;
    const pulse = on * (0.75 + Math.sin(state.clock.elapsedTime * 4) * 0.25);
    if (led.current) led.current.intensity = pulse * 3;
    if (bulb.current) bulb.current.material.opacity = 0.2 + pulse * 0.8;
    if (halo.current) halo.current.scale.setScalar(1 + pulse * 0.3);
  });
  return (
    <group>
      <Box p={[0.5, 0.4, 0]} s={[1.5, 0.1, 0.9]} m={M.cream3} />
      {[[-0.1, 0.35], [1.1, 0.35], [-0.1, -0.35], [1.1, -0.35]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.18, z]} s={[0.08, 0.36, 0.08]} m={M.ink} />
      ))}
      <Box p={[0.1, 0.52, 0]} s={[0.36, 0.14, 0.28]} m={M.ink} />
      <mesh ref={wire} position={[0.28, 0.47, 0]} material={M.accent} scale={[0.001, 1, 1]}>
        <boxGeometry args={[1.3, 0.045, 0.045]} />
      </mesh>
      <mesh ref={bulb} position={[0.95, 0.6, 0]}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.2} />
      </mesh>
      <mesh ref={halo} position={[0.95, 0.6, 0]}>
        <sphereGeometry args={[0.2, 14, 14]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.12} />
      </mesh>
      <pointLight ref={led} position={[0.95, 0.8, 0]} color={ACCENT} intensity={0} distance={4.5} />
      <Kid p={[0.5, 0, 0.85]} scale={0.68} rotY={Math.PI} pose="work" kidMat={kidMat} />
    </group>
  );
}

// ── 04 · Age 10 — code types itself, the robot wakes ─────────────────────────
function CodeScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const lines = [useRef(), useRef(), useRef(), useRef()];
  const bot = useRef(), botEye = useRef();
  useFrame((state) => {
    const k = act.current;
    lines.forEach((l, i) => {
      if (!l.current) return;
      l.current.scale.x = Math.max(ease(THREE.MathUtils.clamp(k * 5 - i, 0, 1)), 0.001);
    });
    if (bot.current && k > 0.8) {
      bot.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.7;
      bot.current.position.y = 0.22 + Math.abs(Math.sin(state.clock.elapsedTime * 3.2)) * 0.06;
    }
    if (botEye.current) botEye.current.material.color.setStyle(k > 0.8 ? ACCENT : '#6b6357');
  });
  const lineWidths = [0.55, 0.4, 0.62, 0.3];
  return (
    <group>
      <Box p={[0.4, 0.4, 0]} s={[1.4, 0.1, 0.8]} m={M.cream3} />
      {[[-0.2, 0.3], [1, 0.3], [-0.2, -0.3], [1, -0.3]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.18, z]} s={[0.08, 0.36, 0.08]} m={M.ink} />
      ))}
      <Box p={[0.4, 0.82, -0.18]} s={[0.95, 0.62, 0.05]} m={M.screen} />
      {lines.map((l, i) => (
        <mesh key={i} ref={l} position={[0.08 + lineWidths[i] / 2 - 0.35, 1 - i * 0.12, -0.14]} material={i === 2 ? M.accent : M.ink} scale={[0.001, 1, 1]}>
          <boxGeometry args={[lineWidths[i], 0.045, 0.02]} />
        </mesh>
      ))}
      <Box p={[0.4, 0.49, -0.18]} s={[0.12, 0.14, 0.08]} m={M.ink} />
      <group ref={bot} position={[1.55, 0.22, 0.45]}>
        <Box p={[0, 0, 0]} s={[0.42, 0.32, 0.36]} m={M.accent} />
        <mesh ref={botEye} position={[0.14, 0.06, 0.19]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#6b6357" />
        </mesh>
      </group>
      <Kid p={[0.4, 0, 0.7]} scale={0.74} rotY={Math.PI} pose="type" kidMat={kidMat} />
    </group>
  );
}

// ── 05 · Age 12 — solder sparks ──────────────────────────────────────────────
function SolderScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const iron = useRef(), spark = useRef(), sparkDot = useRef();
  useFrame((state) => {
    const k = act.current;
    const t = state.clock.elapsedTime;
    if (iron.current && k > 0.4) {
      iron.current.position.x = 0.45 + Math.sin(t * 1.4) * 0.18;
      iron.current.position.z = 0.05 + Math.cos(t * 1.1) * 0.08;
    }
    const f = k > 0.4 ? Math.max(0, Math.sin(t * 11)) : 0;
    if (spark.current) spark.current.intensity = f * 2.4;
    if (sparkDot.current) {
      sparkDot.current.scale.setScalar(0.4 + f * 1.1);
      sparkDot.current.position.set((iron.current ? iron.current.position.x : 0.5) - 0.16, 0.56, iron.current ? iron.current.position.z : 0.05);
    }
  });
  return (
    <group>
      <Box p={[0.45, 0.42, 0]} s={[1.5, 0.1, 0.9]} m={M.cream3} />
      {[[-0.15, 0.35], [1.05, 0.35], [-0.15, -0.35], [1.05, -0.35]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.19, z]} s={[0.08, 0.38, 0.08]} m={M.ink} />
      ))}
      <Box p={[0.35, 0.5, 0.05]} s={[0.55, 0.06, 0.4]} m={M.accent} />
      <group ref={iron} position={[0.45, 0.62, 0.05]} rotation={[0, 0, -0.7]}>
        <mesh material={M.ink}><cylinderGeometry args={[0.03, 0.012, 0.5, 8]} /></mesh>
      </group>
      <mesh ref={sparkDot} position={[0.35, 0.56, 0.05]} material={M.glow}>
        <sphereGeometry args={[0.05, 8, 8]} />
      </mesh>
      <pointLight ref={spark} position={[0.4, 0.7, 0.05]} color="#FFB37B" intensity={0} distance={3} />
      <Kid p={[0.45, 0, 0.85]} scale={0.8} rotY={Math.PI} pose="work" kidMat={kidMat} />
    </group>
  );
}

// ── 06 · Age 13 — the print grows ────────────────────────────────────────────
function PrintScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const head = useRef(), print = useRef();
  useFrame((state) => {
    const k = act.current;
    if (head.current) {
      head.current.position.x = k > 0.15 ? Math.sin(state.clock.elapsedTime * 3) * 0.3 : 0;
      head.current.position.y = 0.3 + k * 0.5;
    }
    if (print.current) print.current.scale.y = Math.max(k, 0.001);
  });
  return (
    <group>
      <group position={[0.75, 0, -0.05]}>
        <Box p={[0, 0.06, 0]} s={[1.05, 0.12, 0.95]} m={M.ink} />
        <Box p={[-0.48, 0.6, 0]} s={[0.09, 1.1, 0.09]} m={M.cream3} />
        <Box p={[0.48, 0.6, 0]} s={[0.09, 1.1, 0.09]} m={M.cream3} />
        <Box p={[0, 1.12, 0]} s={[1.05, 0.09, 0.09]} m={M.cream3} />
        <mesh ref={head} position={[0, 0.8, 0]} material={M.accent}><boxGeometry args={[0.17, 0.2, 0.17]} /></mesh>
        <group ref={print} position={[0, 0.12, 0]} scale={[1, 0.001, 1]}>
          <mesh position={[0, 0.26, 0]} material={M.accent}><coneGeometry args={[0.16, 0.52, 10]} /></mesh>
        </group>
      </group>
      <Box p={[-0.7, 0.4, 0.1]} s={[0.9, 0.1, 0.6]} m={M.cream3} />
      <Box p={[-0.7, 0.78, -0.05]} s={[0.62, 0.45, 0.05]} m={M.screen} />
      <Kid p={[-0.7, 0, 0.75]} scale={0.85} rotY={Math.PI} pose="type" kidMat={kidMat} />
    </group>
  );
}

// ── 07 · Age 15 — the team's robot runs the field ────────────────────────────
function CompeteScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const bot = useRef();
  useFrame((state) => {
    if (bot.current && act.current > 0.3) {
      const t = state.clock.elapsedTime * 1.5;
      const r = 0.62;
      bot.current.position.set(Math.cos(t) * r, 0.16, Math.sin(t) * r);
      bot.current.rotation.y = -t;
    }
  });
  return (
    <group>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.cream2}>
        <circleGeometry args={[1.7, 28]} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.glow}>
        <ringGeometry args={[1.6, 1.66, 32]} />
      </mesh>
      <group ref={bot} position={[0.62, 0.16, 0]}>
        <Box p={[0, 0, 0]} s={[0.44, 0.24, 0.36]} m={M.accent} />
        <Box p={[0, 0.2, 0]} s={[0.13, 0.15, 0.13]} m={M.ink} />
      </group>
      <Kid p={[-1.2, 0, 0.9]} scale={0.92} rotY={Math.PI / 3} pose="stand" kidMat={kidMat} />
      <Kid p={[-1.6, 0, -0.4]} scale={0.88} rotY={Math.PI / 2.4} pose="work" kidMat={M.cream3} />
      <Box p={[2, 0.8, -0.9]} s={[0.06, 1.6, 0.06]} m={M.ink} />
      <Box p={[2.3, 1.4, -0.9]} s={[0.55, 0.34, 0.05]} m={M.accent} />
    </group>
  );
}

// ── 08 · Age 18 — college: the cap goes up ───────────────────────────────────
function CollegeScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const cap = useRef();
  const confetti = useRef([]);
  const seeds = useMemo(() => [...Array(10)].map((_, i) => ({ a: (i / 10) * Math.PI * 2, s: 0.6 + (i % 3) * 0.3 })), []);
  useFrame((state, delta) => {
    const k = act.current;
    const toss = ease(THREE.MathUtils.clamp((k - 0.55) / 0.45, 0, 1));
    if (cap.current) {
      cap.current.position.y = 1.05 + toss * 1.3 + (toss === 1 ? Math.sin(state.clock.elapsedTime * 2.2) * 0.06 : 0);
      cap.current.rotation.y += delta * toss * 2.4;
    }
    confetti.current.forEach((c, i) => {
      if (!c) return;
      const seed = seeds[i];
      if (toss > 0.4) {
        const t = (state.clock.elapsedTime * seed.s + i) % 2;
        c.position.set(Math.cos(seed.a) * (0.5 + t * 0.5), 1.6 + 1.1 - t * 1.1, 0.4 + Math.sin(seed.a) * (0.4 + t * 0.4));
        c.rotation.x += delta * 4;
        c.visible = true;
      } else c.visible = false;
    });
  });
  return (
    <group>
      {/* campus building */}
      <Box p={[0.6, 0.12, -0.5]} s={[3.4, 0.24, 1.8]} m={M.cream2} />
      <Box p={[0.6, 1.05, -0.8]} s={[2.9, 1.7, 1]} m={M.cream} />
      {[-0.5, 0.2, 0.9, 1.6].map((x, i) => (
        <mesh key={i} position={[x, 1, -0.25]} material={M.cream3}>
          <cylinderGeometry args={[0.1, 0.1, 1.6, 10]} />
        </mesh>
      ))}
      <mesh position={[0.6, 2.2, -0.5]} rotation={[0, Math.PI / 4, 0]} material={M.cream3}>
        <coneGeometry args={[1.9, 0.8, 4]} />
      </mesh>
      <Box p={[0.6, 1.35, 0.28]} s={[0.7, 0.4, 0.06]} m={M.accent} />
      {/* the graduate */}
      <Kid p={[-0.9, 0, 0.9]} scale={0.98} rotY={Math.PI / 6} pose="raise" kidMat={kidMat} />
      {/* the cap */}
      <group ref={cap} position={[-0.9, 1.05, 0.9]}>
        <Box p={[0, 0, 0]} s={[0.34, 0.04, 0.34]} m={M.ink} r={0.4} />
        <mesh position={[0, -0.05, 0]} material={M.ink}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 10]} />
        </mesh>
        <mesh position={[0.16, 0.03, 0.16]} material={M.glow}>
          <sphereGeometry args={[0.035, 6, 6]} />
        </mesh>
      </group>
      {/* confetti */}
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => (confetti.current[i] = el)} material={i % 2 ? M.glow : M.ink} visible={false}>
          <boxGeometry args={[0.07, 0.012, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

// ── 09 · Age 22 — his own thing: the drone he shipped lifts off ──────────────
function VentureScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const drone = useRef();
  const props = [useRef(), useRef(), useRef(), useRef()];
  useFrame((state, delta) => {
    const k = act.current;
    if (drone.current) {
      const hover = k > 0.5 ? (k - 0.5) * 2 : 0;
      drone.current.position.y = 0.62 + ease(hover) * 1.5 + (hover > 0.9 ? Math.sin(state.clock.elapsedTime * 2) * 0.07 : 0);
      drone.current.rotation.y += delta * 0.4 * hover;
    }
    props.forEach((pr) => {
      if (pr.current) pr.current.rotation.y += delta * (2 + act.current * 26);
    });
  });
  return (
    <group>
      <Box p={[-0.9, 0.45, -0.3]} s={[1.5, 0.1, 0.9]} m={M.cream3} />
      {[[-1.5, 0.05], [-0.3, 0.05], [-1.5, -0.65], [-0.3, -0.65]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} m={M.ink} />
      ))}
      <Box p={[-1.7, 1.3, -0.6]} s={[0.7, 0.06, 0.4]} m={M.cream3} />
      <Box p={[-1.85, 1.45, -0.6]} s={[0.18, 0.22, 0.18]} m={M.accent} />
      <Box p={[-1.55, 1.42, -0.6]} s={[0.14, 0.16, 0.14]} m={M.ink} />
      <Box p={[-1.2, 0.55, -0.2]} s={[0.3, 0.06, 0.2]} m={M.accent} />
      <mesh position={[0.9, 0.05, 0.3]} material={M.cream2}>
        <cylinderGeometry args={[0.85, 0.85, 0.1, 20]} />
      </mesh>
      <mesh position={[0.9, 0.11, 0.3]} rotation={[-Math.PI / 2, 0, 0]} material={M.glow}>
        <ringGeometry args={[0.7, 0.76, 28]} />
      </mesh>
      <group ref={drone} position={[0.9, 0.62, 0.3]}>
        <Box p={[0, 0, 0]} s={[0.5, 0.14, 0.5]} m={M.ink} />
        <mesh position={[0, -0.04, 0.26]} material={M.glow}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        {[[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]].map(([x, z], i) => (
          <group key={i} position={[x, 0.04, z]}>
            <Box p={[0, 0.04, 0]} s={[0.07, 0.1, 0.07]} m={M.accent} />
            <group ref={props[i]} position={[0, 0.12, 0]}>
              <Box p={[0, 0, 0]} s={[0.4, 0.02, 0.06]} m={M.cream3} />
            </group>
          </group>
        ))}
      </group>
      <Kid p={[0, 0, 1.1]} scale={1.02} rotY={Math.PI + 0.5} pose="raise" kidMat={kidMat} />
    </group>
  );
}

// ── 10 · An amazing life — and the spark passes on ───────────────────────────
function LifeScene({ kidMat, progress, idx }) {
  const act = useActivation(progress, idx);
  const orb = useRef(), orbLight = useRef();
  const newTrail = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const NEW_DOTS = 16;
  useFrame((state) => {
    const k = act.current;
    // the spark passes from his hand to the next kid's
    const pass = ease(THREE.MathUtils.clamp((k - 0.45) / 0.45, 0, 1));
    if (orb.current) {
      const from = new THREE.Vector3(-0.28, 1.05, 0.62);
      const to = new THREE.Vector3(0.72, 0.5, 0.95);
      const pos = from.clone().lerp(to, pass);
      pos.y += Math.sin(pass * Math.PI) * 0.45;
      orb.current.position.copy(pos);
      orb.current.visible = k > 0.2;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.4) * 0.18;
      orb.current.scale.setScalar(pulse);
      if (orbLight.current) orbLight.current.intensity = (k > 0.2 ? 1.6 : 0) * pulse;
    }
    // a fresh trail begins, flowing toward the horizon
    if (newTrail.current) {
      for (let i = 0; i < NEW_DOTS; i++) {
        const reveal = THREE.MathUtils.clamp(pass * NEW_DOTS * 1.4 - i, 0, 1);
        dummy.position.set(1.05 + i * 0.42, 0.08, 1 + i * 0.16);
        const s = reveal * (0.85 + Math.sin(state.clock.elapsedTime * 2.6 - i * 0.6) * 0.15);
        dummy.scale.setScalar(Math.max(s, 0.001));
        dummy.updateMatrix();
        newTrail.current.setMatrixAt(i, dummy.matrix);
      }
      newTrail.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <group>
      {/* the life he built: home + studio of his own (life-scale, not dollhouse) */}
      <group position={[-1.9, 0, -1]} scale={1.5}>
        <Box p={[0, 0.55, 0]} s={[1.5, 1.1, 1.2]} m={M.cream} />
        <mesh position={[0, 1.35, 0]} rotation={[0, Math.PI / 4, 0]} material={M.cream2}>
          <coneGeometry args={[1.25, 0.7, 4]} />
        </mesh>
        <Box p={[0.35, 0.35, 0.62]} s={[0.34, 0.7, 0.06]} m={M.accent} />
      </group>
      <group position={[2, 0, -1.3]} scale={1.45}>
        <Box p={[0, 0.5, 0]} s={[1.3, 1, 1]} m={M.cream3} />
        <Box p={[0, 1.08, 0]} s={[1.45, 0.12, 1.15]} m={M.cream2} />
        <Box p={[0, 0.78, 0.52]} s={[0.8, 0.3, 0.05]} m={M.accent} />
      </group>
      <group position={[2.4, 0, 0.4]}>
        <mesh position={[0, 0.5, 0]} material={M.trunk}><cylinderGeometry args={[0.07, 0.1, 1, 6]} /></mesh>
        <mesh position={[0, 1.3, 0]} material={M.leaf}><coneGeometry args={[0.5, 1.3, 6]} /></mesh>
      </group>
      {/* him, grown — handing the spark to the next kid */}
      <Kid p={[-0.45, 0, 0.55]} scale={1.08} rotY={Math.PI / 2.6} pose="give" kidMat={kidMat} />
      <Kid p={[0.85, 0, 1]} scale={0.5} rotY={-Math.PI / 2.4} pose="reach" kidMat={M.cream3} />
      {/* the spark */}
      <group ref={orb} visible={false}>
        <mesh material={M.glow}><sphereGeometry args={[0.11, 12, 12]} /></mesh>
        <pointLight ref={orbLight} color={ACCENT} intensity={0} distance={4} />
      </group>
      {/* the next journey begins */}
      <instancedMesh ref={newTrail} args={[null, null, NEW_DOTS]} material={M.glow}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </instancedMesh>
    </group>
  );
}

// Sparse scenery along the route
function Scenery() {
  const items = useMemo(() => {
    const out = [];
    for (let i = 0; i < N - 1; i++) {
      const a = STATIONS[i], b = STATIONS[i + 1];
      out.push([THREE.MathUtils.lerp(a.x, b.x, 0.5), THREE.MathUtils.lerp(a.z, b.z, 0.5) + 7, 0.9]);
      out.push([THREE.MathUtils.lerp(a.x, b.x, 0.3), THREE.MathUtils.lerp(a.z, b.z, 0.3) - 7.5, 1.05]);
    }
    return out;
  }, []);
  return (
    <group>
      {items.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 0.5, 0]} material={M.trunk}>
            <cylinderGeometry args={[0.07, 0.1, 1, 6]} />
          </mesh>
          <mesh position={[0, 1.35, 0]} material={M.leaf}>
            <coneGeometry args={[0.55, 1.5, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Trail + camera ───────────────────────────────────────────────────────────
const DOTS = 400;

function useTrailCurve() {
  return useMemo(() => {
    const c = new THREE.CatmullRomCurve3(STATIONS.map((s) => s.clone().setY(0.08)));
    c.tension = 0.2;
    return c;
  }, []);
}

function Trail({ progress }) {
  const curve = useTrailCurve();
  const dotsRef = useRef();
  const sparkRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const t = dwellT(rawToT(progress.get()));
    if (dotsRef.current) {
      for (let i = 0; i < DOTS; i++) {
        const ti = i / (DOTS - 1);
        const pt = curve.getPointAt(ti);
        const lit = ti <= t;
        dummy.position.set(pt.x, lit ? 0.1 : 0.04, pt.z);
        const s = lit ? 1.2 : 0.4;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        dotsRef.current.setMatrixAt(i, dummy.matrix);
      }
      dotsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (sparkRef.current) {
      const pt = curve.getPointAt(t);
      sparkRef.current.position.set(pt.x, 0.24, pt.z);
    }
  });

  return (
    <group>
      <instancedMesh ref={dotsRef} args={[null, null, DOTS]} material={M.glow}>
        <sphereGeometry args={[0.09, 8, 8]} />
      </instancedMesh>
      <group ref={sparkRef}>
        <mesh material={M.glow}>
          <sphereGeometry args={[0.16, 12, 12]} />
        </mesh>
        <pointLight color={ACCENT} intensity={2.6} distance={5} />
      </group>
    </group>
  );
}

// Cinematic perspective camera + a sun that travels with the story so every
// scene gets crisp local shadows from a tight shadow frustum.
function CameraRig({ progress }) {
  const { camera, size, scene } = useThree();
  const curve = useTrailCurve();
  const target = useRef(STATIONS[0].clone());
  const sun = useRef();
  const sunTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    scene.add(sunTarget);
    if (sun.current) sun.current.target = sunTarget;
    return () => scene.remove(sunTarget);
  }, [scene, sunTarget]);

  useFrame(() => {
    const raw = progress.get();
    const t = dwellT(rawToT(raw));
    const pt = curve.getPointAt(t);
    // intro: pull wide and frame the world beside the headline, then dive in
    const wideK = 1 - THREE.MathUtils.clamp((raw - 0.04) / 0.05, 0, 1);
    target.current.lerp(new THREE.Vector3(pt.x + 0.8 + wideK * 2.6, 0, pt.z + wideK * 2), 0.07);
    const base = size.width < 768 ? 24 : size.width < 1280 ? 19 : 16.5;
    const d = base * (1 + wideK * 0.3);
    camera.position.set(target.current.x + d * 0.52, d * 0.6, target.current.z + d * 0.8);
    camera.lookAt(target.current.x, 0.7, target.current.z);
    if (sun.current) {
      sun.current.position.set(target.current.x + 6, 11, target.current.z + 5);
      sunTarget.position.set(target.current.x, 0, target.current.z);
    }
  });

  return (
    <directionalLight
      ref={sun}
      castShadow
      intensity={2.4}
      color="#FFF1DA"
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-camera-near={1}
      shadow-camera-far={40}
      shadow-bias={-0.0004}
    />
  );
}

// Everything solid casts and catches light — set once after the world mounts
function EnableShadows() {
  const { scene } = useThree();
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh && !o.isInstancedMesh && o.material !== M.glow && o.material !== WIRE && o.material !== M.screen) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);
  return null;
}

// Image-based lighting so the PBR materials have something to reflect
function PhotoEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function WorldFog() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog('#F5F0E8', 21, 44);
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

function useKidMats(progress) {
  const mats = useMemo(
    () => STATIONS.map(() => new THREE.MeshPhysicalMaterial({ color: KID_GREY, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.3, emissive: ACCENT, emissiveIntensity: 0 })),
    []
  );
  const grey = useMemo(() => new THREE.Color(KID_GREY), []);
  const warm = useMemo(() => new THREE.Color(KID_WARM), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const seg = rawToT(progress.get()) * (N - 1);
    mats.forEach((m, i) => {
      const k = THREE.MathUtils.clamp((seg - arrivalSeg(i)) / 0.2, 0, 1);
      tmp.copy(grey).lerp(warm, k);
      m.color.copy(tmp);
      m.emissiveIntensity = k * 0.32;
    });
  });
  return mats;
}

const SCENES = [TowerScene, TeardownScene, CircuitScene, CodeScene, SolderScene, PrintScene, CompeteScene, CollegeScene, VentureScene, LifeScene];

function World({ progress }) {
  const kidMats = useKidMats(progress);
  return (
    <>
      <Trail progress={progress} />
      {SCENES.map((Scene, i) => (
        <group key={i} position={STATIONS[i]} scale={SCALE}>
          <Materialize progress={progress} idx={i}>
            <Scene kidMat={kidMats[i]} progress={progress} idx={i} />
          </Materialize>
        </group>
      ))}
      <Scenery />
    </>
  );
}

export default function HeroWorld3D({ progress }) {
  return (
    <Canvas
      shadows
      camera={{ fov: 34, position: [9, 10, 14], near: 0.5, far: 220 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
      style={{ pointerEvents: 'none' }}
    >
      <hemisphereLight args={['#FFEFD8', '#C9B896', 0.55]} />
      <ambientLight intensity={0.18} />
      <WorldFog />
      <CameraRig progress={progress} />
      <PhotoEnvironment />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[300, 160]} />
        <meshStandardMaterial color="#DCD1B8" roughness={0.95} />
      </mesh>
      <World progress={progress} />
      <EnableShadows />
    </Canvas>
  );
}
