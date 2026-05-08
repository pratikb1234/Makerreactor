import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, ArcReactorNode } from './MakerElements';

const levels = [
  {
    id: "01",
    title: "TINKER",
    grades: "Grades 1 to 3",
    desc: "Young makers explore materials, movement, structures, balance and simple mechanisms. They learn to use their hands, try ideas, make choices and explain what they made.",
    skills: ["Materials", "Structures", "Simple Machines", "Cutting", "Joining", "Assembling", "Creative Confidence", "Early Design Thinking"],
    accent: "var(--color-accent)"
  },
  {
    id: "02",
    title: "EXPLORE",
    grades: "Grades 4 and 5",
    desc: "The jump from building to engineering. Students learn electronics, coding logic, measuring, drawing and bringing multiple mechanisms together.",
    skills: ["Circuits", "Motors & LEDs", "Block Coding", "Measurements", "Drafting", "Testing", "Iteration", "Tool Safety"],
    accent: "var(--color-accent)"
  },
  {
    id: "03",
    title: "BUILD",
    grades: "Grades 6 and 7",
    desc: "The shift to real-world tooling. Students move from craft to fabrication, learning 3D design, Python coding, sensors, soldering, and building functional machines.",
    skills: ["3D Modeling", "3D Printing", "Python syntax", "Microcontrollers", "Sensors", "Soldering", "Prototyping", "Troubleshooting"],
    accent: "var(--color-accent)"
  },
  {
    id: "04",
    title: "INVENT",
    grades: "Grades 8 and 9",
    desc: "Complete autonomy. Students use AI, advanced CAD, physics simulation and connected devices to build actual, deployable products that solve real problems.",
    skills: ["AI Integration", "Parametric CAD", "IoT", "PCB Design", "Data Analysis", "Project Management", "UI/UX", "Deployment"],
    accent: "var(--color-accent)"
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
      
      {/* ── Header Container (Handles top padding and dynamic text height) ── */}
      <div className="relative pt-24 md:pt-40 pb-32">
        {/* Top Connector Circuit Line - exactly spans this dynamic header gap */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[100px] h-full pointer-events-none z-0 hidden lg:block">
          <ScrollCircuitLine 
            className="top-0 left-0 w-full h-full"
            pathD="M 50 0 V 1000" 
            viewBox="0 0 100 1000"
            scrollOffset={["start center", "end center"]}
          />
        </div>

        <div className="max-w-[90rem] mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
            THE PROGRAM
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2">
              NOT A CLASS.<br/><span className="text-black/20">A YEARLY MAKER JOURNEY.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="lg:w-1/2 space-y-6">
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-tight">Most programs teach children one skill at a time.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">At Bits & Studios, makers move through a year-long pathway where projects become more complex, tools become more serious, and thinking becomes more independent.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">Parents are not buying isolated activities. They are buying a recurring makerspace membership where their child builds skills, projects, confidence, portfolios and a community over time.</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 relative z-10 pb-24 md:pb-40">
        {/* Pathway Visualization */}
        <div className="relative">
          <ScrollCircuitLine 
            sectionRef={sectionRef} className="absolute left-1/2 -translate-x-1/2 top-0 w-[100px] h-full z-0 hidden lg:block"
            pathD="M 50 0 V 1000" viewBox="0 0 100 1000" style={{ left: '50%', transform: 'translateX(-50%)' }}
          />
          
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
              Every year adds new projects, confidence and proof of growth.
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

        <div className="space-y-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-black/30 mb-4 flex items-center gap-2">
            <div className="w-8 h-px bg-black/10" />
            Core Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {level.skills.map((skill, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 rounded-full border border-black/5 bg-gray-50 text-[11px] font-bold uppercase tracking-tight text-gray-600 transition-colors group-hover:bg-white group-hover:border-[var(--color-accent)]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

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


