import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlueprintGrid, PowerSwitch, LEDIndicator, FloatingCodeWidget } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';
import { useCircuitTriggers, HeroCTAs, EYEBROW } from './heroShared';

// ── Animated circuit hero (2D) ───────────────────────────────────────────────
// Flat, light, fast. SVG circuit traces draw and flow when the system powers on;
// the headline ignites from grey to brand. No WebGL.

function Trace({ d, powered, delay = 0, w = 2 }) {
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(20,16,9,0.07)" strokeWidth={w} strokeLinecap="round" />
      <motion.path
        d={d} fill="none" stroke="var(--color-accent)" strokeWidth={w} strokeLinecap="round"
        initial={false}
        animate={{ pathLength: powered ? 1 : 0, opacity: powered ? 1 : 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,90,0,0.4))' }}
      />
      {/* flowing packet */}
      {powered && (
        <motion.path
          d={d} fill="none" stroke="#fff" strokeWidth={w + 1} strokeLinecap="round"
          strokeDasharray="6 320"
          initial={{ strokeDashoffset: 326 }}
          animate={{ strokeDashoffset: [326, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: delay + 0.8 }}
          style={{ filter: 'drop-shadow(0 0 5px #fff)' }}
        />
      )}
    </g>
  );
}

function Node({ cx, cy, powered, delay = 0, r = 5 }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={r}
      initial={false}
      animate={{ scale: powered ? 1 : 0.6, fill: powered ? '#FF5A00' : 'rgba(20,16,9,0.15)' }}
      transition={{ duration: 0.5, delay: delay + 0.6 }}
      style={{ transformOrigin: `${cx}px ${cy}px`, filter: powered ? 'drop-shadow(0 0 6px rgba(255,90,0,0.6))' : 'none' }}
    />
  );
}

export default function HeroCircuit2D() {
  const ref = useRef(null);
  const { isPowered } = useCircuit();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.6 });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative min-h-screen bg-[var(--color-light)] font-sans overflow-hidden flex items-center" aria-label="The maker journey">
      <BlueprintGrid />

      {/* circuit trace layer */}
      <motion.svg style={{ y: gridY }} className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {/* spine down the middle, branching to the code panel and out */}
        <Trace d="M 720 -20 V 250 H 1040 V 430" powered={isPowered} delay={0.1} />
        <Trace d="M 720 250 H 360 V 520" powered={isPowered} delay={0.25} />
        <Trace d="M 1040 430 H 1260 V 700" powered={isPowered} delay={0.4} />
        <Trace d="M 360 520 V 760 H 760" powered={isPowered} delay={0.5} />
        <Trace d="M 720 250 V 920" powered={isPowered} delay={0.2} w={2.5} />
        <Node cx={720} cy={250} powered={isPowered} delay={0.1} r={6} />
        <Node cx={1040} cy={430} powered={isPowered} delay={0.3} />
        <Node cx={360} cy={520} powered={isPowered} delay={0.4} />
        <Node cx={1260} cy={700} powered={isPowered} delay={0.5} />
      </motion.svg>

      <div className="relative z-10 max-w-[100rem] mx-auto w-full px-6 md:px-12 py-24 md:py-0">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">

          {/* ── Left: type ── */}
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] mb-7">
              <LEDIndicator />
              {EYEBROW}
            </div>
            <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.86] text-[11vw] sm:text-[8vw] lg:text-[5.2vw] mb-7">
              <motion.span animate={{ color: isPowered ? '#131009' : '#9b958a' }} transition={{ duration: 0.8 }} className="block">
                The future belongs
              </motion.span>
              <motion.span animate={{ color: isPowered ? '#131009' : '#9b958a' }} transition={{ duration: 0.8, delay: 0.1 }} className="block">
                to the kids
              </motion.span>
              <motion.span animate={{ color: isPowered ? '#FF5A00' : '#c8a88f' }} transition={{ duration: 0.8, delay: 0.2 }} className="block">
                who build it.
              </motion.span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-8">
              A makerspace for K–12 where children do real work with real tools — and leave with a
              portfolio that speaks for itself.
            </p>
            <HeroCTAs className="mb-9" />
            <div className="flex flex-wrap items-center gap-6">
              <PowerSwitch />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                {isPowered ? 'System live — real tools, real problems' : 'Power on to begin'}
              </span>
            </div>
          </div>

          {/* ── Right: the circuit terminal ── */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <FloatingCodeWidget className="w-full" />
            </motion.div>
            {/* corner brackets */}
            <div className="absolute -inset-4 pointer-events-none">
              {[['top-0 left-0', 'border-t-2 border-l-2'], ['top-0 right-0', 'border-t-2 border-r-2'], ['bottom-0 left-0', 'border-b-2 border-l-2'], ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, b], i) => (
                <motion.div key={i} animate={{ borderColor: isPowered ? 'rgba(255,90,0,0.5)' : 'rgba(20,16,9,0.12)' }} className={`absolute ${pos} w-6 h-6 ${b}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 flex items-center gap-2"
      >
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>Scroll</motion.span>
        <span className="text-[var(--color-accent)]">↓</span>
      </motion.div>
    </section>
  );
}
