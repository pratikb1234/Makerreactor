import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, ArcReactorNode } from './MakerElements';

const levels = [
  {
    id: "01",
    title: "TINKER",
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

      {/* Single continuous circuit line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[100px] pointer-events-none z-0 hidden lg:block">
        <ScrollCircuitLine 
          sectionRef={sectionRef}
          className="top-0 left-0 w-full h-full"
          pathD="M 50 0 V 1000" 
          viewBox="0 0 100 1000"
          scrollOffset={["start center", "end center"]}
        />
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

      <div className="max-w-[90rem] mx-auto px-6 relative z-10 pb-24 md:pb-40">
        
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
          {/* Symmetrical Circuit Illumination Box */}
          <div className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-70 group-hover/system:opacity-100 transition-opacity duration-700">
            {/* The SVG paths draw a rounded circuit box that surrounds the content */}
            <ScrollCircuitLine 
              sectionRef={sectionRef} 
              className="top-0 left-0 w-full h-full" 
              pathD="M 500 0 V 48 C 500 20, 480 0, 450 0 H 48 C 20 0, 0 20, 0 48 V 952 C 0 980, 20 1000, 48 1000 H 450 C 480 1000, 500 980, 500 952" 
              viewBox="0 0 1000 1000" 
              scrollOffset={["start 80%", "center 40%"]} 
            />
            <ScrollCircuitLine 
              sectionRef={sectionRef} 
              className="top-0 left-0 w-full h-full" 
              pathD="M 500 0 V 48 C 500 20, 520 0, 550 0 H 952 C 980 0, 1000 20, 1000 48 V 952 C 1000 980, 980 1000, 952 1000 H 550 C 520 1000, 500 980, 500 952" 
              viewBox="0 0 1000 1000" 
              scrollOffset={["start 80%", "center 40%"]} 
            />
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/15 blur-[100px] rounded-full group-hover/system:bg-[var(--color-accent)]/20 transition-colors duration-700" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-8 flex items-center gap-3">
              <div className="w-8 h-px bg-[var(--color-accent)]/50" />
              // THE SYSTEM
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter leading-[1.1] mb-12">
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
          
          {/* Decorative SVG Pattern */}
          <div className="absolute bottom-[-10%] right-[-10%] opacity-10">
            <svg width="400" height="400" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="150" stroke="white" fill="none" strokeWidth="0.5" strokeDasharray="10 10" />
              <circle cx="200" cy="200" r="100" stroke="white" fill="none" strokeWidth="0.5" />
              <path d="M 200 50 V 350 M 50 200 H 350" stroke="white" strokeWidth="0.5" />
            </svg>
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
      <div className="absolute top-8 right-8 font-mono text-[11px] text-black/20 font-bold uppercase tracking-widest">
        LVL_{level.id}_PATH
      </div>

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
  const activationPoint = (index + 0.5) / levels.length;
  const [isActive, setIsActive] = useState(false);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsActive(latest > activationPoint - 0.1);
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 relative`}>
      
      {/* Visual Marker on central line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-30">
        <ArcReactorNode isActive={isActive} isHovered={isHovered} setIsHovered={setIsHovered} />
      </div>

      {/* Level Card Base Content */}
      <div className="w-full lg:w-[45%]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <LevelCardBase level={level} index={index} />
      </div>

      {/* Decorative Blueprint connector - LG only */}
      <div className={`hidden lg:block w-[5%] h-px bg-black/5 absolute top-1/2 ${isEven ? 'left-[45%]' : 'right-[45%]'}`} />
      
      {/* Empty space on opposite side */}
      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}


