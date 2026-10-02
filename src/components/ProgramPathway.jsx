import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { BlueprintGrid } from './MakerElements';
import imgTinker from '../assets/tinker.png';
import imgBuild from '../assets/builder.png';
import imgEngineer from '../assets/engineer.png';
import imgInvent from '../assets/inventor.png';

// 3D rail (gears + capsule) — Three.js chunk loads only when the section nears
const levels = [
  {
    id: "01",
    title: "TINKER",
    image: imgTinker,
    grades: "Ages 5–9 · Grades K–3",
    desc: "Young makers begin with materials, movement, balance, structures and simple mechanisms. They learn to use their hands, make choices, work safely and explain what they created.",
    mtb: {
      make: "Working models, simple circuits, things that move and respond.",
      think: "Cause and effect, and how to make things work better.",
      become: "A problem-solver who tries, fails, and tries again."
    }
  },
  {
    id: "02",
    title: "BUILD",
    image: imgEngineer,
    grades: "Ages 9–11 · Grades 4–5",
    desc: "Makers move from playful making to purposeful prototypes. They combine mechanisms, electronics, measurement and block coding to build projects that move, light up, respond or solve a small problem.",
    mtb: {
      make: "Working robots, real circuits, programmed builds that solve problems.",
      think: "Systems, logic, and how to debug what is not working.",
      become: "A capable builder who can take an idea to a finished machine."
    }
  },
  {
    id: "03",
    title: "ENGINEER",
    image: imgBuild,
    grades: "Ages 11–13 · Grades 6–7",
    desc: "Makers start thinking in systems. Robotics, microcontrollers, sensors, fabrication, Python and AI tools come together in functional builds where hardware, software and design must work together.",
    mtb: {
      make: "Competition robots, real engineering builds, working systems.",
      think: "Engineering trade-offs, debugging, and building to a real standard.",
      become: "A serious builder who can engineer a real solution."
    }
  },
  {
    id: "04",
    title: "INVENT",
    image: imgInvent,
    grades: "Ages 13–18 · Grades 8–12",
    desc: "Makers take on original work. They use advanced robotics, CAD, AI, connected devices, electronics and product thinking to build solutions that can be tested, presented and improved in the real world.",
    mtb: {
      make: "Original research, deployed projects, published work, real ventures.",
      think: "Real problems, real users, and how to take work into the world.",
      become: "A maker with a body of real work that speaks for itself."
    }
  }
];

const membershipInclusions = [
  "All Materials Included",
  "Free Tool Access",
  "Dedicated Mentor",
  "Maker Portfolio",
  "MakerFest Showcase",
  "Parent Updates",
  "Competition Pathways",
  "3D Printing & Fab",
  "Take-Home Projects",
  "CAS Activities"
];

export function NotAClass() {
  return (
    <section className="bg-[var(--color-light)] relative font-sans border-t border-black/5 pt-24 md:pt-40 pb-24 md:pb-32 z-10 overflow-hidden">
      <BlueprintGrid opacity={0.4} />

      {/* Cyclic rhythm track — represents the yearly cycle */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-black/8 pointer-events-none z-0 hidden lg:block">
        {/* Looping dot that travels up and down */}
        <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_14px_5px_rgba(255,90,0,0.4)]" 
          style={{ animation: 'cycleUpDown 4s ease-in-out infinite', top: '10%' }} />
        {/* Second dot offset by half phase */}
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]/40" 
          style={{ animation: 'cycleUpDown 4s ease-in-out infinite reverse', top: '50%' }} />
      </div>

      {/* Mobile: left-edge cyclic track */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-black/8 pointer-events-none z-0 lg:hidden">
        <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_4px_rgba(255,90,0,0.4)]"
          style={{ animation: 'cycleUpDown 4s ease-in-out infinite', top: '10%' }} />
      </div>

      <style>{`
        @keyframes cycleUpDown {
          0%   { top: 8%;  opacity: 1; }
          45%  { top: 88%; opacity: 1; }
          50%  { top: 88%; opacity: 0.3; }
          95%  { top: 8%;  opacity: 1; }
          100% { top: 8%;  opacity: 1; }
        }
      `}</style>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
          THE PROGRAM
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2">
            NOT A CLASS.<br/><span className="text-black/20">A YEARLY MAKER JOURNEY.</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="lg:w-1/2 space-y-6">
            <p className="text-xl md:text-2xl text-gray-800 font-medium leading-tight">Most programs stop at teaching a skill.</p>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">At Bits &amp; Studios, makers grow through a year-long pathway of projects, tools, challenges and showcases.</p>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">The work becomes deeper.<br/>The tools become more serious.<br/>The thinking becomes more independent.</p>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">By the end, makers have more than finished projects.<br/>They have confidence, capability and proof of how they think.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ProgramPathway() {
  const sectionRef = useRef(null);
  const [coreDesign, setCoreDesign] = useState(2); // Default to Sphere
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [isEasterEggActive, setIsEasterEggActive] = useState(false);

  const textContent = (
    <>
      <div className={`font-mono text-xs uppercase tracking-[0.4em] font-bold mb-8 flex items-center justify-center gap-3 transition-all duration-500 ${isEasterEggActive ? 'text-[var(--color-accent)] brightness-150 drop-shadow-[0_0_10px_var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>
        <div className={`w-8 h-px transition-colors duration-500 ${isEasterEggActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/50'}`} />
        {isEasterEggActive ? '// IGNITION: DEPTH & ATTENTION DETECTED...' : '// DEEP INTO THE CORE'}
        <div className={`w-8 h-px transition-colors duration-500 ${isEasterEggActive ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/50'}`} />
      </div>
      <h3 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[1.1] drop-shadow-xl text-white flex flex-col items-center justify-center gap-6 md:gap-10 w-full px-4">
        <span className="text-center">Every maker enters at a level.</span>
        <span className="text-center">Every level builds new skills.</span>
        
        {/* Centered Circle Icon */}
        <span 
          className={`pointer-events-none relative flex items-center justify-center rounded-full transition-all duration-300 ${
            isEasterEggActive 
              ? 'w-10 h-10 border-4 border-[var(--color-accent)] shadow-[0_0_30px_rgba(255,90,0,0.6)]' 
              : 'w-6 h-6 md:w-8 md:h-8 border-2 border-[var(--color-accent)]'
          }`}
        >
          {/* The Tiny Hitbox for precise activation */}
          <span 
            onMouseEnter={() => setIsEasterEggActive(true)}
            onMouseLeave={() => setIsEasterEggActive(false)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full pointer-events-auto z-50 cursor-crosshair"
          />
          {/* Visual Rings */}
          <span className={`absolute rounded-full border-[3px] border-[var(--color-accent)] transition-all duration-300 ${
            isEasterEggActive ? 'w-6 h-6 opacity-100' : 'w-2 h-2 opacity-0'
          }`} />
          <span className={`rounded-full bg-[var(--color-accent)] transition-all duration-300 pointer-events-none ${
            isEasterEggActive 
              ? 'w-2.5 h-2.5 shadow-[0_0_15px_var(--color-accent)] brightness-150' 
              : 'w-2 h-2 shadow-[0_0_10px_var(--color-accent)] animate-pulse'
          }`} />
        </span>

        <span className="text-center">Every project creates evidence of growth.</span>
        <span className="text-white/40 text-center">Together, they form a system.</span>
      </h3>
      <p className={`text-xl md:text-2xl font-display italic transition-all duration-500 ${isEasterEggActive ? 'text-[var(--color-accent)] brightness-150 drop-shadow-[0_0_10px_var(--color-accent)]' : 'text-[var(--color-accent)] drop-shadow-md'}`}>
        Nobody stays where they started.
      </p>
    </>
  );



  return (
    <>
    <section ref={sectionRef} className="bg-[var(--color-light)] relative font-sans border-t border-black/5 pb-48 z-10 pt-24 md:pt-40">
      <BlueprintGrid opacity={0.4} />
      {/* ── Mechanical Contraption Timeline ── */}
      <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-0 -bottom-[350px] md:-bottom-[550px] lg:-bottom-[650px] w-[120px] pointer-events-none z-0">
        <MechanicalTimeline scrollYProgress={scrollYProgress} />
      </div>

      {/* ── Age Group Entry Points ── */}
      <div className="max-w-[90rem] mx-auto px-6 relative z-10 pb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
          // WHERE YOU BEGIN
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl lg:text-7xl lg:w-[48%] lg:pr-10 font-display font-bold text-black uppercase tracking-tighter leading-[0.85] mb-6 relative z-20">
          FIND YOUR MAKER'S<br/><span className="text-black/20">STARTING POINT.</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 leading-relaxed max-w-2xl mb-16">
          Makers enter at the group that fits their age. Wherever they start, they work across all four studios and grow from there.
        </motion.p>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10 pb-24 md:pb-40">
        
        {/* Pathway Visualization */}
        <div className="relative">
          <div className="space-y-32 relative">
            {levels.map((level, idx) => (
              <LevelCardTimeline key={level.id} level={level} index={idx} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--color-light)] relative font-sans overflow-x-clip z-20">
      <BlueprintGrid opacity={0.4} />
      <div className="max-w-[90rem] mx-auto px-6 relative z-10 pt-32 md:pt-48 pb-24 md:pb-40">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative flex flex-col items-center justify-center h-[500px] md:h-[800px] lg:h-[1000px] group/system w-full">
          <motion.div 
            animate={isEasterEggActive ? { scale: 1.15, borderColor: "rgba(255,90,0,0.8)", boxShadow: "0 0 300px rgba(255,90,0,0.6)" } : { scale: 1, borderColor: "rgba(0,0,0,0.9)", boxShadow: "0 0 150px rgba(255,90,0,0.15)" }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] bg-[#030303] rounded-full border-4 flex items-center justify-center overflow-hidden"
          >
            <motion.div 
              animate={isEasterEggActive ? { opacity: 0.8, scale: 1.2 } : { opacity: 0.2, scale: 1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[50vw] md:w-[600px] md:h-[400px] blur-[80px] animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--color-accent)_0%,_transparent_70%)]"
            />
            <div className="absolute w-full h-full pointer-events-none flex items-center justify-center opacity-[0.2] mix-blend-screen transition-opacity duration-1000 z-0">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div 
                  key={i}
                  animate={isEasterEggActive ? { 
                    scale: [0.05, 5], 
                    opacity: [0, 1, 0],
                    rotate: i % 2 === 0 ? 180 : -180,
                    borderWidth: ["2px", "8px", "20px"]
                  } : { 
                    scale: 1 - i * 0.12, 
                    opacity: 0.3,
                    rotate: i % 2 === 0 ? 360 : -360,
                    borderWidth: i % 2 === 0 ? "2px" : "4px"
                  }} 
                  transition={isEasterEggActive ? { 
                    duration: 2.5, 
                    repeat: Infinity, 
                    delay: i * 0.35, 
                    ease: "linear" 
                  } : { 
                    repeat: Infinity, 
                    duration: 120 - i * 10, 
                    ease: "linear" 
                  }} 
                  className={`absolute rounded-full border-[var(--color-accent)] will-change-transform transform-gpu ${i % 2 === 0 ? 'border-solid' : 'border-dashed'}`}
                  style={{ width: '80%', height: '80%' }}
                />
              ))}
            </div>
            {/* The Central Deep Eye */}
            <motion.div 
              animate={isEasterEggActive ? { scale: [1, 1.5, 1], boxShadow: "inset 0 20px 200px rgba(255,90,0,1), 0 0 100px rgba(255,90,0,1)" } : { scale: 1, boxShadow: "inset 0 20px 50px rgba(255,90,0,0.3)" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[15%] h-[15%] bg-black rounded-full z-10" 
            />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] flex flex-col items-center justify-center text-center px-6 md:px-16 z-10 pointer-events-auto">
            {textContent}
          </div>
        </motion.div>

        {/* Membership Strip */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-black/10 rounded-[2rem] p-8 md:p-12 bg-white shadow-sm"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
              <div>
                <h4 className="font-display font-bold text-2xl uppercase mb-2">Annual Membership Includes</h4>
                <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Premium Makerspace Access</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full lg:w-auto">
                {membershipInclusions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-tight text-gray-700 leading-tight group-hover/item:text-black transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div> {/* End of max-w container */}
    </section>
    </>
  );
}

// ── Interactive Hero Image with Easter Egg ──
function InteractiveHeroImage({ level }) {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [ringCenter, setRingCenter] = useState({ x: 0, y: 0 });

  // For the Engineer image (id: "03"), the orange circle is at these percentages
  const targetX = 0.619;
  const targetY = 0.7905;
  const imgW = 1448;
  const imgH = 1086;

  useEffect(() => {
    if (level.id !== "03") return;
    const calculate = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const contW = rect.width;
      const contH = rect.height;
      const S = Math.max(contW / imgW, contH / imgH);
      const rw = imgW * S;
      const rh = imgH * S;
      const ox = (contW - rw) / 2;
      const oy = (contH - rh) / 2;
      setRingCenter({ x: ox + targetX * rw, y: oy + targetY * rh });
    };
    calculate();
    const obs = new ResizeObserver(calculate);
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [level.id]);

  const handleMouseMove = (e) => {
    if (level.id !== "03") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.sqrt((x - ringCenter.x) ** 2 + (y - ringCenter.y) ** 2);
    // Active if within 50px of the center
    setIsActive(dist < 50);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsActive(false)}
      className="relative -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-8 h-48 sm:h-64 overflow-hidden rounded-t-[2.5rem] border-b border-black/5"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
      <img src={level.image} alt={level.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
      
      {/* Easter Egg Triggered Effect */}
      {level.id === "03" && isActive && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Darken background slightly */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          
          {/* Target Reticle Locked onto the Ring */}
          <motion.div 
            initial={{ scale: 2, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -ml-12 -mt-12 w-24 h-24 border-2 border-[var(--color-accent)] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,90,0,0.6)]"
            style={{ left: ringCenter.x, top: ringCenter.y }}
          >
            <div className="absolute w-32 h-px bg-[var(--color-accent)]/50" />
            <div className="absolute h-32 w-px bg-[var(--color-accent)]/50" />
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
          </motion.div>

          {/* Glitchy Tech Text */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-6 font-mono text-xs md:text-sm text-[var(--color-accent)] font-bold tracking-[0.2em] uppercase"
          >
            {'>'} ALIGNMENT_LOCKED <br/>
            {'>'} SYSTEM_READY
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ── Shared Card Content (The 2x2 grid design the user liked!) ──
function LevelCardBase({ level, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "circOut", delay: index * 0.1 }}
      className="w-full bg-white rounded-[2.5rem] border border-black/5 p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-[var(--color-accent)]/30 transition-all duration-500 h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Technical Label */}
      <div className="absolute top-8 right-8 font-mono text-[11px] text-black/20 font-bold uppercase tracking-widest z-20 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
        GROUP_{level.id}
      </div>

      {/* Hero Image */}
      {level.image && <InteractiveHeroImage level={level} />}

      <div className="mb-10 relative">
        <div className="font-mono text-4xl font-bold text-black/5 mb-2 leading-none">{level.id}</div>
        <h3 className="text-4xl md:text-5xl font-display font-bold text-black mb-2 tracking-tighter">{level.title}</h3>
        <p className="font-mono text-sm font-bold text-[var(--color-accent)] uppercase tracking-widest">{level.grades}</p>
      </div>

      <p className="text-gray-500 text-lg leading-relaxed mb-10">
        {level.desc}
      </p>

      {/* The MAKE / THINK / BECOME Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8 mt-4 pt-6 border-t border-black/5">
        {[
          { label: 'THEY MAKE', text: level.mtb.make },
          { label: 'THEY THINK IN', text: level.mtb.think },
          { label: 'THEY BECOME', text: level.mtb.become }
        ].map((item, idx) => (
          <div key={idx} className="relative group/grid">
            <div className="absolute left-0 top-0 w-[2px] h-full bg-[var(--color-accent)]/20 group-hover/grid:bg-[var(--color-accent)] transition-colors duration-500" />
            <div className="pl-3">
              <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">{item.label}</h5>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accent Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100 group-hover:bg-[var(--color-accent)] transition-colors duration-500" />
    </motion.div>
  );
}


// ── Layout 1: The Original Timeline Wrapper ──
function LevelCardTimeline({ level, index, scrollYProgress }) {
  const isEven = index % 2 === 0;
  const cardRef = useRef(null);
  
  // Track the precise window where the elevator and gear intersect
  const [activationStart, setActivationStart] = useState(0);
  const [activationEnd, setActivationEnd] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    const section = cardRef.current.closest('section');
    if (!section) return;

    const calculate = () => {
      let offsetTop = 0;
      let el = cardRef.current;
      while (el && el !== section) {
        offsetTop += el.offsetTop;
        el = el.offsetParent;
      }
      
      const gearCenter = offsetTop + cardRef.current.offsetHeight / 2;
      
      // The mechanical rail container extends below the section to reach the core sphere
      // (must match the -bottom-[...] values on the timeline container)
      const extraBottom = window.innerWidth >= 1024 ? 650 : (window.innerWidth >= 768 ? 550 : 350);
      const containerHeight = section.offsetHeight + extraBottom;
      
      // Physical Collision Math:
      // The payload drops linearly. Its center is at `scrollYProgress * containerHeight`.
      // Payload extends 56px UP (to the hook) and 40px DOWN.
      // Gear extends 60px UP and 60px DOWN.
      
      // Collision starts when bottom of payload hits top of gear:
      // payloadCenter + 40 > gearCenter - 60  => payloadCenter > gearCenter - 100
      const startPixel = gearCenter - 100;
      
      // Keep it active until the payload drops completely past the bottom of the card
      const endPixel = offsetTop + cardRef.current.offsetHeight;
      
      setActivationStart(startPixel / containerHeight);
      setActivationEnd(endPixel / containerHeight);
    };

    calculate();
    const observer = new ResizeObserver(() => calculate());
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // The gear is ONLY active while the payload is physically touching it!
    // Once the payload drops past it, it deactivates. This makes it feel like a real mechanical switch.
    setIsActive(latest >= activationStart && latest <= activationEnd);
  });

  return (
    <div ref={cardRef} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 relative`}>
      
      {/* Central Mechanical Gear */}
      <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 pointer-events-none">
        <MechanicalLinkageNode isActive={isActive || isHovered} />
      </div>

      {/* Level Card Base Content - Wrapped in a jolt animation */}
      <motion.div 
        className="w-full lg:w-[45%] relative z-10 pl-16 lg:pl-0" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        animate={(isActive || isHovered) ? (isMobile ? { y: 15, x: 0 } : { x: isEven ? -15 : 15, y: 0 }) : { x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, mass: 1 }}
      >
        {/* Pass isActive down so the card can light up when punched */}
        <div className={`transition-all duration-500 rounded-[2.5rem] ${isActive || isHovered ? 'shadow-[0_0_40px_rgba(255,90,0,0.15)] ring-2 ring-[var(--color-accent)]' : ''}`}>
          <LevelCardBase level={level} index={index} />
        </div>
      </motion.div>

      {/* Piston Arm (extends from the central gear to the card) */}
      <div className={`absolute top-1/2 -translate-y-1/2 h-8 z-20 w-12 lg:w-[5%] left-[40px] ${isEven ? 'lg:left-[45%]' : 'lg:right-[45%] lg:left-auto'} pointer-events-none`}>
        <PistonArm isActive={isActive || isHovered} isEven={isMobile ? false : isEven} />
      </div>

      {/* Empty space on opposite side */}
      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}

function PistonArm({ isActive, isEven }) {
  // Piston pushes OUT from the center towards the card.
  // Center is at the right for isEven, left for !isEven.
  return (
    <div className={`w-full h-full relative flex items-center ${isEven ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Outer Cylinder (attached to center) */}
      <div className="w-1/2 h-6 bg-[#d4d4d4] border-y-2 border-x border-[#999] rounded-sm relative z-10 flex items-center justify-center shadow-md">
         {/* Decorative cylinder stripes */}
         <div className="w-full h-[2px] bg-black/20" />
      </div>

      {/* Inner Rod (shoots out to the card) */}
      <motion.div 
        className="h-3 bg-[#444] border-y border-black relative z-0 origin-center"
        initial={{ width: '10%' }}
        animate={{ width: isActive ? '100%' : '10%' }}
        transition={{ type: "spring", stiffness: 400, damping: 15, mass: 1 }}
      >
        {/* Plunger Head hitting the card */}
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-10 rounded-sm shadow-[0_0_15px_var(--color-accent)] transition-colors duration-200 ${isActive ? 'bg-[var(--color-accent)]' : 'bg-[#666]'} ${isEven ? '-left-2' : '-right-2'}`}>
          {/* Spark effect when hitting */}
          {isActive && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full ${isEven ? '-left-2' : '-right-2'}`}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Mechanical Contraption Components ──

function MechanicalTimeline({ scrollYProgress }) {
  const payloadY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // The motor rotation is directly proportional to scroll
  const motorRotation = useTransform(scrollYProgress, [0, 1], [0, 1440]); // 4 full spins

  return (
    <div className="absolute inset-0 flex flex-col items-center">
      {/* Top Motor Assembly (mounted at the top of the section, cut horizontally) */}
      <div className="absolute top-0 w-32 h-10 overflow-hidden z-30 flex justify-center">
        <div className="absolute -top-10 w-32 h-20 bg-[#d4d4d4] rounded-[1rem] border-2 border-[#999] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
          {/* Motor body casing details */}
          <div className="absolute inset-x-4 top-2 h-4 bg-black/10 rounded-full" />
          <div className="absolute inset-x-4 bottom-2 h-2 bg-black/10 rounded-full" />
          
          {/* Rotating Pulley Wheel */}
          <motion.div 
            className="relative w-16 h-16 rounded-full border-[6px] border-[#666] bg-[#ccc] flex items-center justify-center shadow-inner"
            style={{ rotate: motorRotation }}
          >
            {/* Pulley Spokes */}
            <div className="absolute w-full h-1.5 bg-[#666]" />
            <div className="absolute w-1.5 h-full bg-[#666]" />
            {/* Glowing Axle Center */}
            <div className="w-4 h-4 bg-[var(--color-accent)] rounded-full z-10 shadow-[0_0_15px_var(--color-accent)]" />
          </motion.div>
        </div>
      </div>

      {/* Elevator Shaft / Track */}
      <div className="absolute top-0 bottom-0 w-12 bg-[#ebebeb] rounded-b-[1rem] border-x border-b border-black/10 flex justify-center shadow-inner overflow-hidden">
        {/* Inner track rail */}
        <div className="absolute top-0 bottom-0 w-2 bg-black/5" />
      </div>

      {/* The Rope (connecting motor to capsule) */}
      <motion.div 
        className="absolute top-0 w-1.5 bg-[#555] z-10 flex justify-center overflow-hidden"
        style={{ height: payloadY }}
      >
        {/* Rope Texture */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, black 2px, black 4px)' }} />
      </motion.div>

      {/* The Elevator Capsule (Payload) */}
      <motion.div 
        className="absolute w-16 h-20 bg-white rounded-xl border-[3px] border-[var(--color-accent)] shadow-[0_10px_30px_rgba(255,90,0,0.4)] flex flex-col items-center justify-center z-20"
        style={{ top: payloadY, y: "-50%" }}
      >
        {/* Hook attaching capsule to rope */}
        <div id="elevator-hook" className="absolute -top-4 w-6 h-4 rounded-t-full border-2 border-b-0 border-[#555] bg-white flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-[#555] rounded-full mt-1" />
        </div>

        <div className="w-8 h-2 bg-black/10 rounded-full mb-2" />
        <div className="w-6 h-6 bg-[var(--color-accent)] rounded-full animate-pulse shadow-[inset_0_0_10px_white]" />
        <div className="w-8 h-2 bg-black/10 rounded-full mt-2" />
      </motion.div>
    </div>
  );
}

function MechanicalLinkageNode({ isActive }) {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 lg:w-32 lg:h-32 group">
      {/* Background large gear */}
      <motion.div 
        animate={{ rotate: isActive ? 360 : 0 }} 
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-500 ${isActive ? 'text-[var(--color-accent)]' : 'text-black/10'}`}
      >
        <GearSVG width="100%" height="100%" />
      </motion.div>
      {/* Inner medium gear (spins opposite) */}
      <motion.div 
        animate={{ rotate: isActive ? -360 : 0 }} 
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 flex items-center justify-center transition-colors duration-500 ${isActive ? 'text-black' : 'text-black/5'}`}
        style={{ padding: '20%' }}
      >
        <GearSVG width="100%" height="100%" />
      </motion.div>
      {/* Center pivot */}
      <div className={`w-4 h-4 lg:w-6 lg:h-6 rounded-full border-[3px] lg:border-4 transition-all duration-500 z-10 ${isActive ? 'border-[var(--color-accent)] bg-white shadow-[0_0_20px_var(--color-accent)]' : 'border-black/20 bg-white'}`} />
    </div>
  );
}

function GearSVG({ width = "100", height = "100" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="currentColor">
      {/* 12 Teeth */}
      {[...Array(12)].map((_, i) => (
        <rect key={i} x="52" y="2" width="16" height="116" rx="4" transform={`rotate(${i * 30} 60 60)`} />
      ))}
      
      {/* Main Outer Ring (with cutout) */}
      <path fillRule="evenodd" clipRule="evenodd" d="M60 14a46 46 0 1 0 0 92 46 46 0 0 0 0-92zm0 14a32 32 0 1 1 0 64 32 32 0 0 1 0-64z" />
      
      {/* Inner Hub (with cutout) */}
      <path fillRule="evenodd" clipRule="evenodd" d="M60 40a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0 12a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" />
      
      {/* Spokes connecting hub to ring */}
      {[...Array(4)].map((_, i) => (
        <rect key={i} x="56" y="28" width="8" height="64" transform={`rotate(${i * 45} 60 60)`} />
      ))}
    </svg>
  );
}
