import { useState } from 'react';
import { motion } from 'framer-motion';

// Kept for any importer; the skills now live inline on each studio card.
export const STUDIO_DNA = [
  { color: '#FF5A00', skills: ['Technical Mastery', 'Problem Solving', 'Critical Thinking'] },
  { color: '#1A140D', skills: ['Design Thinking', 'Creative Confidence', 'Adaptability'] },
  { color: '#C77B3A', skills: ['Communication', 'Collaboration', 'Leadership'] },
  { color: '#A98963', skills: ['Independence', 'Resilience', 'Real-World Impact'] },
];

const studios = [
  {
    num: '01', title: 'Tech', img: 'tech', tagline: 'Building things that work.',
    desc: 'Makers learn to engineer real systems — from physical electronics to code that runs. They wire circuits, program microcontrollers, build robots, and write software that solves actual problems.',
    bullets: ['Electronics & circuits', 'Programming', 'Robotics', '3D printing & fabrication'],
    prompt: 'close-up of a child wiring a circuit board with a microcontroller',
  },
  {
    num: '02', title: 'Design', img: 'design', tagline: 'Building things well.',
    desc: "Makers develop an eye for form, material, and craft. They sketch, prototype, iterate, and refine. Design isn't decoration — it's how you make something people actually want to use.",
    bullets: ['Visual design', 'Product prototyping', 'CAD & fabrication', 'User experience'],
    prompt: 'a child sketching a product design next to a 3D-printed prototype',
  },
  {
    num: '03', title: 'Expression', img: 'expression', tagline: 'Making work understood.',
    desc: 'The best ideas fail without clear communication. Makers learn to demo their work on stage, write documentation, build pitch decks, and tell the story of what they made and why it matters.',
    bullets: ['Public speaking & demos', 'Technical writing', 'Visual storytelling', 'Pitching'],
    prompt: 'a child presenting their project on a small stage to an audience',
  },
  {
    num: '04', title: 'Entrepreneurship', img: 'entrepreneurship', tagline: 'Building things that matter.',
    desc: 'Makers learn to spot real problems, validate solutions, and think about impact. They run experiments, talk to users, build MVPs, and learn what it takes to ship something into the world.',
    bullets: ['Problem identification', 'Market validation', 'Business thinking', 'Shipping'],
    prompt: 'a child demonstrating a finished product to a small group of customers',
  },
];

function StudioImage({ studio }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="absolute inset-0 bg-[#EFEAE1] flex flex-col items-center justify-center text-center px-6">
        <div className="font-display font-bold text-7xl text-black/8 leading-none">{studio.num}</div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 mt-3">
          PHOTO · <span className="bg-black/5 px-1.5 py-0.5 rounded">/studios/{studio.img}.jpg</span>
        </div>
        <div className="font-mono text-[10px] text-black/30 mt-2 max-w-xs leading-relaxed">“{studio.prompt}”</div>
      </div>
    );
  }
  return (
    <img
      src={`/studios/${studio.img}.jpg`}
      alt={studio.title}
      onError={() => setBroken(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}

function StudioCard({ studio, idx }) {
  const dna = STUDIO_DNA[idx];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: idx * 0.06 }}
      className="group"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#EFEAE1] mb-6">
        <StudioImage studio={studio} />
        <div className="absolute top-4 left-4 font-mono text-xs font-bold tracking-[0.2em] text-white bg-black/55 backdrop-blur px-2.5 py-1 rounded">
          S/{studio.num}
        </div>
      </div>
      <div className="flex items-baseline gap-3 mb-1.5">
        <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-black">{studio.title}</h3>
        <span className="font-mono text-[12px] italic text-black/45">{studio.tagline}</span>
      </div>
      <p className="text-[15px] md:text-base text-gray-600 leading-relaxed max-w-xl mb-4">{studio.desc}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {studio.bullets.map((b) => (
          <span key={b} className="font-mono text-[11px] tracking-wide text-black/55 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dna.color }} />{b}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

export default function FourStudios() {
  return (
    <section id="programs" className="relative py-24 md:py-36 bg-[var(--color-light)] border-y border-black/5">
      <div className="max-w-[88rem] mx-auto px-6 md:px-12">
        {/* header */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-20 items-end mb-16 md:mb-24">
          <div>
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
              The Four Studios
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-5xl md:text-7xl font-display font-bold text-black tracking-tighter leading-[0.9]">
              Four studios.<br /><span className="text-black/30">One maker.</span>
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Every maker works across all four studios, every year — not as subjects to study, but as
            four ways to build, think, and grow.
          </motion.p>
        </div>

        {/* studio grid */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-20">
          {studios.map((studio, idx) => (
            <StudioCard key={studio.num} studio={studio} idx={idx} />
          ))}
        </div>

        {/* closing line */}
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mt-20 md:mt-28 text-2xl md:text-4xl font-display font-bold tracking-tight text-black leading-snug">
          Together, they shape a complete maker —{' '}
          <span className="text-[var(--color-accent)]">one who can make it work, make it good, make it understood, and make it matter.</span>
        </motion.p>
      </div>
    </section>
  );
}
