import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCircuit } from '../context/CircuitContext';
import { ScrollCircuitLine } from './MakerElements';

const pairs = [
  { id: 'Curiosity',          how: 'Open exploration',    desc: 'Every maker journey begins with a question. We design projects with no single right answer — sparking the instinct to explore, experiment, and discover.' },
  { id: 'Persistence',        how: 'Iterative design',    desc: 'Failure is data. Our build-test-redesign cycles teach makers that every broken prototype is closer to a breakthrough. We never give up on an idea.' },
  { id: 'Collaboration',      how: 'Team challenges',     desc: 'Great things are never built alone. Cross-disciplinary builds teach makers to speak the languages of engineers, artists, and coders simultaneously.' },
  { id: 'Creative confidence',how: 'Make & showcase',     desc: 'Regular public exhibitions turn shy builders into confident presenters. Sharing your creation is a skill as important as building it.' },
  { id: 'Logical thinking',   how: 'Coding & robotics',   desc: 'Code is the nervous system of the machine. We train structured logical thinking through programming and electronics, where precision is non-negotiable.' },
  { id: 'Adaptability',       how: 'Competition prep',    desc: 'Real competitions have real surprises. Preparing teaches makers to stay calm, think fast, and pivot under pressure.' },
  { id: 'Resourcefulness',    how: 'Material mastery',    desc: "A true maker sees a solution where others see scrap. We expose makers to diverse tools so they can build anything with whatever's at hand." },
  { id: 'Systems thinking',   how: 'Complex engineering', desc: 'Every part affects every other part. Multi-phase engineering challenges reveal how small decisions cascade into big, real-world outcomes.' },
];

const N1 = 8, N2 = 18, RATIO = N1 / N2;
const G1 = { cx: 175, cy: 200, iR: 56, oR: 74 };
const MESH_DIST = G1.oR + 160 - 14;
const G2 = { cx: G1.cx + MESH_DIST, cy: 200, iR: 128, oR: 160 };
const VB_W = 680, VB_H = 400;
const LBL1_R = 102, LBL2_R = G2.oR + 28, ARC_SPAN = 0.60;
const HAND_L = G1.oR - 5;

function gearPts(iR, oR, n) {
  const p = [], h = (Math.PI / n) * 0.5;
  for (let i = 0; i < n; i++) {
    const b = (i / n) * Math.PI * 2;
    const pt = (a, r) => `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
    p.push(pt(b-h*1.5,iR), pt(b-h*.5,oR), pt(b+h*.5,oR), pt(b+h*1.5,iR));
  }
  return p.join(' ');
}

function makeBolts(bR, n, s) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { cx: (bR * Math.cos(a)).toFixed(2), cy: (bR * Math.sin(a)).toFixed(2), r: s };
  });
}

function arcD(cx, cy, R, cA, span, flip = false) {
  if (flip) {
    const [a1, a2] = [cA + span, cA - span];
    return `M${(cx+R*Math.cos(a1)).toFixed(2)},${(cy+R*Math.sin(a1)).toFixed(2)} A${R},${R},0,0,0,${(cx+R*Math.cos(a2)).toFixed(2)},${(cy+R*Math.sin(a2)).toFixed(2)}`;
  }
  const [a1, a2] = [cA - span, cA + span];
  return `M${(cx+R*Math.cos(a1)).toFixed(2)},${(cy+R*Math.sin(a1)).toFixed(2)} A${R},${R},0,0,1,${(cx+R*Math.cos(a2)).toFixed(2)},${(cy+R*Math.sin(a2)).toFixed(2)}`;
}

const G1_PTS = gearPts(G1.iR, G1.oR, N1);
const G2_PTS = gearPts(G2.iR, G2.oR, N2);
const G1_BOLTS = makeBolts(G1.iR * 0.62, 6, 4);
const G2_BOLTS_O = makeBolts(G2.iR * 0.88, 12, 5.5);
const G2_BOLTS_I = makeBolts(G2.iR * 0.65, 8, 4);

const LABEL_ANGS = pairs.map((_, i) => -Math.PI / 2 + i * Math.PI * 2 / N1);
const LABEL_POS = LABEL_ANGS.map(a => ({
  x:      (G1.cx + LBL1_R * Math.cos(a)).toFixed(1),
  y:      (G1.cy + LBL1_R * Math.sin(a)).toFixed(1),
  anchor: Math.abs(Math.cos(a)) < 0.25 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end',
  dx:     (G1.cx + (G1.oR + 9) * Math.cos(a)).toFixed(1),
  dy:     (G1.cy + (G1.oR + 9) * Math.sin(a)).toFixed(1),
}));

export default function IdentityEngine() {
  const { isPowered } = useCircuit();
  const [step, setStep] = useState(0);
  const svgRef  = useRef(null);
  const sectionRef = useRef(null);
  const state   = useRef({ rot1: -Math.PI / 2, dragging: false, autoOn: true, sa: 0, sr: 0 });
  const autoT   = useRef(null);
  const g1Ref   = useRef(null);
  const g2Ref   = useRef(null);
  const arcRefs = useRef([]);
  const txtRefs = useRef([]);

  // Animation loop — runs entirely via refs, no re-renders
  useEffect(() => {
    let raf;
    const loop = () => {
      const s = state.current;
      if (s.autoOn && !s.dragging) s.rot1 -= 0.0014;

      const rot2 = -(s.rot1 * RATIO) + Math.PI / N2; // half-tooth offset = proper meshing

      g1Ref.current?.setAttribute('transform',
        `translate(${G1.cx},${G1.cy}) rotate(${(s.rot1 * 180 / Math.PI).toFixed(2)})`);
      g2Ref.current?.setAttribute('transform',
        `translate(${G2.cx},${G2.cy}) rotate(${(rot2 * 180 / Math.PI).toFixed(2)})`);

      const raw = (s.rot1 - (-Math.PI / 2)) / (Math.PI * 2 / N1);
      const st = ((-Math.round(raw)) % N1 + N1) % N1;
      setStep(prev => prev !== st ? st : prev);

      pairs.forEach((_, i) => {
        if (!arcRefs.current[i] || !txtRefs.current[i]) return;
        const wAng = (-Math.PI / 2 + i * Math.PI * 2 / N1) + rot2;
        const d    = ((wAng - (-Math.PI / 2) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        const prox = Math.cos(d);
        const isAct = i === st;
        if (prox < -0.6 && !isAct) { txtRefs.current[i].setAttribute('opacity', '0'); return; }
        arcRefs.current[i].setAttribute('d',
          arcD(G2.cx, G2.cy, LBL2_R, wAng, ARC_SPAN, Math.abs(d) > Math.PI / 2));
        const alpha = isAct ? 1 : Math.max(0.08, ((prox + 0.6) / 1.6) * 0.55);
        const fs    = isAct ? 13 : Math.max(8.5, 8.5 + prox * 4);
        const el    = txtRefs.current[i];
        el.setAttribute('opacity',     alpha.toFixed(2));
        el.setAttribute('font-size',   fs.toFixed(1));
        el.setAttribute('font-weight', isAct ? 900 : 400);
        el.setAttribute('fill',        isAct ? '#FF5A00' : '#9CA3AF');
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const svgPt = useCallback((cx, cy) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: cx, y: cy };
    return { x: (cx - r.left) * (VB_W / r.width), y: (cy - r.top) * (VB_H / r.height) };
  }, []);

  const startDrag = useCallback((cx, cy) => {
    const s = state.current;
    s.dragging = true; s.autoOn = false;
    clearTimeout(autoT.current);
    s.sa = Math.atan2(svgPt(cx, cy).y - G1.cy, svgPt(cx, cy).x - G1.cx);
    s.sr = s.rot1;
  }, [svgPt]);

  const jumpTo = useCallback((i) => {
    state.current.rot1 = -Math.PI / 2 - i * Math.PI * 2 / N1;
    state.current.autoOn = false;
    clearTimeout(autoT.current);
    autoT.current = setTimeout(() => { state.current.autoOn = true; }, 3000);
  }, []);

  useEffect(() => {
    const onMove = e => {
      if (!state.current.dragging) return;
      const angle = Math.atan2(svgPt(e.clientX, e.clientY).y - G1.cy, svgPt(e.clientX, e.clientY).x - G1.cx);
      state.current.rot1 = state.current.sr + (angle - state.current.sa);
    };
    const onUp = () => {
      if (!state.current.dragging) return;
      state.current.dragging = false;
      const snap = Math.PI * 2 / N1;
      state.current.rot1 = Math.round(state.current.rot1 / snap) * snap;
      autoT.current = setTimeout(() => { state.current.autoOn = true; }, 2500);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [svgPt]);

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden bg-[#FAFAFA] border-b border-black/5">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '40px 40px' }}
      />
      
      <ScrollCircuitLine 
        sectionRef={sectionRef}
        className="top-0 left-0 w-[140px] h-full"
        pathD="M 20 0 V 1000"
        viewBox="0 0 100 1000"
        components={[
          { type: 'gear', cx: 20, cy: 500, threshold: 0.5 },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">

        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter text-black leading-[0.8] mb-4">
            The maker <span className="text-[#FF5A00]">engine.</span>
          </h2>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-mono">
            Drag the drive gear · identity drives method
          </p>
        </div>

        <div className="w-full select-none mb-16">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="w-full cursor-grab active:cursor-grabbing touch-none overflow-visible"
            onMouseDown={e => startDrag(e.clientX, e.clientY)}
          >
            <defs>
              {pairs.map((_, i) => (
                <path key={i} id={`ma-${i}`} fill="none" ref={el => arcRefs.current[i] = el} />
              ))}
            </defs>

            {/* G2 rotating — big method gear */}
            <g ref={g2Ref}>
              <polygon points={G2_PTS} fill="white" stroke={isPowered ? '#FF5A00' : '#E5E7EB'} strokeWidth="1.5" />
              <circle cx={0} cy={0} r={G2.iR * 0.88} fill="none" stroke="#eee" strokeWidth="1" strokeDasharray="4 6" />
              {G2_BOLTS_O.map((b, i) => <circle key={`go${i}`} cx={b.cx} cy={b.cy} r={b.r} fill="white" stroke="#eee" strokeWidth="1" />)}
            </g>

            {/* G2 curved method labels */}
            {pairs.map((p, i) => (
              <text key={i} ref={el => txtRefs.current[i] = el} className="font-display font-bold uppercase tracking-tighter" opacity={0.3}>
                <textPath href={`#ma-${i}`} startOffset="50%" textAnchor="middle">{p.how}</textPath>
              </text>
            ))}

            {/* G1 rotating — identity gear */}
            <g ref={g1Ref}>
              <polygon points={G1_PTS} fill="white" stroke="#FF5A00" strokeWidth="3" />
              <line x1={0} y1={0} x2={0} y2={-HAND_L} stroke="#FF5A00" strokeWidth="4" strokeLinecap="round" />
              <circle cx={0} cy={-HAND_L} r={8} fill="white" stroke="#FF5A00" strokeWidth="3" />
            </g>

            {/* G1 identity labels — fixed, click to jump */}
            {pairs.map((p, i) => {
              const pos = LABEL_POS[i];
              const on  = i === step;
              return (
                <g key={i} onClick={() => jumpTo(i)} style={{ cursor: 'pointer' }}>
                  <text
                    x={pos.x} y={pos.y}
                    textAnchor={pos.anchor} dominantBaseline="central"
                    className="font-mono uppercase tracking-widest transition-all duration-300"
                    fontSize={on ? 12 : 9} fontWeight={on ? 900 : 400}
                    fill={on ? '#FF5A00' : '#9CA3AF'}
                  >
                    {p.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-2xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent opacity-20" />
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-3xl font-display font-black uppercase tracking-tighter text-[#FF5A00]">
                {pairs[step].id}
              </span>
              <span className="w-8 h-[1px] bg-black/10" />
              <span className="text-3xl font-display font-black uppercase tracking-tighter text-black">
                {pairs[step].how}
              </span>
            </div>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg mx-auto">{pairs[step].desc}</p>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
