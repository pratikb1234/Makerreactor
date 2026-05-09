import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';
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
    {on && <><line x1="11" y1="-10" x2="17" y2="-16" stroke="#FF5A00" strokeWidth="1.5" opacity="0.9" /><line x1="15" y1="-3" x2="22" y2="-5" stroke="#FF5A00" strokeWidth="1.5" opacity="0.9" /><circle cx="0" cy="0" r="18" fill="#FF5A00" opacity="0.08" /></>}
  </g>
);

const Resistor = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <line x1="-18" y1="0" x2="-10" y2="0" stroke={c} strokeWidth="2" />
      <rect x="-10" y="-6" width="20" height="12" rx="2" fill="none" stroke={c} strokeWidth="2" />
      <line x1="-5" y1="-6" x2="-5" y2="6" stroke={on ? '#FFB347' : '#ddd'} strokeWidth="2.5" />
      <line x1="0" y1="-6" x2="0" y2="6" stroke={on ? '#FF5A00' : '#ddd'} strokeWidth="2.5" />
      <line x1="5" y1="-6" x2="5" y2="6" stroke={on ? '#FFD700' : '#ddd'} strokeWidth="2.5" />
      <line x1="10" y1="0" x2="18" y2="0" stroke={c} strokeWidth="2" />
    </g>
  );
};

const Buzzer = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <circle cx="0" cy="0" r="9" fill="none" stroke={c} strokeWidth="2" />
      <line x1="-4" y1="-4" x2="4" y2="-4" stroke={c} strokeWidth="2" />
      <line x1="-4" y1="4" x2="4" y2="4" stroke={c} strokeWidth="2" />
      {on && <>
        <motion.path d="M 13 -9 Q 21 0 13 9" fill="none" stroke="#FF5A00" strokeWidth="2"
          animate={{ opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 0.7, repeat: Infinity }} />
        <motion.path d="M 18 -14 Q 28 0 18 14" fill="none" stroke="#FF5A00" strokeWidth="1.5"
          animate={{ opacity: [0.6, 0.1, 0.6] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }} />
      </>}
      <line x1="-17" y1="0" x2="-9" y2="0" stroke={c} strokeWidth="2" />
      <line x1="9" y1="0" x2="17" y2="0" stroke={c} strokeWidth="2" />
    </g>
  );
};

const Capacitor = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <line x1="-18" y1="0" x2="-4" y2="0" stroke={c} strokeWidth="2" />
      <line x1="-4" y1="-9" x2="-4" y2="9" stroke={c} strokeWidth="3" />
      <line x1="4" y1="-9" x2="4" y2="9" stroke={c} strokeWidth="3" />
      <line x1="4" y1="0" x2="18" y2="0" stroke={c} strokeWidth="2" />
      {on && <circle cx="0" cy="0" r="14" fill="#FF5A00" opacity="0.07" />}
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
      <circle cx="0" cy="0" r="13" fill="none" stroke={c} strokeWidth="2" />
      <text x="0" y="4" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={c}>M</text>
      <motion.line x1="-5" y1="-9" x2="5" y2="9" stroke={c} strokeWidth="2" style={{ rotate: rot }} />
      <line x1="-20" y1="0" x2="-13" y2="0" stroke={c} strokeWidth="2" />
      <line x1="13" y1="0" x2="20" y2="0" stroke={c} strokeWidth="2" />
    </g>
  );
};

const MotorFan = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const rot = useSpring(0, { damping: 12, stiffness: 40 });
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => rot.set(rot.get() + 120), 100);
    return () => clearInterval(id);
  }, [on]);
  return (
    <g>
      <circle cx="0" cy="0" r="8" fill="none" stroke={c} strokeWidth="2" />
      <motion.g style={{ rotate: rot }}>
        <path d="M 0 0 Q 10 -15 0 -20 Q -10 -15 0 0" fill={on ? '#FF5A00' : '#ddd'} opacity="0.6" />
        <path d="M 0 0 Q 15 10 20 0 Q 15 -10 0 0" fill={on ? '#FF5A00' : '#ddd'} opacity="0.6" transform="rotate(120)" />
        <path d="M 0 0 Q -5 15 -10 20 Q -15 5 0 0" fill={on ? '#FF5A00' : '#ddd'} opacity="0.6" transform="rotate(240)" />
      </motion.g>
      <circle cx="0" cy="0" r="2" fill={c} />
      <line x1="-20" y1="0" x2="-8" y2="0" stroke={c} strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke={c} strokeWidth="2" />
    </g>
  );
};

const MCU = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <rect x="-18" y="-14" width="36" height="28" rx="2" fill="none" stroke={c} strokeWidth="2.5" />
      <rect x="-12" y="-9" width="24" height="18" rx="1" fill={on ? '#FF5A00' : '#eee'} opacity={on ? 0.2 : 1} />
      {/* Pins */}
      {[-12, -6, 0, 6, 12].map(x => (
        <g key={x}>
          <line x1={x} y1="-14" x2={x} y2="-18" stroke={c} strokeWidth="1.5" />
          <line x1={x} y1="14" x2={x} y2="18" stroke={c} strokeWidth="1.5" />
        </g>
      ))}
      {[-8, -2, 4].map(y => (
        <g key={y}>
          <line x1="-18" y1={y} x2="-22" y2={y} stroke={c} strokeWidth="1.5" />
          <line x1="18" y1={y} x2="22" y2={y} stroke={c} strokeWidth="1.5" />
        </g>
      ))}
      {on && <motion.circle cx="0" cy="0" r="4" fill="#FF5A00" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />}
    </g>
  );
};

const RoboticArm = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  const a1 = useSpring(0, { damping: 15, stiffness: 50 });
  const a2 = useSpring(0, { damping: 15, stiffness: 50 });
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      a1.set(Math.sin(Date.now() / 500) * 20 - 10);
      a2.set(Math.cos(Date.now() / 500) * 30 + 20);
    }, 50);
    return () => clearInterval(id);
  }, [on]);
  return (
    <g transform="translate(-10, 10)">
      <rect x="-5" y="0" width="10" height="5" fill={c} />
      <motion.g style={{ rotate: a1, originX: '0px', originY: '0px' }}>
        <line x1="0" y1="0" x2="0" y2="-20" stroke={c} strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="-20" r="3" fill="none" stroke={c} strokeWidth="2" />
        <motion.g transform="translate(0, -20)" style={{ rotate: a2, originX: '0px', originY: '0px' }}>
          <line x1="0" y1="0" x2="15" y2="-10" stroke={c} strokeWidth="3" strokeLinecap="round" />
          {/* Gripper */}
          <g transform="translate(15, -10)">
            <path d="M 0 0 L 5 -5 M 0 0 L 5 5" stroke={c} strokeWidth="2" strokeLinecap="round" />
          </g>
        </motion.g>
      </motion.g>
    </g>
  );
};

const NeuralNetwork = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      {/* Nodes */}
      <circle cx="-15" cy="0" r="3" fill={c} />
      <circle cx="0" cy="-12" r="3" fill={c} />
      <circle cx="0" cy="12" r="3" fill={c} />
      <circle cx="15" cy="0" r="3" fill={c} />
      {/* Connections */}
      <motion.g initial={{ opacity: 0.2 }} animate={on ? { opacity: 1 } : { opacity: 0.2 }}>
        <line x1="-15" y1="0" x2="0" y2="-12" stroke={c} strokeWidth="1" />
        <line x1="-15" y1="0" x2="0" y2="12" stroke={c} strokeWidth="1" />
        <line x1="0" y1="-12" x2="15" y2="0" stroke={c} strokeWidth="1" />
        <line x1="0" y1="12" x2="15" y2="0" stroke={c} strokeWidth="1" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke={c} strokeWidth="1" />
        {on && <>
          <motion.circle cx="-15" cy="0" r="1.5" fill="#fff" animate={{ cx: [-15, 0], cy: [0, -12] }} transition={{ duration: 1, repeat: Infinity }} />
          <motion.circle cx="0" cy="12" r="1.5" fill="#fff" animate={{ cx: [0, 15], cy: [12, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />
        </>}
      </motion.g>
    </g>
  );
};

const F1Car = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g transform="scale(0.8)">
      <path d="M -25 10 L -20 0 L 10 0 L 25 10 Z" fill="none" stroke={c} strokeWidth="2" />
      <rect x="-22" y="8" width="8" height="6" fill={c} />
      <rect x="14" y="8" width="8" height="6" fill={c} />
      <path d="M -5 -5 L 5 -5 L 8 0 L -8 0 Z" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M 20 0 L 22 -8 L 28 -8" stroke={c} strokeWidth="2" />
      {on && <motion.path d="M -25 5 H -35" stroke="#FF5A00" strokeWidth="1.5" strokeDasharray="2,2" animate={{ x: [-5, 0] }} transition={{ duration: 0.3, repeat: Infinity }} />}
    </g>
  );
};

const RocketIcon = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g transform="rotate(-45)">
      <path d="M 0 -20 C 5 -10 5 10 0 20 C -5 10 -5 -10 0 -20" fill="none" stroke={c} strokeWidth="2.5" />
      <path d="M 5 10 L 12 18 L 5 15" fill="none" stroke={c} strokeWidth="2" />
      <path d="M -5 10 L -12 18 L -5 15" fill="none" stroke={c} strokeWidth="2" />
      <circle cx="0" cy="-5" r="3" fill="none" stroke={c} strokeWidth="1.5" />
      {on && <motion.path d="M -3 20 Q 0 35 3 20" stroke="#FF5A00" strokeWidth="3" animate={{ opacity: [0.5, 1, 0.5], scaleY: [1, 2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />}
    </g>
  );
};

const DroneIcon = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb'; 
  return (
    <g transform="scale(0.8)">
      <rect x="-15" y="-3" width="30" height="6" fill="none" stroke={c} strokeWidth="2" rx="3" />
      <rect x="-3" y="-15" width="6" height="30" fill="none" stroke={c} strokeWidth="2" rx="3" />
      {/* Rotors */}
      {[-15, 15].map(x => [-15, 15].map(y => (
        <motion.g key={`${x}-${y}`} transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy="0" r="8" fill="none" stroke={c} strokeWidth="1" strokeDasharray="2,2" />
          <motion.line 
            x1="-6" y1="0" x2="6" y2="0" stroke={c} strokeWidth="2" 
            animate={on ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.g>
      )))}
    </g>
  );
};

const RocketWithPlanet = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb'; 
  return (
    <g>
      {/* Small Planet */}
      <motion.g animate={on ? { x: [-2, 2, -2], y: [1, -1, 1] } : {}} transition={{ duration: 4, repeat: Infinity }}>
        <circle cx="20" cy="-15" r="5" fill="none" stroke={c} strokeWidth="1.5" />
        <ellipse cx="20" cy="-15" rx="8" ry="2" fill="none" stroke={c} strokeWidth="1" transform="rotate(-20 20 -15)" opacity="0.6" />
      </motion.g>
      
      {/* Rocket */}
      <g transform="rotate(-45) translate(0, 0)">
        <path d="M 0 -20 C 5 -10 5 10 0 20 C -5 10 -5 -10 0 -20" fill="none" stroke={c} strokeWidth="2.5" />
        <path d="M 5 10 L 12 18 L 5 15" fill="none" stroke={c} strokeWidth="2" />
        <path d="M -5 10 L -12 18 L -5 15" fill="none" stroke={c} strokeWidth="2" />
        <circle cx="0" cy="-5" r="3" fill="none" stroke={c} strokeWidth="1.5" />
        {on && <motion.path d="M -3 20 Q 0 35 3 20" stroke="#FF5A00" strokeWidth="3" animate={{ opacity: [0.5, 1, 0.5], scaleY: [1, 2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />}
      </g>
    </g>
  );
};

const Printer3D = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb'; 
  return (
    <g transform="translate(0, 5) scale(0.9)">
      {/* Frame */}
      <path d="M -16 12 L -16 -16 L 16 -16 L 16 12" fill="none" stroke={c} strokeWidth="2" strokeLinecap="square"/>
      <line x1="-18" y1="12" x2="18" y2="12" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      
      {/* Print bed */}
      <rect x="-10" y="8" width="20" height="4" fill={c} opacity="0.4"/>
      
      {/* X-axis gantry */}
      <line x1="-16" y1="-6" x2="16" y2="-6" stroke={c} strokeWidth="1.5" opacity="0.6"/>
      
      {/* Moving Print Head */}
      <motion.g animate={on ? { x: [-10, 10, -10] } : { x: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
        <rect x="-3" y="-8" width="6" height="6" fill={c} rx="1"/>
        <path d="M -1 -2 L 1 -2 L 2 2 L -2 2 Z" fill={c}/>
      </motion.g>
      
      {/* Printing laser / filament glow */}
      {on && (
        <motion.g animate={{ x: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <line x1="0" y1="2" x2="0" y2="8" stroke="#FF5A00" strokeWidth="1.5" />
          <circle cx="0" cy="8" r="1.5" fill="#fff" style={{ filter: "drop-shadow(0 0 3px #FF5A00)" }}/>
        </motion.g>
      )}
    </g>
  );
};

const AIIcon = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb'; 
  return (
    <g transform="scale(0.9)">
      <circle cx="0" cy="0" r="15" fill="none" stroke={c} strokeWidth="2" strokeDasharray="2,2" />
      <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke={c} strokeWidth="2" />
      <rect x="-5" y="-5" width="10" height="10" fill="none" stroke={c} strokeWidth="2" rx="2" />
      {on && (
        <motion.circle 
          cx="0" cy="0" r="18" fill="none" stroke="#FF5A00" strokeWidth="1" 
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Neural lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line 
          key={i} x1="0" y1="0" x2={20 * Math.cos(i * Math.PI / 2)} y2={20 * Math.sin(i * Math.PI / 2)} 
          stroke={c} strokeWidth="1.5" strokeDasharray={on ? "none" : "2,2"}
        />
      ))}
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
      <circle cx="0" cy="0" r="R+6" fill="transparent" />{/* hit area */}
      <motion.g style={{ rotate: rot }}>
        <polygon points={pts} fill="none" stroke={c} strokeWidth="1.8" />
        <circle cx="0" cy="0" r="4" fill="none" stroke={c} strokeWidth="1.8" />
        <circle cx="0" cy="0" r="1.5" fill={c} />
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
      <circle cx="-10" cy="0" r="16" fill="transparent" />{/* hit area */}
      <circle cx="-10" cy="0" r="8" fill="none" stroke={c} strokeWidth="2" />
      <motion.g style={{ rotate: angle, originX: '-10px', originY: '0px' }}>
        <line x1="-10" y1="0" x2="-10" y2="-8" stroke={c} strokeWidth="2.5" />
        <circle cx="-10" cy="-8" r="2.5" fill={c} />
        <line x1="-10" y1="-8" x2="12" y2="-5" stroke={c} strokeWidth="2" />
        <circle cx="12" cy="-5" r="2.5" fill="none" stroke={c} strokeWidth="1.5" />
      </motion.g>
      <rect x="10" y="-4" width="14" height="8" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5" />
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
      <rect x="-12" y="-18" width="24" height="30" fill="transparent" />{/* hit area */}
      <rect x="-7" y="-16" width="14" height="24" rx="2" fill="none" stroke={c} strokeWidth="2" />
      <motion.g style={{ translateY: y }}>
        <rect x="-6" y="-14" width="12" height="8" rx="1"
          fill={on || clicking ? 'rgba(255,90,0,0.2)' : 'rgba(0,0,0,0.05)'} stroke={c} strokeWidth="1.5" />
        <line x1="0" y1="-6" x2="0" y2="14" stroke={c} strokeWidth="2.5" />
      </motion.g>
      <title>Click to pump</title>
    </g>
  );
};


// ─── Futuristic Tech & Skills ──────────────────────────────────────────────────
const QuantumCore = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <circle cx="0" cy="0" r="14" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="3 3" />
      <ellipse cx="0" cy="0" rx="18" ry="6" fill="none" stroke={c} strokeWidth="1" transform="rotate(45)" />
      <ellipse cx="0" cy="0" rx="18" ry="6" fill="none" stroke={c} strokeWidth="1" transform="rotate(-45)" />
      <circle cx="0" cy="0" r="4" fill={on ? c : 'none'} stroke={c} strokeWidth="2" />
      {on && <circle cx="0" cy="0" r="4" fill={c} filter="blur(2px)" />}
    </g>
  );
};

const VRHeadset = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <rect x="-14" y="-8" width="28" height="14" rx="4" fill="none" stroke={c} strokeWidth="2" />
      <path d="M-14 -2 C-18 -2, -18 6, -14 6" fill="none" stroke={c} strokeWidth="2" />
      <path d="M14 -2 C18 -2, 18 6, 14 6" fill="none" stroke={c} strokeWidth="2" />
      <rect x="-10" y="-4" width="8" height="6" rx="1" fill={on ? 'rgba(255,90,0,0.3)' : 'none'} stroke={c} strokeWidth="1.5" />
      <rect x="2" y="-4" width="8" height="6" rx="1" fill={on ? 'rgba(255,90,0,0.3)' : 'none'} stroke={c} strokeWidth="1.5" />
    </g>
  );
};

const Satellite = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g transform="rotate(-30)">
      <rect x="-6" y="-6" width="12" height="12" rx="2" fill="none" stroke={c} strokeWidth="2" />
      <rect x="-24" y="-4" width="16" height="8" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 1" />
      <rect x="8" y="-4" width="16" height="8" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 1" />
      <circle cx="0" cy="0" r="2" fill={c} />
      <path d="M0 6 L0 14" stroke={c} strokeWidth="1.5" />
      {on && <path d="M-4 16 A 6 6 0 0 0 4 16" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" />}
      {on && <path d="M-8 20 A 10 10 0 0 0 8 20" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />}
    </g>
  );
};

const NeuralBrain = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <path d="M-12 0 C-12 -10, -4 -16, 0 -12 C4 -16, 12 -10, 12 0 C16 6, 8 14, 0 10 C-8 14, -16 6, -12 0 Z" fill="none" stroke={c} strokeWidth="2" />
      <circle cx="-5" cy="-2" r="1.5" fill={c} />
      <circle cx="5" cy="2" r="1.5" fill={c} />
      <circle cx="0" cy="5" r="1.5" fill={c} />
      <path d="M-5 -2 L5 2 L0 5 Z" fill="none" stroke={c} strokeWidth="1" strokeDasharray="1 2" />
      {on && <circle cx="-5" cy="-2" r="3" fill={c} opacity="0.3" />}
    </g>
  );
};

const DNAHelix = ({ on }) => {
  const c = on ? '#FF5A00' : '#bbb';
  return (
    <g>
      <path d="M-6 -12 C 10 -6, -10 6, 6 12" fill="none" stroke={c} strokeWidth="2" />
      <path d="M6 -12 C -10 -6, 10 6, -6 12" fill="none" stroke={c} strokeWidth="2" opacity="0.5" />
      <line x1="-3" y1="-8" x2="3" y2="-8" stroke={c} strokeWidth="1.5" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke={c} strokeWidth="1.5" />
      <line x1="-3" y1="8" x2="3" y2="8" stroke={c} strokeWidth="1.5" />
      {on && <circle cx="0" cy="0" r="12" fill="none" stroke={c} strokeWidth="1" opacity="0.2" />}
    </g>
  );
};

// ─── Symbol Dispatcher ────────────────────────────────────────────────────────
export const Symbol = ({ type, on }) => {
  if (type === 'led') return <LED on={on} />;
  if (type === 'resistor') return <Resistor on={on} />;
  if (type === 'buzzer') return <Buzzer on={on} />;
  if (type === 'capacitor') return <Capacitor on={on} />;
  if (type === 'motor') return <MotorFan on={on} />;
  if (type === 'mcu') return <MCU on={on} />;
  if (type === 'arm') return <RoboticArm on={on} />;
  if (type === 'car') return <F1Car on={on} />;
  if (type === 'rocket') return <RocketIcon on={on} />;
  if (type === 'rocket_planet') return <RocketWithPlanet on={on} />;
  if (type === 'drone') return <DroneIcon on={on} />;
  if (type === 'printer') return <Printer3D on={on} />;
  if (type === 'ai') return <AIIcon on={on} />;
  if (type === 'gear') return <SmallGear on={on} />;
  if (type === 'linkage') return <Linkage on={on} />;
  if (type === 'piston') return <Piston on={on} />;
  if (type === 'quantum') return <QuantumCore on={on} />;
  if (type === 'vr') return <VRHeadset on={on} />;
  if (type === 'satellite') return <Satellite on={on} />;
  if (type === 'brain') return <NeuralBrain on={on} />;
  if (type === 'dna') return <DNAHelix on={on} />;
  return null;
};

// Wrapper: activates when pathLength crosses this component's threshold
export const ArcReactorNode = ({ isActive, isHovered, setIsHovered, children, className = "" }) => {
  return (
    <div className={`flex items-center justify-center z-30 ${className}`}>
      <motion.div 
        animate={isHovered ? {
          scale: 1.35,
          borderColor: 'var(--color-accent)',
          boxShadow: '0 0 30px rgba(255, 90, 0, 0.4), inset 0 0 10px rgba(255, 90, 0, 0.2)',
          backgroundColor: '#111111'
        } : {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
          borderColor: isActive ? 'var(--color-accent)' : 'rgba(0,0,0,0.1)'
        }}
        className="w-12 h-12 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-500 relative overflow-visible"
      >
        {/* Reliable HTML Sliding Doors (Left & Right Halves) */}
        <motion.div 
          className="absolute inset-[-2px] rounded-full overflow-hidden z-20 pointer-events-none"
          initial={false}
          animate={{ rotate: isHovered ? 90 : 0 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
        >
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-[51%] bg-white border-r border-black/20"
            animate={isHovered ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
          />
          <motion.div 
            className="absolute right-0 top-0 bottom-0 w-[51%] bg-white border-l border-black/20"
            animate={isHovered ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 0.8, ease: "anticipate" }}
          />
        </motion.div>

        {/* Dark Mechanical Arc Reactor (Revealed when gates open) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 150, damping: 20 }}
          className="absolute inset-[-4px] rounded-full flex items-center justify-center pointer-events-none z-10"
        >
          {/* The 10 Mechanical Coils (Ratchet Spin) */}
          <motion.div 
            animate={isHovered ? { rotate: -360 } : {}}
            transition={{ duration: 15, repeat: Infinity, ease: "steps(10)" }}
            className="absolute w-[120%] h-[120%]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Heavy Black Torus */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="10" />
              {/* 10 Dark Coils */}
              {Array.from({ length: 10 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 36} 50 50)`}>
                  <rect x="43" y="5" width="14" height="10" fill="#111111" stroke="var(--color-accent)" strokeWidth="1" />
                  <line x1="45" y1="8" x2="55" y2="8" stroke="var(--color-accent)" strokeWidth="1" opacity="0.8" />
                  <line x1="45" y1="12" x2="55" y2="12" stroke="var(--color-accent)" strokeWidth="1" opacity="0.8" />
                </g>
              ))}
            </svg>
          </motion.div>

          {/* Inner Glowing Ring & Rivets (Smooth Spin) */}
          <motion.div 
            animate={isHovered ? { rotate: 360 } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute w-[85%] h-[85%]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="28" fill="none" stroke="var(--color-accent)" strokeWidth="6" className="opacity-80 drop-shadow-[0_0_6px_var(--color-accent)]" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" strokeWidth="1" className="opacity-80" />
              {Array.from({ length: 12 }).map((_, i) => (
                <circle key={`dot-${i}`} cx="50" cy="22" r="2" fill="#ffffff" className="drop-shadow-[0_0_2px_var(--color-accent)]" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
          </motion.div>

          {/* Center Core & Mesh */}
          <div className="absolute w-[30%] h-[30%] rounded-full bg-white blur-[2px] shadow-[0_0_10px_var(--color-accent),0_0_20px_var(--color-accent)]" />
          <svg viewBox="0 0 100 100" className="absolute w-[40%] h-[40%] animate-[spin_4s_linear_infinite]">
             <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray="6 10" opacity="0.8" />
          </svg>
        </motion.div>

        {/* Central Component (Visible when gates are closed) */}
        <motion.div 
          animate={isHovered ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          className="transition-all duration-300 relative z-30 pointer-events-none flex items-center justify-center" 
        >
          {children ? children : (
            <div style={{ backgroundColor: isActive ? 'var(--color-accent)' : 'black' }} className="w-3 h-3 rounded-full" />
          )}
        </motion.div>
        
        {/* Precision Trigger Zone - ONLY activates when perfectly centered */}
        <div 
           className="absolute inset-0 m-auto w-8 h-8 rounded-full z-50 cursor-pointer"
           onMouseEnter={() => setIsHovered?.(true)}
           onMouseLeave={() => setIsHovered?.(false)}
        />
      </motion.div>
    </div>
  );
};

const CircuitComponent = ({ type, cx, cy, pathLength, threshold, isPowered }) => {
  const pathOpacity = useTransform(pathLength, [Math.max(0, threshold - 0.04), threshold + 0.01], [0, 1]);
  // Gate: icon is invisible when not powered, regardless of path progress
  const opacity = useTransform(pathOpacity, (v) => isPowered ? v : 0);
  const [on, setOn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const update = () => setOn(pathLength.get() >= threshold && isPowered);
    update();
    const unsub = pathLength.on('change', update);
    return unsub;
  }, [pathLength, threshold, isPowered]);

  return (
    <motion.div 
      className="absolute pointer-events-auto"
      style={{ 
        left: cx, 
        top: cy, 
        transform: 'translate(-50%, -50%)', 
        opacity,
        zIndex: 50
      }}
    >
      <ArcReactorNode isActive={on} isHovered={isHovered} setIsHovered={setIsHovered}>
        <svg viewBox="-20 -20 40 40" className="w-8 h-8 pointer-events-none drop-shadow-sm">
          <Symbol type={type} on={on} />
        </svg>
      </ArcReactorNode>
    </motion.div>
  );
};

// ─── Scroll Circuit Line ──────────────────────────────────────────────────────
// components: [{ type, cx, cy, threshold }]  threshold is 0-1 along the path
// ─── Power Flow Circuit Line ─────────────────────────────────────────────────
// Animates when isPowered toggles to true, with a moving current pulse
export const PowerFlowLine = ({ className = "", pathD, viewBox = "0 0 200 200", onPowerReachTop }) => {
  const { isPowered } = useCircuit();
  const glow = isPowered ? 'rgba(255,90,0,0.9)' : 'rgba(0,0,0,0.15)';
  const stroke = isPowered ? '#FF5A00' : 'rgba(0,0,0,0.12)';

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg viewBox={viewBox} fill="none" strokeLinecap="square" strokeLinejoin="miter" className="w-full h-full overflow-visible">
        <path d={pathD} stroke="rgba(0,0,0,0.07)" strokeWidth="2" />
        
        {/* Glow Layer (Pulsing) */}
        {isPowered && (
          <motion.path
            d={pathD}
            stroke={glow}
            strokeWidth="8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.1, 0.5, 0.1] }}
            transition={{ 
              pathLength: { duration: 1.0, ease: "linear" },
              opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        )}
        
        <motion.path
          d={pathD}
          stroke={stroke}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isPowered ? 1 : 0 }}
          transition={{ duration: 1.0, ease: "linear" }}
          onAnimationComplete={(definition) => {
            if (isPowered && definition?.pathLength === 1) {
              onPowerReachTop?.();
            } else if (isPowered && !definition) {
              onPowerReachTop?.();
            }
          }}
        />

        {/* Moving Current Pulse (Circles) */}
        {isPowered && (
          <motion.path
            d={pathD}
            stroke="#FF5A00"
            strokeWidth="6"
            strokeDasharray="1, 100"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 101 }}
            animate={{ strokeDashoffset: -101 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>
    </div>
  );
};

export const ScrollCircuitLine = ({ className = "", pathD, viewBox = "0 0 100 1000", components = [], sectionRef, scrollOffset = ["start end", "end start"], isActivated: propIsActivated, shouldBoost = false, maxBackgroundLength = 1, onReachCenter }) => {
  const { isPowerFlowComplete } = useCircuit();
  const innerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef || innerRef, offset: scrollOffset });
  const pathLength = scrollYProgress;

  // shouldBoost: when power trail reaches top, auto-illuminate to 2nd icon (threshold ~0.58)
  const boostTarget = useMotionValue(0);
  const boostProgress = useSpring(boostTarget, { stiffness: 30, damping: 25 });
  useEffect(() => {
    boostTarget.set(shouldBoost ? 0.46 : 0);
  }, [shouldBoost]);
  const displayPathLength = useTransform([pathLength, boostProgress], ([p, b]) => Math.max(p, b));

  // Fire onReachCenter when scroll crosses 0.995 (line has bent fully right to center)
  const hasFiredRef = useRef(false);
  useEffect(() => {
    if (!onReachCenter) return;
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v >= 0.995 && !hasFiredRef.current) {
        hasFiredRef.current = true;
        onReachCenter(true);
      } else if (v < 0.98 && hasFiredRef.current) {
        hasFiredRef.current = false;
        onReachCenter(false);
      }
    });
    return unsubscribe;
  }, [onReachCenter, scrollYProgress]);

  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!innerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setSize({ w: entries[0].contentRect.width, h: entries[0].contentRect.height });
    });
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  const isActivated = propIsActivated !== undefined ? propIsActivated : isPowerFlowComplete;
  const glow = isActivated ? 'rgba(255,90,0,0.9)' : 'rgba(0,0,0,0.15)';
  const stroke = isActivated ? '#FF5A00' : 'rgba(0,0,0,0.12)';

  if (size.w === 0) {
    return <div ref={innerRef} className={`absolute pointer-events-none ${className}`} />;
  }

  // Parse original viewBox (e.g., "0 0 100 1000")
  const [, , origW, origH] = viewBox.split(' ').map(Number);
  const scaleX = size.w / origW;
  const scaleY = size.h / origH;

  const scaledPathD = pathD.replace(/([M|L|H|V])\s*([0-9.]+)?(?:\s+([0-9.]+))?/g, (match, cmd, arg1, arg2) => {
    if (cmd === 'M' || cmd === 'L') return `${cmd} ${arg1 * scaleX} ${arg2 * scaleY}`;
    if (cmd === 'V') return `V ${arg1 * scaleY}`;
    if (cmd === 'H') return `H ${arg1 * scaleX}`;
    return match;
  });

  const scaledComponents = components.map(c => ({
    ...c,
    cx: c.cx * scaleX,
    cy: c.cy * scaleY
  }));

  return (
    <div ref={innerRef} className={`absolute pointer-events-none ${className}`}>
      <svg viewBox={`0 0 ${size.w} ${size.h}`} fill="none" strokeLinecap="square" strokeLinejoin="miter" className="w-full h-full overflow-visible">
        <motion.path 
          d={scaledPathD} 
          stroke="rgba(0,0,0,0.07)" 
          strokeWidth="2" 
          style={{ 
            pathLength: isActivated ? maxBackgroundLength : 0,
            opacity: isActivated ? 0.3 : 0
          }}
        />
        {/* Glow Layer (Pulsing) */}
        {isActivated && (
          <motion.path 
            d={scaledPathD} 
            stroke={glow} 
            strokeWidth="8"
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ pathLength: displayPathLength }} 
          />
        )}
        <motion.path 
          d={scaledPathD} 
          stroke={stroke} 
          strokeWidth="1.5"
          style={{ pathLength: displayPathLength }} 
        />
        
        {/* Moving Current Pulse (Circles/Electrons) */}
        {isActivated && (
          <motion.path
            d={scaledPathD}
            stroke="#FF5A00"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="0 40"
            animate={{ strokeDashoffset: [40, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ pathLength: displayPathLength }}
          />
        )}
      </svg>
      {scaledComponents.map((comp, i) => (
        <CircuitComponent key={i} type={comp.type} cx={comp.cx} cy={comp.cy}
          pathLength={displayPathLength} threshold={comp.threshold} isPowered={isActivated} />
      ))}
    </div>
  );
};

// ─── Hero → Section 2 Bridge ──────────────────────────────────────────────────
// Renders as a thin centred column between Hero and WhyItWorks.
// Draws a vertical glow line top→bottom when isHeroBridgeComplete is true,
// then fires onBridgeComplete so Section 2 knows to turn on its circuit.
export const HeroBridge = ({ onBridgeComplete }) => {
  const { isHeroBridgeComplete } = useCircuit();
  const [fired, setFired] = useState(false);

  // Reset when bridge gate drops
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isHeroBridgeComplete) setFired(false);
  }, [isHeroBridgeComplete]);

  const pathD = "M 40 0 V 100";
  const viewBox = "0 0 80 100";

  return (
    <div
      className="relative w-full pointer-events-none overflow-visible hidden lg:block"
      style={{ height: '80px', zIndex: 20 }}
    >
      {/* Ghost track — always visible, very faint */}
      <svg
        viewBox={viewBox}
        fill="none"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 80, height: 80, top: 0, overflow: 'visible' }}
      >
        <path d={pathD} stroke="rgba(0,0,0,0.07)" strokeWidth="2.5" strokeLinecap="square" />

        {/* Live orange trace */}
        {isHeroBridgeComplete && (
          <motion.path
            d={pathD}
            stroke="#FF5A00"
            strokeWidth="2.5"
            strokeLinecap="square"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,90,0,0.9))' }}
            onAnimationComplete={() => {
              if (!fired) {
                setFired(true);
                onBridgeComplete?.();
              }
            }}
          />
        )}

        {/* Repeating pulse along the bridge when live */}
        {isHeroBridgeComplete && (
          <motion.path
            d={pathD}
            stroke="white"
            strokeWidth="6"
            strokeDasharray="1, 100"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 101 }}
            animate={{ strokeDashoffset: -101 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 6px #FF5A00)' }}
          />
        )}

        {/* Junction dot at top (hero end) */}
        {isHeroBridgeComplete && (
          <motion.circle
            cx="40" cy="0" r="5"
            fill="#FF5A00"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ filter: 'drop-shadow(0 0 8px #FF5A00)' }}
          />
        )}

        {/* Junction dot at bottom (section 2 start) */}
        {fired && (
          <motion.circle
            cx="40" cy="100" r="5"
            fill="#FF5A00"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ filter: 'drop-shadow(0 0 8px #FF5A00)' }}
          />
        )}
      </svg>
    </div>
  );
};

// ─── Power Switch ─────────────────────────────────────────────────────────────
export const PowerSwitch = ({ className = "" }) => {
  const { isPowered, togglePower } = useCircuit();

  return (
    <div className={`relative ${className}`}>
      {/* Attention pulse when NOT powered */}
      {!isPowered && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-xl z-0"
            style={{ backgroundColor: '#7B2CBF' }}
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 rounded-xl z-0"
            style={{ backgroundColor: '#7B2CBF' }}
          />
        </>
      )}

      <motion.button onClick={togglePower} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}
        className={`relative flex items-center gap-3 pl-4 pr-6 py-3 rounded-full border-2 cursor-pointer overflow-hidden transition-all duration-500 z-20 font-mono text-sm font-bold uppercase tracking-widest ${isPowered
            ? 'border-[var(--color-accent)] text-[var(--color-accent)] shadow-[0_0_35px_rgba(255,90,0,0.4)]'
            : 'border-black/40 text-black hover:border-black bg-white/80 backdrop-blur-sm'
          }`}
      >
        <motion.div className="absolute inset-0 bg-[var(--color-accent)]/8 pointer-events-none"
          animate={{ opacity: isPowered ? 1 : 0 }} transition={{ duration: 0.4 }} />
        {/* Battery icon */}
        <svg width="34" height="17" viewBox="0 0 34 17" fill="none" className="relative z-10 flex-shrink-0">
          <rect x="0.5" y="0.5" width="28" height="16" rx="3" stroke={isPowered ? '#FF5A00' : 'currentColor'} strokeWidth="1.5" fill="none" />
          <path d="M29.5 5.5 H32 V11.5 H29.5" stroke={isPowered ? '#FF5A00' : 'currentColor'} strokeWidth="1.5" fill={isPowered ? '#FF5A00' : 'currentColor'} />
          <motion.rect x="3" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.3 }} transition={{ delay: 0 }} />
          <motion.rect x="11" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.3 }} transition={{ delay: 0.1 }} />
          <motion.rect x="19" y="4" width="6" height="9" rx="1.5" animate={{ fill: isPowered ? '#FF5A00' : '#ccc', opacity: isPowered ? 1 : 0.2 }} transition={{ delay: 0.2 }} />
        </svg>
        <span className="relative z-10 whitespace-nowrap">
          {isPowered ? '⚡ Maker Mindset On' : 'Power your creativity'}
        </span>
      </motion.button>
    </div>
  );
};

// ─── LED Indicator ────────────────────────────────────────────────────────────
export const LEDIndicator = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  return (
    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: false }}
      className={`absolute w-4 h-4 rounded-full border ${className} ${isPowered ? 'bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_20px_rgba(255,90,0,1)]' : 'bg-gray-300 border-black/20'
        } transition-all duration-500`} />
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
  [{ t: '// ', c: '#6B7280' }, { t: 'System: ', c: '#6B7280' }, { t: 'MAKER MINDSET ON ✓', c: '#34D399' }],
  [],
  [{ t: 'const ', c: '#C084FC' }, { t: 'power', c: '#60A5FA' }, { t: ' = ', c: '#e5e7eb' }, { t: 'true', c: '#34D399' }],
  [{ t: 'drone', c: '#34D399' }, { t: '.deploy', c: '#FCD34D' }, { t: '({ mode: ', c: '#e5e7eb' }, { t: '"BUILD"', c: '#FF5A00' }, { t: ' })', c: '#e5e7eb' }],
  [{ t: 'makers', c: '#34D399' }, { t: '.founding', c: '#FCD34D' }, { t: ' = ', c: '#e5e7eb' }, { t: '150', c: '#FF5A00' }],
  [{ t: 'future', c: '#34D399' }, { t: '.belongs_to', c: '#FCD34D' }, { t: '(', c: '#e5e7eb' }, { t: '"MAKERS"', c: '#FF5A00' }, { t: ')', c: '#e5e7eb' }],
];

export const FloatingCodeWidget = ({ className = "" }) => {
  const { isPowered, togglePower } = useCircuit();
  const [shown, setShown] = useState(0);
  const lines = isPowered ? LINES_ON : LINES_OFF;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${isPowered ? 'bg-green-400' : 'bg-green-500/25'}`} />
        <span className="ml-2 text-gray-500 text-[10px] tracking-wider">circuit.js</span>
        {isPowered && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-green-400 text-[10px]">● running</motion.span>}
      </div>
      {/* Code lines — fixed height to prevent layout shift */}
      <div className="p-4 pb-3 space-y-[3px] h-[132px] overflow-hidden">
        {lines.slice(0, shown).map((line, i) => (
          <div key={`${isPowered}-${i}`} className="flex gap-3">
            <span className="text-gray-600 w-3 text-right select-none">{i + 1}</span>
            <span className="flex flex-wrap items-center">
              {line.map((tok, j) => <span key={j} style={{ color: tok.c }}>{tok.t}</span>)}
              {i === shown - 1 && shown < lines.length && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-[6px] h-3 bg-[var(--color-accent)] ml-0.5" />
              )}
            </span>
          </div>
        ))}
      </div>
      {/* ► RUN button — this IS the power toggle */}
      <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-3 relative">
        <motion.button onClick={togglePower} whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.04 }}
          animate={!isPowered ? { boxShadow: ["0 0 0px transparent", "0 0 20px rgba(123, 44, 191, 0.6)", "0 0 0px transparent"] } : {}}
          transition={!isPowered ? { duration: 1.5, repeat: Infinity } : {}}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest transition-all duration-400 ${isPowered
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
    style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
);

// ─── Background Mechanics ──────────────────────────────────────────────────
// A large, semi-transparent background SVG with gears and linkage instead of a boxed widget
export const BackgroundMechanics = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  const angleA = useRef(0);
  const velA = useRef(0);
  const rafRef = useRef(null);
  const [displayAngle, setDisplayAngle] = useState(0);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  // Helper for gear teeth
  const buildGearPath = (teeth, R, r) => {
    const pts = [];
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i * Math.PI) / teeth;
      const rad = i % 2 === 0 ? R : r;
      pts.push(`${(rad * Math.cos(a)).toFixed(2)},${(rad * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(' ');
  };

  const RATIO = 3.5;

  useEffect(() => {
    const loop = () => {
      if (!dragging.current) {
        velA.current *= 0.98;
        if (Math.abs(velA.current) < 0.02) velA.current = 0;
        angleA.current += velA.current;
      }
      setDisplayAngle(angleA.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    const move = (ev) => {
      const dx = ev.clientX - lastX.current;
      const dt = Math.max(1, Date.now() - lastTime.current);
      velA.current = (dx * 1.5) / dt * 10;
      angleA.current += dx * 0.8;
      lastX.current = ev.clientX;
      lastTime.current = Date.now();
    };
    const up = () => { dragging.current = false; window.removeEventListener('mousemove', move); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up, { once: true });
  };

  const aRad = (displayAngle * Math.PI) / 180;
  const angleB = -displayAngle * RATIO;

  const CRANK_R = 120;
  const ROD_L = 400;
  const crankX = 300 + CRANK_R * Math.cos(aRad);
  const crankY = 300 + CRANK_R * Math.sin(aRad);
  const sliderX = crankX + Math.sqrt(Math.max(0, ROD_L * ROD_L - (crankY - 800) ** 2));

  const accent = isPowered ? 'rgba(255,90,0,0.15)' : 'rgba(0,0,0,0.03)';
  const stroke = isPowered ? 'rgba(255,90,0,0.3)' : 'rgba(0,0,0,0.06)';

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="opacity-40">
        {/* Large Gear */}
        <g transform={`translate(200, 300) rotate(${displayAngle})`} style={{ pointerEvents: 'all', cursor: 'grab' }} onMouseDown={handleMouseDown}>
          <circle cx="0" cy="0" r="280" fill="transparent" />
          <polygon points={buildGearPath(24, 250, 230)} fill="none" stroke={stroke} strokeWidth="4" />
          <circle cx="0" cy="0" r="100" fill="none" stroke={stroke} strokeWidth="3" />
          <circle cx="0" cy="0" r="15" fill={stroke} />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <line key={a} x1={15 * Math.cos(a * Math.PI / 180)} y1={15 * Math.sin(a * Math.PI / 180)}
              x2={100 * Math.cos(a * Math.PI / 180)} y2={100 * Math.sin(a * Math.PI / 180)} stroke={stroke} strokeWidth="4" />
          ))}
        </g>

        {/* Small Gear */}
        <g transform={`translate(515, 300) rotate(${angleB})`}>
          <polygon points={buildGearPath(10, 85, 70)} fill="none" stroke={stroke} strokeWidth="3" />
          <circle cx="0" cy="0" r="25" fill="none" stroke={stroke} strokeWidth="2" />
        </g>

        {/* Crank-slider */}
        <line x1="200" y1="300" x2={crankX - 100} y2={crankY} stroke={stroke} strokeWidth="12" strokeLinecap="round" />
        <circle cx={crankX - 100} cy={crankY} r="15" fill={accent} stroke={stroke} strokeWidth="4" />

        {/* Connecting rod */}
        <line x1={crankX - 100} y1={crankY} x2={sliderX - 100} y2="800" stroke={stroke} strokeWidth="8" strokeLinecap="round" />

        {/* Piston block */}
        <rect x={sliderX - 140} y="780" width="80" height="40" rx="10" fill={accent} stroke={stroke} strokeWidth="4" />
      </svg>
    </div>
  );
};

// ─── Oscilloscope Band ────────────────────────────────────────────────────────
// Full-width animated waveform band — design element, not a boxed sim
export const OscilloscopeBand = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  const [t, setT] = useState(0);
  const rafRef = useRef(null);
  const W = 1200, H = 80;
  const accent = isPowered ? '#FF5A00' : '#22c55e';

  useEffect(() => {
    const loop = () => {
      setT(prev => prev + 0.05);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pts = Array.from({ length: W }, (_, x) => {
    const phase = (x / 150) * Math.PI * 2 - t;
    const envelope = Math.sin((x / W) * Math.PI); // fade at edges
    const y = H / 2 - Math.sin(phase) * (H * 0.3) * envelope;
    return `${x},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <div className={`w-full overflow-hidden opacity-20 pointer-events-none ${className}`}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke={accent} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
        <polyline points={pts} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: isPowered ? `drop-shadow(0 0 8px ${accent})` : 'none' }} />
      </svg>
    </div>
  );
};

// ─── Multimeter Stat ──────────────────────────────────────────────────────────
// A single stat styled as a multimeter LCD reading
export const MultimeterStat = ({ value, unit, label, delay = 0, className = "" }) => {
  const { isPowered } = useCircuit();
  const [displayed, setDisplayed] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let start = null;
    let frame;
    const duration = 1400;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p < 0.1 ? Math.random() * value : value * (1 - Math.pow(1 - p, 3));
      setDisplayed(Math.round(eased));
      if (p < 1) { frame = requestAnimationFrame(animate); }
      else { setDisplayed(value); setSettled(true); }
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(animate); }, delay * 1000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [value, delay]);

  const accent = isPowered ? '#FF5A00' : '#64748b';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
      className={`${className} rounded-xl p-5 font-mono`}
      style={{ background: '#0D1117', border: `1px solid ${settled ? accent + '40' : 'rgba(255,255,255,0.06)'}`, transition: 'border-color 0.5s' }}
    >
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-bold tracking-tighter tabular-nums transition-colors duration-500"
          style={{ color: accent, fontFamily: 'monospace', textShadow: settled && isPowered ? `0 0 20px ${accent}60` : 'none' }}>
          {displayed.toLocaleString()}
        </span>
        <span className="text-lg font-bold" style={{ color: accent + 'aa' }}>{unit}</span>
      </div>
      <div className="h-1 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full rounded-full" style={{ background: accent }}
          initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (displayed / value) * 100)}%` }}
          viewport={{ once: true }} transition={{ delay: delay + 0.2, duration: 1.2 }}
        />
      </div>
      <div className="text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
    </motion.div>
  );
};

// ─── Drag-to-Build CTA (Closed Loop SVG) ──────────────────────────────────────
const SVG_COMPONENTS = {
  led: (
    <g>
      <polygon points="-9,-7 -9,7 7,0" fill="#FF5A00" />
      <line x1="7" y1="-7" x2="7" y2="7" stroke="#FF5A00" strokeWidth="2.5" />
      <line x1="-15" y1="0" x2="-9" y2="0" stroke="#FF5A00" strokeWidth="2" />
      <line x1="7" y1="0" x2="15" y2="0" stroke="#FF5A00" strokeWidth="2" />
    </g>
  ),
  resistor: (
    <g>
      <line x1="-18" y1="0" x2="-10" y2="0" stroke="#FFB347" strokeWidth="2" />
      <rect x="-10" y="-6" width="20" height="12" rx="2" fill="none" stroke="#FFB347" strokeWidth="2" />
      <line x1="-5" y1="-6" x2="-5" y2="6" stroke="#FFB347" strokeWidth="2.5" />
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#FFB347" strokeWidth="2.5" />
      <line x1="5" y1="-6" x2="5" y2="6" stroke="#FFB347" strokeWidth="2.5" />
      <line x1="10" y1="0" x2="18" y2="0" stroke="#FFB347" strokeWidth="2" />
    </g>
  ),
  capacitor: (
    <g>
      <line x1="-18" y1="0" x2="-4" y2="0" stroke="#60A5FA" strokeWidth="2" />
      <line x1="-4" y1="-9" x2="-4" y2="9" stroke="#60A5FA" strokeWidth="3" />
      <line x1="4" y1="-9" x2="4" y2="9" stroke="#60A5FA" strokeWidth="3" />
      <line x1="4" y1="0" x2="18" y2="0" stroke="#60A5FA" strokeWidth="2" />
    </g>
  )
};

const SNAP_ITEMS = [
  { id: 'led', label: 'LED', color: '#FF5A00' },
  { id: 'resistor', label: '220Ω', color: '#FFB347' },
  { id: 'capacitor', label: '10µF', color: '#60A5FA' },
];

export const DragToBuildCTA = ({ className = "" }) => {
  const { isPowered } = useCircuit();
  const [filled, setFilled] = useState({ led: false, resistor: false, capacitor: false });
  const [dragging, setDragging] = useState(null);

  const complete = filled.led && filled.resistor && filled.capacitor;
  const accent = isPowered ? '#FF5A00' : '#6366f1';

  const handleDrop = (e, id) => {
    e.preventDefault();
    if (dragging === id) setFilled(prev => ({ ...prev, [id]: true }));
    setDragging(null);
  };

  return (
    <div className={`${className} flex flex-col items-center gap-12`}>
      <p className="font-mono text-sm uppercase tracking-widest text-white/40 text-center">
        {complete ? '⚡ Circuit closed — system ready' : 'Complete the circuit to continue'}
      </p>

      <div className="flex gap-8">
        {SNAP_ITEMS.map(comp => !filled[comp.id] && (
          <motion.div key={comp.id}
            draggable
            onDragStart={() => setDragging(comp.id)}
            onDragEnd={() => setDragging(null)}
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex flex-col items-center gap-3 cursor-grab select-none"
          >
            <svg width="40" height="40" viewBox="-20 -20 40 40">
              {SVG_COMPONENTS[comp.id]}
            </svg>
            <span className="text-[10px] font-mono text-white/40 tracking-wider">{comp.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="relative w-full max-w-sm" style={{ height: '160px' }}>
        <svg width="100%" height="100%" viewBox="0 0 300 160" className="overflow-visible">
          <rect x="20" y="20" width="260" height="120" rx="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="4 4" />

          <motion.rect x="20" y="20" width="260" height="120" rx="10" fill="none" stroke={accent} strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: complete ? 1 : 0, opacity: complete ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
          />

          <g transform="translate(150, 20)" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'led')} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
            <rect x="-30" y="-15" width="60" height="30" fill="black" stroke={filled.led ? 'transparent' : 'rgba(255,255,255,0.2)'} strokeWidth="1" strokeDasharray="2 2" />
            {filled.led && SVG_COMPONENTS.led}
          </g>

          <g transform="translate(280, 80) rotate(90)" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'resistor')} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
            <rect x="-30" y="-15" width="60" height="30" fill="black" stroke={filled.resistor ? 'transparent' : 'rgba(255,255,255,0.2)'} strokeWidth="1" strokeDasharray="2 2" />
            {filled.resistor && SVG_COMPONENTS.resistor}
          </g>

          <g transform="translate(20, 80) rotate(90)" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'capacitor')} style={{ cursor: 'pointer', pointerEvents: 'all' }}>
            <rect x="-30" y="-15" width="60" height="30" fill="black" stroke={filled.capacitor ? 'transparent' : 'rgba(255,255,255,0.2)'} strokeWidth="1" strokeDasharray="2 2" />
            {filled.capacitor && SVG_COMPONENTS.capacitor}
          </g>

          <g transform="translate(150, 140)">
            <circle cx="0" cy="0" r="12" fill={complete ? accent : "rgba(255,255,255,0.1)"} />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fill="black" fontWeight="bold">PWR</text>
          </g>
        </svg>
      </div>

      <motion.a href="#experience"
        animate={{
          boxShadow: complete ? `0 0 60px ${accent}60, 0 0 20px ${accent}40` : '0 0 0px transparent',
          borderColor: complete ? accent : 'rgba(255,255,255,0.2)',
          color: complete ? accent : 'white',
        }}
        transition={{ duration: 0.5 }}
        className="px-12 py-5 rounded-full border-2 font-bold text-lg uppercase tracking-widest transition-colors duration-300 cursor-hover z-10"
        style={{ background: complete ? accent + '15' : 'transparent', pointerEvents: complete ? 'all' : 'none', opacity: complete ? 1 : 0.4 }}
      >
        {complete ? '⚡ Apply For 2026' : 'Circuit Open'}
      </motion.a>
    </div>
  );
};

