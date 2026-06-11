import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { STUDIO_DNA } from './FourStudiosDNA';

// ── Geometry ─────────────────────────────────────────────────────────────────
const TURNS = 1.5;
const HEIGHT = 8.2;
const RADIUS = 1.6;
const STRAND_OFFSET = 2.4; // radians — real DNA grooves are asymmetric
const RUNGS = STUDIO_DNA.reduce((n, s) => n + s.skills.length, 0); // 12

const strandPoint = (t, phase) => {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return new THREE.Vector3(
    Math.cos(angle) * RADIUS,
    t * HEIGHT - HEIGHT / 2,
    Math.sin(angle) * RADIUS
  );
};

// Procedural studio reflections — no network fetch, can't fail offline
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

// One skill connector: colored strut + white joint + label chip.
// Reacts to its studio being hovered: glows, swells, others dim.
function Rung({ a, b, mid, color, skill, studioIdx, activeStudio, isInk }) {
  const group = useRef();
  const labelRef = useRef();
  const matRef = useRef();
  const world = useMemo(() => new THREE.Vector3(), []);

  const { quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a);
    return {
      length: dir.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      ),
    };
  }, [a, b]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const isActive = activeStudio === studioIdx;
    const isDimmed = activeStudio !== null && !isActive;
    const k = Math.min(1, delta * 6);

    const targetScale = isActive ? 1.22 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), k);

    if (matRef.current) {
      matRef.current.opacity += ((isDimmed ? 0.18 : 1) - matRef.current.opacity) * k;
      const targetEm = isInk ? 0 : isActive ? 0.6 : 0.2;
      matRef.current.emissiveIntensity += (targetEm - matRef.current.emissiveIntensity) * k;
    }

    if (labelRef.current) {
      group.current.getWorldPosition(world);
      const behind = world.z < -0.7;
      labelRef.current.style.opacity = behind ? 0.06 : isDimmed ? 0.18 : 1;
      labelRef.current.style.transform = `scale(${isActive && !behind ? 1.12 : 1})`;
    }
  });

  return (
    <group ref={group} position={mid}>
      <mesh quaternion={quaternion}>
        <cylinderGeometry args={[0.042, 0.042, length, 12]} />
        <meshPhysicalMaterial
          ref={matRef}
          color={color}
          roughness={0.28}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.2}
          emissive={isInk ? '#000000' : color}
          emissiveIntensity={0.2}
          transparent
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.12} metalness={0.1} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <Html center distanceFactor={9} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div
          ref={labelRef}
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: '#1A140D',
            background: 'rgba(245,240,232,0.92)',
            border: `1.5px solid ${color}`,
            borderRadius: 999,
            padding: '3px 10px',
            transition: 'opacity 0.3s, transform 0.3s',
            boxShadow: '0 2px 10px rgba(26,20,13,0.08)',
          }}
        >
          {skill}
        </div>
      </Html>
    </group>
  );
}

function HelixModel({ activeStudio, reduced }) {
  const group = useRef();
  const pointer = useRef({ x: 0, y: 0 });
  const idleSpin = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, rawDelta) => {
    if (!group.current) return;
    // Clamp delta so resuming after an offscreen pause never fast-forwards the
    // rotation — the helix only turns while it's actually being watched.
    const delta = Math.min(rawDelta, 0.05);
    if (!reduced) idleSpin.current += delta * 0.14;
    const targetY = idleSpin.current + pointer.current.x * 1.0;
    const targetX = pointer.current.y * 0.2;
    const k = Math.min(1, delta * 3.2);
    group.current.rotation.y += (targetY - group.current.rotation.y) * k;
    group.current.rotation.x += (targetX - group.current.rotation.x) * k;
  });

  const { tubeA, tubeB, rungs, backbone, bead } = useMemo(() => {
    const ptsA = [], ptsB = [];
    const SAMPLES = 200;
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      ptsA.push(strandPoint(t, 0));
      ptsB.push(strandPoint(t, STRAND_OFFSET));
    }
    const tubeA = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), 180, 0.055, 14, false);
    const tubeB = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), 180, 0.055, 14, false);

    const backbone = new THREE.MeshPhysicalMaterial({
      color: '#241B12', roughness: 0.32, metalness: 0.4,
      clearcoat: 1, clearcoatRoughness: 0.18,
    });
    const bead = new THREE.MeshPhysicalMaterial({
      color: '#3A2D1E', roughness: 0.25, metalness: 0.45,
      clearcoat: 1, clearcoatRoughness: 0.12,
    });

    // 12 skill connectors, grouped bottom→top by studio (3 per studio)
    const rungs = [];
    let r = 0;
    STUDIO_DNA.forEach((studio, studioIdx) => {
      studio.skills.forEach((skill) => {
        const t = 0.06 + 0.88 * (r / (RUNGS - 1));
        const a = strandPoint(t, 0);
        const b = strandPoint(t, STRAND_OFFSET);
        const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
        rungs.push({
          // strut endpoints relative to the rung's group (positioned at mid)
          a: a.clone().sub(mid), b: b.clone().sub(mid), mid,
          absA: a, absB: b,
          color: studio.color, skill, studioIdx, isInk: studio.ink,
        });
        r++;
      });
    });
    return { tubeA, tubeB, rungs, backbone, bead };
  }, []);

  return (
    <group ref={group} rotation={[0.1, 0, -0.12]}>
      <mesh geometry={tubeA} material={backbone} />
      <mesh geometry={tubeB} material={backbone} />
      {rungs.map((rg, i) => (
        <group key={`beads-${i}`}>
          <mesh position={rg.absA} material={bead}>
            <sphereGeometry args={[0.115, 20, 20]} />
          </mesh>
          <mesh position={rg.absB} material={bead}>
            <sphereGeometry args={[0.115, 20, 20]} />
          </mesh>
        </group>
      ))}
      {rungs.map((rg, i) => (
        <Rung
          key={`rung-${i}`}
          a={rg.a}
          b={rg.b}
          mid={rg.mid}
          color={rg.color}
          skill={rg.skill}
          studioIdx={rg.studioIdx}
          activeStudio={activeStudio}
          isInk={rg.isInk}
        />
      ))}
    </group>
  );
}

// ── Public component ─────────────────────────────────────────────────────────
export default function DNAHelix3D({ className = '', activeStudio = null }) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: '300px' }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <div
        className="absolute inset-0 m-auto w-[70%] h-[70%] rounded-full opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,90,0,0.13) 0%, transparent 65%)', filter: 'blur(30px)' }}
      />
      <Canvas
        camera={{ position: [0, 0, 10.5], fov: 36 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 7, 4]} intensity={1.4} />
        <pointLight position={[-6, -3, -4]} intensity={26} color="#FF5A00" />
        <pointLight position={[4, 5, 6]} intensity={10} color="#FFF3E6" />
        <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.1} floatIntensity={reduced ? 0 : 0.45}>
          <HelixModel activeStudio={activeStudio} reduced={reduced} />
        </Float>
        <ContactShadows position={[0, -5.1, 0]} opacity={0.28} scale={11} blur={2.8} far={5.5} />
        <StudioEnvironment />
      </Canvas>
    </div>
  );
}
