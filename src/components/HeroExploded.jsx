import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { BlueprintGrid } from './MakerElements';
import { useCircuitTriggers, HeroCTAs, EYEBROW } from './heroShared';

const ACCENT = '#FF5A00';
const M = {
  cream: new THREE.MeshPhysicalMaterial({ color: '#F2EAD9', roughness: 0.45, clearcoat: 0.35 }),
  ink: new THREE.MeshPhysicalMaterial({ color: '#2E2A26', roughness: 0.35, metalness: 0.7 }),
  accent: new THREE.MeshPhysicalMaterial({ color: ACCENT, roughness: 0.22, clearcoat: 1, emissive: ACCENT, emissiveIntensity: 0.5 }),
  glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(3), toneMapped: false }),
};
const ease = (k) => k * k * (3 - 2 * k);

// home position + explode direction(×dist) + label
const PARTS = [
  { home: [0, 1.85, 0], dir: [0, 2.6, 0], label: 'SENSORS', kind: 'sensor' },
  { home: [0, 1.05, 0], dir: [-3.2, 1.4, 0.5], label: 'VISION', kind: 'head' },
  { home: [0, 0, 0], dir: [0, 0, 3.4], label: 'THE CODE', kind: 'core' },
  { home: [-1.05, 0, 0], dir: [-3.4, -0.6, 0], label: 'ACTUATORS', kind: 'arm' },
  { home: [1.05, 0, 0], dir: [3.4, -0.6, 0], label: '3D-PRINTED SHELL', kind: 'arm' },
  { home: [0, -1.15, 0], dir: [0, -2.8, 0], label: 'DRIVE', kind: 'base' },
];

function PartMesh({ kind }) {
  if (kind === 'sensor') return (<group><mesh material={M.ink}><cylinderGeometry args={[0.05, 0.05, 0.6, 8]} /></mesh><mesh position={[0, 0.4, 0]} material={M.glow}><sphereGeometry args={[0.16, 16, 16]} /></mesh></group>);
  if (kind === 'head') return (<group><RoundedBox args={[1.1, 0.8, 0.9]} radius={0.16} material={M.cream} /><mesh position={[0.32, 0.05, 0.46]} material={M.glow}><sphereGeometry args={[0.15, 16, 16]} /></mesh></group>);
  if (kind === 'core') return (<group><RoundedBox args={[1.5, 1.5, 1.2]} radius={0.18} material={M.cream} /><mesh position={[0, 0, 0.62]} material={M.glow}><sphereGeometry args={[0.3, 20, 20]} /></mesh></group>);
  if (kind === 'arm') return <RoundedBox args={[0.6, 1.3, 0.6]} radius={0.14} material={M.ink} />;
  if (kind === 'base') return (<group><RoundedBox args={[1.8, 0.5, 1.2]} radius={0.14} material={M.ink} />{[-1, 1].map((s) => <mesh key={s} position={[s * 0.9, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.accent}><cylinderGeometry args={[0.35, 0.35, 0.3, 16]} /></mesh>)}</group>);
  return null;
}

function Part({ part, explode, showLabels }) {
  const g = useRef();
  useFrame(() => {
    const e = explode.current;
    if (g.current) g.current.position.set(
      THREE.MathUtils.lerp(part.home[0], part.home[0] + part.dir[0], e),
      THREE.MathUtils.lerp(part.home[1], part.home[1] + part.dir[1], e),
      THREE.MathUtils.lerp(part.home[2], part.home[2] + part.dir[2], e),
    );
  });
  return (
    <group ref={g}>
      <PartMesh kind={part.kind} />
      <Html center distanceFactor={11} position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ opacity: showLabels ? 1 : 0, transition: 'opacity .3s', whiteSpace: 'nowrap', fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', color: '#1A140D', background: 'rgba(242,234,217,.9)', border: `1.5px solid ${ACCENT}`, borderRadius: 999, padding: '3px 10px', transform: 'translateY(-34px)' }}>{part.label}</div>
      </Html>
    </group>
  );
}

function Scene({ progress, showLabels }) {
  const { camera, scene, gl } = useThree();
  const rig = useRef();
  const explode = useRef(0);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env; scene.environmentIntensity = 0.5;
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  useFrame((_, dt) => {
    const p = progress.get();
    // explode 0.12→0.6, hold, reassemble 0.86→1
    explode.current = p < 0.12 ? 0 : p < 0.6 ? ease((p - 0.12) / 0.48) : p < 0.86 ? 1 : ease(1 - (p - 0.86) / 0.14);
    if (rig.current) rig.current.rotation.y += dt * 0.25 + (p - 0.5) * 0.0;
    camera.position.set(Math.sin(p * 0.6) * 2, 1 + p * 1.5, 11);
    camera.lookAt(0, 0.4, 0);
  });
  return (
    <>
      <hemisphereLight args={['#FFEFD8', '#C9B896', 0.45]} />
      <directionalLight position={[6, 10, 6]} intensity={2.2} color="#FFF1DA" />
      <directionalLight position={[-8, 4, -4]} intensity={0.7} color="#FF7A3D" />
      <group ref={rig}>{PARTS.map((part, i) => <Part key={i} part={part} explode={explode} showLabels={showLabels} />)}</group>
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.14} intensity={1.3} radius={0.85} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

export default function HeroExploded() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.85 });
  const [showLabels, setShowLabels] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setShowLabels(v > 0.28 && v < 0.84));
  const introOpacity = useTransform(p, [0, 0.08, 0.13], [1, 1, 0]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.11 ? 'none' : 'auto'));
  const outroOpacity = useTransform(p, [0.88, 0.94], [0, 1]);
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.9 ? 'auto' : 'none'));

  return (
    <section ref={ref} className="relative h-[480vh] bg-[var(--color-light)] font-sans" aria-label="Exploded build hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        <BlueprintGrid />
        <div className="absolute inset-0 z-0"><Canvas camera={{ fov: 40, position: [0, 1, 11] }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => { gl.toneMappingExposure = 1.05; }} style={{ pointerEvents: 'none' }}><Scene progress={p} showLabels={showLabels} /></Canvas></div>

        {/* mid caption */}
        <motion.div style={{ opacity: useTransform(p, [0.3, 0.38, 0.8, 0.86], [0, 1, 1, 0]) }} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">// every part, made by them</div>
          <div className="font-display font-bold uppercase tracking-tighter text-2xl md:text-4xl text-black">Not a kit. A build.</div>
        </motion.div>

        {/* INTRO */}
        <motion.div style={{ opacity: introOpacity, pointerEvents: introPE }} className="absolute inset-0 flex flex-col items-center justify-start pt-[14vh] text-center px-6 z-20">
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4"><span className="w-9 h-px bg-[var(--color-accent)]" />{EYEBROW}<span className="w-9 h-px bg-[var(--color-accent)]" /></div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.86] text-black text-[12vw] md:text-[6vw] mb-6">They build it.<br /><span className="text-[var(--color-accent)]">Every part.</span></h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-7">Scroll to take it apart — sensors, code, actuators, a 3D-printed shell. All theirs.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>

        {/* OUTRO */}
        <motion.div style={{ opacity: outroOpacity, pointerEvents: outroPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[11vw] md:text-[5.5vw] mb-6">Understand<br /><span className="text-[var(--color-accent)]">every layer.</span></h2>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed mb-8">A maker who built it knows how it works — and how to fix it.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
