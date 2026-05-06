import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import TextReveal from './TextReveal';
import MagneticButton from './MagneticButton';
import { BlueprintGrid, ScrollCircuitLine, PowerFlowLine, LEDIndicator, PowerSwitch, FloatingCodeWidget } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

export default function HeroSection() {
  const { isPowered } = useCircuit();
  const sectionRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[var(--color-light)] flex items-center justify-center">
      <BlueprintGrid />
      
      <motion.div style={{ y: y1, opacity }} className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full border border-black/5 bg-gradient-to-tr from-gray-100 to-white blur-3xl pointer-events-none" />
      <motion.div style={{ y: y2, opacity }} className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 blur-2xl pointer-events-none" />

      {/* PCB Trace — Side positioned but vertically centered during scroll */}
      <ScrollCircuitLine 
        sectionRef={sectionRef}
        className="top-0 left-0 w-[140px] h-full"
        pathD="M 20 0 V 150 H 80 V 350 H 20 V 550 H 80 V 750 H 20 V 950"
        viewBox="0 0 100 1000"
        scrollOffset={["start center", "end center"]}
        components={[
          { type: 'led',    cx: 20, cy: 150, threshold: 0.15 },
          { type: 'motor',  cx: 80, cy: 350, threshold: 0.35 },
          { type: 'car',    cx: 20, cy: 550, threshold: 0.55 },
          { type: 'arm',    cx: 80, cy: 750, threshold: 0.75 },
          { type: 'rocket', cx: 20, cy: 900, threshold: 0.90 },
        ]}
      />

      {/* Connection from Power Button to Headline — Flowing through the button like a battery */}
      <PowerFlowLine 
        className="absolute inset-0 w-full h-full z-0"
        pathD="M 1230 1000 V 450 H 700 V 100 H 70"
        viewBox="0 0 1400 1000"
        components={[
          { type: 'gear', cx: 1230, cy: 900, threshold: 0.1 },
          { type: 'led',  cx: 700, cy: 300, threshold: 0.6 },
        ]}
      />

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`w-16 h-16 md:w-24 md:h-24 rounded-full mb-8 flex items-center justify-center cursor-hover transition-colors duration-700 ${isPowered ? 'bg-[var(--color-accent)]' : 'bg-gray-200'}`}
            >
              <div className="w-1/2 h-1/2 bg-[var(--color-light)] rounded-full" />
            </motion.div>
            
            <h1 className={`text-[12vw] sm:text-[10vw] lg:text-[8vw] font-display font-bold leading-[0.85] tracking-tighter uppercase mix-blend-darken transition-all duration-1000 ${isPowered ? 'text-black opacity-100' : 'text-gray-400 opacity-60'}`}>
              <TextReveal text={isPowered ? "Build the" : "Be a"} delay={0.2} key={isPowered ? "on-1" : "off-1"} />
              <br />
              <div className="flex items-center gap-4 md:gap-8">
                <TextReveal text={isPowered ? "Future." : "Maker."} delay={0.4} key={isPowered ? "on-2" : "off-2"} />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isPowered ? "20vw" : "10vw" }}
                  transition={{ delay: 1, duration: 1, ease: [0.76, 0, 0.24, 1] }}
                  className={`h-[2vw] lg:h-[1vw] hidden sm:block relative transition-colors duration-700 ${isPowered ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <LEDIndicator className="absolute right-[-10px] top-1/2 -translate-y-1/2" />
                </motion.div>
              </div>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end pb-4 relative gap-6">
            <motion.p 
              key={isPowered ? "p-on" : "p-off"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`text-lg md:text-xl font-medium leading-relaxed border-l-2 pl-4 transition-all duration-700 ${isPowered ? 'text-gray-600 border-black' : 'text-gray-400 border-gray-300 italic'}`}
            >
              {isPowered 
                ? "Ahmedabad's most exclusive academy for young makers, coders, and innovators."
                : "Future belongs to ones who make."
              }
              <br/>
              <span className={`font-mono text-sm uppercase tracking-widest mt-4 inline-block font-bold transition-colors duration-700 ${isPowered ? 'text-[var(--color-accent)]' : 'text-gray-300'}`}>
                {isPowered ? 'Applications Open' : 'System Offline'}
              </span>
            </motion.p>

            {/* Interactive code terminal — changes when power is toggled */}
            <FloatingCodeWidget className="w-full" />
            
            <div className="flex items-center gap-6">
              <PowerSwitch />
              <MagneticButton>
                <button className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all cursor-hover group relative z-20 ${isPowered ? 'border-black hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white' : 'border-gray-300 text-gray-300'}`}>
                  <ArrowDownRight className="w-8 h-8 group-hover:rotate-[-45deg] transition-transform duration-300" />
                </button>
              </MagneticButton>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
