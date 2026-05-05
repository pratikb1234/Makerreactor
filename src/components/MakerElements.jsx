import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useCircuit } from '../context/CircuitContext';

// ─── Gear SVG (used in HoverGearSystem) ──────────────────────────────────────
const GearSVG = ({ className, style, rotate }) => (
  <motion.svg style={{ rotate, ...style }} className={`pointer-events-none ${className}`}
    viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="4">
    <path d="M100 10 L110 30 A 70 70 0 0 1 125 35 L145 20 L160 35 L145 55 A 70 70 0 0 1 165 75 L180 65 L190 85 L170 100 L190 115 L180 135 L165 125 A 70 70 0 0 1 145 145 L160 165 L145 180 L125 165 A 70 70 0 0 1 110 170 L100 190 L80 190 L90 170 A 70 70 0 0 1 75 165 L55 180 L40 165 L55 145 A 70 70 0 0 1 35 125 L20 135 L10 115 L30 100 L10 85 L20 65 L35 75 A 70 70 0 0 1 55 55 L40 35 L55 20 L75 35 A 70 70 0 0 1 90 30 L80 10 Z" />
    <circle cx="100" cy="100" r="40" /><circle cx="100" cy="100" r="10" />
  </motion.svg>
);

export const HoverGearSystem = ({ className = "", isHovered = false }) => {
  const { isPowered } = useCircuit();
  const rotateA = useSpring(0, { damping: 20, stiffness: 100 });
  const rotateB = useSpring(0, { damping: 20, stiffness: 100 });
  if (isHovered) { rotateA.set(rotateA.get() + 90); rotateB.set(rotateB.get() - 90); }
  return (
    <div className={`relative ${className} ${isHovered && isPowered ? 'text-[var(--color-secondary)] drop-shadow-[0_0_15px_rgba(123,44,191,0.8)]' : isHovered ? 'text-gray-400' : 'text-black/10'} transition-all duration-1000`}>
      <GearSVG rotate={rotateA} className="absolute top-0 left-0 w-48 h-48 origin-center" />
      <GearSVG rotate={rotateB} className="absolute top-[120px] left-[130px] w-32 h-32 origin-center" style={{ transform: 'rotate(15deg)' }} />
    </div>
  );
};

// ─── Circuit Electronic Components (SVG, centered at 0,0) ────────────────────
const LED = ({ on }) => (
  <g>
    <polygon points="-9,-7 -9,7 7,0" fill={on ? '#FF5A00' : '#bbb'} />
    <line x1="7" y1="-7" x2="7" y2="7" stroke={on ? '#FF5A00' : '#bbb'} strokeWidth="2.5" />
    <line x1="-15" y1="0" x2="-9" y2="0" stroke={on ? '#FF5A00' : '#ccc'} strokeWidth="2" />
    <line x1="7" y1="0" x2="15" y2="0" stroke={on ? '#FF5A00' : '#ccc'} strokeWidth="2" />
    {on && <><line x1="11" y1="-10" x2="17" y2="-16" stroke="#FF5A00" strokeWidth="1.5" opacity="0.9"/><line x1="15" y1="-3" x2="22" y2="-5" stroke="#FF5A00" strokeWidth="1.5" opacity="0.9"/><circle cx="0" cy="0" r="18" fill="#FF5A00" opacity="0.08"/></>}
  </g>
);

const Resistor = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <line x1="-18" y1="0" x2="-10" y2="0" stroke={c} strokeWidth="2"/>
      <rect x="-10" y="-6" width="20" height="12" rx="2" fill="none" stroke={c} strokeWidth="2"/>
      <line x1="-5" y1="-6" x2="-5" y2="6" stroke={on ? '#FFB347':'#ddd'} strokeWidth="2.5"/>
      <line x1="0" y1="-6" x2="0" y2="6" stroke={on ? '#FF5A00':'#ddd'} strokeWidth="2.5"/>
      <line x1="5" y1="-6" x2="5" y2="6" stroke={on ? '#FFD700':'#ddd'} strokeWidth="2.5"/>
      <line x1="10" y1="0" x2="18" y2="0" stroke={c} strokeWidth="2"/>
    </g>
  );
};

const Buzzer = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <circle cx="0" cy="0" r="9" fill="none" stroke={c} strokeWidth="2"/>
      <line x1="-4" y1="-4" x2="4" y2="-4" stroke={c} strokeWidth="2"/>
      <line x1="-4" y1="4" x2="4" y2="4" stroke={c} strokeWidth="2"/>
      {on && <>
        <motion.path d="M 13 -9 Q 21 0 13 9" fill="none" stroke="#FF5A00" strokeWidth="2"
          animate={{ opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 0.7, repeat: Infinity }}/>
        <motion.path d="M 18 -14 Q 28 0 18 14" fill="none" stroke="#FF5A00" strokeWidth="1.5"
          animate={{ opacity: [0.6, 0.1, 0.6] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }}/>
      </>}
      <line x1="-17" y1="0" x2="-9" y2="0" stroke={c} strokeWidth="2"/>
      <line x1="9" y1="0" x2="17" y2="0" stroke={c} strokeWidth="2"/>
    </g>
  );
};

const Capacitor = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <line x1="-18" y1="0" x2="-4" y2="0" stroke={c} strokeWidth="2"/>
      <line x1="-4" y1="-9" x2="-4" y2="9" stroke={c} strokeWidth="3"/>
      <line x1="4" y1="-9" x2="4" y2="9" stroke={c} strokeWidth="3"/>
      <line x1="4" y1="0" x2="18" y2="0" stroke={c} strokeWidth="2"/>
      {on && <circle cx="0" cy="0" r="14" fill="#FF5A00" opacity="0.07"/>}
    </g>
  );
};

const MotorComp = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const rot = useSpring(0, { damping: 15, stiffness: 60 });
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => rot.set(rot.get() + 40), 140);
    return () => clearInterval(id);
  }, [on]);
  return (
    <g>
      <circle cx="0" cy="0" r="13" fill="none" stroke={c} strokeWidth="2"/>
      <text x="0" y="4" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={c}>M</text>
      <motion.line x1="-5" y1="-9" x2="5" y2="9" stroke={c} strokeWidth="2" style={{ rotate: rot, originX: '0px', originY: '0px' }}/>
      <line x1="-20" y1="0" x2="-13" y2="0" stroke={c} strokeWidth="2"/>
      <line x1="13" y1="0" x2="20" y2="0" stroke={c} strokeWidth="2"/>
    </g>
  );
};

// ─── Mechanism Components (interactive) ─────────────────────────────────────
const SmallGear = ({ on, teeth = 8 }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const rot = useSpring(0, { damping: 20, stiffness: 80 });
  const dragging = useRef(false);
  const lastX = useRef(0);

  // Auto-spin when on and not being dragged
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      if (!dragging.current) rot.set(rot.get() + 15);
    }, 100);
    return () => clearInterval(id);
  }, [on]);

  const onMouseDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    const move = (ev) => {
      rot.set(rot.get() + (ev.clientX - lastX.current) * 3);
      lastX.current = ev.clientX;
    };
    const up = () => { dragging.current = false; window.removeEventListener('mousemove', move); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up, { once: true });
  };

  const R = 12, r = 9;
  const pts = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i * Math.PI) / teeth;
    const radius = i % 2 === 0 ? R : r;
    return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

  return (
    <g style={{ pointerEvents: 'all', cursor: 'grab' }} onMouseDown={onMouseDown}>
      <circle cx="0" cy="0" r="R+6" fill="transparent"/>{/* hit area */}
      <motion.g style={{ rotate: rot }}>
        <polygon points={pts} fill="none" stroke={c} strokeWidth="1.8"/>
        <circle cx="0" cy="0" r="4" fill="none" stroke={c} strokeWidth="1.8"/>
        <circle cx="0" cy="0" r="1.5" fill={c}/>
      </motion.g>
      {/* tooltip hint */}
      {!on && <title>Drag to spin</title>}
    </g>
  );
};


const Linkage = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const angle = useSpring(0, { damping: 15, stiffness: 60 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!on && !hovered) return;
    let t = 0;
    const speed = hovered ? 0.14 : 0.08;
    const id = setInterval(() => { t += speed; angle.set(Math.sin(t) * 25); }, 40);
    return () => clearInterval(id);
  }, [on, hovered]);

  return (
    <g style={{ pointerEvents: 'all', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <circle cx="-10" cy="0" r="16" fill="transparent"/>{/* hit area */}
      <circle cx="-10" cy="0" r="8" fill="none" stroke={c} strokeWidth="2"/>
      <motion.g style={{ rotate: angle, originX: '-10px', originY: '0px' }}>
        <line x1="-10" y1="0" x2="-10" y2="-8" stroke={c} strokeWidth="2.5"/>
        <circle cx="-10" cy="-8" r="2.5" fill={c}/>
        <line x1="-10" y1="-8" x2="12" y2="-5" stroke={c} strokeWidth="2"/>
        <circle cx="12" cy="-5" r="2.5" fill="none" stroke={c} strokeWidth="1.5"/>
      </motion.g>
      <rect x="10" y="-4" width="14" height="8" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
      {hovered && <title>Hover to crank</title>}
    </g>
  );
};


const Piston = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const y = useSpring(0, { damping: 18, stiffness: 70 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (!on && !clicking) return;
    let t = 0;
    const speed = clicking ? 0.25 : 0.1;
    const id = setInterval(() => { t += speed; y.set(Math.sin(t) * 10); }, 40);
    return () => clearInterval(id);
  }, [on, clicking]);

  const handleClick = () => {
    setClicking(true);
    setTimeout(() => setClicking(false), 800);
  };

  return (
    <g style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={handleClick}>
      <rect x="-12" y="-18" width="24" height="30" fill="transparent"/>{/* hit area */}
      <rect x="-7" y="-16" width="14" height="24" rx="2" fill="none" stroke={c} strokeWidth="2"/>
      <motion.g style={{ translateY: y }}>
        <rect x="-6" y="-14" width="12" height="8" rx="1"
          fill={on || clicking ? 'rgba(255,90,0,0.2)' : 'rgba(0,0,0,0.05)'} stroke={c} strokeWidth="1.5"/>
        <line x1="0" y1="-6" x2="0" y2="14" stroke={c} strokeWidth="2.5"/>
      </motion.g>
      <title>Click to pump</title>
    </g>
  );
};


// ─── Symbol Dispatcher ────────────────────────────────────────────────────────
const Symbol = ({ type, on }) => {
  if (type === 'led')       return <LED on={on}/>;
  if (type === 'resistor')  return <Resistor on={on}/>;
  if (type === 'buzzer')    return <Buzzer on={on}/>;
  if (type === 'capacitor') return <Capacitor on={on}/>;
  if (type === 'motor')     return <MotorComp on={on}/>;
  if (type === 'gear')      return <SmallGear on={on}/>;
  if (type === 'linkage')   return <Linkage on={on}/>;
  if (type === 'piston')    return <Piston on={on}/>;
  return null;
};

// Wrapper: activates when pathLength crosses this component's threshold
const CircuitComponent = ({ type, cx, cy, pathLength, threshold, isPowered }) => {
  const opacity = useTransform(pathLength, [Math.max(0, threshold - 0.04), threshold + 0.01], [0, 1]);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const unsub = pathLength.on('change', v => setOn(v >= threshold && isPowered));
    return unsub;
  }, [pathLength, threshold, isPowered]);
  return (
    <motion.g transform={`translate(${cx},${cy})`} style={{ opacity }}>
      <Symbol type={type} on={on}/>
    </motion.g>
  );
};

// ─── Scroll Circuit Line ──────────────────────────────────────────────────────
// components: [{ type, cx, cy, threshold }]  threshold is 0-1 along the path
export const ScrollCircuitLine = ({ className = "", pathD, viewBox = "0 0 200 200", components = [], sectionRef }) => {
  const { isPowered } = useCircuit();
  const innerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef || innerRef, offset: ["start end", "end start"] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const glow = isPowered ? 'rgba(255,90,0,0.9)' : 'rgba(0,0,0,0.15)';
  const stroke = isPowered ? '#FF5A00' : 'rgba(0,0,0,0.12)';

  return (
    <div ref={innerRef} className={`absolute pointer-events-none ${className}`}>
      <svg viewBox={viewBox} fill="none" strokeLinecap="square" strokeLinejoin="miter" className="w-full h-full overflow-visible">
        <path d={pathD} stroke="rgba(0,0,0,0.07)" strokeWidth="2.5"/>
        <motion.path d={pathD} stroke={stroke} strokeWidth="2.5"
          style={{ pathLength, filter: isPowered ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
        {components.map((comp, i) => (
          <CircuitComponent key={i} type={comp.type} cx={comp.cx} cy={comp.cy}
            pathLength={pathLength} threshold={comp.threshold} isPowered={isPowered}/>
        ))}
      </svg>
    </div>
  );
};

// ─── Power Switch ─────────────────────────────────────────────────────────────
export const PowerSwitch = ({ className = "" }) => {
  const { isPowered, togglePower } = useCircuit();
  return (
    <motion.button onClick={togglePower} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
      className={`relative flex items-center gap-3 pl-4 pr-6 py-3 rounded-full border-2 cursor-hover overflow-hidden transition-all duration-500 z-20 font-mono text-sm font-bold uppercase tracking-widest ${
        isPowered
          ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_35px_rgba(255,90,0,0.4)]'
          : 'border-black/40 text-black hover:border-black'
      } ${className}`}
    >
      <motion.div className="absolute inset-0 bg-[var(--color-accent)]/8 pointer-events-none"
        animate={{ opacity: isPowered ? 1 : 0 }} transition={{ duration: 0.4 }}/>
      {/* Battery icon */}
      <svg width="34" height="17" viewBox="0 0 34 17" fill="none" className="relative z-10 flex-shrink-0">
        <rect x="0.5" y="0.5" width="28" height="16" rx="3" stroke={isPowered ? '#FF5A00' : 'currentColor'} strokeWidth="1.5" fill="none"/>
        <path d="M29.5 5.5 H32 V11.5 H29.5" stroke={isPowered ? '#FF5A00' : 'currentColor'} strokeWidth="1.5" fill={isPowered ? '#FF5A00' : 'currentColor'}/>
        <motion.rect x="3" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.3 }} transition={{ delay: 0 }}/>
        <motion.rect x="11" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.3 }} transition={{ delay: 0.1 }}/>
        <motion.rect x="19" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.3 }} transition={{ delay: 0.2 }}/>
      </svg>
      <span className="relative z-10 whitespace-nowrap">
        {isPowered ? '⚡ Online' : 'Power your creativity'}
      </span>
    </motion.button>
  );
};

// ─── LED Indicator ────────────────────────────────────────────────────────────
export const LEDIndicator = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  return (
    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: false }}
      className={`absolute w-4 h-4 rounded-full border ${className} ${
        isPowered ? 'bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_20px_rgba(255,90,0,1)]' : 'bg-gray-300 border-black/20'
      } transition-all duration-500`}/>
  );
};

// ─── Interactive Code Widget ──────────────────────────────────────────────────
const LINES_OFF = [
  [{ t: '// ', c: '#6B7280' }, { t: 'System: ', c: '#6B7280' }, { t: 'OFFLINE', c: '#EF4444' }],
  [],
  [{ t: 'const ', c: '#C084FC' }, { t: 'power', c: '#60A5FA' }, { t: ' = ', c: '#e5e7eb' }, { t: 'false', c: '#F87171' }],
  [{ t: 'led', c: '#34D399' }, { t: '.brightness ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '0', c: '#F87171' }],
  [{ t: 'motor', c: '#34D399' }, { t: '.speed ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '0', c: '#F87171' }],
  [{ t: 'gear', c: '#34D399' }, { t: '.rpm ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '0', c: '#F87171' }],
];
const LINES_ON = [
  [{ t: '// ', c: '#6B7280' }, { t: 'System: ', c: '#6B7280' }, { t: 'ONLINE ✓', c: '#34D399' }],
  [],
  [{ t: 'const ', c: '#C084FC' }, { t: 'power', c: '#60A5FA' }, { t: ' = ', c: '#e5e7eb' }, { t: 'true', c: '#34D399' }],
  [{ t: 'led', c: '#34D399' }, { t: '.brightness ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '255', c: '#FF5A00' }],
  [{ t: 'motor', c: '#34D399' }, { t: '.speed ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '100', c: '#FF5A00' }],
  [{ t: 'gear', c: '#34D399' }, { t: '.rpm ', c: '#FCD34D' }, { t: '= ', c: '#e5e7eb' }, { t: '360', c: '#FF5A00' }],
];

export const FloatingCodeWidget = ({ className = "" }) => {
  const { isPowered, togglePower } = useCircuit();
  const [shown, setShown] = useState(0);
  const lines = isPowered ? LINES_ON : LINES_OFF;

  useEffect(() => {
    setShown(0);
    let i = 0;
    const t = setInterval(() => { i++; setShown(i); if (i >= lines.length) clearInterval(t); }, 90);
    return () => clearInterval(t);
  }, [isPowered]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className={`${className} rounded-xl overflow-hidden font-mono text-xs leading-relaxed`}
      style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"/>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"/>
        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isPowered ? 'bg-green-400' : 'bg-green-500/25'}`}/>
        <span className="ml-2 text-gray-500 text-[10px] tracking-wider">circuit.js</span>
        {isPowered && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-green-400 text-[10px]">● running</motion.span>}
      </div>
      {/* Code lines */}
      <div className="p-4 pb-3 space-y-[3px] min-h-[96px]">
        {lines.slice(0, shown).map((line, i) => (
          <div key={`${isPowered}-${i}`} className="flex gap-3">
            <span className="text-gray-600 w-3 text-right select-none">{i + 1}</span>
            <span className="flex flex-wrap items-center">
              {line.map((tok, j) => <span key={j} style={{ color: tok.c }}>{tok.t}</span>)}
              {i === shown - 1 && shown < lines.length && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-[6px] h-3 bg-[var(--color-accent)] ml-0.5"/>
              )}
            </span>
          </div>
        ))}
      </div>
      {/* ► RUN button — this IS the power toggle */}
      <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-3">
        <motion.button onClick={togglePower} whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.04 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest transition-all duration-400 ${
            isPowered
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/30'
          }`}
        >
          {isPowered ? '◼ Stop' : '▶ Run'}
        </motion.button>
        <span className="text-gray-600 text-[10px]">{isPowered ? 'circuit.js running…' : 'ready to execute'}</span>
      </div>
    </motion.div>
  );
};

// ─── Blueprint Grid ───────────────────────────────────────────────────────────
export const BlueprintGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
    style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}/>
);

// ─── Mechanics Widget ─────────────────────────────────────────────────────────
// A standalone engineering panel: two meshing gears + crank-slider
// Drag the large gear to drive the whole mechanism
function buildGearPath(teeth, R, r) {
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${(rad * Math.cos(a)).toFixed(2)},${(rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export const MechanicsWidget = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  const angleA = useRef(0);   // large gear angle (degrees)
  const velA   = useRef(0);   // angular velocity for inertia
  const rafRef  = useRef(null);
  const [displayAngle, setDisplayAngle] = useState(0);
  const [rpm, setRpm] = useState(0);

  // Drag state
  const dragging = useRef(false);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const lastDragAngle = useRef(0);

  // Gear ratios — large:12 teeth R50, small:7 teeth R30
  const TEETH_L = 12, RL = 46, rL = 38;
  const TEETH_S = 7,  RS = 28, rS = 22;
  const RATIO = TEETH_L / TEETH_S; // small rotates faster

  // Crank-slider params
  const CRANK_R = 22; // crank arm length
  const ROD_L   = 55; // connecting rod length

  // Inertia loop — auto-decelerate
  useEffect(() => {
    const loop = () => {
      if (!dragging.current) {
        velA.current *= 0.96; // friction
        if (Math.abs(velA.current) < 0.05) velA.current = 0;
        angleA.current += velA.current;
      }
      setDisplayAngle(angleA.current);
      const absRpm = Math.round(Math.abs(velA.current) * 60 / 6);
      setRpm(absRpm);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = true;
    lastDragX.current = e.clientX;
    lastDragTime.current = Date.now();
    lastDragAngle.current = angleA.current;

    const move = (ev) => {
      const dx = ev.clientX - lastDragX.current;
      const now = Date.now();
      const dt = Math.max(1, now - lastDragTime.current);
      velA.current = (dx * 2.5) / dt * 16; // px → deg/frame
      angleA.current += dx * 2.5;
      lastDragX.current = ev.clientX;
      lastDragTime.current = now;
    };
    const up = () => { dragging.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up, { once: true });
    return () => window.removeEventListener('mousemove', move);
  };

  const aRad = (displayAngle * Math.PI) / 180;
  const angleB = -displayAngle * RATIO; // small gear counter-rotates
  // Crank pivot is at large gear center (cx=70, cy=70 in widget space)
  // Crank pin position
  const crankX = 70 + CRANK_R * Math.cos(aRad);
  const crankY = 70 + CRANK_R * Math.sin(aRad);
  // Slider X (horizontal slider)
  const sliderX = crankX + Math.sqrt(Math.max(0, ROD_L * ROD_L - (crankY - 130) ** 2));

  const accent = isPowered ? '#FF5A00' : '#888';
  const glow   = isPowered ? 'drop-shadow(0 0 8px rgba(255,90,0,0.7))' : 'none';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`${className} rounded-xl overflow-hidden select-none`}
      style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isPowered ? 'bg-green-400' : 'bg-green-500/20'}`} />
        <span className="ml-2 text-gray-500 text-[10px] tracking-wider font-mono">mechanics.sim</span>
        <span className="ml-auto font-mono text-[10px]" style={{ color: rpm > 0 ? accent : '#4B5563' }}>
          {rpm} RPM
        </span>
      </div>

      {/* SVG canvas */}
      <div
        className="relative"
        style={{ cursor: 'grab' }}
        onMouseDown={handleMouseDown}
      >
        <svg width="100%" viewBox="0 0 220 160" style={{ filter: glow, display: 'block' }}>
          {/* Grid dots */}
          <defs>
            <pattern id="mgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="0.8" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>
          <rect width="220" height="160" fill="url(#mgrid)" />

          {/* ── Large gear (draggable, center 70,70) ── */}
          <g transform={`translate(70,70) rotate(${displayAngle})`}>
            <polygon points={buildGearPath(TEETH_L, RL, rL)}
              fill="none" stroke={accent} strokeWidth="2" />
            <circle cx="0" cy="0" r="18" fill="none" stroke={accent} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="5" fill={accent} />
            {/* Spokes */}
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={5 * Math.cos(a*Math.PI/180)} y1={5 * Math.sin(a*Math.PI/180)}
                x2={18 * Math.cos(a*Math.PI/180)} y2={18 * Math.sin(a*Math.PI/180)}
                stroke={accent} strokeWidth="1.5" />
            ))}
          </g>

          {/* ── Small gear (center 155,70, counter-rotating) ── */}
          <g transform={`translate(155,70) rotate(${angleB})`}>
            <polygon points={buildGearPath(TEETH_S, RS, rS)}
              fill="none" stroke={accent} strokeWidth="1.8" opacity="0.85"/>
            <circle cx="0" cy="0" r="10" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.85"/>
            <circle cx="0" cy="0" r="3.5" fill={accent} opacity="0.85"/>
          </g>

          {/* ── Crank arm (from large gear center to crank pin) ── */}
          <line x1="70" y1="70" x2={crankX} y2={crankY}
            stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <circle cx={crankX} cy={crankY} r="5" fill={accent} />

          {/* ── Connecting rod ── */}
          <line x1={crankX} y1={crankY} x2={sliderX} y2="130"
            stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.9"/>

          {/* ── Slider track ── */}
          <rect x="30" y="124" width="160" height="12" rx="3"
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

          {/* ── Piston / slider block ── */}
          <rect x={sliderX - 14} y="122" width="28" height="16" rx="3"
            fill={isPowered ? 'rgba(255,90,0,0.15)' : 'rgba(255,255,255,0.05)'}
            stroke={accent} strokeWidth="2" />

          {/* Hint text */}
          {rpm === 0 && (
            <text x="110" y="152" textAnchor="middle" fontSize="8"
              fill="rgba(255,255,255,0.2)" fontFamily="monospace">← drag gear to run →</text>
          )}
        </svg>
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center gap-3 font-mono text-[10px]">
        <span style={{ color: accent }}>⚙</span>
        <span className="text-gray-500">gear ratio {TEETH_L}:{TEETH_S} · crank-slider</span>
        {rpm > 0 && (
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="ml-auto"
            style={{ color: accent }}
          >torque ↑</motion.span>
        )}
      </div>
    </motion.div>
  );
};
