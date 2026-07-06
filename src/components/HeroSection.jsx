import { useRef, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { PowerSwitch, LEDIndicator } from './MakerElements';
import { useCircuit } from '../context/CircuitContext';
import { waLink, VISIT_MESSAGE } from './StickyCTA';

// Isometric world carries Three.js — loads as its own chunk after first paint
const HeroWorld3D = lazy(() => import('./HeroWorld3D'));

// ── The maker transformation — eight stations across the years ──────────────
// Each stage names the skill being built and the belief it installs.
// This is the education: why making matters, year by year.
const JOURNEY = [
  {
    num: '01', tag: 'Age 5 · Wonder', title: 'The first tower',
    belief: '“I can try.”',
    body: 'Blocks fall. They rebuild. Making starts with hands, not screens — balance, patience, and the courage to try again.',
  },
  {
    num: '02', tag: 'Age 7 · Curiosity', title: 'How things work',
    belief: '“Things can be understood.”',
    body: 'The toy comes apart. The mechanism makes sense. Curiosity becomes a method: look inside, ask why.',
  },
  {
    num: '03', tag: 'Age 8 · First circuit', title: 'Making it light up',
    belief: '“I can make it work.”',
    body: 'A battery, a wire, an LED — and light. The moment a child stops consuming technology and starts commanding it.',
  },
  {
    num: '04', tag: 'Age 10 · Code', title: 'Teaching machines',
    belief: '“I can teach a machine.”',
    body: 'Logic, loops, debugging. Code stops being magic and becomes a language they speak — and a robot that listens.',
  },
  {
    num: '05', tag: 'Age 12 · Real tools', title: 'Trusted with fire',
    belief: '“I’m trusted with real things.”',
    body: 'Soldering irons. Real materials. Safety earned, not assumed. Trust builds responsibility — and responsibility builds confidence.',
  },
  {
    num: '06', tag: 'Age 13 · Design', title: 'Imagine, then make',
    belief: '“If I can draw it, I can build it.”',
    body: 'From sketch to CAD to a printed object in their hands. The gap between idea and reality closes for good.',
  },
  {
    num: '07', tag: 'Age 15 · The team', title: 'Harder, together',
    belief: '“We can solve hard problems.”',
    body: 'Competition robots. Deadlines. Teammates. Failure on a public field — and the comeback after it.',
  },
  {
    num: '08', tag: 'Age 18 · College', title: 'The door opens',
    belief: '“My work opened the door.”',
    body: 'A portfolio that speaks louder than marks. The cap goes up — and the making goes with him.',
  },
  {
    num: '09', tag: 'Age 22 · His own thing', title: 'Still building',
    belief: '“I don’t wait for permission.”',
    body: 'His own bench, his own shelves, his own product lifting off the pad. Shipping things that matter.',
  },
  {
    num: '10', tag: 'An amazing life', title: 'The spark passes on',
    belief: '“A life, built by hand.”',
    body: 'A home, a studio, work he is proud of — and a new kid reaching for the spark. The trail begins again.',
  },
];

const MAKERS_BYTES = ['01001101', '01000001', '01001011', '01000101', '01010010', '01010011'];

function CTAs({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <a
        href={waLink(VISIT_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-7 py-3 bg-[var(--color-accent)] text-white font-mono text-sm uppercase tracking-widest font-bold rounded-full shadow-[0_0_24px_rgba(255,90,0,0.35)] transition-transform duration-300 hover:scale-105 cursor-hover"
      >
        BOOK A STUDIO VISIT →
      </a>
      <a
        href="#admissions"
        className="font-mono text-xs uppercase tracking-widest font-bold text-gray-600 hover:text-[var(--color-accent)] transition-colors cursor-hover underline decoration-black/20 underline-offset-4"
      >
        How admissions work
      </a>
    </div>
  );
}

// Show, don't tell: the scene does the talking — one quiet caption underneath.
// A mono age-tag, the stage's belief in display type, and a thin progress strip.
function SceneCaption({ activeStep }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <AnimatePresence mode="wait">
        {activeStep >= 0 && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {JOURNEY[activeStep].tag}
            </div>
            <div className="font-display font-bold tracking-tight text-black text-2xl md:text-4xl">
              {JOURNEY[activeStep].belief}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* eight quiet ticks — where you are in the years */}
      <div className="flex items-center gap-1.5 mt-1">
        {JOURNEY.map((s, i) => (
          <span
            key={s.num}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === activeStep ? 'w-7 bg-[var(--color-accent)]' : i < activeStep ? 'w-2.5 bg-[var(--color-accent)]/40' : 'w-2.5 bg-black/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const trackRef = useRef(null);
  const { isPowered, togglePower, setIsPowerFlowComplete, setIsHeroBridgeComplete } = useCircuit();
  const [activeStep, setActiveStep] = useState(-1);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  // One-way circuit triggers: first scroll ignites the system, journey's end arms the bridge
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.02 && !isPowered) togglePower();
    if (v > 0.04) setIsPowerFlowComplete(true);
    if (v > 0.86) setIsHeroBridgeComplete(true);
    // Captions flip exactly when the spark ARRIVES at a station (dwell pacing:
    // it rests at each station from 30% before to 30% after the leg boundary).
    const seg = Math.min(Math.max((v - 0.08) / 0.8, 0), 1) * (JOURNEY.length - 1);
    const idx = seg < 0.7 ? 0 : Math.min(JOURNEY.length - 1, Math.floor(seg + 0.3));
    setActiveStep(v < 0.08 ? -1 : idx);
  });

  // Intro lockup
  const introOpacity = useTransform(p, [0, 0.07, 0.12], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.12], [0, -60]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.1 ? 'none' : 'auto'));

  // Journey overlay (step list)
  const journeyOpacity = useTransform(p, [0.1, 0.15, 0.85, 0.9], [0, 1, 1, 0]);

  // Outro lockup
  const outroOpacity = useTransform(p, [0.88, 0.95], [0, 1]);
  const outroY = useTransform(p, [0.88, 0.97], [36, 0]);
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.9 ? 'auto' : 'none'));

  const progressPct = useTransform(p, (v) => `${String(Math.min(99, Math.max(0, Math.round(v * 100)))).padStart(2, '0')}`);
  const railFill = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  return (
    <section ref={trackRef} className="relative h-[1000vh] bg-[var(--color-light)] font-sans" aria-label="The maker journey">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── The isometric maker world ── */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <HeroWorld3D progress={p} />
          </Suspense>
        </div>
        {/* readability wash — whisper-thin, no exposure blowout */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--color-light)]/35 to-transparent z-[1] pointer-events-none" />

        {/* System status — top left, under the navbar */}
        <div className="absolute top-20 left-6 md:top-24 md:left-12 z-30 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">
          <span className="inline-flex w-5 justify-center flex-none"><LEDIndicator /></span>
          <span>
            {activeStep < 0 ? 'SYS // STANDBY' : `SYS // STAGE_${JOURNEY[activeStep].num}: ${JOURNEY[activeStep].tag.toUpperCase()}`}
          </span>
        </div>

        {/* Scroll progress rail — right edge */}
        <motion.div style={{ opacity: useTransform(p, [0, 0.04, 0.94, 1], [0.4, 1, 1, 0]) }} className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-3">
          <motion.span className="font-mono text-[10px] font-bold text-black/40 tabular-nums">{progressPct}</motion.span>
          <div className="relative w-px h-36 bg-black/10 overflow-hidden">
            <motion.div className="absolute top-0 left-0 w-full bg-[var(--color-accent)]" style={{ height: railFill }} />
          </div>
          <span className="font-mono text-[10px] font-bold text-black/40">100</span>
        </motion.div>

        {/* ── Intro lockup ── */}
        <motion.div
          style={{ opacity: introOpacity, y: introY, pointerEvents: introPE }}
          className="absolute inset-0 flex flex-col items-center justify-start pt-[16vh] md:pt-[14vh] text-center px-6 z-20"
        >
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4">
            <span className="w-9 h-px bg-[var(--color-accent)]" />
            A MAKERSPACE FOR K–12 · BODAKDEV, AHMEDABAD
            <span className="w-9 h-px bg-[var(--color-accent)]" />
          </div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.88] text-black text-[12vw] md:text-[6vw] mb-6">
            The future belongs<br />
            to the kids <span className="text-[var(--color-accent)]">who build it.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mb-7">
            Watch a child become a maker — real tools, real problems,
            and a portfolio that speaks for itself.
          </p>
          <CTAs className="justify-center mb-8" />
          <div className="flex items-center gap-6">
            <PowerSwitch />
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 flex items-center gap-2"
            >
              Scroll to follow the trail <span className="text-[var(--color-accent)]">↓</span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Journey caption: the scene shows, this line whispers ── */}
        <motion.div
          style={{ opacity: journeyOpacity }}
          className="absolute inset-x-0 bottom-8 md:bottom-12 z-20 pointer-events-none px-6"
        >
          <SceneCaption activeStep={activeStep} />
        </motion.div>

        {/* ── Outro lockup ── */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY, pointerEvents: outroPE }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20"
        >
          <div className="font-mono text-[9px] md:text-xs font-bold tracking-[0.2em] text-black/35 mb-6">
            {MAKERS_BYTES.join(' ')} <span className="text-[var(--color-accent)]">→ MAKERS ✓</span>
          </div>
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[11vw] md:text-[5.5vw] mb-6">
            That transformation<br />
            <span className="text-[var(--color-accent)]">is the program.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed mb-9">
            A year-long journey across four studios. Keep scrolling to see how it works —
            or come watch it happen in person.
          </p>
          <CTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
