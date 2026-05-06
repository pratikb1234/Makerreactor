import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, PowerFlowLine, LEDIndicator, PowerSwitch, FloatingCodeWidget } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

export default function HeroSection() {
  const { isPowered, setIsPowerFlowComplete, isPowerFlowComplete } = useCircuit();
  const sectionRef = useRef(null);
  const buttonWrapRef = useRef(null);
  const [flowPath, setFlowPath] = useState('');
  const [viewW, setViewW] = useState(1400);
  const [viewH, setViewH] = useState(1000);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Track when the power trail has reached the top of the path
  const [isFutureLineActive, setIsFutureLineActive] = useState(false);
  
  // Reset when power goes off
  useEffect(() => {
    if (!isPowered) {
      setIsFutureLineActive(false);
    } else {
      // Trigger the future line lightsaber slightly after power on (as trail reaches it vertically)
      const t = setTimeout(() => setIsFutureLineActive(true), 250);
      return () => clearTimeout(t);
    }
  }, [isPowered]);

  // Measure button position and build the SVG path dynamically
  useEffect(() => {
    const measure = () => {
      if (!buttonWrapRef.current || !sectionRef.current) return;
      
      const sRect = sectionRef.current.getBoundingClientRect();
      const bRect = buttonWrapRef.current.getBoundingClientRect();

      const W = sRect.width;
      const H = window.innerHeight;

      // Start from the left edge of the button
      const bx = bRect.left - sRect.left;
      // Button vertical center
      const by = bRect.top + bRect.height / 2;

      // Path: go LEFT slightly to clear button, go UP past the headline, then go LEFT and bend UP to the top edge
      // Running vertically at x=160 keeps it safely to the right of the icon trace
      const path = `M ${bx} ${by} H ${bx - 30} V 80 H 160 V 0`;

      setViewW(W);
      setViewH(H);
      setFlowPath(path);
    };

    measure();
    window.addEventListener('resize', measure);
    // Re-measure when fonts/layout settle
    const t = setTimeout(measure, 500);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[var(--color-light)] flex items-center justify-center"
    >
      <BlueprintGrid />
      
      <motion.div style={{ y: y1, opacity }} className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full border border-black/5 bg-gradient-to-tr from-gray-100 to-white blur-3xl pointer-events-none" />
      <motion.div style={{ y: y2, opacity }} className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 blur-2xl pointer-events-none" />

      {/* PCB Trace — Side trace with evolving icons */}
      <ScrollCircuitLine 
        sectionRef={sectionRef}
        className="top-0 left-0 w-[140px] h-full"
        pathD="M 20 0 V 250 H 80 V 600 H 20 V 1000"
        viewBox="0 0 100 1000"
        scrollOffset={["start center", "end center"]}
        components={[
          { type: 'led',    cx: 20, cy: 125, threshold: 0.12 },
          { type: 'car',    cx: 80, cy: 425, threshold: 0.55 },
          { type: 'drone',  cx: 20, cy: 800, threshold: 0.85 },
        ]}
      />

      {/* Power flow line — coordinates measured from actual button position */}
      {flowPath && (
        <PowerFlowLine 
          className="absolute top-0 left-0 w-full h-screen z-0"
          pathD={flowPath}
          viewBox={`0 0 ${viewW} ${viewH}`}
          onPowerReachTop={() => setIsPowerFlowComplete(true)}
        />
      )}

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Headline — fixed layout, only color/opacity animates */}
          <div className="lg:col-span-8">
            <motion.div 
              animate={{ backgroundColor: isPowered ? 'var(--color-accent)' : '#e5e7eb' }}
              transition={{ duration: 0.8 }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-full mb-8 flex items-center justify-center"
            >
              <div className="w-1/2 h-1/2 bg-[var(--color-light)] rounded-full" />
            </motion.div>
            
            {/* Dynamic Headline — swapped based on user feedback */}
            <motion.h1
              animate={{ 
                color: isPowered ? '#000000' : '#9ca3af',
                opacity: isPowered ? 1 : 0.8
              }}
              transition={{ duration: 0.8 }}
              className="text-[8vw] sm:text-[7vw] lg:text-[5.5vw] font-display font-bold leading-[0.9] tracking-tighter uppercase max-w-4xl"
            >
              {isPowered ? (
                <>
                  Future belongs to<br />
                  <span className="flex items-center gap-4 md:gap-8">
                    <span className="text-[var(--color-accent)]">the ones who make.</span>
                    <motion.div 
                      animate={{ 
                        width: '12vw',
                        backgroundColor: '#000000'
                      }}
                      transition={{ duration: 0.8 }}
                      className="h-[1vw] hidden lg:block relative"
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-r-full">
                        {isFutureLineActive && (
                          <motion.div
                            initial={{ left: '100%', x: '0%' }}
                            animate={{ left: '0%', x: '-100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-[40px] bg-white rounded-full shadow-[0_0_10px_#FF5A00,0_0_20px_#FF5A00]"
                          />
                        )}
                      </div>
                      <LEDIndicator className="absolute right-[-10px] top-1/2 -translate-y-1/2" />
                    </motion.div>
                  </span>
                </>
              ) : (
                <>
                  Build the<br />
                  <span className="text-gray-300">Future.</span>
                </>
              )}
            </motion.h1>
          </div>

          {/* Right: Completely fixed layout — only opacity transitions */}
          <div className="lg:col-span-4 flex flex-col justify-start pt-4 gap-6">
            
            {/* Cohort CTA — pops when online, fades when offline */}
            <motion.div
              animate={{ opacity: isPowered ? 1 : 0.4 }}
              transition={{ duration: 0.6 }}
              className={`border-l-2 pl-4 transition-colors duration-500 ${isPowered ? 'border-[var(--color-accent)]' : 'border-black'}`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-2">Make:</p>
              <p className={`text-lg md:text-xl font-medium leading-relaxed transition-colors duration-500 ${isPowered ? 'text-black' : 'text-gray-600'}`}>
                Join the exclusive cohort<br/>of 150 makers.
              </p>
              <motion.a
                href="#apply"
                animate={{ 
                  backgroundColor: isPowered ? '#FF5A00' : '#000000',
                  boxShadow: isPowered ? '0 0 20px rgba(255,90,0,0.4)' : '0 0 0px rgba(0,0,0,0)'
                }}
                transition={{ duration: 0.5 }}
                className="inline-block mt-4 px-6 py-2.5 text-white font-mono text-sm uppercase tracking-widest font-bold rounded-full transition-transform duration-300 hover:scale-105"
              >
                Apply Now →
              </motion.a>
            </motion.div>

            {/* Code terminal — fixed height prevents layout shift */}
            <FloatingCodeWidget className="w-full" />
            
            {/* Power button — ref measured for exact circuit connection */}
            <div ref={buttonWrapRef} className="flex items-center gap-6">
              <PowerSwitch />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
