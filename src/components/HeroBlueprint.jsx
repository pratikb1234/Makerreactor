import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { BlueprintGrid } from './MakerElements';
import { useCircuitTriggers, HeroCTAs, EYEBROW } from './heroShared';

const ACCENT = '#FF5A00';
const M = {
  cream: new THREE.MeshPhysicalMaterial({ color: '#F2EAD9', roughness: 0.5, clearcoat: 0.3 }),
  ink: new THREE.MeshPhysicalMaterial({ color: '#2E2A26', roughness: 0.35, metalness: 0.7 }),
  accent: new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.22, clearcoat: 1, emissive: ACCENT, emissiveIntensity: 0.45 }),
  glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(3), toneMapped: false }),
};
const WIRE = new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.3 });
const ease = (k) => k * k * (3 - 2 * k);
const backOut = (k) => { const c = 1.70158; const x = k - 1; return 1 + (c + 1) * x ** 3 + c * x ** 2; };

const PROJECTS = [
  { x: -13, label: 'A GEAR TRAIN' },
  { x: -4.4, label: 'A LIVE CIRCUIT' },
  { x: 4.2, label: 'A ROBOT' },
  { x: 12.8, label: 'A FLYING DRONE' },
];

function Gear() {
  return (
    <group>
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <RoundedBox key={i} args={[0.32, 0.7, 0.4]} radius={0.05} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0]} rotation={[0, 0, a]} material={M.ink} />;
      })}
      <mesh material={M.accent}><torusGeometry args={[1.5, 0.35, 14, 32]} /></mesh>
      <mesh material={M.cream}><cylinderGeometry args={[0.5, 0.5, 0.5, 24]} /></mesh>
    </group>
  );
}
function Board() {
  return (
    <group>
      <RoundedBox args={[3, 0.25, 2]} radius={0.06} material={M.cream} />
      {[[-0.8, 0.4], [0.6, -0.3], [0.9, 0.5]].map(([x, z], i) => <RoundedBox key={i} args={[0.5, 0.35, 0.5]} radius={0.05} position={[x, 0.28, z]} material={M.ink} />)}
      <mesh position={[-0.2, 0.35, -0.5]} material={M.glow}><sphereGeometry args={[0.18, 16, 16]} /></mesh>
      <pointLight position={[-0.2, 0.6, -0.5]} color={ACCENT} intensity={6} distance={4} />
    </group>
  );
}
function Robot() {
  return (
    <group>
      <RoundedBox args={[1.7, 1.3, 1.3]} radius={0.18} position={[0, 0.2, 0]} material={M.cream} />
      <RoundedBox args={[1.1, 0.8, 0.9]} radius={0.16} position={[0, 1.3, 0]} material={M.cream} />
      <mesh position={[0.35, 1.35, 0.46]} material={M.glow}><sphereGeometry args={[0.16, 16, 16]} /></mesh>
      <pointLight position={[0.35, 1.4, 0.8]} color={ACCENT} intensity={5} distance={3} />
      <mesh position={[0, 2, 0]} material={M.ink}><cylinderGeometry args={[0.04, 0.04, 0.5, 8]} /></mesh>
      <mesh position={[0, 2.28, 0]} material={M.accent}><sphereGeometry args={[0.12, 12, 12]} /></mesh>
      {[-1, 1].map((s) => <RoundedBox key={s} args={[0.7, 0.5, 0.5]} radius={0.16} position={[0, -0.7, s * 0.5]} material={M.ink} />)}
    </group>
  );
}
function Drone({ spin }) {
  const props = [useRef(), useRef(), useRef(), useRef()];
  useFrame((_, dt) => props.forEach((p) => { if (p.current) p.current.rotation.y += dt * 18 * spin.current; }));
  return (
    <group>
      <RoundedBox args={[1.3, 0.4, 1.3]} radius={0.12} material={M.ink} />
      <mesh position={[0, -0.15, 0.6]} material={M.glow}><sphereGeometry args={[0.12, 12, 12]} /></mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
        <group key={i} position={[x * 0.9, 0.1, z * 0.9]}>
          <RoundedBox args={[0.2, 0.3, 0.2]} radius={0.05} material={M.accent} />
          <group ref={props[i]} position={[0, 0.25, 0]}><mesh material={M.cream}><boxGeometry args={[1.1, 0.05, 0.16]} /></mesh></group>
        </group>
      ))}
    </group>
  );
}

function Project({ proj, idx, progress, barX, spin }) {
  const solid = useRef();
  const wires = useRef();
  useEffect(() => {
    if (!solid.current || !wires.current || wires.current.children.length) return;
    const clone = solid.current.clone(true);
    const strip = [];
    clone.traverse((o) => { if (o.isLight) strip.push(o); else if (o.isMesh) o.material = WIRE; });
    strip.forEach((o) => o.parent && o.parent.remove(o)); // remove AFTER traversal, not during
    wires.current.add(clone);
  }, []);
  useFrame(() => {
    const built = ease(THREE.MathUtils.clamp((barX.current - proj.x + 2.5) / 4.5, 0, 1));
    if (solid.current) {
      const s = built < 0.02 ? 0.001 : backOut(built);
      solid.current.scale.setScalar(Math.max(s, 0.001));
      solid.current.visible = built > 0.02;
    }
    if (wires.current) { wires.current.visible = built < 0.97; wires.current.rotation.y += 0.002; }
  });
  return (
    <group position={[proj.x, 1.2, 0]}>
      <group ref={solid}>{idx === 0 ? <Gear /> : idx === 1 ? <Board /> : idx === 2 ? <Robot /> : <Drone spin={spin} />}</group>
      <group ref={wires} />
    </group>
  );
}

function Scene({ progress }) {
  const { camera, scene, gl } = useThree();
  const barX = useRef(-18);
  const spin = useRef(0);
  const bar = useRef();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env; scene.environmentIntensity = 0.5;
    scene.fog = new THREE.Fog('#F5F0E8', 22, 46);
    return () => { scene.environment = null; scene.fog = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  useFrame(() => {
    const p = progress.get();
    const t = THREE.MathUtils.clamp((p - 0.1) / 0.78, 0, 1);
    barX.current = THREE.MathUtils.lerp(-18, 18, t);
    spin.current = t > 0.78 ? 1 : 0;
    camera.position.set(barX.current * 0.62 + 2, 5.5, 15);
    camera.lookAt(barX.current * 0.62, 1, 0);
    if (bar.current) bar.current.position.x = barX.current;
  });
  return (
    <>
      <hemisphereLight args={['#FFEFD8', '#C9B896', 0.42]} />
      <directionalLight position={[6, 12, 6]} intensity={2.2} color="#FFF1DA" castShadow />
      <directionalLight position={[-8, 5, -4]} intensity={0.6} color="#FF7A3D" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow><planeGeometry args={[120, 60]} /><meshStandardMaterial color="#D4C6A6" roughness={0.97} /></mesh>
      {/* the sweeping build bar */}
      <mesh ref={bar} position={[-18, 1.5, 0]}><boxGeometry args={[0.12, 7, 7]} /><meshBasicMaterial color={new THREE.Color(ACCENT).multiplyScalar(3)} transparent opacity={0.5} toneMapped={false} /></mesh>
      {PROJECTS.map((proj, i) => <Project key={i} proj={proj} idx={i} progress={progress} barX={barX} spin={spin} />)}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.14} intensity={1.3} radius={0.85} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

export default function HeroBlueprint() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.85 });
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v - 0.1) / 0.78;
    setActive(v < 0.12 ? -1 : v > 0.9 ? 99 : Math.min(PROJECTS.length - 1, Math.floor(t * PROJECTS.length)));
  });
  const introOpacity = useTransform(p, [0, 0.07, 0.12], [1, 1, 0]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.1 ? 'none' : 'auto'));
  const outroOpacity = useTransform(p, [0.9, 0.95], [0, 1]);
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.91 ? 'auto' : 'none'));

  return (
    <section ref={ref} className="relative h-[520vh] bg-[var(--color-light)] font-sans" aria-label="Blueprint to built hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 z-0"><Canvas shadows camera={{ fov: 38, position: [2, 5.5, 15] }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => { gl.toneMappingExposure = 1.05; }} style={{ pointerEvents: 'none' }}><Scene progress={p} /></Canvas></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-light)] to-transparent z-[1] pointer-events-none" />
        <BlueprintGrid />

        {/* caption */}
        {active >= 0 && active < 90 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-20">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">// blueprint → built</div>
            <div className="font-display font-bold uppercase tracking-tighter text-3xl md:text-5xl text-black">{PROJECTS[active].label}</div>
          </div>
        )}

        {/* INTRO */}
        <motion.div style={{ opacity: introOpacity, pointerEvents: introPE }} className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh] text-center px-6 z-20">
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4"><span className="w-9 h-px bg-[var(--color-accent)]" />{EYEBROW}<span className="w-9 h-px bg-[var(--color-accent)]" /></div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.86] text-black text-[12vw] md:text-[6vw] mb-6">Plans become<br /><span className="text-[var(--color-accent)]">real things here.</span></h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-7">Scroll, and watch a blueprint materialize into something real — the way it happens in the studio.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>

        {/* OUTRO */}
        <motion.div style={{ opacity: outroOpacity, pointerEvents: outroPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[11vw] md:text-[5.5vw] mb-6">From plan<br /><span className="text-[var(--color-accent)]">to proof.</span></h2>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed mb-8">Every maker leaves with a portfolio of real, finished work.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
