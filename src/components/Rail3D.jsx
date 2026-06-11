import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// ── 3D elevator rail for the program pathway ─────────────────────────────────
// One sticky viewport-height canvas with an orthographic camera mapped 1:1 to
// CSS pixels. Geometry positions are computed each frame from document
// coordinates, so the 3D gears sit exactly on the DOM card nodes and the
// capsule descends in perfect sync with the scroll spring.

function Env() {
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

const bronzeMat = () =>
  new THREE.MeshPhysicalMaterial({
    color: '#241B12', roughness: 0.32, metalness: 0.45,
    clearcoat: 1, clearcoatRoughness: 0.18,
  });

// A physically-lit gear: ring + teeth + hub. Spins while the capsule touches it.
function Gear({ refObj }) {
  const hubMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FF5A00', roughness: 0.3, metalness: 0.1,
        clearcoat: 1, clearcoatRoughness: 0.2,
        emissive: '#FF5A00', emissiveIntensity: 0.1,
      }),
    []
  );
  const body = useMemo(() => bronzeMat(), []);
  return (
    <group ref={(g) => { if (g) { refObj.group = g; refObj.hubMat = hubMat; } }} visible={false}>
      <mesh material={body} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[26, 6.5, 12, 48]} />
      </mesh>
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={`t${i}`} material={body} position={[Math.cos(a) * 33, Math.sin(a) * 33, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[12, 9, 9]} />
          </mesh>
        );
      })}
      <mesh material={hubMat}>
        <cylinderGeometry args={[11, 11, 14, 24]} />
      </mesh>
      <mesh material={body} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[15, 2.5, 10, 32]} />
      </mesh>
    </group>
  );
}

function RailScene({ progress, geom }) {
  const { size } = useThree();
  const railL = useRef();
  const railR = useRef();
  const rope = useRef();
  const capsule = useRef();
  const coreMat = useRef();
  const gearRefs = useMemo(() => [{}, {}, {}, {}], []);
  const capsuleMats = useRef([]);
  const spinSpeed = useRef([0, 0, 0, 0]);

  const shellMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF', roughness: 0.18, metalness: 0.05,
        clearcoat: 1, clearcoatRoughness: 0.1, transparent: true,
      }),
    []
  );
  const capBronze = useMemo(() => { const m = bronzeMat(); m.transparent = true; return m; }, []);
  const ropeMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#2E251A', roughness: 0.5, metalness: 0.3, transparent: true }),
    []
  );

  useFrame((state, rawDelta) => {
    const g = geom.current;
    if (!g) return;
    const delta = Math.min(rawDelta, 0.05);
    const vh = size.height;
    const sy = window.scrollY;
    const toWorldY = (docY) => vh / 2 - (docY - sy);

    // Rail tubes: from section top to the boundary, clamped to the viewport
    const topDoc = Math.max(g.sectionTop, sy - 60);
    const botDoc = Math.min(g.boundaryDoc, sy + vh + 60);
    const railLen = Math.max(botDoc - topDoc, 0);
    const midY = (toWorldY(topDoc) + toWorldY(botDoc)) / 2;
    [railL.current, railR.current].forEach((r, i) => {
      if (!r) return;
      r.visible = railLen > 0;
      r.position.set(i === 0 ? -16 : 16, midY, -14);
      r.scale.y = railLen;
    });

    // Capsule + rope follow the spring-smoothed scroll progress
    const p = progress.get();
    const capDoc = g.sectionTop + p * 0.98 * g.containerH;
    const capScreen = capDoc - sy;
    const capVisible = capScreen > -120 && capScreen < vh + 120;
    const fade = THREE.MathUtils.clamp((g.boundaryDoc - capDoc) / 140, 0, 1);

    if (capsule.current) {
      capsule.current.visible = capVisible && fade > 0.01;
      capsule.current.position.y = toWorldY(capDoc);
      capsule.current.rotation.y += delta * 0.6;
      [shellMat, capBronze].forEach((m) => (m.opacity = fade));
      if (coreMat.current) {
        coreMat.current.opacity = fade;
        coreMat.current.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.35;
      }
    }
    if (rope.current) {
      const ropeTop = Math.max(g.sectionTop, sy - 60);
      const ropeLen = Math.max(capDoc - 40 - ropeTop, 0);
      rope.current.visible = ropeLen > 0 && fade > 0.01;
      ropeMat.opacity = fade;
      rope.current.position.y = (toWorldY(ropeTop) + toWorldY(ropeTop + ropeLen)) / 2;
      rope.current.scale.y = ropeLen;
    }

    // Gears: sit on their DOM anchors, spin while the capsule is passing
    g.nodes.forEach((docY, i) => {
      const ref = gearRefs[i];
      if (!ref.group) return;
      const screen = docY - sy;
      ref.group.visible = screen > -90 && screen < vh + 90;
      ref.group.position.set(0, toWorldY(docY), 0);
      const active = Math.abs(capDoc - docY) < 130;
      const target = active ? 2.6 : 0;
      spinSpeed.current[i] += (target - spinSpeed.current[i]) * Math.min(1, delta * 4);
      ref.group.rotation.z += delta * spinSpeed.current[i];
      if (ref.hubMat) {
        ref.hubMat.emissiveIntensity += ((active ? 0.65 : 0.1) - ref.hubMat.emissiveIntensity) * Math.min(1, delta * 5);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[120, 200, 300]} intensity={1.3} />
      <pointLight position={[-120, -80, 120]} intensity={60000} color="#FF5A00" />
      <Env />

      {/* rail tubes (unit cylinders, scaled each frame) */}
      <mesh ref={railL} material={useMemo(() => bronzeMat(), [])}>
        <cylinderGeometry args={[3.2, 3.2, 1, 12]} />
      </mesh>
      <mesh ref={railR} material={useMemo(() => bronzeMat(), [])}>
        <cylinderGeometry args={[3.2, 3.2, 1, 12]} />
      </mesh>

      {/* rope */}
      <mesh ref={rope} material={ropeMat}>
        <cylinderGeometry args={[2.1, 2.1, 1, 8]} />
      </mesh>

      {/* capsule */}
      <group ref={capsule}>
        <mesh material={shellMat}>
          <capsuleGeometry args={[22, 36, 8, 24]} />
        </mesh>
        <mesh material={capBronze} position={[0, 34, 0]}>
          <cylinderGeometry args={[10, 14, 12, 16]} />
        </mesh>
        <mesh material={capBronze} position={[0, -34, 0]}>
          <cylinderGeometry args={[14, 10, 12, 16]} />
        </mesh>
        <mesh material={capBronze} position={[0, 44, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7, 2.4, 8, 20]} />
        </mesh>
        <mesh>
          <sphereGeometry args={[11, 20, 20]} />
          <meshPhysicalMaterial
            ref={coreMat}
            color="#FF5A00"
            emissive="#FF5A00"
            emissiveIntensity={1}
            roughness={0.2}
            transparent
          />
        </mesh>
      </group>

      {gearRefs.map((refObj, i) => (
        <Gear key={i} refObj={refObj} />
      ))}
    </>
  );
}

export default function Rail3D({ progress }) {
  const wrapRef = useRef(null);
  const geom = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const section = wrapRef.current.closest('section');
    const railBox = wrapRef.current.parentElement.parentElement; // the overhang container
    const measure = () => {
      const sRect = section.getBoundingClientRect();
      const sectionTop = sRect.top + window.scrollY;
      const overhang = parseFloat(getComputedStyle(railBox).getPropertyValue('--rail-overhang')) || 0;
      geom.current = {
        sectionTop,
        containerH: sRect.height + overhang,
        boundaryDoc: sectionTop + sRect.height,
        nodes: [...section.querySelectorAll('.rail-node-anchor')].map((el) => {
          const r = el.getBoundingClientRect();
          return r.top + r.height / 2 + window.scrollY;
        }),
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    window.addEventListener('resize', measure);
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { rootMargin: '200px' });
    io.observe(wrapRef.current);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 500], zoom: 1, near: 0.1, far: 1200 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={running ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
      >
        <RailScene progress={progress} geom={geom} />
      </Canvas>
    </div>
  );
}
