import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine, ArcReactorNode, Symbol } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

const STEPS = [
  { num: '01', title: 'THE ENVIRONMENT', icon: 'brain', desc: "A space built for real work. Real tools. Real problems. Where the answer is never handed to them — it's built by them.", image: '/src/assets/WhatsApp Image 2026-04-30 at 20.48.28.jpeg', threshold: 0.15 },
  { num: '02', title: 'THE CULTURE', icon: 'dna', desc: 'Where serious work is celebrated, struggle is respected, and the best idea in the room might belong to an eleven-year-old.', image: '/src/assets/card 2.png', threshold: 0.50 },
  { num: '03', title: 'THE OUTCOMES', icon: 'quantum', desc: 'Projects presented publicly. Portfolios that speak louder than grades. Competitions won on national and international stages.', image: '/src/assets/card 3.png', threshold: 0.85 },
];

export default function WhyItWorks() {
  const sectionRef = useRef(null);
  const introTrackRef = useRef(null);
  const enderRef = useRef(null);
  const { isHeroBridgeComplete } = useCircuit();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  // Tracks exactly the first 120vh of scroll after section reaches top
  const { scrollYProgress: introP } = useScroll({
    target: introTrackRef,
    offset: ['start start', 'end start'],
  });

  // Cinematic → normal: font 9.5vw (full-screen) → 4.5vw, width 100vw → 40vw (column), x -3rem → 0rem
  // Transition completes at introP=0.85 so headline is settled before first card at introP=1
  const fontSizeVw    = useTransform(introP, [0, 0.15, 0.35, 1], [9.5, 9.5, 4.5, 4.5]);
  const fontSize      = useMotionTemplate`${fontSizeVw}vw`;
  const headlineWidthVw = useTransform(introP, [0, 0.15, 0.35, 1], [100, 100, 40, 40]);
  const headlineWidth = useMotionTemplate`${headlineWidthVw}vw`;
  const headlineX     = useTransform(introP, [0, 0.15, 0.35, 1], ['-3rem', '-3rem', '0rem', '0rem']);
  // Sub-quote: one-way trigger — once visible, never fades out
  const [showSub, setShowSub] = useState(false);
  useMotionValueEvent(introP, 'change', (v) => {
    if (v >= 0.12) setShowSub(true);
  });
  // Sub-quote margin: indented during cinematic hold, flush when settled in left column
  const subMarginLeft = useTransform(introP, [0.15, 0.35], ['2rem', '0rem']);
  // Dark ACTIVE_DIRECTIVE card: one-way trigger to prevent disappearing on scroll up
  const [showDirective, setShowDirective] = useState(false);
  useMotionValueEvent(introP, 'change', (v) => {
    if (v >= 0.35) setShowDirective(true);
  });

  return (
    <>
      {/* ── Main scrolling section ── */}
      <section
        ref={sectionRef}
        className="pb-24 md:pb-40 bg-[var(--color-light)] relative border-b border-black/10 overflow-visible font-sans"
      >
        {/* Invisible tracker for the first 180vh of scroll */}
        <div ref={introTrackRef} className="absolute top-0 left-0 w-full h-[180vh]" />
        <BlueprintGrid />

        {/* Central circuit line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none z-0"
          style={{ top: 0, bottom: 0, width: 80 }}
        >
          <ScrollCircuitLine
            sectionRef={sectionRef}
            className="top-0 left-0 w-full h-full"
            pathD="M 40 0 V 1000"
            viewBox="0 0 80 1000"
            scrollOffset={['start center', 'end bottom']}
            isActivated={isHeroBridgeComplete}
            components={[]}
          />
        </div>

        <div className="max-w-[95rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-0">

            {/* ── LEFT: sticky headline — cinematic entrance animation ── */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-12 lg:pr-16 relative z-20">
              <motion.div
                style={{
                  x: headlineX,
                  transformOrigin: 'left center',
                }}
              >
                <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-4 bg-black/5 px-4 py-2 rounded-full border border-black/10">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  SYSTEM.ROOT // WHY_IT_WORKS
                </div>
                <motion.h2
                  className="font-display font-bold uppercase tracking-tighter leading-[0.88] text-black mb-5"
                  style={{ fontSize, width: headlineWidth }}
                >
                  THE MOMENT<br />
                  YOUR CHILD BUILDS<br />
                  SOMETHING REAL —<br />
                  <span className="text-[var(--color-accent)]">THEY CHANGE.</span>
                </motion.h2>
              </motion.div>

              {/* Sub-quote — independent of headline scale/x, fades in during hold */}
              <motion.div
                animate={{ opacity: showSub ? 1 : 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ x: headlineX, marginLeft: subMarginLeft }}
                className="mt-4 border-l-2 border-[var(--color-accent)]/30 pl-5 space-y-2 max-w-sm"
              >
                <p className="text-base font-bold text-black leading-snug">
                  Not the project. Not the robot. Not the code.{' '}
                  <span className="text-[var(--color-accent)]">Them.</span>
                </p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400 leading-relaxed">
                  Science. Math. Engineering. Not as subjects — as tools they now know how to wield.
                </p>
              </motion.div>
              <motion.div 
                animate={{ opacity: showDirective ? 1 : 0, x: 0 }} // x handled by wrapper if needed, or rely on layout
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ x: headlineX }}
                className="mt-6 bg-[#111] rounded-2xl border border-white/5 p-5 relative overflow-hidden max-w-sm"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
                <p className="font-mono text-[11px] text-gray-500 mb-2 tracking-widest">// ACTIVE_DIRECTIVE</p>
                <p className="text-base font-bold text-white font-display uppercase tracking-wide leading-snug">
                  Projects are not the end goal.<br />
                  <span className="text-[var(--color-accent)]">They are the method.</span>
                </p>
              </motion.div>
            </div>

            {/* ── RIGHT: Heading + 3 cards scrolling normally, pushed down to allow cinematic hold ── */}
            <div className="w-full lg:w-[55%] pt-[160vh] flex flex-col items-end gap-[40vh] relative z-30">
              <HeadingCard isCircuitActive={isHeroBridgeComplete} />
              
              {STEPS.map((step, idx) => (
                <StepCard
                  key={idx}
                  step={step}
                  isCircuitActive={isHeroBridgeComplete}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Belief — ender ── */}
      <section ref={enderRef} className="relative py-32 md:py-48 bg-[var(--color-dark)] text-[var(--color-light)] flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Symmetrical Frame Circuit Lines */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <ScrollCircuitLine sectionRef={enderRef} className="top-0 left-0 w-full h-full" pathD="M 500 0 V 150 H 100 V 850 H 500 V 1000" viewBox="0 0 1000 1000" isActivated={isHeroBridgeComplete} scrollOffset={["start 80%", "center center"]} />
          <ScrollCircuitLine sectionRef={enderRef} className="top-0 left-0 w-full h-full" pathD="M 500 0 V 150 H 900 V 850 H 500 V 1000" viewBox="0 0 1000 1000" isActivated={isHeroBridgeComplete} scrollOffset={["start 80%", "center center"]} />
        </div>


        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative z-10 font-mono text-xs uppercase tracking-[0.3em] text-gray-500 font-bold mb-12 flex items-center gap-3">
          <div className="w-8 h-px bg-white/20" />Our Core Belief<div className="w-8 h-px bg-white/20" />
        </motion.div>
        
        <motion.p initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 text-center font-display font-bold uppercase tracking-tighter leading-[0.9] max-w-6xl" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6rem)', textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
          <span className="text-white">A maker who has built something real has learned more than any system was ever designed to teach.</span>
        </motion.p>

        {/* Universal Footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="relative z-10 flex gap-10 mt-16 text-gray-400 font-mono text-[11px] tracking-widest uppercase font-bold">
          {['SYSTEMS_THINKING', 'APPLIED_ENGINEERING', 'TACTILE_KNOWLEDGE'].map(t => (
            <div key={t} className="flex items-center gap-2"><span className="text-[var(--color-accent)]">#</span>{t}</div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

// ── Heading Card: Explains what the cue cards are about ──────────────
function HeadingCard({ isCircuitActive }) {
  const cardRef = useRef(null);
  const { scrollYProgress: cp } = useScroll({ target: cardRef, offset: ['start 55%', 'start 50%'] });
  const activeP = useTransform(cp, (v) => isCircuitActive ? v : 0);
  const cardOpacity = useTransform(activeP, [0, 1], [0.4, 1]);
  const branchOp = useTransform(activeP, [0, 1], [0, 1]);
  const titleColor = useTransform(activeP, [0, 1], ['#111', '#FF5A00']);
  const borderColor = useTransform(activeP, [0, 1], ['rgba(0,0,0,0.1)', '#FF5A00']);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  useMotionValueEvent(activeP, "change", (latest) => setIsActive(latest > 0.5));

  return (
    <motion.div ref={cardRef} className="relative w-full max-w-[460px] mb-[-10vh]" style={{ opacity: cardOpacity }}>
      {/* Branch wire connecting card to central line */}
      <motion.div className="absolute top-[1.5rem] right-full hidden lg:block h-px pointer-events-none"
        style={{ width: 'min(252px, calc(50vw - 508px))', opacity: branchOp, backgroundColor: '#FF5A00', boxShadow: '0 0 8px #FF5A00' }} />
      
      {/* Arc Reactor Node on the central line */}
      <motion.div className="absolute top-[1.5rem] hidden lg:flex items-center justify-center z-50 pointer-events-auto"
        style={{ right: 'calc(100% + min(252px, calc(50vw - 508px)))', transform: 'translateX(50%) translateY(-50%)', opacity: branchOp }} 
      >
        <ArcReactorNode isActive={isActive} isHovered={isHovered} setIsHovered={setIsHovered}>
          <svg viewBox="-20 -20 40 40" className="w-8 h-8 pointer-events-none drop-shadow-sm">
            <Symbol type="vr" on={isActive} />
          </svg>
        </ArcReactorNode>
      </motion.div>

      <motion.div className="border-l-[4px] pl-6 py-1" style={{ borderColor }}>
        <p className="font-mono text-[11px] text-gray-500 mb-3 tracking-[0.2em] uppercase font-bold">// THE ECOSYSTEM</p>
        <motion.h3 style={{ color: titleColor }} className="text-4xl font-display font-bold uppercase tracking-tight leading-[1.1]">
          The Anatomy of <br />a Maker Space
        </motion.h3>
      </motion.div>
    </motion.div>
  );
}

// ── Card: invisible until it reaches screen center, then fades in sharply ──────────────
function StepCard({ step, isCircuitActive }) {
  const cardRef = useRef(null);

  // Tracks this specific card crossing the vertical center of the viewport
  // Starts fading at 55% (just below center) and fully opaque at 50% (exact center)
  const { scrollYProgress: cp } = useScroll({
    target: cardRef,
    offset: ['start 55%', 'start 50%']
  });

  // Only animate if the circuit is active, otherwise stay invisible
  const activeP = useTransform(cp, (v) => isCircuitActive ? v : 0);

  const cardOpacity = useTransform(activeP, [0, 1], [0.4, 1]);
  const blurVal = useTransform(activeP, [0, 1], [0, 0]);
  const cardFilter = useMotionTemplate`blur(${blurVal}px)`;
  const cardScale = useTransform(activeP, [0, 1], [0.98, 1]);

  const branchOp = useTransform(activeP, [0, 1], [0, 1]);
  const imgFilter = useTransform(activeP, [0, 1], ['grayscale(100%) brightness(0.65)', 'grayscale(0%) brightness(1)']);
  const numColor = useTransform(activeP, [0, 1], ['rgba(0,0,0,0.1)', '#FF5A00']);
  const titleColor = useTransform(activeP, [0, 1], ['#111', '#FF5A00']);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  useMotionValueEvent(activeP, "change", (latest) => setIsActive(latest > 0.5));

  return (
    <motion.div ref={cardRef} className="relative group" style={{ opacity: cardOpacity, scale: cardScale, filter: cardFilter }}>
      {/* Branch wire connecting card to central line */}
      <motion.div className="absolute top-[3rem] right-full hidden lg:block h-px pointer-events-none"
        style={{ width: 'min(252px, calc(50vw - 508px))', opacity: branchOp, backgroundColor: '#FF5A00', boxShadow: '0 0 8px #FF5A00' }} />
      
      {/* Arc Reactor Node on the central line */}
      <motion.div className="absolute top-[3rem] hidden lg:flex items-center justify-center z-50 pointer-events-auto"
        style={{ right: 'calc(100% + min(252px, calc(50vw - 508px)))', transform: 'translateX(50%) translateY(-50%)', opacity: branchOp }} 
      >
        <ArcReactorNode isActive={isActive} isHovered={isHovered} setIsHovered={setIsHovered}>
          {step.icon && (
            <svg viewBox="-20 -20 40 40" className="w-8 h-8 pointer-events-none drop-shadow-sm">
              <Symbol type={step.icon} on={isActive} />
            </svg>
          )}
        </ArcReactorNode>
      </motion.div>

      <motion.div className="bg-transparent max-w-[460px] relative font-sans group">
        <div className="relative h-[320px] overflow-hidden mb-8 shadow-xl">
          <motion.img src={step.image} alt={step.title} style={{ filter: imgFilter }} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-none font-mono text-[10px] tracking-widest font-bold shadow-lg flex items-center gap-2 border border-black/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <motion.span style={{ color: numColor }}>SYS // {step.title.split(' ')[1] || step.title}</motion.span>
          </div>
        </div>
        <motion.h3 style={{ color: titleColor }} className="text-4xl font-display font-bold uppercase tracking-tight mb-4">{step.title}</motion.h3>
        <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
      </motion.div>
    </motion.div>
  );
}
