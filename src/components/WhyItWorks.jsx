import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { BlueprintGrid, ScrollCircuitLine } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';

const STEPS = [
  { num: '01', title: 'THE ENVIRONMENT', desc: "A space built for real work. Real tools. Real problems. Where the answer is never handed to them — it's built by them.", image: '/src/assets/WhatsApp Image 2026-04-30 at 20.48.28.jpeg', threshold: 0.15 },
  { num: '02', title: 'THE CULTURE',     desc: 'Where serious work is celebrated, struggle is respected, and the best idea in the room might belong to an eleven year old.',          image: '/src/assets/card 2.png',  threshold: 0.50 },
  { num: '03', title: 'THE OUTCOMES',    desc: 'Projects presented publicly. Portfolios that speak louder than grades. Competitions won on national and international stages.',        image: '/src/assets/card 3.png',  threshold: 0.85 },
];

export default function WhyItWorks() {
  const sectionRef = useRef(null);
  const introTrackRef = useRef(null);
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
  
  // Hold large and wide (0 → 0.4) to force two lines, then shrink and slide left (0.4 → 1)
  const headlineX     = useTransform(introP, [0, 0.4, 1], ['12%', '12%', '0%']);
  const headlineScale = useTransform(introP, [0, 0.4, 1], [1.15, 1.15, 1]);
  const headlineWidth = useTransform(introP, [0, 0.4, 1], ['210%', '210%', '100%']);
  const subOpacity    = useTransform(introP, [0.8, 1], [0, 1]);

  return (
    <>
      {/* ── Main scrolling section ── */}
      <section
        ref={sectionRef}
        className="pb-24 md:pb-40 bg-[var(--color-light)] relative border-b border-black/10 overflow-visible font-sans"
      >
        {/* Invisible tracker for the first 120vh of scroll */}
        <div ref={introTrackRef} className="absolute top-0 left-0 w-full h-[120vh]" />
        <BlueprintGrid />

        {/* Central circuit line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none z-10"
          style={{ top: 0, bottom: 0, width: 80 }}
        >
          <ScrollCircuitLine
            sectionRef={sectionRef}
            className="top-0 left-0 w-full h-full"
            pathD="M 40 0 V 1000"
            viewBox="0 0 80 1000"
            scrollOffset={['start center', 'end center']}
            isActivated={isHeroBridgeComplete}
            components={[]} // LEDs removed — each card renders its own branch dot
          />
        </div>

        <div className="max-w-[95rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-0">

            {/* ── LEFT: sticky headline — cinematic entrance animation ── */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-32 lg:pr-16">
              <motion.div
                style={{
                  x: headlineX,
                  scale: headlineScale,
                  transformOrigin: 'left center',
                }}
              >
                <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-5 bg-black/5 px-4 py-2 rounded-full border border-black/10">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  SYSTEM.ROOT // WHY_IT_WORKS
                </div>
                <motion.h2
                  className="font-display font-bold uppercase tracking-tighter leading-[0.88] text-black mb-7"
                  style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)', width: headlineWidth }}
                >
                  THE MOMENT YOUR CHILD BUILDS SOMETHING REAL{' '}
                  <span className="text-[var(--color-accent)]">— THEY CHANGE.</span>
                </motion.h2>
                <motion.div style={{ opacity: subOpacity }} className="border-l-2 border-[var(--color-accent)]/30 pl-5 space-y-2 max-w-sm">
                  <p className="text-base font-bold text-black leading-snug">
                    Not the project. Not the robot. Not the code.{' '}
                    <span className="text-[var(--color-accent)]">Them.</span>
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 leading-relaxed">
                    Their confidence. Their patience. Their belief that hard problems have solutions.
                  </p>
                </motion.div>
                <motion.div style={{ opacity: subOpacity }} className="mt-8 bg-[#111] rounded-2xl border border-white/5 p-5 relative overflow-hidden max-w-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
                  <p className="font-mono text-[10px] text-gray-500 mb-2 tracking-widest">// ACTIVE_DIRECTIVE</p>
                  <p className="text-base font-bold text-white font-display uppercase tracking-wide leading-snug">
                    Projects are not the end goal.<br />
                    <span className="text-[var(--color-accent)]">They are the method.</span>
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* ── RIGHT: 3 cards scrolling normally, pushed down to allow cinematic hold ── */}
            <div className="w-full lg:w-[55%] lg:pl-24 pt-[120vh] flex flex-col gap-20">
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

      {/* ── Core Belief — dark cinematic ── */}
      <section className="relative min-h-screen bg-[#0B1026] flex flex-col items-center justify-center px-6 md:px-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]/60 mb-12 flex items-center gap-3">
          <div className="w-8 h-px bg-[var(--color-accent)]/40" />Our Core Belief<div className="w-8 h-px bg-[var(--color-accent)]/40" />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-display font-bold uppercase tracking-tighter leading-[0.9] max-w-6xl"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 6rem)' }}>
          <span className="text-white">A maker who has built something real has learnt more than any system was ever designed to teach</span>
          <span className="text-[var(--color-accent)]/50"> — and felt it in a way that never leaves.</span>
        </motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="flex gap-10 mt-16 text-white/20 font-mono text-[10px] tracking-widest uppercase">
          {['SKILL_TRANSFER', 'MUSCLE_MEMORY', 'TRUE_LEARNING'].map(t => (
            <div key={t} className="flex items-center gap-2"><span className="text-[var(--color-accent)]/40">#</span>{t}</div>
          ))}
        </motion.div>
      </section>
    </>
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

  const cardOpacity = useTransform(activeP, [0, 1], [0, 1]);
  const blurVal     = useTransform(activeP, [0, 1], [12, 0]);
  const cardFilter  = useMotionTemplate`blur(${blurVal}px)`;
  const cardScale   = useTransform(activeP, [0, 1], [0.96, 1]);
  
  const borderColor = useTransform(activeP, [0, 1], ['rgba(255,90,0,0.12)', '#FF5A00']);
  const boxShadow   = useTransform(activeP, [0, 1], [
    '0 8px 30px rgba(0,0,0,0.04)',
    '0 0 0 1.5px rgba(255,90,0,0.5), 0 20px 60px rgba(255,90,0,0.14)'
  ]);
  const branchOp    = useTransform(activeP, [0, 1], [0, 1]);
  const imgFilter   = useTransform(activeP, [0, 1], ['grayscale(100%) brightness(0.65)', 'grayscale(0%) brightness(1)']);
  const numColor    = useTransform(activeP, [0, 1], ['rgba(0,0,0,0.1)', '#FF5A00']);
  const titleColor  = useTransform(activeP, [0, 1], ['#111', '#FF5A00']);

  return (
    <motion.div ref={cardRef} className="relative group" style={{ opacity: cardOpacity, scale: cardScale, filter: cardFilter }}>
      {/* Branch wire connecting card to central line */}
      <motion.div className="absolute top-[3rem] right-full hidden lg:block h-px pointer-events-none"
        style={{ width: '4rem', opacity: branchOp, backgroundColor: '#FF5A00', boxShadow: '0 0 8px #FF5A00' }} />
      {/* Junction dot on the central line */}
      <motion.div className="absolute top-[3rem] right-[calc(100%+4rem)] translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--color-accent)] hidden lg:block z-20"
        style={{ opacity: branchOp, backgroundColor: '#FF5A00', boxShadow: '0 0 10px #FF5A00' }} />

      <motion.div style={{ borderColor, boxShadow }} className="rounded-[2rem] border-2 overflow-hidden bg-white max-w-[460px]">
        <div className="relative h-[260px] overflow-hidden bg-black/5">
          <motion.img src={step.image} alt={step.title} style={{ filter: imgFilter }} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 text-white/60 font-mono text-[10px]">[{step.num}_SYS]</div>
          <div className="absolute bottom-4 right-4 text-white/60 font-mono text-[10px]">[OK]</div>
        </div>
        <div className="p-7">
          <div className="flex items-center gap-3 mb-2">
            <motion.span className="font-mono text-3xl font-bold" style={{ color: numColor }}>{step.num}</motion.span>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent" />
          </div>
          <motion.h3 className="font-display font-bold text-2xl uppercase tracking-tighter mb-2" style={{ color: titleColor }}>{step.title}</motion.h3>
          <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
