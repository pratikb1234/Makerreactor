import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Reconstructed from the live bitsandstudios.com build (June 9 2026 deploy) —
// this version of the section was never committed to git.

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

const studios = [
  {
    num: '01',
    title: 'TECH',
    tagline: 'Building things that work.',
    desc: 'Makers learn to engineer real systems — from physical electronics to code that runs. They wire circuits, program microcontrollers, build robots, and write software that solves actual problems.',
    bullets: ['Electronics & circuit design', 'Programming & algorithms', 'Robotics & mechatronics', '3D printing & digital fabrication'],
  },
  {
    num: '02',
    title: 'DESIGN',
    tagline: 'Building things well.',
    desc: "Makers develop an eye for form, material, and craft. They sketch, prototype, iterate, and refine. Design isn't decoration — it's how you make something that people actually want to use.",
    bullets: ['Visual design & typography', 'Product design & prototyping', 'CAD modeling & fabrication', 'User experience & interaction'],
  },
  {
    num: '03',
    title: 'EXPRESSION',
    tagline: 'Making work understood.',
    desc: 'The best ideas fail without clear communication. Makers learn to demo their work on stage, write documentation, create pitch decks, and tell the story of what they built and why it matters.',
    bullets: ['Public speaking & demos', 'Technical writing & docs', 'Visual storytelling', 'Pitching & persuasion'],
  },
  {
    num: '04',
    title: 'ENTREPRENEURSHIP',
    tagline: 'Building things that matter.',
    desc: 'Makers learn to identify real problems, validate solutions, and think about impact. They run experiments, talk to users, build MVPs, and understand what it takes to ship something into the world.',
    bullets: ['Problem identification', 'Market research & validation', 'Business model thinking', 'Project management & shipping'],
  },
];

const makerQualities = [
  'Problem Solving', 'Independence', 'Critical Thinking', 'Technical Mastery',
  'Creative Confidence', 'Design Thinking', 'Communication', 'Resilience',
  'Collaboration', 'Real-World Impact', 'Leadership', 'Adaptability',
];

function generateHelix(svgH, cx, amp, turns) {
  let pathA = '';
  let pathB = '';
  const phase = Math.PI / 2;
  const steps = 400;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * svgH;
    const angle = t * Math.PI * 2 * turns + phase;
    const xA = cx + Math.sin(angle) * amp;
    const xB = cx + Math.sin(angle + Math.PI) * amp;
    pathA += (i === 0 ? 'M' : 'L') + `${xA.toFixed(1)},${y.toFixed(1)} `;
    pathB += (i === 0 ? 'M' : 'L') + `${xB.toFixed(1)},${y.toFixed(1)} `;
  }

  const rungs = [];
  for (let i = 0; i < makerQualities.length; i++) {
    const t = (i + 0.5) / makerQualities.length;
    const y = t * svgH;
    const angle = t * Math.PI * 2 * turns + phase;
    const xA = cx + Math.sin(angle) * amp;
    const xB = cx + Math.sin(angle + Math.PI) * amp;
    const depth = Math.cos(angle);
    rungs.push({ xA, xB, y, t, label: makerQualities[i], depth });
  }
  return { pathA, pathB, rungs };
}

// eslint-disable-next-line no-unused-vars
function QualityLabel({ x, y, anchor, label, t, progress, isMobileCenter = false }) {
  const labelOpacity = useTransform(progress, [t * 0.73 + 0.04, t * 0.73 + 0.08], [0, 1]);
  const smoothOpacity = useSpring(labelOpacity, { stiffness: 80, damping: 25 });
  return (
    <g>
      <motion.text x={x} y={y + 3} textAnchor={anchor} className="font-mono"
        fontSize="8" fontWeight="bold" letterSpacing="1.5" fill="rgba(255,90,0,0.7)"
        style={{ opacity: smoothOpacity }}>
        {label.toUpperCase()}
      </motion.text>
    </g>
  );
}

function StudioCardHelix({ studio, index, progress, style, isLeft, isMobile, dnaOffsetX = 0 }) {
  const center = [0.15, 0.38, 0.61, 0.84][index] || 0;
  const start = Math.max(0, center - 0.12);
  const end = Math.min(1, center + 0.12);

  const cardOpacity = useTransform(progress, [start, start + 0.08, end, end + 0.08], [0, 1, 1, 0]);
  const cardX = useTransform(progress, [start, start + 0.12], [isLeft ? -40 : 40, 0]);
  const sO = useSpring(cardOpacity, { stiffness: 80, damping: 25 });
  const sX = useSpring(cardX, { stiffness: 80, damping: 25 });
  const connector = useSpring(useTransform(progress, [start + 0.05, start + 0.15], [0, 1]), { stiffness: 80, damping: 25 });

  // Connector line from the card edge to the helix
  const helixX = isLeft ? 160 + dnaOffsetX : dnaOffsetX - 160;
  const lineW = Math.abs(helixX) - 85;

  return (
    <motion.div style={{ ...style, opacity: sO, x: sX }} className="group cursor-hover z-20">
      <div className={`bg-white border border-black/[0.06] rounded-2xl p-8 md:p-10 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[0_20px_60px_-15px_rgba(255,90,0,0.08)] transition-all duration-700 ${isLeft ? 'text-right' : 'text-left'}`}>
        {!isMobile && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-[var(--color-accent)]/30 to-[var(--color-accent)]/10 origin-left"
            style={{
              width: `${lineW}px`,
              scaleX: connector,
              right: isLeft ? `-${lineW}px` : undefined,
              left: isLeft ? undefined : `-${lineW}px`,
              transformOrigin: isLeft ? 'right center' : 'left center',
            }}
          >
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]"
              style={{
                opacity: connector,
                right: isLeft ? `-${lineW + 5}px` : undefined,
                left: isLeft ? undefined : `-${lineW + 5}px`,
              }}
            />
          </motion.div>
        )}
        <div className={`flex items-baseline gap-3 mb-2 ${isLeft ? 'justify-end' : ''}`}>
          <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{studio.num}</span>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-black tracking-tighter group-hover:text-[var(--color-accent)] transition-colors duration-500">{studio.title}</h3>
        </div>
        <p className="text-base font-display font-semibold text-[var(--color-accent)]/70 italic mb-4">{studio.tagline}</p>
        <div className={`w-10 h-0.5 bg-[var(--color-accent)]/20 group-hover:w-20 group-hover:bg-[var(--color-accent)] transition-all duration-700 mb-5 ${isLeft ? 'ml-auto' : ''}`} />
        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-5">{studio.desc}</p>
        <div className={`flex flex-wrap gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
          {studio.bullets.map((b, i) => (
            <span key={i} className="font-mono text-[9px] text-black/30 uppercase tracking-widest border border-black/5 rounded-md px-2 py-1">
              {b.replace(' & ', '_').replace(' ', '_')}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DesktopHelix() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 400, damping: 40, mass: 0.1 });

  const svgH = 2000;
  const helix = useMemo(() => generateHelix(svgH, 200, 85, 4.5), []);
  const fillH = useTransform(smooth, [0, 1], [0, svgH]);
  const convergeOpacity = useTransform(smooth, [0.85, 0.98], [0, 1]);
  const studioYPositions = [0.15, 0.38, 0.61, 0.84];
  const [coreHovered, setCoreHovered] = useState(false);

  return (
    <div ref={ref} className="relative w-full mt-12 md:mt-0" style={{ height: `${svgH}px` }}>
      <div className="absolute left-1/2 top-0 pointer-events-none" style={{
        width: '400px', height: `${svgH}px`,
        transform: 'translateX(-50%) rotate(-12deg)',
      }}>
        <svg viewBox={`0 0 400 ${svgH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" overflow="visible"
          style={{ filter: coreHovered ? 'drop-shadow(0px 0px 15px rgba(255,90,0,0.8))' : 'none', transition: 'filter 0.5s ease' }}>
          <defs>
            <clipPath id="helix-fill-desktop">
              <motion.rect x="-50" y="-30" width={500} style={{ height: fillH }} />
            </clipPath>
          </defs>

          {/* Ghost layer */}
          <path d={helix.pathA} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
          <path d={helix.pathB} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
          {helix.rungs.map((r, i) => (
            <line key={`gr-${i}`} x1={r.xA} y1={r.y} x2={r.xB} y2={r.y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          ))}

          {/* Active layer — fills top to bottom */}
          <g clipPath="url(#helix-fill-desktop)">
            <path d={helix.pathA} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity={coreHovered ? '1' : '0.55'} style={{ transition: 'all 0.3s ease' }} />
            <path d={helix.pathB} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity={coreHovered ? '1' : '0.55'} style={{ transition: 'all 0.3s ease' }} />
            <path d={helix.pathA} fill="none" stroke="#FF5A00" strokeWidth="8" strokeOpacity={coreHovered ? '0.6' : '0'} style={{ filter: 'blur(6px)', transition: 'all 0.3s ease' }} />
            <path d={helix.pathB} fill="none" stroke="#FF5A00" strokeWidth="8" strokeOpacity={coreHovered ? '0.6' : '0'} style={{ filter: 'blur(6px)', transition: 'all 0.3s ease' }} />
            {coreHovered && (
              <>
                <path d={helix.pathA} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
                <path d={helix.pathB} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
              </>
            )}
            {helix.rungs.map((r, i) => {
              const isFront = r.depth > 0;
              return (
                <g key={`ar-${i}`}>
                  <line x1={r.xA} y1={r.y} x2={r.xB} y2={r.y}
                    stroke="#FF5A00" strokeWidth={isFront ? 1.5 : 0.8} strokeOpacity={isFront ? 0.45 : 0.15} />
                  <circle cx={200} cy={r.y} r={isFront ? 2.5 : 1.5} fill="#FF5A00" opacity={isFront ? 0.5 : 0.2} />
                </g>
              );
            })}
          </g>

          {/* Quality labels */}
          {helix.rungs.map((r, i) => {
            if (!r.label) return null;
            const side = r.xA > r.xB ? 'right' : 'left';
            return (
              <QualityLabel key={i}
                x={side === 'right' ? Math.max(r.xA, r.xB) + 14 : Math.min(r.xA, r.xB) - 14}
                y={r.y} anchor={side === 'right' ? 'start' : 'end'}
                label={r.label} t={r.t} progress={smooth} />
            );
          })}

          {/* Convergence node */}
          <motion.g style={{ opacity: convergeOpacity }}>
            <g className="pointer-events-auto cursor-pointer" onMouseEnter={() => setCoreHovered(true)} onMouseLeave={() => setCoreHovered(false)}>
              <circle cx={200} cy={svgH + 10} r="20" fill="transparent" />{' '}
              <circle cx={200} cy={svgH + 10} r="14" fill="none" stroke="#FF5A00" strokeWidth="2"
                style={{ filter: coreHovered ? 'drop-shadow(0 0 5px #FF5A00)' : 'none', transition: 'all 0.3s' }} />
              <circle cx={200} cy={svgH + 10} r="6" fill="#FF5A00"
                style={{ filter: coreHovered ? 'drop-shadow(0 0 5px #FF5A00)' : 'none', transition: 'all 0.3s' }} />
            </g>
            <line x1={200} y1={svgH + 24} x2={200} y2={svgH + 100} stroke="#FF5A00" strokeWidth="2" strokeOpacity="0.3" />
          </motion.g>
        </svg>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2 pointer-events-none">
          <motion.div style={{ opacity: convergeOpacity }}>
            <div className="font-mono text-[9px] text-[var(--color-accent)] font-bold uppercase tracking-[0.3em] mb-1">All strands converge</div>
            <div className="font-display text-xl font-bold text-black tracking-tighter uppercase">= Complete Maker</div>
          </motion.div>
        </div>
      </div>

      {/* Studio cards, positioned along the tilted helix */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {studios.map((studio, idx) => {
            const isLeft = idx % 2 === 0;
            const yPos = studioYPositions[idx];
            const tilt = (-12 * Math.PI) / 180;
            const fromCenter = (yPos - 0.5) * svgH;
            const dnaOffsetX = -fromCenter * Math.sin(tilt);
            const dnaOffsetY = fromCenter * Math.cos(tilt);
            return (
              <StudioCardHelix key={studio.num} studio={studio} index={idx} progress={smooth}
                dnaOffsetX={dnaOffsetX}
                style={{
                  position: 'absolute', top: `${svgH / 2 + dnaOffsetY}px`, y: '-50%',
                  [isLeft ? 'left' : 'right']: '0',
                  width: 'calc(50% - 160px)',
                  pointerEvents: 'auto',
                }}
                isLeft={isLeft}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileHelix() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const progress = scrollYProgress;

  const svgH = 2000;
  const helix = useMemo(() => generateHelix(svgH, 200, 80, 4.5), []);
  const fillH = useTransform(progress, [0.05, 0.95], [0, svgH]);

  return (
    <div ref={ref} className="relative w-full flex flex-col mb-12 mt-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2000px] z-0 pointer-events-none">
        <svg viewBox={`0 0 400 ${svgH}`} className="w-full h-full" overflow="visible"
          style={{ transform: 'rotate(-12deg)', transformOrigin: 'center center' }}>
          <defs>
            <clipPath id="helix-fill-mobile">
              <motion.rect x="-100" y="-50" width={600} style={{ height: fillH }} />
            </clipPath>
          </defs>
          <path d={helix.pathA} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
          <path d={helix.pathB} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
          {helix.rungs.map((r, i) => (
            <line key={`mg-${i}`} x1={r.xA} y1={r.y} x2={r.xB} y2={r.y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          ))}
          <g clipPath="url(#helix-fill-mobile)">
            <path d={helix.pathA} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity="0.55" />
            <path d={helix.pathB} fill="none" stroke="#FF5A00" strokeWidth="2.5" strokeOpacity="0.55" />
            {helix.rungs.map((r, i) => {
              const isFront = r.depth > 0;
              return (
                <g key={`ma-${i}`}>
                  <line x1={r.xA} y1={r.y} x2={r.xB} y2={r.y}
                    stroke="#FF5A00" strokeWidth={isFront ? 1.5 : 1} strokeOpacity={isFront ? 0.6 : 0.2} />
                  <circle cx={200} cy={r.y} r={isFront ? 2 : 1} fill="#FF5A00" opacity={isFront ? 0.7 : 0.3} />
                </g>
              );
            })}
          </g>
          {helix.rungs.map((r, i) => r.label ? (
            <QualityLabel key={i} x={200} y={r.y} anchor="middle" label={r.label} t={r.t} progress={progress} isMobileCenter />
          ) : null)}
        </svg>
      </div>

      <div className="w-full px-6 pt-[10vh] pb-[20vh] relative z-10 space-y-24 mt-12">
        {studios.map((studio, idx) => (
          <StudioCardHelix key={studio.num} studio={studio} index={idx} progress={progress} isLeft={false} isMobile />
        ))}
      </div>
    </div>
  );
}

export default function FourStudiosDNA() {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="programs" className="relative pb-24 md:pb-48 pt-12 md:pt-24 bg-[#F5F0E8] border-y border-black/5 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-0 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-12 md:mb-24 px-6 md:px-0">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6">
            // THE FOUR STUDIOS
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-start">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2">
              FOUR STUDIOS.<br /><span className="text-black/15">ONE MAKER.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="lg:w-1/2 space-y-4">
              <p className="text-lg md:text-2xl text-black/80 font-medium leading-tight">Every maker works across all four studios, every year.</p>
              <p className="text-sm md:text-lg text-black/50 leading-relaxed max-w-xl">Not as subjects to study, but as four ways to build, think, and grow.</p>
            </motion.div>
          </div>
        </div>

        {mounted && (isMobile ? <MobileHelix /> : <DesktopHelix />)}

        {/* Closing */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mt-12 md:mt-48 px-6 md:px-0 relative z-20">
          <p className="text-xl md:text-3xl text-black font-display font-bold uppercase tracking-tighter leading-snug">
            Together, they shape a complete maker:{' '}
            <span className="text-[var(--color-accent)]">one who can make it work, make it good, make it understood, and make it matter.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
