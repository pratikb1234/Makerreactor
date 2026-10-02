import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { BlueprintGrid } from './MakerElements';

// ── Closing kinetic-type crescendo ───────────────────────────────────────────
// The Kinetic hero concept, repurposed as a bottom-of-page section: a scroll-
// driven typographic build that lands on the brand line, then hands off to the
// final CTA below. No hero framing, no circuit triggers — it's mid-page.
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

export default function KineticCloser() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  const trace = useTransform(p, [0.05, 0.92], [0, 1]);
  const reelIdx = useTransform(p, [0.34, 0.6], [0, REEL.length]);
  const railFill = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  return (
    <section ref={ref} className="relative h-[340vh] bg-[var(--color-light)] font-sans border-t border-black/5" aria-label="The bottom line">
      <div className="sticky top-0 h-screen overflow-hidden">
        <BlueprintGrid />

        {/* circuit trace drawing across */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <motion.path d="M -20 300 H 250 V 180 H 520 V 420 H 760 V 300 H 1020" fill="none" stroke="var(--color-accent)" strokeWidth="2" style={{ pathLength: trace, opacity: 0.4 }} />
        </svg>

        {/* scroll rail */}
        <motion.div style={{ opacity: useTransform(p, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }} className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center">
          <div className="relative w-px h-32 bg-black/10 overflow-hidden"><motion.div className="absolute top-0 left-0 w-full bg-[var(--color-accent)]" style={{ height: railFill }} /></div>
        </motion.div>

        {/* BEAT 0 — lead in */}
        <Beat p={p} range={[0, 0.04, 0.12, 0.18]}>
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] mb-5">// the bottom line</div>
          <div className="font-display font-bold uppercase tracking-tighter text-black text-[9vw] md:text-[5.5vw] leading-[0.95]">There are two kinds<br />of kids.</div>
        </Beat>

        {/* BEAT 1 — consume → create */}
        <Beat p={p} range={[0.18, 0.24, 0.32, 0.38]}>
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-black/40 mb-4">// most are taught to</div>
          <div className="relative font-display font-bold uppercase tracking-tighter text-black text-[16vw] md:text-[11vw] leading-none">
            consume<span className="absolute left-0 top-1/2 w-full h-[6px] md:h-[10px] bg-[var(--color-accent)] -translate-y-1/2" />
          </div>
          <div className="font-display font-bold uppercase tracking-tighter text-[var(--color-accent)] text-[16vw] md:text-[11vw] leading-none mt-2">ours create.</div>
        </Beat>

        {/* BEAT 2 — word reel */}
        <Beat p={p} range={[0.39, 0.45, 0.6, 0.66]}>
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-black/40 mb-6">// here, a maker learns to</div>
          <div className="relative h-[18vw] md:h-[13vw] flex items-center justify-center">
            {REEL.map((w, i) => {
              const o = useTransform(reelIdx, [i - 0.5, i, i + 0.5], [0, 1, 0]);
              const sc = useTransform(reelIdx, [i - 0.5, i, i + 0.5], [0.8, 1, 1.15]);
              return <motion.span key={w} style={{ opacity: o, scale: sc }} className="absolute font-display font-bold uppercase tracking-tighter text-black text-[18vw] md:text-[13vw] leading-none">{w}</motion.span>;
            })}
          </div>
        </Beat>

        {/* BEAT 3 — consumer → creator */}
        <Beat p={p} range={[0.67, 0.73, 0.82, 0.88]}>
          <div className="font-display font-bold uppercase tracking-tighter text-black/25 text-[11vw] md:text-[8vw] leading-none line-through decoration-[var(--color-accent)] decoration-4">consumer</div>
          <div className="font-display font-bold uppercase tracking-tighter text-black text-[15vw] md:text-[10vw] leading-none mt-2">CREATOR<span className="text-[var(--color-accent)]">.</span></div>
        </Beat>

        {/* BEAT 4 — landing line (holds to the end → hands off to Final CTA) */}
        <motion.div style={{ opacity: useTransform(p, [0.88, 0.93], [0, 1]) }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-accent)] mb-5">// that’s the whole idea</div>
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-black text-[12vw] md:text-[6.5vw]">
            Real tools. Real work.<br /><span className="text-[var(--color-accent)]">Real proof.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
