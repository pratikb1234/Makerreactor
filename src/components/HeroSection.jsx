import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, PowerFlowLine, LEDIndicator, PowerSwitch, FloatingCodeWidget } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

// Each byte in the packet is the binary encoding of a MAKERS letter
const MAKERS_BYTES = [
  { letter: 'M', bin: '01001101' },
  { letter: 'A', bin: '01000001' },
  { letter: 'K', bin: '01001011' },
  { letter: 'E', bin: '01000101' },
  { letter: 'R', bin: '01010010' },
  { letter: 'S', bin: '01010011' },
];

// White traveling packet — silently carries MAKERS encoded in binary (easter egg)
function MatrixPacket() {
  return (
    <span className="font-mono whitespace-nowrap font-bold px-3 select-none flex items-center gap-[6px]" style={{ fontSize: 11 }}>
      {MAKERS_BYTES.map(({ bin }, i) => (
        <span key={i} className="inline-block w-[58px] text-center text-black/75">{bin}</span>
      ))}
    </span>
  );
}


export default function HeroSection() {
  const { isPowered, setIsPowerFlowComplete, isPowerFlowComplete, setGlobalCircuitX, setIsHeroBridgeComplete } = useCircuit();
  const sectionRef = useRef(null);
  const buttonWrapRef = useRef(null);
  const makersRef = useRef(null);
  const [barTop, setBarTop] = useState(0);
  const codeSnippet = `// ─── Maker Machine v2.0 ───
machine.ignite();
circuit.sync(150);
`;
  const [flowPath, setFlowPath] = useState('');
  const [viewW, setViewW] = useState(1400);
  const [viewH, setViewH] = useState(1000);
  const [powerLineX, setPowerLineX] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

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
      const t = setTimeout(() => setIsFutureLineActive(true), 250);
      return () => clearTimeout(t);
    }
  }, [isPowered]);

  // Measure positions for SVG path and conduit bar dynamically
  useEffect(() => {
    const measure = () => {
      if (!buttonWrapRef.current || !sectionRef.current || !makersRef.current) return;

      const sRect = sectionRef.current.getBoundingClientRect();
      const bRect = buttonWrapRef.current.getBoundingClientRect();
      const mRect = makersRef.current.getBoundingClientRect();

      const W = sRect.width;
      const H = sRect.height;

      // Start from the left edge of the button
      const bx = bRect.left - sRect.left;
      // Button vertical center
      const by = bRect.top - sRect.top + bRect.height / 2;

      const pLineX = bx - 30; // x-coord of powerline at MAKERS text level

      // Path: go LEFT slightly to clear button, go UP past the headline, then go LEFT and bend UP to the top edge
      // Also draw a branch that goes DOWN to the bottom of the section to meet Section 2
      const path = `M ${bx} ${by} H ${pLineX} V 80 H 160 V 0`;

      const middleX = W / 2;

      setViewW(W);
      setViewH(H);
      setFlowPath(path);
      setPowerLineX(pLineX);
      setGlobalCircuitX(middleX); // Broadcast center X to Section 2
      setBarTop(mRect.top - sRect.top + mRect.height / 2);

      // Calculate the gap between the right side of the 'S' and the powerline
      const makersRight = mRect.right - sRect.left;
      const gap = pLineX - makersRight - 15; // 15px buffer
      setBarWidth(gap > 0 ? gap : 0);
    };

    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 500);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, [isPowered]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[var(--color-light)] flex items-center justify-center"
      style={{ clipPath: 'inset(0)' }}
    >
      <BlueprintGrid />

      {/* Blob layer — overflow-hidden so blobs don't spill outside hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: y1, opacity }} className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full border border-black/5 bg-gradient-to-tr from-gray-100 to-white blur-3xl" />
        <motion.div style={{ y: y2, opacity }} className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 blur-2xl" />
      </div>

      {/* PCB Trace — clipped to hero section so it doesn't bleed into next section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ScrollCircuitLine
          sectionRef={sectionRef}
          className="top-0 left-0 w-full h-full"
          pathD="M 20 0 V 250 H 80 V 600 H 20 V 1000 H 500"
          viewBox="0 0 1000 1000"
          scrollOffset={["start center", "end center"]}
          onReachCenter={setIsHeroBridgeComplete}
          components={[
            { type: 'led', cx: 20, cy: 125, threshold: 0.10 },
            { type: 'car', cx: 80, cy: 425, threshold: 0.48 },
            { type: 'drone', cx: 20, cy: 780, threshold: 0.80 },
          ]}
        />
      </div>

      {/* Conduit bar — right edge connects to the powerline (x=bx-30), extends leftward */}
      {isPowered && barTop > 0 && powerLineX > 0 && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: barWidth, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            right: `${viewW - powerLineX}px`,
            top: barTop,
            transform: 'translateY(-50%)',
            zIndex: 5
          }}
          className="h-9 pointer-events-none"
        >
          {/* Inner background and clipping container */}
          <div
            className="absolute inset-0 bg-black overflow-hidden rounded-l-full"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
          >
            {/* Glowing white light packet — MAKERS binary with matrix letter glitches */}
            {isFutureLineActive && (
              <motion.div
                initial={{ left: '100%', x: '0%' }}
                animate={{ left: '0%', x: '-100%' }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 bottom-0 bg-white rounded-full shadow-[0_0_12px_#FF5A00,0_0_24px_#FF5A00] flex items-center justify-center overflow-hidden"
                style={{ width: 440 }}
              >
                <MatrixPacket />
              </motion.div>
            )}
          </div>

          {/* Orange junction dot at RIGHT edge (powerline connection) - Now unclipped! */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[var(--color-accent)] rounded-full shadow-[0_0_12px_#FF5A00,0_0_24px_#FF5A00] z-10" />

          <LEDIndicator className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10" />
        </motion.div>
      )}

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
                  <span ref={makersRef} className="text-[var(--color-accent)]">MAKERS</span>
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
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-2">Make now:</p>
              <p className={`text-base md:text-lg font-medium leading-relaxed mb-4 transition-colors duration-500 ${isPowered ? 'text-black' : 'text-gray-600'}`}>
                At Bits & Studios, your child joins a makerspace community for K–12 makers who build, solve, compete, fail, fix and grow.
              </p>
              <p className={`text-lg md:text-xl font-bold leading-relaxed transition-colors duration-500 ${isPowered ? 'text-[var(--color-accent)]' : 'text-gray-500'}`}>
                Become a Founding 150 member.
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
                APPLY NOW →
              </motion.a>
            </motion.div>

            {/* Code terminal — original widget unchanged */}
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