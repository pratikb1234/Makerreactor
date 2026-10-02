import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, ContactShadows, Float, PresentationControls, Image } from '@react-three/drei';
import * as THREE from 'three';

// Reconstructed to match the live bitsandstudios.com build (June 9 2026 deploy,
// with Mohit Ahuja + Mantasha Sheikh removed on Aug 8 2026).

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) { // eslint-disable-line no-unused-vars
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#222', color: '#ff5555', fontFamily: 'monospace', minHeight: '100vh', zIndex: 9999, position: 'relative' }}>
          <h2>Something crashed!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// NOTE: the photo files are named the other way round (pratik.jpg / anjalee.jpg),
// so the live site maps them crosswise to show the right face on each card.
const team = [
  { id: "01", name: "Pratik Bhatt", role: "Maker-in-Chief", bio: "Hand him anything complicated and he will light up taking it apart. For Pratik, the fun starts when things stop working.", image: "./anjalee.jpg" },
  { id: "02", name: "Anjalee Bhatt", role: "Designer-in-Chief", bio: "A designer at heart and a teacher by calling. Trained at CEPT, Anjalee has spent a decade preparing learners for university and for life. She is endlessly curious, deeply empathetic, and happiest helping a young maker find their voice.", image: "./pratik.jpg" },
  { id: "05", name: "Aryan Parmar", role: "Robotics Educator & Coach", bio: "The one you want in your corner on competition day. With a Master's in Computer Science, Aryan coaches our teams and helps makers turn rough ideas into machines that win.", image: "./aryan.jpg" },
  { id: "06", name: "Sohil Sheikh", role: "Educator", bio: "The steady hand in the room, Sohil keeps every build moving and every maker unstuck. B.Tech, Computer Science.", image: "./sohil.jpg" },
  { id: "07", name: "Foram Mendha", role: "Educator", bio: "Patient, precise, and endlessly encouraging, Foram has a gift for meeting makers exactly where they are. B.Tech, Computer Science.", image: "./foram.jpg" }
];

function AnimatedTubeConnection({ start, end, mid, color, opacity, speed, offset, isDark }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    // Create a 3D tube geometry for rock-solid native WebGL rendering (avoids buggy line materials)
    return new THREE.TubeGeometry(curve, 30, 0.04, 8, false);
  }, [start, end, mid]);

  useFrame((state) => {
    if (meshRef.current) {
      // Create a pulsing 'energy flow' effect that pulses along the saber
      const time = state.clock.elapsedTime * speed + offset;
      const intensity = (Math.sin(time) + 1) / 2; // 0 to 1
      meshRef.current.material.opacity = opacity * (0.3 + 0.7 * intensity);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </mesh>
  );
}

function NetworkConnections({ team, isDark }) {
  const radius = 6.5;
  const lines = [];

  for (let i = 0; i < team.length; i++) {
    const angle1 = (i / team.length) * Math.PI * 2;
    const start = new THREE.Vector3(Math.sin(angle1) * radius, 0, Math.cos(angle1) * radius);

    // Connect to adjacent node
    const nextIndex = (i + 1) % team.length;
    const angle2 = (nextIndex / team.length) * Math.PI * 2;
    const end1 = new THREE.Vector3(Math.sin(angle2) * radius, 0, Math.cos(angle2) * radius);

    // Connect to across node to form a complex network
    const acrossIndex = (i + 2) % team.length;
    const angle3 = (acrossIndex / team.length) * Math.PI * 2;
    const end2 = new THREE.Vector3(Math.sin(angle3) * radius, 0, Math.cos(angle3) * radius);

    // Parabolic mid points (curving upwards into the center)
    const mid1 = new THREE.Vector3((start.x + end1.x) / 2, 2.5, (start.z + end1.z) / 2);
    const mid2 = new THREE.Vector3((start.x + end2.x) / 2, 4.5, (start.z + end2.z) / 2);

    // Primary connection
    lines.push(
      <AnimatedTubeConnection
        key={`tube1-${i}`}
        start={start}
        end={end1}
        mid={mid1}
        color="#FF5A00"
        speed={3.0}
        offset={i * 0.5}
        opacity={isDark ? 0.8 : 1}
        isDark={isDark}
      />
    );

    // Secondary connection
    lines.push(
      <AnimatedTubeConnection
        key={`tube2-${i}`}
        start={start}
        end={end2}
        mid={mid2}
        color={isDark ? "#ffffff" : "#FF5A00"}
        speed={2.0}
        offset={i * 0.8}
        opacity={isDark ? 0.3 : 0.5}
        isDark={isDark}
      />
    );
  }

  return <group>{lines}</group>;
}

function TeamMember3D({ member, index, position, rotation }) {
  const scaleFactor = 0.75; // medium
  const groupRef = useRef();
  const htmlContainerRef = useRef();

  useFrame(() => {
    if (!groupRef.current || !htmlContainerRef.current) return;

    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    // The camera is at Z=14 looking at Z=0.
    // Anything with a world Z < -1 is on the back half of the ring.
    if (worldPos.z < -1) {
      htmlContainerRef.current.style.opacity = '0';
      htmlContainerRef.current.style.pointerEvents = 'none';
    } else {
      htmlContainerRef.current.style.opacity = '1';
      htmlContainerRef.current.style.pointerEvents = 'auto';
    }
  });

  // Render a different abstract 3D shape for each member as a temporary avatar
  const renderAvatarShape = () => {
    switch (index % 7) {
      case 0: return <icosahedronGeometry args={[1.5, 0]} />;
      case 1: return <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      case 2: return <cylinderGeometry args={[1.2, 1.2, 3, 32]} />;
      case 3: return <dodecahedronGeometry args={[1.5, 0]} />;
      case 4: return <coneGeometry args={[1.5, 3, 32]} />;
      case 5: return <octahedronGeometry args={[1.5, 0]} />;
      case 6: return <torusGeometry args={[1.2, 0.4, 16, 100]} />;
      default: return <boxGeometry args={[2, 2, 2]} />;
    }
  };

  return (
    <group position={position} rotation={rotation} ref={groupRef} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      {/* Photo, or an abstract 3D avatar when there is no photo */}
      <group position={[0, 1, 0]}>
        {member.image ? (
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <Image url={member.image} scale={[2.5, 2.5]} transparent radius={0.1} side={THREE.DoubleSide} />
            {/* Subtle glow/border behind the image */}
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[2.6, 2.6]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.5} wireframe />
            </mesh>
          </Float>
        ) : (
          <group>
            {/* Bright, friendly Inner Body */}
            <mesh castShadow receiveShadow>
              {renderAvatarShape()}
              <meshStandardMaterial color="#e6e6e6" metalness={0.2} roughness={0.1} />
            </mesh>

            {/* Subtle Orange Wireframe Overlay */}
            <mesh>
              {renderAvatarShape()}
              <meshBasicMaterial color="#FF5A00" wireframe transparent opacity={0.15} />
            </mesh>
          </group>
        )}
      </group>

      {/* Floating Data Card */}
      <Html transform position={[0, -2, 0.22]} distanceFactor={3.5} className="pointer-events-none">
        <div ref={htmlContainerRef} className="w-[300px] p-6 backdrop-blur-md border rounded-xl transition-all duration-500 shadow-xl bg-white/70 border-black/10 hover:border-[var(--color-accent)]">
          <div className="font-mono text-[12px] uppercase tracking-widest text-[var(--color-accent)] mb-2 font-bold drop-shadow-md">
            {member.role}
          </div>
          <h3 className="text-3xl font-display font-bold uppercase mb-3 leading-tight text-black">
            {member.name}
          </h3>
          <p className="text-[13px] font-sans leading-relaxed text-gray-600">
            {member.bio}
          </p>
        </div>
      </Html>
    </group>
  );
}

export default function Credibility() {
  const bgColor = '#f5f5f5';

  return (
    <ErrorBoundary>
      <section className="h-screen min-h-[900px] relative overflow-hidden transition-colors duration-700 bg-[#e8e8e8] text-black border-black/5 border-t">

        {/* UI Overlay */}
        <div className="absolute top-12 left-12 z-20 pointer-events-none">
          <div className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-px bg-[var(--color-accent)]" />
            The Mentors
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] max-w-2xl">
            Makers behind <br />MakerSpace.
          </h2>
        </div>

        <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10">
          <Canvas camera={{ position: [0, 1, 14], fov: 45 }} shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <color attach="background" args={[bgColor]} />
              <fog attach="fog" args={[bgColor, 10, 30]} />

              <ambientLight intensity={2.5} />
              <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
              <pointLight position={[-10, 0, -10]} intensity={0.5} color="#FF5A00" />

              <PresentationControls
                global
                speed={3}
                zoom={0.8}
                rotation={[0, 0, 0]}
                polar={[-0.15, 0.15]}
                azimuth={[-Infinity, Infinity]}
                config={{ mass: 1, tension: 120, friction: 14 }}
              >
                <group position={[0, -0.5, 0]}>
                  {/* Network Connections connecting the team */}
                  <group position={[0, -1, 0]}>
                    <NetworkConnections team={team} isDark={false} />
                  </group>

                  {/* Orbiting Team Avatars */}
                  {team.map((member, i) => {
                    const angle = (i / team.length) * Math.PI * 2;
                    const radius = 6.5;
                    return (
                      <Float key={member.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
                        <TeamMember3D
                          member={member}
                          index={i}
                          position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
                          rotation={[0, angle, 0]}
                        />
                      </Float>
                    );
                  })}
                  {/* Ground Shadow */}
                  <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.2} far={10} color="#000000" position={[0, -3.5, 0]} />
                </group>
              </PresentationControls>

              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </section>
    </ErrorBoundary>
  );
}
