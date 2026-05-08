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
      
      {/* Single continuous circuit line for the entire section */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[100px] pointer-events-none z-0 hidden lg:block">
        <ScrollCircuitLine 
          sectionRef={sectionRef}
          className="top-0 left-0 w-full h-full"
          pathD="M 50 0 V 1000" 
          viewBox="0 0 100 1000"
          scrollOffset={["start center", "end center"]}
        />
      </div>

      {/* ── Header Container (Handles top padding and dynamic text height) ── */}
      <div className="relative pt-24 md:pt-40 pb-32">

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
              <LevelCard key={level.id} level={level} index={idx} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* The System - Dark Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 bg-[#0d0d0d] rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-8">
              // THE SYSTEM
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-none mb-12">
              Every maker enters at a level. <br/>
              Every level builds new skills. <br/>
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

function LevelCard({ level, index, scrollYProgress }) {
  const isEven = index % 2 === 0;
  
  // Calculate activation point based on index
  const activationPoint = (index + 0.5) / levels.length;
  const [isActive, setIsActive] = useState(false);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsActive(latest > activationPoint - 0.1);
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 relative`}>
      
      {/* Visual Marker on central line - Arc Reactor Hover Effect */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-30"
      >
        <ArcReactorNode isActive={isActive} isHovered={isHovered} setIsHovered={setIsHovered} />
      </div>

      {/* Level Card Content */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full lg:w-[45%] bg-white rounded-[2.5rem] border border-black/5 p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-[var(--color-accent)]/30 transition-all duration-500"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        />
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

        <LevelTabs gridData={level.grid} levelId={level.id} />

        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100 group-hover:bg-[var(--color-accent)] transition-colors duration-500" />
      </motion.div>

      {/* Decorative Blueprint connector - LG only */}
      <div className={`hidden lg:block w-[5%] h-px bg-black/5 absolute top-1/2 ${isEven ? 'left-[45%]' : 'right-[45%]'}`} />
      
      {/* Empty space on opposite side for text/image or just spacing */}
      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}

// --- Minimalist Toggle Options ---
// Added 5 different toggle styles per user request.
// The user can hover over the top-right of the tab area to see the tiny 1-5 selector and preview the 5 designs!
function LevelTabs({ gridData, levelId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [styleOption, setStyleOption] = useState(3); // Defaulting to option 3 (Vertical Sidebar) which fits the grid vibe well

  const tabs = [
    { id: 'inquire', label: 'INQUIRE', text: gridData.inquire },
    { id: 'make', label: 'MAKE', text: gridData.make },
    { id: 'reflect', label: 'REFLECT', text: gridData.reflect },
    { id: 'present', label: 'PRESENT', text: gridData.present }
  ];

  return (
    <div className="mt-8 pt-4 border-t border-black/5 relative group/tabs">
      {/* Dev-only style switcher (invisible unless hovered) */}
      <div className="absolute -top-3 right-0 opacity-0 group-hover/tabs:opacity-100 transition-opacity flex gap-1 z-50">
        {[1, 2, 3, 4, 5].map(opt => (
          <button 
            key={opt} 
            onClick={() => setStyleOption(opt)} 
            className={`text-[9px] font-mono w-4 h-4 flex items-center justify-center rounded border transition-colors ${styleOption === opt ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 hover:text-black'}`}
            title={`Toggle Style ${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Render selected style */}
      {styleOption === 1 && <TabStyle1 tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} levelId={levelId} />}
      {styleOption === 2 && <TabStyle2 tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} levelId={levelId} />}
      {styleOption === 3 && <TabStyle3 tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} levelId={levelId} />}
      {styleOption === 4 && <TabStyle4 tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} levelId={levelId} />}
      {styleOption === 5 && <TabStyle5 tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} levelId={levelId} />}
    </div>
  );
}

// 1. Premium Pill Toggle (Apple style)
function TabStyle1({ tabs, activeTab, setActiveTab, levelId }) {
  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100/80 p-1 rounded-xl relative">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className="flex-1 relative py-2 px-2 text-center z-10">
            {activeTab === idx && (
              <motion.div layoutId={`pill-${levelId}`} className="absolute inset-0 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-0" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
            )}
            <span className={`relative z-10 font-mono text-[10px] font-bold tracking-widest transition-colors duration-300 ${activeTab === idx ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="min-h-[80px]">
        <motion.p key={`${levelId}-${activeTab}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-sm text-gray-600 leading-relaxed font-medium">
          {tabs[activeTab].text}
        </motion.p>
      </div>
    </div>
  );
}

// 2. Minimalist Underline (Clean, editorial)
function TabStyle2({ tabs, activeTab, setActiveTab, levelId }) {
  return (
    <div className="space-y-6">
      <div className="flex border-b border-black/5">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className="flex-1 pb-3 relative text-center">
            <span className={`font-mono text-[10px] font-bold tracking-widest transition-colors duration-300 ${activeTab === idx ? 'text-[var(--color-accent)]' : 'text-gray-400 hover:text-gray-600'}`}>{tab.label}</span>
            {activeTab === idx && (
              <motion.div layoutId={`underline-${levelId}`} className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-accent)]" />
            )}
          </button>
        ))}
      </div>
      <div className="min-h-[80px]">
        <motion.p key={`${levelId}-${activeTab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 leading-relaxed font-medium">
          {tabs[activeTab].text}
        </motion.p>
      </div>
    </div>
  );
}

// 3. Vertical Sidebar (Developer/System style)
function TabStyle3({ tabs, activeTab, setActiveTab, levelId }) {
  return (
    <div className="flex gap-6 min-h-[120px] bg-gray-50 rounded-2xl p-6 border border-black/5">
      <div className="flex flex-col gap-3 w-1/3 border-r border-black/5 pr-4 justify-center">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className={`text-left relative pl-3 py-1 ${activeTab === idx ? '' : 'hover:opacity-70'}`}>
            {activeTab === idx && <motion.div layoutId={`vert-line-${levelId}`} className="absolute left-0 top-0 w-[2px] h-full bg-[var(--color-accent)]" />}
            <span className={`font-mono text-[10px] font-bold tracking-widest transition-colors ${activeTab === idx ? 'text-black' : 'text-gray-400'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="w-2/3 flex items-center">
        <motion.p key={`${levelId}-${activeTab}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-gray-600 leading-relaxed font-medium">
          {tabs[activeTab].text}
        </motion.p>
      </div>
    </div>
  );
}

// 4. Glowing Dots (Futuristic/Minimal)
function TabStyle4({ tabs, activeTab, setActiveTab, levelId }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-black/5 rounded-full px-6 py-3">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className="flex items-center gap-2 group">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTab === idx ? 'bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]' : 'bg-black/10 group-hover:bg-black/20'}`} />
            <span className={`font-mono text-[9px] font-bold tracking-widest transition-colors hidden sm:block ${activeTab === idx ? 'text-black' : 'text-gray-400'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="min-h-[80px] px-2 text-center flex items-center justify-center">
        <motion.p key={`${levelId}-${activeTab}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-sm text-gray-600 leading-relaxed font-medium">
          {tabs[activeTab].text}
        </motion.p>
      </div>
    </div>
  );
}

// 5. Numbered Accordion-Style Tabs (Editorial / Serious)
function TabStyle5({ tabs, activeTab, setActiveTab, levelId }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => setActiveTab(idx)} className={`flex-1 py-3 border-t-2 text-left transition-all duration-300 ${activeTab === idx ? 'border-[var(--color-accent)] pt-4' : 'border-black/5 hover:border-black/20'}`}>
            <div className="font-mono text-[9px] text-gray-400 mb-1">0{idx + 1}</div>
            <div className={`font-mono text-[10px] font-bold tracking-widest ${activeTab === idx ? 'text-black' : 'text-gray-400'}`}>{tab.label}</div>
          </button>
        ))}
      </div>
      <div className="min-h-[80px] bg-gray-50 p-6 rounded-xl border border-black/5 flex items-center">
        <motion.p key={`${levelId}-${activeTab}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 leading-relaxed font-medium">
          {tabs[activeTab].text}
        </motion.p>
      </div>
    </div>
  );
}
