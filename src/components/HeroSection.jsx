import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import TextReveal from './TextReveal';
import MagneticButton from './MagneticButton';
import { BlueprintGrid, ScrollCircuitLine, LEDIndicator, PowerSwitch, FloatingCodeWidget } from './MakerElements';

export default function HeroSection() {
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

      {/* PCB Trace — electronics activate as path draws in */}
      <ScrollCircuitLine 
        sectionRef={sectionRef}
        className="top-0 left-0 w-[120px] h-full"
        pathD="M 20 0 V 200 H 80 V 350 H 20 V 600"
        viewBox="0 0 80 600"
        components={[
          { type: 'led',       cx: 20, cy: 200, threshold: 0.28 },
          { type: 'capacitor', cx: 80, cy: 275, threshold: 0.47 },
          { type: 'resistor',  cx: 20, cy: 350, threshold: 0.65 },
        ]}
      />

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-16 h-16 md:w-24 md:h-24 bg-[var(--color-accent)] rounded-full mb-8 flex items-center justify-center cursor-hover"
            >
              <div className="w-1/2 h-1/2 bg-[var(--color-light)] rounded-full" />
            </motion.div>
            
            <h1 className="text-[12vw] sm:text-[10vw] lg:text-[8vw] font-display font-bold leading-[0.85] text-black tracking-tighter uppercase mix-blend-darken">
              <TextReveal text="Build the" delay={0.2} />
              <br />
              <div className="flex items-center gap-4 md:gap-8">
                <TextReveal text="Future." delay={0.4} />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "20vw" }}
                  transition={{ delay: 1, duration: 1, ease: [0.76, 0, 0.24, 1] }}
                  className="h-[2vw] lg:h-[1vw] bg-black hidden sm:block relative"
                >
                  <LEDIndicator className="absolute right-[-10px] top-1/2 -translate-y-1/2" />
                </motion.div>
              </div>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end pb-4 relative gap-6">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed border-l-2 border-black pl-4"
            >
              Ahmedabad's most exclusive academy for young makers, coders, and innovators. <br/>
              <span className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] mt-4 inline-block font-bold">Applications Open</span>
            </motion.p>

            {/* Interactive code terminal — changes when power is toggled */}
            <FloatingCodeWidget className="w-full" />
            
            <div className="flex items-center gap-6">
              <PowerSwitch />
              <MagneticButton>
                <button className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white transition-colors cursor-hover group relative z-20">
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
