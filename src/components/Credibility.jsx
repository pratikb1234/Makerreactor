import { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, ContactShadows, Float, PresentationControls, Image, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

const team = [
  { id: "01", name: "Pratik Bhatt", role: "Maker-in-Chief", bio: "Hand him anything complicated and he will light up taking it apart. For Pratik, the fun starts when things stop working.", image: "./pratik.jpg" },
  { id: "02", name: "Anjalee Bhatt", role: "Designer-in-Chief", bio: "A designer at heart and a teacher by calling. Trained at CEPT, Anjalee has spent a decade preparing learners for university and for life. She is endlessly curious, deeply empathetic, and happiest helping a young maker find their voice.", image: "./anjalee.jpg" },
  { id: "03", name: "Mohit Ahuja", role: "Senior Educator", bio: "A maker who genuinely wears many hats, science one day, design the next. A B.Sc. gold medalist and formerly of Riverside, Mohit brings range, rigour, and real warmth to the studio." },
  { id: "04", name: "Aryan Parmar", role: "Robotics Educator & Coach", bio: "The one you want in your corner on competition day. With a Master's in Computer Science, Aryan coaches our teams and helps makers turn rough ideas into machines that win." },
  { id: "05", name: "Mantasha Sheikh", role: "Educator", bio: "She makes code click for makers who thought it wasn't for them. A B.Tech in Computer Science, she loves teaching coding and digital design." },
  { id: "06", name: "Foram Mendha", role: "Educator", bio: "Patient, precise, and endlessly encouraging, Foram has a gift for meeting makers exactly where they are. B.Tech, Computer Science." },
  { id: "07", name: "Sohil Sheikh", role: "Educator", bio: "The steady hand in the room, Sohil keeps every build moving and every maker unstuck. B.Tech, Computer Science." }
];

const VIDEO_URLS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
];

function VideoAvatar({ index }) {
  const url = VIDEO_URLS[index % VIDEO_URLS.length];
  // useVideoTexture auto-plays and loops by default, but MUST be muted to bypass browser autoplay blocks!
  const texture = useVideoTexture(url, { crossOrigin: 'Anonymous', muted: true });
  
  return (
    <mesh>
      <planeGeometry args={[2.5, 2.5]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function TeamMember3D({ member, index, position, rotation, mediaMode, themeMode }) {
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
    switch(index % 7) {
      case 0: return <icosahedronGeometry args={[1.5, 0]} />; // Pratik
      case 1: return <torusKnotGeometry args={[1, 0.3, 100, 16]} />; // Anjalee
      case 2: return <cylinderGeometry args={[1.2, 1.2, 3, 32]} />; // Mohit
      case 3: return <dodecahedronGeometry args={[1.5, 0]} />; // Aryan
      case 4: return <coneGeometry args={[1.5, 3, 32]} />; // Mantasha
      case 5: return <octahedronGeometry args={[1.5, 0]} />; // Foram
      case 6: return <torusGeometry args={[1.2, 0.4, 16, 100]} />; // Sohil
      default: return <boxGeometry args={[2, 2, 2]} />;
    }
  };

  const isDark = themeMode === 'dark';

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      
      {/* ==================================================== */}
      {/* 3D AVATAR, PHOTO, OR VIDEO */}
      {/* ==================================================== */}
      <group position={[0, 1, 0]}>
        {mediaMode === 'video' ? (
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <VideoAvatar index={index} />
            {/* Subtle glow/border behind the video */}
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[2.6, 2.6]} />
              <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} transparent opacity={0.5} wireframe />
            </mesh>
          </Float>
        ) : member.image ? (
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            {/* The Image plane itself */}
            <Image url={member.image} scale={[2.5, 2.5]} transparent radius={0.1} side={THREE.DoubleSide} />
            {/* Subtle glow/border behind the image */}
            <mesh position={[0, 0, -0.05]}>
              <planeGeometry args={[2.6, 2.6]} />
              <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} transparent opacity={0.5} wireframe />
            </mesh>
          </Float>
        ) : (
          <>
            {/* Bright, friendly Inner Body */}
            <mesh castShadow receiveShadow>
              {renderAvatarShape()}
              <meshStandardMaterial color={isDark ? "#ffffff" : "#e6e6e6"} metalness={0.2} roughness={0.1} />
            </mesh>
            
            {/* Subtle Orange Wireframe Overlay */}
            <mesh>
              {renderAvatarShape()}
              <meshBasicMaterial color="#FF5A00" wireframe transparent opacity={0.15} />
            </mesh>
          </>
        )}
      </group>

      {/* Floating Data Card */}
      <Html transform position={[0, -2, 0.22]} distanceFactor={3.5} className="pointer-events-none">
        <div ref={htmlContainerRef} className={`w-[300px] p-6 backdrop-blur-md border rounded-xl transition-all duration-500 shadow-xl ${isDark ? 'bg-white/10 border-white/20 hover:border-[var(--color-accent)]' : 'bg-white/70 border-black/10 hover:border-[var(--color-accent)]'}`}>
          <div className="font-mono text-[12px] uppercase tracking-widest text-[var(--color-accent)] mb-2 font-bold drop-shadow-md">
            {member.role}
          </div>
          <h3 className={`text-3xl font-display font-bold uppercase mb-3 leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
            {member.name}
          </h3>
          <p className={`text-sm leading-relaxed line-clamp-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {member.bio}
          </p>
        </div>
      </Html>
    </group>
  );
}

export default function Credibility() {
  const [mediaMode, setMediaMode] = useState('picture');
  const [themeMode, setThemeMode] = useState('dark');

  const isDark = themeMode === 'dark';
  const bgColor = isDark ? '#141414' : '#f5f5f5';

  return (
    <section className={`h-screen min-h-[900px] relative overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#0a0a0a] text-white border-white/5' : 'bg-[#e8e8e8] text-black border-black/5'} border-t`}>
      
      {/* UI Overlay */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <div className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-px bg-[var(--color-accent)]" />
          The People
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] max-w-2xl">
          Meet the <br/>Network.
        </h2>
      </div>

      {/* Control Toggles */}
      <div className="absolute top-12 right-12 z-30 flex flex-col gap-3 items-end">
        {/* Media Mode Toggle */}
        <div className={`flex items-center gap-2 backdrop-blur-md p-1.5 rounded-full border transition-colors ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/50 border-black/10'}`}>
          <button 
            onClick={() => setMediaMode('picture')}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${mediaMode === 'picture' ? 'bg-[var(--color-accent)] text-black font-bold' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
          >
            Picture
          </button>
          <button 
            onClick={() => setMediaMode('video')}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${mediaMode === 'video' ? 'bg-[var(--color-accent)] text-black font-bold' : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
          >
            Video
          </button>
        </div>

        {/* Theme Mode Toggle */}
        <div className={`flex items-center gap-2 backdrop-blur-md p-1.5 rounded-full border transition-colors ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/50 border-black/10'}`}>
          <button 
            onClick={() => setThemeMode('dark')}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${isDark ? 'bg-[var(--color-accent)] text-black font-bold' : 'text-gray-500 hover:text-black'}`}
          >
            Dark
          </button>
          <button 
            onClick={() => setThemeMode('light')}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 ${!isDark ? 'bg-[var(--color-accent)] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            Light
          </button>
        </div>
      </div>

      <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10">
        <Canvas camera={{ position: [0, 1, 14], fov: 45 }} shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <color attach="background" args={[bgColor]} />
            <fog attach="fog" args={[bgColor, 10, 30]} />
            
            <ambientLight intensity={isDark ? 1.5 : 2.5} />
            <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={isDark ? 3 : 2} castShadow />
            <pointLight position={[-10, 0, -10]} intensity={isDark ? 1 : 0.5} color="#FF5A00" />
            
            <PresentationControls 
              global 
              zoom={0.8} 
              rotation={[0, -Math.PI / 4, 0]} 
              polar={[-0.15, 0.15]} 
              azimuth={[-Infinity, Infinity]}
              config={{ mass: 2, tension: 400 }}
            >
              <group position={[0, -0.5, 0]}>
                {/* Central Core */}
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                  <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[2.5, 1]} />
                    <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.1} />
                  </mesh>
                </Float>

                {/* Orbiting Team Avatars */}
                {team.map((member, i) => {
                  const angle = (i / team.length) * Math.PI * 2;
                  const radius = 6.5;
                  const x = Math.sin(angle) * radius;
                  const z = Math.cos(angle) * radius;
                  return (
                    <Float key={member.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
                      <TeamMember3D 
                        member={member} 
                        index={i}
                        position={[x, 0, z]} 
                        rotation={[0, angle, 0]} 
                        mediaMode={mediaMode}
                        themeMode={themeMode}
                      />
                    </Float>
                  );
                })}
                {/* Ground Shadow */}
                <ContactShadows resolution={1024} scale={20} blur={2} opacity={isDark ? 0.5 : 0.2} far={10} color="#000000" position={[0, -3.5, 0]} />
              </group>
            </PresentationControls>
            
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
