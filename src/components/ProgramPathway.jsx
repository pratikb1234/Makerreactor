import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, ArcReactorNode, FloatingCodeWidget } from './MakerElements';

import imgTinker from '../assets/tinker.png';
import imgBuild from '../assets/builder.png';
import imgEngineer from '../assets/engineer.png';
import imgInvent from '../assets/inventor.png';

const levels = [
  {
    id: "01",
    title: "TINKER",
    image: imgTinker,
    grades: "Grades 1 to 3",
    desc: "Young makers begin with materials, movement, balance, structures and simple mechanisms. They learn to use their hands, make choices, work safely and explain what they created.",
    grid: {
      inquire: "Observe materials, ask simple “what if” questions, notice patterns, predict what might happen.",
      make: "Cutting, joining, folding, assembling, structures, balance, simple machines, movement.",
      reflect: "What worked? What fell? What changed? What would I try again?",
      present: "Show-and-tell, naming design choices, explaining how the project works."
    }
  },
  {
    id: "02",
    title: "BUILD",
    image: imgBuild,
    grades: "Grades 4 to 5",
    desc: "Makers move from playful making to purposeful prototypes. They combine mechanisms, electronics, measurement and block coding to build projects that move, light up, respond or solve a small problem.",
    grid: {
      inquire: "Define a problem, compare ideas, plan before building, choose materials with purpose.",
      make: "Mechanisms, gears, pulleys, levers, circuits, motors, LEDs, switches, sensors, block coding, measurement.",
      reflect: "Test, debug, improve, notice cause and effect, understand why a system works or fails.",
      present: "Explain the function, describe improvements, work in teams, present the process."
    }
  },
  {
    id: "03",
    title: "ENGINEER",
    image: imgEngineer,
    grades: "Grades 6 to 7",
    desc: "Makers start thinking in systems. Robotics, microcontrollers, sensors, fabrication, Python and AI tools come together in functional builds where hardware, software and design must work together.",
    grid: {
      inquire: "Break complex problems into systems, identify inputs and outputs, use data to make decisions.",
      make: "Robotics, microcontrollers, sensors, actuators, Python, automation, 3D modelling, 3D printing, laser cutting basics, soldering.",
      reflect: "Calibrate, troubleshoot, document tests, redesign parts, improve reliability and performance.",
      present: "Technical explanation, system diagrams, engineering notes, demo presentation."
    }
  },
  {
    id: "04",
    title: "INVENT",
    image: imgInvent,
    grades: "Grades 8 to 9+",
    desc: "Makers take on original work. They use advanced robotics, CAD, AI, connected devices, electronics and product thinking to build solutions that can be tested, presented and improved in the real world.",
    grid: {
      inquire: "Frame real problems, research users, question assumptions, define constraints and success criteria.",
      make: "Advanced robotics, parametric CAD, fabrication planning, PCB basics, IoT, AI integration, data analysis, UI/UX.",
      reflect: "Evaluate impact, iterate independently, manage longer projects, document decisions and trade-offs.",
      present: "Portfolio building, competition presentation, pitch-style demos, leadership, mentoring younger makers."
    }
  }
];

const membershipInclusions = [
  "Weekly maker studio sessions",
  "Materials and project work",
  "Age-appropriate tools and technologies",
  "Mentor guidance",
  "Maker Passport progression",
  "Project portfolio",
  "Quarterly showcases",
  "Parent updates",
  "Community challenges",
  "Access to advanced pathways"
];

export default function ProgramPathway() {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} className="bg-[var(--color-light)] relative overflow-hidden font-sans border-t border-black/5">
      <BlueprintGrid opacity={0.4} />

      {/* ── Mechanical Contraption Timeline ── */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[120px] pointer-events-none z-[5] hidden lg:block">
        <MechanicalTimeline scrollYProgress={scrollYProgress} />
      </div>

      {/* ── Header Container ── */}
      <div className="relative pt-24 md:pt-40 pb-24 md:pb-32">
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
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">At Bits & Studios, makers grow through a year-long pathway of projects, tools, challenges and showcases.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">The work becomes deeper.<br/>The tools become more serious.<br/>The thinking becomes more independent.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">By the end, makers have more than finished projects.<br/>They have confidence, capability and proof of how they think.</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 relative pb-24 md:pb-40">
        
        {/* Pathway Visualization */}
        <div className="relative">
          <div className="space-y-32 relative">
            {levels.map((level, idx) => (
              <LevelCardTimeline key={level.id} level={level} index={idx} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>


        {/* The System - Dark Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 bg-[#0d0d0d] rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white group/system border border-black shadow-[0_0_80px_-20px_rgba(255,90,0,0.15)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/15 blur-[100px] rounded-full group-hover/system:bg-[var(--color-accent)]/20 transition-colors duration-700" />
          
          <div className="relative z-10 w-full lg:max-w-[calc(50%-80px)]">
            <div className="font-mono text-xs uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-8 flex items-center gap-3">
              <div className="w-8 h-px bg-[var(--color-accent)]/50" />
              // THE SYSTEM
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-5xl font-display font-bold uppercase tracking-tighter leading-[1.1] mb-12">
              Every maker enters at a level. <br/>
              <span className="inline-flex items-center gap-4 flex-wrap">
                Every level builds new skills.
                <span className="hidden md:inline-flex relative -top-1 w-6 h-6 items-center justify-center rounded-full border-2 border-[var(--color-accent)]">
                  <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full shadow-[0_0_10px_var(--color-accent)] animate-pulse" />
                </span>
              </span> <br/>
              Every project creates evidence of growth. <br/>
              Every showcase builds confidence.
            </h3>
            <p className="text-2xl text-white/40 font-display italic">
              Nobody stays where they started.
            </p>
          </div>
          
          {/* The Code Metaphor Widget */}
          <div className="relative mt-12 md:absolute md:bottom-8 md:right-8 z-10 w-full md:w-[350px] shadow-2xl shadow-black/50 opacity-80 group-hover/system:opacity-100 transition-opacity duration-700">
            <FloatingCodeWidget className="w-full" />
          </div>
        </motion.div>

        {/* Membership Strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 border border-black/10 rounded-[2rem] p-8 md:p-12 bg-white shadow-sm"
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
    </section>
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
        LVL_{level.id}_PATH
      </div>

      {/* Hero Image */}
      {level.image && (
        <div className="relative -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-8 h-48 sm:h-64 overflow-hidden rounded-t-[2.5rem] border-b border-black/5">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <img 
            src={level.image} 
            alt={level.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>
      )}

      <div className="mb-10 relative">
        <div className="font-mono text-4xl font-bold text-black/5 mb-2 leading-none">{level.id}</div>
        <h3 className="text-4xl md:text-5xl font-display font-bold text-black mb-2 tracking-tighter">{level.title}</h3>
        <p className="font-mono text-sm font-bold text-[var(--color-accent)] uppercase tracking-widest">{level.grades}</p>
      </div>

      <p className="text-gray-500 text-lg leading-relaxed mb-10">
        {level.desc}
      </p>

      {/* The 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-4 pt-6 border-t border-black/5">
        {[
          { label: 'INQUIRE', text: level.grid.inquire },
          { label: 'MAKE', text: level.grid.make },
          { label: 'REFLECT', text: level.grid.reflect },
          { label: 'PRESENT', text: level.grid.present }
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
      const sectionHeight = section.offsetHeight;
      
      // Physical Collision Math:
      // The payload drops linearly. Its center is at `scrollYProgress * sectionHeight`.
      // Payload extends 56px UP (to the hook) and 40px DOWN.
      // Gear extends 60px UP and 60px DOWN.
      
      // Collision starts when bottom of payload hits top of gear:
      // payloadCenter + 40 > gearCenter - 60  => payloadCenter > gearCenter - 100
      const startPixel = gearCenter - 100;
      
      // Keep it active until the payload drops completely past the bottom of the card
      // Card bottom is `offsetTop + cardRef.current.offsetHeight`.
      // The payload center leaves the card bottom when `payloadCenter > cardBottom`.
      const endPixel = offsetTop + cardRef.current.offsetHeight;
      
      setActivationStart(startPixel / sectionHeight);
      setActivationEnd(endPixel / sectionHeight);
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
      
      {/* Visual Marker on central line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-30">
        <MechanicalLinkageNode isActive={isActive || isHovered} />
      </div>

      {/* Level Card Base Content - Wrapped in a jolt animation */}
      <motion.div 
        className="w-full lg:w-[calc(50%-80px)] relative z-10" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        animate={(isActive || isHovered) ? { x: isEven ? -15 : 15 } : { x: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, mass: 1 }}
      >
        {/* Pass isActive down so the card can light up when punched */}
        <div className={`transition-all duration-500 rounded-[2.5rem] ${isActive || isHovered ? 'shadow-[0_0_40px_rgba(255,90,0,0.15)] ring-2 ring-[var(--color-accent)]' : ''}`}>
          <LevelCardBase level={level} index={index} />
        </div>
      </motion.div>

      {/* Decorative Mechanical Linkage Piston Arm - LG only */}
      <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-[5%] h-8 z-20 ${isEven ? 'left-[45%]' : 'right-[45%]'}`}>
        <PistonArm isActive={isActive || isHovered} isEven={isEven} />
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
      {/* Top Motor Assembly (mounted at the top of the section) */}
      <div className="absolute top-0 -mt-10 w-32 h-20 bg-[#d4d4d4] rounded-[1rem] border-2 border-[#999] z-30 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)]">
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
        className="absolute top-0 w-16 h-20 bg-white rounded-xl border-[3px] border-[var(--color-accent)] shadow-[0_10px_30px_rgba(255,90,0,0.4)] flex flex-col items-center justify-center z-20"
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
    <div className="relative flex items-center justify-center w-32 h-32 group">
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
      <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500 z-10 ${isActive ? 'border-[var(--color-accent)] bg-white shadow-[0_0_20px_var(--color-accent)]' : 'border-black/20 bg-white'}`} />
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
