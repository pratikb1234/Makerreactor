import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { BlueprintGrid } from './MakerElements';
import { useCircuitTriggers, HeroCTAs, EYEBROW } from './heroShared';

// ── Variant 5 · Kinetic Type ─────────────────────────────────────────────────
// Editorial, fast, mostly typographic. Scroll morphs huge type from
// "consumer" → "creator" with a circuit trace drawing across. CTA is reachable
// in the first screen.
const REEL = ['BUILD.', 'SOLVE.', 'FAIL.', 'FIX.', 'SHIP.'];

function Beat({ p, range, children, y = 60, className = '' }) {
  const [a, b, c, d] = range;
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
  const ty = useTransform(p, [a, b, c, d], [y, 0, 0, -y]);
  return (
    <motion.div style={{ opacity, y: ty }} className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 ${className}`}>
      {children}
    </motion.div>
  );
}

export default function HeroKinetic() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.85 });

  // the trace that draws across the whole experience
  const trace = useTransform(p, [0.1, 0.9], [0, 1]);
  const reelIdx = useTransform(p, [0.4, 0.66], [0, REEL.length]);
  const introOpacity = useTransform(p, [0, 0.08, 0.13], [1, 1, 0]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.11 ? 'none' : 'auto'));
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.82 ? 'auto' : 'none'));
  const railFill = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  return (
    <section ref={ref} className="relative h-[460vh] bg-[var(--color-light)] font-sans" aria-label="Kinetic hero">
      <div className="sticky top-0 h-screen overflow-hidden">
        <BlueprintGrid />

        {/* circuit trace drawing across the middle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <motion.path
            d="M -20 300 H 250 V 180 H 520 V 420 H 760 V 300 H 1020"
            fill="none" stroke="var(--color-accent)" strokeWidth="2"
            style={{ pathLength: trace, opacity: 0.4 }}
          />
        </svg>

        {/* scroll rail */}
        <motion.div style={{ opacity: useTransform(p, [0, 0.04, 0.94, 1], [0.4, 1, 1, 0]) }} className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-3">
          <div className="relative w-px h-36 bg-black/10 overflow-hidden">
            <motion.div className="absolute top-0 left-0 w-full bg-[var(--color-accent)]" style={{ height: railFill }} />
          </div>
        </motion.div>

        {/* INTRO */}
        <motion.div style={{ opacity: introOpacity, pointerEvents: introPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4">
            <span className="w-9 h-px bg-[var(--color-accent)]" />{EYEBROW}<span className="w-9 h-px bg-[var(--color-accent)]" />
          </div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.85] text-black text-[13vw] md:text-[7vw]">
            The future belongs<br />to the kids <span className="text-[var(--color-accent)]">who build it.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed mt-6 mb-8">
            Most kids consume technology. Ours create it. Scroll to see the difference.
          </p>
          <HeroCTAs className="justify-center" />
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">
            Scroll <span className="text-[var(--color-accent)]">↓</span>
          </motion.div>
        </motion.div>

        {/* BEAT 1 — consume → create */}
        <Beat p={p} range={[0.13, 0.2, 0.3, 0.37]} className="z-10">
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-black/40 mb-4">// most programs teach kids to</div>
          <div className="relative font-display font-bold uppercase tracking-tighter text-black text-[16vw] md:text-[11vw] leading-none">
            consume
            <span className="absolute left-0 top-1/2 w-full h-[6px] md:h-[10px] bg-[var(--color-accent)] -translate-y-1/2" />
          </div>
          <div className="font-display font-bold uppercase tracking-tighter text-[var(--color-accent)] text-[16vw] md:text-[11vw] leading-none mt-2">create.</div>
        </Beat>

        {/* BEAT 2 — the word reel */}
        <Beat p={p} range={[0.38, 0.44, 0.62, 0.68]} className="z-10">
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-black/40 mb-6">// here, a maker learns to</div>
          <div className="relative h-[18vw] md:h-[13vw] flex items-center justify-center">
            {REEL.map((w, i) => {
              const o = useTransform(reelIdx, [i - 0.5, i, i + 0.5], [0, 1, 0]);
              const sc = useTransform(reelIdx, [i - 0.5, i, i + 0.5], [0.8, 1, 1.15]);
              return (
                <motion.span key={w} style={{ opacity: o, scale: sc }} className="absolute font-display font-bold uppercase tracking-tighter text-black text-[18vw] md:text-[13vw] leading-none">
                  {w}
                </motion.span>
              );
            })}
          </div>
        </Beat>

        {/* BEAT 3 — consumer → creator morph */}
        <Beat p={p} range={[0.69, 0.75, 0.82, 0.88]} className="z-10">
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">// the transformation</div>
          <div className="font-display font-bold uppercase tracking-tighter text-black/25 text-[11vw] md:text-[8vw] leading-none line-through decoration-[var(--color-accent)] decoration-4">consumer</div>
          <div className="font-display font-bold uppercase tracking-tighter text-black text-[15vw] md:text-[10vw] leading-none mt-2">CREATOR<span className="text-[var(--color-accent)]">.</span></div>
        </Beat>

        {/* OUTRO */}
        <motion.div style={{ opacity: useTransform(p, [0.88, 0.93], [0, 1]), pointerEvents: outroPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[11vw] md:text-[5.5vw] mb-6">
            Real tools. Real work.<br /><span className="text-[var(--color-accent)]">Real proof.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed mb-8">
            A makerspace for K–12 where your child builds a portfolio that speaks for itself.
          </p>
          <HeroCTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
