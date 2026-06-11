import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Tilt3D from './Tilt3D';

// 3D helix carries the Three.js stack — load its chunk only when the section nears
const DNAHelix3D = lazy(() => import('./DNAHelix3D'));

// ── Single source of truth for the maker DNA ─────────────────────────────────
// Each studio owns three skill connectors on the 3D helix (bottom → top).
// Imported by DNAHelix3D — keep colors readable against the cream background.
export const STUDIO_DNA = [
  { color: '#FF5A00', ink: false, skills: ['Technical Mastery', 'Problem Solving', 'Critical Thinking'] },
  { color: '#1A140D', ink: true,  skills: ['Design Thinking', 'Creative Confidence', 'Adaptability'] },
  { color: '#FFB37B', ink: false, skills: ['Communication', 'Collaboration', 'Leadership'] },
  { color: '#A98963', ink: false, skills: ['Independence', 'Resilience', 'Real-World Impact'] },
];

const studios = [
  {
    num: '01', title: 'TECH', tagline: 'Building things that work.',
    desc: 'Makers learn to engineer real systems — from physical electronics to code that runs. They wire circuits, program microcontrollers, build robots, and write software that solves actual problems.',
    bullets: ['Electronics & circuit design', 'Programming & algorithms', 'Robotics & mechatronics', '3D printing & digital fabrication'],
  },
  {
    num: '02', title: 'DESIGN', tagline: 'Building things well.',
    desc: "Makers develop an eye for form, material, and craft. They sketch, prototype, iterate, and refine. Design isn't decoration — it's how you make something that people actually want to use.",
    bullets: ['Visual design & typography', 'Product design & prototyping', 'CAD modeling & fabrication', 'User experience & interaction'],
  },
  {
    num: '03', title: 'EXPRESSION', tagline: 'Making work understood.',
    desc: 'The best ideas fail without clear communication. Makers learn to demo their work on stage, write documentation, create pitch decks, and tell the story of what they built and why it matters.',
    bullets: ['Public speaking & demos', 'Technical writing & docs', 'Visual storytelling', 'Pitching & persuasion'],
  },
  {
    num: '04', title: 'ENTREPRENEURSHIP', tagline: 'Building things that matter.',
    desc: 'Makers learn to identify real problems, validate solutions, and think about impact. They run experiments, talk to users, build MVPs, and understand what it takes to ship something into the world.',
    bullets: ['Problem identification', 'Market research & validation', 'Business model thinking', 'Project management & shipping'],
  },
];

function HelixShowcase({ activeStudio }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const inRange = () =>
      ref.current && ref.current.getBoundingClientRect().top < window.innerHeight + 900;
    if (inRange()) { setNear(true); return; }
    const onScroll = () => { if (inRange()) setNear(true); };
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setNear(true); },
      { rootMargin: '900px' }
    );
    obs.observe(ref.current);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [near]);
  return (
    <div ref={ref} className="relative h-[52vh] min-h-[420px] lg:h-[78vh] lg:max-h-[860px]">
      {near && (
        <Suspense fallback={null}>
          <DNAHelix3D className="h-full" activeStudio={activeStudio} />
        </Suspense>
      )}
    </div>
  );
}

function StudioCard({ studio, idx, active, setActive }) {
  const dna = STUDIO_DNA[idx];
  const isActive = active === idx;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: idx * 0.08 }}
      onMouseEnter={() => setActive(idx)}
      onMouseLeave={() => setActive(null)}
      onClick={() => setActive(isActive ? null : idx)}
      className={`bg-white rounded-3xl border p-6 lg:p-8 transition-all duration-300 cursor-hover relative overflow-hidden ${
        isActive
          ? 'border-transparent shadow-[0_24px_60px_rgba(26,20,13,0.14)] lg:-translate-y-1'
          : 'border-black/10 shadow-[0_10px_30px_rgba(26,20,13,0.05)]'
      }`}
      style={isActive ? { boxShadow: `0 24px 60px rgba(26,20,13,0.12), inset 0 0 0 2px ${dna.color}` } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs font-bold tracking-[0.25em] text-black/30">S/{studio.num}</span>
        <span className="w-3 h-3 rounded-full transition-transform duration-300" style={{ backgroundColor: dna.color, transform: isActive ? 'scale(1.5)' : 'scale(1)' }} />
      </div>
      <h3 className="font-display font-bold uppercase tracking-tighter text-2xl lg:text-3xl text-black leading-none mb-1">{studio.title}</h3>
      <p className="font-mono text-[12px] italic text-black/50 mb-4">{studio.tagline}</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">{studio.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {studio.bullets.map((b) => (
          <span key={b} className="font-mono text-[10px] tracking-wide border border-black/10 rounded-full px-2.5 py-1 text-black/60 bg-[#FAF7F0]">
            {b}
          </span>
        ))}
      </div>
      {/* The card's strands on the helix */}
      <div className="border-t border-black/5 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: dna.ink ? '#1A140D' : dna.color }}>
        In the DNA: {dna.skills.join(' · ')}
      </div>
    </motion.div>
  );
}

export default function FourStudiosDNA() {
  const [active, setActive] = useState(null);

  return (
    <section id="programs" className="relative pb-24 md:pb-48 pt-12 md:pt-24 bg-[#F5F0E8] border-y border-black/5 overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
            // THE FOUR STUDIOS
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-start">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2">
              <span className="text-extrude">FOUR STUDIOS.</span><br /><span className="text-black/15">ONE MAKER.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="lg:w-1/2 space-y-4">
              <p className="text-lg md:text-2xl text-black/80 font-medium leading-tight">Every maker works across all four studios, every year.</p>
              <p className="text-sm md:text-lg text-black/50 leading-relaxed max-w-xl">
                Not as subjects to study, but as four strands of one DNA.
                <span className="hidden lg:inline"> Hover a studio to see the skills it weaves into the helix.</span>
                <span className="lg:hidden"> Tap a studio to see the skills it weaves into the helix.</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── The maker DNA: helix center, studios flanking ── */}
        <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,560px)_1fr] lg:gap-10 lg:items-center">
          <div className="lg:order-2">
            <HelixShowcase activeStudio={active} />
          </div>
          <div className="lg:order-1 flex flex-col gap-6 lg:gap-16 mt-10 lg:mt-0">
            <Tilt3D radiusClass="rounded-3xl"><StudioCard studio={studios[0]} idx={0} active={active} setActive={setActive} /></Tilt3D>
            <Tilt3D radiusClass="rounded-3xl"><StudioCard studio={studios[2]} idx={2} active={active} setActive={setActive} /></Tilt3D>
          </div>
          <div className="lg:order-3 flex flex-col gap-6 lg:gap-16 mt-6 lg:mt-0">
            <Tilt3D radiusClass="rounded-3xl"><StudioCard studio={studios[1]} idx={1} active={active} setActive={setActive} /></Tilt3D>
            <Tilt3D radiusClass="rounded-3xl"><StudioCard studio={studios[3]} idx={3} active={active} setActive={setActive} /></Tilt3D>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mt-16 md:mt-32 relative z-20">
          <p className="text-xl md:text-3xl text-black font-display font-bold uppercase tracking-tighter leading-snug">
            Together, they shape a complete maker:{' '}
            <span className="text-[var(--color-accent)]">one who can make it work, make it good, make it understood, and make it matter.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
