import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useCircuitTriggers, HeroCTAs, EYEBROW } from './heroShared';

// ── The maker journey as a film ──────────────────────────────────────────────
// A scroll-driven sequence of full-bleed frames (AI images or video), each
// crossfading with a slow Ken-Burns push. Drop media into public/journey/ as
// 01.jpg … 10.jpg (or .mp4) and it loads automatically; until then a clean
// storyboard placeholder shows. Captions = the belief ladder.
const STAGES = [
  { num: '01', tag: 'Age 5 · Wonder', title: 'The first tower', belief: '“I can try.”', tint: ['#FFE0B8', '#FFB877'], prompt: 'a focused 5-year-old building a tall tower of wooden blocks on the floor, warm window light, shallow depth of field, photoreal documentary' },
  { num: '02', tag: 'Age 7 · Curiosity', title: 'How things work', belief: '“Things can be understood.”', tint: ['#FFD9A8', '#F2A65A'], prompt: 'a curious 7-year-old taking apart a toy car with a screwdriver, parts laid out, soft daylight, photoreal' },
  { num: '03', tag: 'Age 8 · First circuit', title: 'Making it light up', belief: '“I can make it work.”', tint: ['#FFC98A', '#FF8A4D'], prompt: 'an 8-year-old lighting a small LED with a battery and wire, face glowing with wonder, dark workbench, warm rim light, photoreal' },
  { num: '04', tag: 'Age 10 · Code', title: 'Teaching machines', belief: '“I can teach a machine.”', tint: ['#FFD0A0', '#E8823C'], prompt: 'a 10-year-old coding on a laptop with a small robot responding beside them, focused, studio light, photoreal' },
  { num: '05', tag: 'Age 12 · Real tools', title: 'Trusted with fire', belief: '“I’m trusted with real things.”', tint: ['#FFB877', '#D9662E'], prompt: 'a 12-year-old soldering a circuit board wearing safety goggles, tiny solder glow, focused hands, photoreal makerspace' },
  { num: '06', tag: 'Age 13 · Design', title: 'Imagine, then make', belief: '“If I can draw it, I can build it.”', tint: ['#FFCF9A', '#E07B3A'], prompt: 'a 13-year-old at a CAD screen next to a running 3D printer building their part, warm studio, photoreal' },
  { num: '07', tag: 'Age 15 · The team', title: 'Harder, together', belief: '“We can solve hard problems.”', tint: ['#FFC078', '#C85A28'], prompt: 'teenagers crowded around a competition robot they built, intense focus, sparks of excitement, photoreal documentary' },
  { num: '08', tag: 'Age 18 · College', title: 'The door opens', belief: '“My work opened the door.”', tint: ['#FFD8A6', '#D98A3C'], prompt: 'a proud 18-year-old in a graduation cap holding a portfolio of built projects, golden light, photoreal' },
  { num: '09', tag: 'Age 22 · His own thing', title: 'Still building', belief: '“I don’t wait for permission.”', tint: ['#FFC98A', '#C76A2E'], prompt: 'a young adult in their own small workshop launching a drone they built, shelves of past projects, warm light, photoreal' },
  { num: '10', tag: 'An amazing life', title: 'The spark passes on', belief: '“A life, built by hand.”', tint: ['#FFE0B8', '#E89A52'], prompt: 'a grown maker mentoring a small child reaching for a glowing component, home workshop, hopeful warm light, photoreal' },
];

const N = STAGES.length;

function Placeholder({ stage }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${stage.tint[0]}, ${stage.tint[1]})` }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      {/* film crop marks */}
      {[['top-8 left-8', 'border-t-2 border-l-2'], ['top-8 right-8', 'border-t-2 border-r-2'], ['bottom-8 left-8', 'border-b-2 border-l-2'], ['bottom-8 right-8', 'border-b-2 border-r-2']].map(([p, b], i) => (
        <div key={i} className={`absolute ${p} w-10 h-10 ${b} border-white/50`} />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
        <div className="font-mono text-[16vw] md:text-[10vw] font-bold text-white/25 leading-none">{stage.num}</div>
        <div className="font-mono text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#1A140D]/70 mt-4 max-w-md leading-relaxed">
          AI FRAME · drop <span className="bg-black/15 px-1.5 py-0.5 rounded">public/journey/{stage.num}.jpg</span>
        </div>
        <div className="font-mono text-[10px] text-[#1A140D]/45 mt-3 max-w-lg leading-relaxed">“{stage.prompt}”</div>
      </div>
    </div>
  );
}

function Frame({ stage, p, center, half, isFirst, isLast }) {
  const [broken, setBroken] = useState(false);
  // crossfade — first holds before its center, last holds after
  const aIn = isFirst ? 0 : center - half;
  const aOut = isLast ? 1 : center + half;
  const opacity = useTransform(p, [aIn, center, aOut], [isFirst ? 1 : 0, 1, isLast ? 1 : 0]);
  const scale = useTransform(p, [center - half, center + half], [1.03, 1.12]); // Ken Burns push
  const src = `/journey/${stage.num}`;
  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="absolute inset-0">
        {broken ? (
          <Placeholder stage={stage} />
        ) : (
          <img
            src={`${src}.jpg`}
            alt={stage.title}
            onError={() => setBroken(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </motion.div>
      {/* legibility wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
    </motion.div>
  );
}

export default function HeroFilmstrip() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });
  useCircuitTriggers(scrollYProgress, { bridgeAt: 0.88 });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v - 0.08) / 0.84;
    setActive(Math.min(N - 1, Math.max(0, Math.floor(t * N))));
  });

  const band = 0.84 / N;
  const centerOf = (i) => 0.08 + band * (i + 0.5);

  const introOpacity = useTransform(p, [0, 0.05, 0.1], [1, 1, 0]);
  const introPE = useTransform(scrollYProgress, (v) => (v > 0.08 ? 'none' : 'auto'));
  const captionOpacity = useTransform(p, [0.08, 0.12, 0.9, 0.95], [0, 1, 1, 0]);
  const railFill = useTransform(p, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const outroOpacity = useTransform(p, [0.92, 0.97], [0, 1]);
  const outroPE = useTransform(scrollYProgress, (v) => (v > 0.93 ? 'auto' : 'none'));
  const s = STAGES[active];

  return (
    <section ref={ref} className="relative h-[680vh] bg-black font-sans" aria-label="The maker journey">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the film */}
        {STAGES.map((stage, i) => (
          <Frame key={stage.num} stage={stage} p={p} center={centerOf(i)} half={band * 0.7} isFirst={i === 0} isLast={i === N - 1} />
        ))}

        {/* progress rail */}
        <motion.div style={{ opacity: useTransform(p, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }} className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-white/60 tabular-nums">{s.num}</span>
          <div className="relative w-px h-32 bg-white/20 overflow-hidden"><motion.div className="absolute top-0 left-0 w-full bg-[var(--color-accent)]" style={{ height: railFill }} /></div>
          <span className="font-mono text-[10px] font-bold text-white/40">{N}</span>
        </motion.div>

        {/* caption */}
        <motion.div style={{ opacity: captionOpacity }} className="absolute left-6 md:left-14 bottom-16 md:bottom-20 z-20 max-w-2xl">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="font-mono text-[11px] md:text-sm font-bold uppercase tracking-[0.28em] text-[var(--color-accent)] mb-3">{s.tag}</div>
            <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.92] text-white text-[10vw] md:text-[5vw] mb-3">{s.title}</h2>
            <p className="font-display font-bold text-white/90 text-xl md:text-3xl">{s.belief}</p>
          </motion.div>
        </motion.div>

        {/* INTRO */}
        <motion.div style={{ opacity: introOpacity, pointerEvents: introPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 bg-black/35">
          <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 flex items-center gap-4"><span className="w-9 h-px bg-[var(--color-accent)]" />{EYEBROW}<span className="w-9 h-px bg-[var(--color-accent)]" /></div>
          <h1 className="font-display font-bold uppercase tracking-tighter leading-[0.86] text-white text-[12vw] md:text-[6vw] mb-6">The future belongs<br />to the kids <span className="text-[var(--color-accent)]">who build it.</span></h1>
          <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed mb-8">Watch a child become a maker — ten years, one transformation.</p>
          <HeroCTAs className="justify-center" />
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Scroll to play <span className="text-[var(--color-accent)]">↓</span></motion.div>
        </motion.div>

        {/* OUTRO */}
        <motion.div style={{ opacity: outroOpacity, pointerEvents: outroPE }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 bg-black/55">
          <h2 className="font-display font-bold uppercase tracking-tighter leading-[0.9] text-white text-[11vw] md:text-[5.5vw] mb-6">That transformation<br /><span className="text-[var(--color-accent)]">is the program.</span></h2>
          <p className="text-base md:text-lg text-white/80 max-w-lg leading-relaxed mb-8">A year-long journey across four studios. Come watch it happen in person.</p>
          <HeroCTAs className="justify-center" />
        </motion.div>
      </div>
    </section>
  );
}
