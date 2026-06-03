import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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
    num: '03', title: 'PRESENTATION', tagline: 'Making work understood.',
    desc: 'The best ideas fail without clear communication. Makers learn to demo their work on stage, write documentation, create pitch decks, and tell the story of what they built and why it matters.',
    bullets: ['Public speaking & demos', 'Technical writing & docs', 'Visual storytelling', 'Pitching & persuasion'],
  },
  {
    num: '04', title: 'ENTREPRENEURSHIP', tagline: 'Building things that matter.',
    desc: 'Makers learn to identify real problems, validate solutions, and think about impact. They run experiments, talk to users, build MVPs, and understand what it takes to ship something into the world.',
    bullets: ['Problem identification', 'Market research & validation', 'Business model thinking', 'Project management & shipping'],
  },
];

const makerQualities = [
  'Problem Solving', 'Critical Thinking', 'Technical Mastery',
  'Creative Confidence', 'Design Thinking', 'Communication',
  'Resilience', 'Collaboration', 'Real-World Impact',
  'Leadership', 'Adaptability', 'Independence',
];

/* ── Generate double helix ── */
function generateHelix(svgH, cx, amp, turns) {
  const n = 400;
  let pathA = '', pathB = '';

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = t * svgH;
    const angle = t * Math.PI * 2 * turns;
    const xA = cx + Math.sin(angle) * amp;
    const xB = cx + Math.sin(angle + Math.PI) * amp;
    pathA += (i === 0 ? 'M' : 'L') + `${xA.toFixed(1)},${y.toFixed(1)} `;
    pathB += (i === 0 ? 'M' : 'L') + `${xB.toFixed(1)},${y.toFixed(1)} `;
  }

  // Rungs
  const rungs = [];
  for (let i = 0; i < makerQualities.length; i++) {
    const t = (i + 0.5) / makerQualities.length;
    const y = t * svgH;
    const angle = t * Math.PI * 2 * turns;
    const xA = cx + Math.sin(angle) * amp;
    const xB = cx + Math.sin(angle + Math.PI) * amp;
    const depth = Math.cos(angle);
    rungs.push({ xA, xB, y, t, label: makerQualities[i], depth });
  }

  return { pathA, pathB, rungs };
}

export default function FourStudiosDNA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 20%"]
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 30, mass: 0.8 });

  const svgH = 1100;
  const cx = 200;
  const amp = 65;
  const turns = 2.5;
  const tiltDeg = -18;
  const svgW = 400;

  const helix = useMemo(() => generateHelix(svgH, cx, amp, turns), []);

  // Fill clip — one smooth rect expanding from top
  const fillH = useTransform(smooth, [0.05, 0.78], [0, svgH + 50]);
  const convergeOpacity = useTransform(smooth, [0.75, 0.9], [0, 1]);
  const studioYPositions = [0.1, 0.33, 0.56, 0.79];

  return (
    <section ref={sectionRef} className="relative pb-32 md:pb-48 pt-12 md:pt-24 bg-[var(--color-light)] overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
            // THE FOUR STUDIOS
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2">
              FOUR STUDIOS.<br /><span className="text-black/15">ONE MAKER.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="lg:w-1/2 space-y-4">
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-tight">Four disciplines. Woven together. Inseparable.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">Like strands of DNA, each studio is part of the maker's code. The qualities between them — problem solving, resilience, creative confidence — emerge where the strands connect.</p>
            </motion.div>
          </div>
        </div>

        {/* ── DNA Helix + Cards (Desktop) ── */}
        <div className="hidden lg:block relative" style={{ height: `${svgH + 400}px` }}>

          {/* SVG container — tilted */}
          <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{
            width: `${svgW}px`, height: `${svgH + 40}px`,
            transform: `translate(-50%, -50%) rotate(${tiltDeg}deg)`,
          }}>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" overflow="visible">
              <defs>
                {/* Single smooth clip rect that expands downward */}
                <clipPath id="helix-fill">
                  <motion.rect x="-50" y="-30" width={svgW + 100} style={{ height: fillH }} />
                </clipPath>
              </defs>

              {/* ═══ GHOST LAYER (always visible) ═══ */}
              <path d={helix.pathA} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" />
              <path d={helix.pathB} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" />
              {helix.rungs.map((r, i) => (
                <line key={`gr-${i}`} x1={r.xA} y1={r.y} x2={r.xB} y2={r.y} stroke="rgba(0,0,0,0.025)" strokeWidth="1" />
              ))}

              {/* ═══ ACTIVE LAYER (clipped — fills from top to bottom) ═══ */}
              <g clipPath="url(#helix-fill)">
                {/* Strand A — full continuous path */}
                <path d={helix.pathA} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity="0.55" />
                <path d={helix.pathA} fill="none" stroke="#FF5A00" strokeWidth="8" strokeOpacity="0.06" filter="blur(4px)" />

                {/* Strand B — full continuous path */}
                <path d={helix.pathB} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity="0.55" />
                <path d={helix.pathB} fill="none" stroke="#FF5A00" strokeWidth="8" strokeOpacity="0.06" filter="blur(4px)" />

                {/* Rungs with depth */}
                {helix.rungs.map((r, i) => {
                  const isFront = r.depth > 0;
                  return (
                    <g key={`ar-${i}`}>
                      <line x1={r.xA} y1={r.y} x2={r.xB} y2={r.y}
                        stroke="#FF5A00" strokeWidth={isFront ? 1.5 : 0.8}
                        strokeOpacity={isFront ? 0.45 : 0.15} />
                      <circle cx={cx} cy={r.y} r={isFront ? 2.5 : 1.5}
                        fill="#FF5A00" opacity={isFront ? 0.5 : 0.2} />
                    </g>
                  );
                })}
              </g>

              {/* ═══ QUALITY LABELS (fade in as fill reaches them) ═══ */}
              {helix.rungs.map((r, i) => {
                const labelSide = r.xA > r.xB ? 'right' : 'left';
                const textX = labelSide === 'right' ? Math.max(r.xA, r.xB) + 14 : Math.min(r.xA, r.xB) - 14;
                return (
                  <QualityLabel key={i} x={textX} y={r.y} anchor={labelSide === 'right' ? 'start' : 'end'}
                    label={r.label} t={r.t} progress={smooth} />
                );
              })}

              {/* Convergence node */}
              <motion.g style={{ opacity: convergeOpacity }}>
                <circle cx={cx} cy={svgH + 10} r="14" fill="none" stroke="#FF5A00" strokeWidth="2" />
                <circle cx={cx} cy={svgH + 10} r="5" fill="#FF5A00" />
                <circle cx={cx} cy={svgH + 10} r="22" fill="none" stroke="#FF5A00" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3" />
              </motion.g>
            </svg>
          </div>

          {/* Studio cards */}
          {studios.map((studio, idx) => {
            const yPercent = studioYPositions[idx] * 100;
            const isLeft = idx % 2 === 0;
            return (
              <StudioCardHelix key={studio.num} studio={studio} index={idx} progress={smooth}
                style={{
                  position: 'absolute', top: `${yPercent}%`,
                  [isLeft ? 'left' : 'right']: '0',
                  width: 'calc(50% - 160px)',
                }}
                isLeft={isLeft}
              />
            );
          })}

          {/* Convergence label */}
          <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center" style={{ opacity: convergeOpacity }}>
            <div className="font-mono text-[9px] text-[var(--color-accent)] font-bold uppercase tracking-[0.3em] mb-1">All strands converge</div>
            <div className="font-display text-xl font-bold text-black tracking-tighter uppercase">= Complete Maker</div>
          </motion.div>
        </div>

        {/* ── Mobile ── */}
        <div className="lg:hidden space-y-6 mb-16">
          {studios.map((studio, idx) => (
            <motion.div key={studio.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="group cursor-hover">
              <div className="bg-white border border-black/[0.06] rounded-2xl p-6 group-hover:border-[var(--color-accent)]/30 transition-all duration-500">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{studio.num}</span>
                  <h3 className="text-xl font-display font-bold text-black tracking-tighter">{studio.title}</h3>
                </div>
                <p className="text-sm font-display font-semibold text-[var(--color-accent)]/70 italic mb-3">{studio.tagline}</p>
                <div className="w-8 h-0.5 bg-[var(--color-accent)]/20 mb-3" />
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{studio.desc}</p>
                <div className="space-y-1.5">
                  {studio.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]/30 shrink-0" />
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="flex flex-wrap gap-2 justify-center py-4">
            {makerQualities.map((q, i) => (
              <span key={i} className="font-mono text-[9px] text-black/15 uppercase tracking-widest border border-black/5 rounded-full px-3 py-1">{q}</span>
            ))}
          </div>
        </div>

        {/* Closing */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mt-32 md:mt-48 relative z-20">
          <p className="text-2xl md:text-3xl text-black font-display font-bold uppercase tracking-tighter leading-snug">
            Together, they shape a complete maker:{' '}
            <span className="text-[var(--color-accent)]">one who can make it work, make it good, make it understood, and make it matter.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function QualityLabel({ x, y, anchor, label, t, progress }) {
  const labelOpacity = useTransform(progress, [t * 0.73 + 0.04, t * 0.73 + 0.08], [0, 1]);
  const smoothOpacity = useSpring(labelOpacity, { stiffness: 80, damping: 25 });
  return (
    <motion.text x={x} y={y + 3} textAnchor={anchor} className="font-mono"
      fontSize="8" fontWeight="bold" letterSpacing="1.5" fill="rgba(0,0,0,0.18)"
      style={{ opacity: smoothOpacity }}>
      {label.toUpperCase()}
    </motion.text>
  );
}

function StudioCardHelix({ studio, index, progress, style, isLeft }) {
  const at = 0.08 + index * 0.17;
  const cardOpacity = useTransform(progress, [at, at + 0.12], [0, 1]);
  const cardX = useTransform(progress, [at, at + 0.12], [isLeft ? -40 : 40, 0]);
  const sO = useSpring(cardOpacity, { stiffness: 80, damping: 25 });
  const sX = useSpring(cardX, { stiffness: 80, damping: 25 });

  return (
    <motion.div style={{ ...style, opacity: sO, x: sX }} className="group cursor-hover z-20">
      <div className={`bg-white border border-black/[0.06] rounded-2xl p-8 md:p-10 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[0_20px_60px_-15px_rgba(255,90,0,0.08)] transition-all duration-700 ${isLeft ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-baseline gap-3 mb-2 ${isLeft ? 'justify-end' : ''}`}>
          <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{studio.num}</span>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-black tracking-tighter group-hover:text-[var(--color-accent)] transition-colors duration-500">{studio.title}</h3>
        </div>
        <p className="text-base font-display font-semibold text-[var(--color-accent)]/70 italic mb-4">{studio.tagline}</p>
        <div className={`w-10 h-0.5 bg-[var(--color-accent)]/20 group-hover:w-20 group-hover:bg-[var(--color-accent)] transition-all duration-700 mb-5 ${isLeft ? 'ml-auto' : ''}`} />
        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-5">{studio.desc}</p>
        <div className={`space-y-2 ${isLeft ? 'flex flex-col items-end' : ''}`}>
          {studio.bullets.map((b, i) => (
            <div key={i} className={`flex items-center gap-2.5 ${isLeft ? 'flex-row-reverse' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]/30 group-hover:bg-[var(--color-accent)] transition-colors duration-500 shrink-0" />
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
