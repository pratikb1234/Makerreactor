import { useRef, useEffect, useMemo, useState } from 'react';
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
  board: new THREE.MeshPhysicalMaterial({ color: '#26201A', roughness: 0.6, metalness: 0.2 }),
  cream: new THREE.MeshPhysicalMaterial({ color: '#EFE6D2', roughness: 0.5, clearcoat: 0.3 }),
  ink: new THREE.MeshPhysicalMaterial({ color: '#2E2A26', roughness: 0.4, metalness: 0.6 }),
  traceDim: new THREE.MeshBasicMaterial({ color: '#7A4A28' }),
  glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT).multiplyScalar(3), toneMapped: false }),
};
const ease = (k) => k * k * (3 - 2 * k);

const DISTRICTS = [
  { pos: [-9, 4], label: 'TINKER', t: 0.04 },
  { pos: [-3, -5], label: 'BUILD', t: 0.34 },
  { pos: [5, 4], label: 'ENGINEER', t: 0.64 },
  { pos: [11, -3], label: 'INVENT', t: 0.95 },
];

function District({ d, pulseT }) {
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#EFE6D2', roughness: 0.4, clearcoat: 0.6, emissive: ACCENT, emissiveIntensity: 0 }), []);
  const light = useRef();
  useFrame((s) => {
    const lit = THREE.MathUtils.clamp((pulseT.current - d.t + 0.05) / 0.05, 0, 1);
    mat.emissiveIntensity = lit * (0.5 + Math.sin(s.clock.elapsedTime * 3) * 0.15 * lit);
    if (light.current) light.current.intensity = lit * 8;
  });
  return (
    <group position={[d.pos[0], 0, d.pos[1]]}>
      <RoundedBox args={[2.4, 1.4, 2.4]} radius={0.12} position={[0, 0.7, 0]} material={mat} />
      <RoundedBox args={[1.2, 2.2, 1.2]} radius={0.1} position={[0.4, 1.1, -0.4]} material={M.ink} />
      <pointLight ref={light} position={[0, 1.6, 0]} color={ACCENT} intensity={0} distance={7} />
      <Html center distanceFactor={16} position={[0, 2.8, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ whiteSpace: 'nowrap', fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 700, letterSpacing: '.18em', color: '#1A140D', background: 'rgba(242,234,217,.92)', border: `1.5px solid ${ACCENT}`, borderRadius: 999, padding: '3px 11px' }}>{d.label}</div>
      </Html>
    </group>
  );
}

function Scene({ progress }) {
  const { camera, scene, gl } = useThree();
  const pulse = useRef();
  const pLight = useRef();
  const litTrace = useRef();
  const pulseT = useRef(0);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(DISTRICTS.map((d) => new THREE.Vector3(d.pos[0], 0.15, d.pos[1])), false, 'catmullrom', 0.4), []);
  const fullTrace = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.12, 8, false), [curve]);
  const litGeo = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.16, 8, false), [curve]);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env; scene.environmentIntensity = 0.4;
    scene.fog = new THREE.Fog('#F5F0E8', 26, 52);
    return () => { scene.environment = null; scene.fog = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene]);

  useFrame(() => {
    const p = progress.get();
    const t = THREE.MathUtils.clamp((p - 0.1) / 0.78, 0, 1);
    pulseT.current = t;
    const pt = curve.getPointAt(Math.min(t, 0.999));
    if (pulse.current) pulse.current.position.copy(pt).setY(0.35);
    if (pLight.current) pLight.current.position.copy(pt).setY(1);
    if (litTrace.current) litTrace.current.geometry.setDrawRange(0, Math.floor(litGeo.index.count * t));
    camera.position.set(pt.x * 0.5 + 4, 17, pt.z * 0.5 + 12);
    camera.lookAt(pt.x * 0.5, 0, pt.z * 0.5);
  });

  return (
    <>
      <hemisphereLight args={['#FFEFD8', '#7A6A52', 0.5]} />
      <directionalLight position={[8, 16, 8]} intensity={1.6} color="#FFF1DA" />
      {/* the board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[80, 50]} /><meshStandardMaterial color="#221C16" roughness={0.7} /></mesh>
      {/* grid streets (dim) */}
      {[...Array(9)].map((_, i) => <mesh key={`h${i}`} position={[0, 0.02, -16 + i * 4]} rotation={[-Math.PI / 2, 0, 0]} material={M.traceDim}><planeGeometry args={[70, 0.08]} /></mesh>)}
      {[...Array(15)].map((_, i) => <mesh key={`v${i}`} position={[-32 + i * 4.6, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.traceDim}><planeGeometry args={[0.08, 44]} /></mesh>)}
      {/* full route trace (dim) + lit overlay */}
      <mesh geometry={fullTrace} material={M.traceDim} />
      <mesh ref={litTrace} geometry={litGeo} material={M.glow} />
      {/* the pulse */}
      <mesh ref={pulse} material={M.glow}><sphereGeometry args={[0.28, 16, 16]} /></mesh>
      <pointLight ref={pLight} color={ACCENT} intensity={9} distance={9} />
      {DISTRICTS.map((d, i) => <District key={i} d={d} pulseT={pulseT} />)}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.14} intensity={1.5} radius={0.9} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}

export default function HeroCircuitCity() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.85 });
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v - 0.1) / 0.78;
    let idx = -1;
    DISTRICTS.forEach((d, i) => { if (t >= d.t - 0.12) idx = i; });
    setActive(v < 0.12 ? -1 : v > 0.92 ? 99 : idx);
  });
  const introOpacity = useTransform(p, [0, 0.08, 0.13], [1, 1, 0]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.11 ? 'none' : 'auto'));
  const outroOpacity = useTransform(p, [0.9, 0.95], [0, 1]);
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.91 ? 'auto' : 'none'));

  return (
    <section ref={ref} className="relative h-[500vh] bg-[var(--color-light)] font-sans" aria-label="Circuit city hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        <BlueprintGrid />
        <div className="absolute inset-0 z-0"><Canvas camera={{ fov: 42, position: [4, 17, 12] }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => { gl.toneMappingExposure = 1.05; }} style={{ pointerEvents: 'none' }}><Scene progress={p} /></Canvas></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-light)] to-transparent z-[1] pointer-events-none" />

        {active >= 0 && active < 90 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">// the current reaches</div>
            <div className="font-display font-bold uppercase tracking-tighter text-3xl md:text-5xl text-black">{DISTRICTS[active].label}</div>
          </div>
        )}

        {/* INTRO */}
        <motion.div style={{ opacity: introOpacity, pointerEvents: introPE }} className="absolute inset-0 flex flex-col items-center justify-start pt-[14vh] text-center px-6 z-20">
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4"><span className="w-9 h-px bg-[var(--color-accent)]" />{EYEBROW}<span className="w-9 h-px bg-[var(--color-accent)]" /></div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.86] text-black text-[12vw] md:text-[6vw] mb-6">One board.<br /><span className="text-[var(--color-accent)]">Four districts.</span></h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-7">Scroll to send the current through the maker's city — Tinker, Build, Engineer, Invent.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>

        {/* OUTRO */}
        <motion.div style={{ opacity: outroOpacity, pointerEvents: outroPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[11vw] md:text-[5.5vw] mb-6">The whole board<br /><span className="text-[var(--color-accent)]">lights up.</span></h2>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed mb-8">A year-long journey across four studios — every maker travels the full circuit.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
