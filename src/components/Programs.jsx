import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { BlueprintGrid, ScrollCircuitLine, LEDIndicator, HoverGearSystem, MechanicsWidget } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

const pathways = [
  {
    title: "Junior Makers",
    grade: "Ages 6–9",
    desc: "Hands-on building & mechanisms.",
    colSpan: "lg:col-span-4",
    bg: "bg-gray-100",
    text: "text-black",
    height: "h-[400px]",
  },
  {
    title: "Robotics Builders",
    grade: "Ages 9–12",
    desc: "Sensors, electronics & coding.",
    colSpan: "lg:col-span-8",
    bg: "bg-[var(--color-dark)]",
    text: "text-white",
    height: "h-[400px]",
  },
  {
    title: "AI Inventors",
    grade: "Ages 11–14",
    desc: "Data automation & smart systems.",
    colSpan: "lg:col-span-7",
    bg: "bg-white",
    text: "text-black",
    height: "h-[500px]",
    border: "border border-gray-200",
  },
  {
    title: "Competition Studio",
    grade: "Ages 13+",
    desc: "Elite national challenges.",
    colSpan: "lg:col-span-5",
    bg: "bg-[var(--color-accent)]",
    text: "text-white",
    height: "h-[500px]",
  }
];

export default function Programs() {
  const sectionRef = useRef(null);
  const { isPowered } = useCircuit();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section ref={sectionRef} id="programs" className="py-32 bg-[var(--color-light)] relative overflow-hidden">
      <BlueprintGrid />

      {/* PCB Trace — mechanisms + electronics with threshold activation */}
      <ScrollCircuitLine 
        sectionRef={sectionRef}
        className="top-0 right-[8%] w-[120px] h-full"
        pathD="M 60 0 V 300 H 0 V 500 H 60 V 1000"
        viewBox="0 0 60 1000"
        components={[
          { type: 'gear',      cx: 60, cy: 300, threshold: 0.27 },
          { type: 'linkage',   cx: 30, cy: 400, threshold: 0.41 },
          { type: 'piston',    cx: 0,  cy: 500, threshold: 0.55 },
          { type: 'motor',     cx: 60, cy: 650, threshold: 0.68 },
        ]}
      />
      <LEDIndicator className="top-[400px] right-[calc(8%+2px)]" />

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section header + MechanicsWidget side by side */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-black">
              Structured <br /> Pathways
            </h2>
            <div className="mt-6">
              <MagneticButton>
                <button className="flex items-center gap-3 text-black font-mono font-bold uppercase tracking-widest text-sm cursor-hover hover:text-[var(--color-accent)] transition-colors border-b-2 border-black pb-1">
                  View Curriculum <ArrowRight className="w-5 h-5" />
                </button>
              </MagneticButton>
            </div>
          </div>

          {/* Standalone mechanics widget */}
          <MechanicsWidget className="w-full lg:w-[320px] flex-shrink-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          {pathways.map((path, idx) => (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className={`${path.colSpan} ${path.bg} ${path.text} ${path.height} ${path.border || ''} rounded-[2rem] p-10 flex flex-col justify-between group cursor-hover relative overflow-hidden ${isPowered ? 'shadow-[0_0_30px_rgba(255,90,0,0.12)] ring-1 ring-[var(--color-accent)]/20' : ''} transition-all duration-700`}
            >
              {/* Hover-driven gear inside each card */}
              <HoverGearSystem 
                className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-80 transition-opacity duration-300" 
                isHovered={hoveredCard === idx} 
              />
              
              <div className="relative z-10">
                <div className="font-mono text-xs uppercase tracking-widest font-bold mb-4 opacity-70">
                  {path.grade}
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase mb-4 group-hover:pl-2 transition-all duration-300">
                  {path.title}
                </h3>
                <p className="text-lg opacity-80 max-w-sm font-medium">
                  {path.desc}
                </p>
              </div>

              <div className="relative z-10 w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-current group-hover:text-black transition-colors duration-300">
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
