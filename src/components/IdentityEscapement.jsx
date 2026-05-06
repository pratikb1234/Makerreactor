import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCircuit } from '../context/CircuitContext';

const ITEMS = [
  {
    identity: "Curiosity",
    method: "Open exploration",
    desc: "Every maker journey begins with a question. We design projects with no single right answer, so children learn to explore, test, notice and discover.",
  },
  {
    identity: "Precision",
    method: "Measurement and tolerances",
    desc: "A difference of 0.2mm can separate a working part from scrap. We train the eye and the hand together.",
  },
  {
    identity: "Persistence",
    method: "Iterative design",
    desc: "Failure becomes useful data. Children build, test, break, repair and improve until the idea becomes stronger.",
  },
  {
    identity: "Collaboration",
    method: "Team challenges",
    desc: "Children learn that meaningful things are rarely built alone. They plan, divide roles, negotiate and build together.",
  },
  {
    identity: "Systems thinking",
    method: "Complex builds",
    desc: "Children begin to see how one choice affects the whole system. Structure, mechanism, electronics and code start working together.",
  },
  {
    identity: "Resourcefulness",
    method: "Material mastery",
    desc: "A maker learns to see possibility in available materials. Cardboard, wood, sensors, motors and scrap become tools for solving.",
  },
  {
    identity: "Confidence",
    method: "Make and showcase",
    desc: "Children do not just build quietly. They present, explain choices, answer questions and slowly become confident creators.",
  },
  {
    identity: "Adaptability",
    method: "Real constraints",
    desc: "Materials fail, motors slip, ideas change and time runs out. Children learn to adjust without losing momentum.",
  },
];

const TAU = Math.PI * 2;
const N = ITEMS.length;
const CANVAS_W = 1200;
const CANVAS_H = 820;

// BRAND THEME: Electric Orange & Technical Black
const THEME = {
  bg: "#000000",
  bg2: "#0A0A0A",
  accent: "#FF5A00", // Electric Orange
  accentLight: "#FF8A4D",
  accentDark: "#993600",
  text: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.6)",
  line: "rgba(255, 90, 0, 0.2)",
  panel: "rgba(10, 10, 10, 0.8)",
  ruby: "#E84B36",
};

const WHEEL = {
  cx: 600,
  cy: 420,
  root: 112,
  tip: 162,
  hub: 34,
  teeth: 20,
};

const ANCHOR = {
  pivotX: 600,
  pivotY: 222,
  forkY: 232,
  stemY: 292,
  leftContactAngle: -2.18,
  rightContactAngle: -0.96,
};

const PENDULUM = {
  pivotX: 600,
  pivotY: 90,
  length: 470,
  bob: 42,
};

function mod(n, m) {
  return ((n % m) + m) % m;
}

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function line(ctx, x1, y1, x2, y2, color, width = 2, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function circle(ctx, x, y, r, fill, stroke, width = 1) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function rotPoint(origin, p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: origin.x + p.x * c - p.y * s,
    y: origin.y + p.x * s + p.y * c,
  };
}

function getPendulumRodPoint(distanceFromPivot, angle) {
  return {
    x: PENDULUM.pivotX + Math.sin(angle) * distanceFromPivot,
    y: PENDULUM.pivotY + Math.cos(angle) * distanceFromPivot,
  };
}

function drawBackground(ctx, isPowered) {
  const g = ctx.createRadialGradient(600, 350, 80, 600, 350, 680);
  g.addColorStop(0, "#080808");
  g.addColorStop(0.55, THEME.bg2);
  g.addColorStop(1, THEME.bg);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Blueprint Grid
  ctx.save();
  ctx.globalAlpha = isPowered ? 0.08 : 0.04;
  ctx.strokeStyle = THEME.accent;
  ctx.lineWidth = 1;

  for (let x = 0; x <= CANVAS_W; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }

  for (let y = 0; y <= CANVAS_H; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
  ctx.restore();

  // Header Area
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fillRect(0, 0, CANVAS_W, 60);
  ctx.restore();

  ctx.save();
  ctx.font = "700 12px 'Space Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = isPowered ? THEME.accent : "rgba(255,255,255,0.2)";
  ctx.letterSpacing = "4px";
  ctx.fillText(
    "MAKER IDENTITY ENGINE // BITS & STUDIOS V2.0",
    600,
    35
  );
  ctx.restore();
}

function drawEscapeWheel(ctx, rot, isPowered) {
  const { cx, cy, root, tip, hub, teeth } = WHEEL;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  const mainColor = isPowered ? THEME.accent : "#333";
  const lightColor = isPowered ? THEME.accentLight : "#444";
  const darkColor = isPowered ? THEME.accentDark : "#222";

  const grad = ctx.createRadialGradient(-50, -48, 18, 0, 0, tip);
  grad.addColorStop(0, lightColor);
  grad.addColorStop(0.4, mainColor);
  grad.addColorStop(1, darkColor);

  if (isPowered) {
    ctx.shadowColor = "rgba(255, 90, 0, 0.4)";
    ctx.shadowBlur = 20;
  }
  
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * TAU;
    const p0 = [Math.cos(a - 0.18) * root, Math.sin(a - 0.18) * root];
    const p1 = [Math.cos(a - 0.025) * tip, Math.sin(a - 0.025) * tip];
    const p2 = [Math.cos(a + 0.12) * (tip - 12), Math.sin(a + 0.12) * (tip - 12)];
    const p3 = [Math.cos(a + 0.24) * root, Math.sin(a + 0.24) * root];

    if (i === 0) ctx.moveTo(p0[0], p0[1]);
    else ctx.lineTo(p0[0], p0[1]);

    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
  }
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = isPowered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Spoke Logic
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    ctx.save();
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(hub + 10, -7);
    ctx.lineTo(root - 25, -12);
    ctx.lineTo(root - 15, 12);
    ctx.lineTo(hub + 10, 7);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = isPowered ? "rgba(255,90,0,0.2)" : "transparent";
    ctx.stroke();
    ctx.restore();
  }

  circle(ctx, 0, 0, hub, darkColor, isPowered ? THEME.accent : "#444", 2);
  circle(ctx, 0, 0, 8, "#000");

  ctx.restore();
}

function drawPendulum(ctx, pendulumAngle, isPowered) {
  const top = { x: PENDULUM.pivotX, y: PENDULUM.pivotY };
  const bob = getPendulumRodPoint(PENDULUM.length, pendulumAngle);

  ctx.save();
  ctx.globalAlpha = 0.1;
  line(ctx, top.x, top.y, top.x, top.y + PENDULUM.length + 18, THEME.accent, 1, 1);
  ctx.restore();

  const c = isPowered ? THEME.accent : "#444";
  const cLight = isPowered ? THEME.accentLight : "#555";

  line(ctx, top.x, top.y, bob.x, bob.y, c, 5, 1);
  circle(ctx, top.x, top.y, 10, "#000", c, 2);

  const grad = ctx.createRadialGradient(bob.x - 12, bob.y - 14, 5, bob.x, bob.y, PENDULUM.bob);
  grad.addColorStop(0, cLight);
  grad.addColorStop(1, THEME.accentDark);

  if (isPowered) {
    ctx.shadowColor = "rgba(255, 90, 0, 0.3)";
    ctx.shadowBlur = 30;
  }
  circle(ctx, bob.x, bob.y, PENDULUM.bob, grad, isPowered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)", 2);
  ctx.shadowBlur = 0;
}

function drawAnchor(ctx, anchorAngle, pendulumAngle, lockedSide, isPowered) {
  const pivot = { x: ANCHOR.pivotX, y: ANCHOR.pivotY };
  const color = isPowered ? THEME.accent : "#333";

  function wheelContact(angle) {
    return {
      x: WHEEL.cx + Math.cos(angle) * (WHEEL.tip - 7),
      y: WHEEL.cy + Math.sin(angle) * (WHEEL.tip - 7),
    };
  }

  const leftContactBase = wheelContact(ANCHOR.leftContactAngle);
  const rightContactBase = wheelContact(ANCHOR.rightContactAngle);
  const stemBase = rotPoint(pivot, { x: 0, y: ANCHOR.stemY - ANCHOR.pivotY }, anchorAngle);

  const leftContact = {
    x: leftContactBase.x + Math.sin(anchorAngle) * 10,
    y: leftContactBase.y + Math.cos(anchorAngle) * 4,
  };

  const rightContact = {
    x: rightContactBase.x + Math.sin(anchorAngle) * 10,
    y: rightContactBase.y + Math.cos(anchorAngle) * 4,
  };

  const rodAtFork = getPendulumRodPoint(ANCHOR.forkY - PENDULUM.pivotY, pendulumAngle);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(pivot.x, pivot.y);
  ctx.lineTo(stemBase.x, stemBase.y);
  ctx.moveTo(stemBase.x, stemBase.y);
  ctx.quadraticCurveTo(WHEEL.cx - 60, WHEEL.cy - 160, leftContact.x, leftContact.y);
  ctx.moveTo(stemBase.x, stemBase.y);
  ctx.quadraticCurveTo(WHEEL.cx + 60, WHEEL.cy - 160, rightContact.x, rightContact.y);
  ctx.stroke();

  // Pallet Stones (The escapement action points)
  function drawPallet(pt, side) {
    const active = lockedSide === side && isPowered;
    ctx.save();
    ctx.translate(pt.x, pt.y);
    roundedRect(ctx, -15, -6, 30, 12, 3);
    ctx.fillStyle = active ? "#fff" : (isPowered ? THEME.accentDark : "#222");
    ctx.fill();
    ctx.restore();
  }
  drawPallet(leftContact, "left");
  drawPallet(rightContact, "right");

  circle(ctx, pivot.x, pivot.y, 14, "#000", color, 2);
  ctx.restore();
}

function drawRadialLabels(ctx, active, isPowered) {
  const baseRadius = 260;
  ctx.save();

  ITEMS.forEach((item, i) => {
    const a = -Math.PI / 2 + (i / N) * TAU;
    const isActive = i === active;
    const radius = isActive ? baseRadius + 15 : baseRadius;
    const x = WHEEL.cx + Math.cos(a) * radius;
    const y = WHEEL.cy + Math.sin(a) * radius;

    // Label
    ctx.font = `${isActive ? '800' : '500'} ${isActive ? 16 : 13}px 'Space Grotesk', sans-serif`;
    const m = ctx.measureText(item.identity.toUpperCase());
    const w = m.width + 30;
    const h = 30;

    if (isActive && isPowered) {
      ctx.fillStyle = "rgba(255, 90, 0, 0.1)";
      roundedRect(ctx, x - w/2, y - h/2, w, h, 15);
      ctx.fill();
      ctx.strokeStyle = THEME.accent;
      ctx.stroke();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = isActive && isPowered ? THEME.accent : "rgba(255,255,255,0.3)";
    ctx.fillText(item.identity.toUpperCase(), x, y);

    // Indicator Dot
    const dr = 205;
    const dx = WHEEL.cx + Math.cos(a) * dr;
    const dy = WHEEL.cy + Math.sin(a) * dr;
    circle(ctx, dx, dy, isActive ? 5 : 3, isActive && isPowered ? THEME.accent : "rgba(255,255,255,0.1)");
  });
  ctx.restore();
}

export default function IdentityEscapement() {
  const { isPowered } = useCircuit();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);
  const machineRef = useRef({
    startedAt: performance.now(),
    tickOffset: 0,
    lastTick: -1,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const rect = wrapRef.current.getBoundingClientRect();
      const scale = Math.min(rect.width / CANVAS_W, 1);
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${CANVAS_W * scale}px`;
      canvas.style.height = `${CANVAS_H * scale}px`;
      canvas.width = CANVAS_W * dpr;
      canvas.height = CANVAS_H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    let raf;
    function loop(now) {
      const m = machineRef.current;
      // If not powered, the clock stops or stays static
      const elapsed = isPowered ? now - m.startedAt : 0; 

      const halfBeatMs = 2000;
      const beatRaw = elapsed / halfBeatMs;
      const tick = Math.floor(beatRaw) + m.tickOffset;

      const pendulumAngle = Math.sin(beatRaw * Math.PI) * 0.22;
      const anchorAngle = pendulumAngle * 0.6;

      const toothStep = TAU / WHEEL.teeth;
      const beatPhase = beatRaw % 1;
      const releaseProgress = beatPhase < 0.2 ? 1 - Math.pow(1 - beatPhase / 0.2, 3) : 1;
      
      const wheelRot = (tick - 1) * toothStep + releaseProgress * toothStep;
      const nextActive = mod(tick, N);
      const lockedSide = tick % 2 === 0 ? "left" : "right";

      if (isPowered && nextActive !== m.lastTick) {
        m.lastTick = nextActive;
        setActive(nextActive);
      }

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawBackground(ctx, isPowered);
      drawRadialLabels(ctx, active, isPowered);
      drawPendulum(ctx, pendulumAngle, isPowered);
      drawEscapeWheel(ctx, wheelRot, isPowered);
      drawAnchor(ctx, anchorAngle, pendulumAngle, lockedSide, isPowered);

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isPowered, active]);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-grotesk text-4xl md:text-6xl font-black text-white mb-4"
          >
            MAKER <span className="text-[#FF5A00]">IDENTITY</span> ENGINE
          </motion.h2>
          <p className="font-mono text-xs md:text-sm text-white/40 tracking-[0.3em] uppercase">
            Escapement Mechanism // 8 Core Competencies
          </p>
        </div>

        {/* Engine Visualization */}
        <div ref={wrapRef} className="w-full flex justify-center relative">
          <canvas ref={canvasRef} className="block max-w-full cursor-crosshair" />
          
          {/* Overlay Grid lines for extra "Technical" look */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />
        </div>

        {/* Description Panel - Glassmorphism */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mt-[-40px] relative z-10 w-full max-w-3xl p-8 md:p-12 rounded-[40px] bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-[#FF5A00] text-black font-mono text-[10px] font-black rounded-full">
              {ITEMS[active].method.toUpperCase()}
            </div>

            <h3 className="font-grotesk text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              {ITEMS[active].identity}
            </h3>
            
            <p className="font-grotesk text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              {ITEMS[active].desc}
            </p>

            {/* Status Indicator */}
            <div className="mt-8 flex justify-center items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-[#FF5A00] animate-pulse' : 'bg-white/20'}`} />
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                System {isPowered ? 'Synchronized' : 'Standby'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Override Dots */}
        <div className="mt-12 flex gap-3">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === active 
                  ? 'w-12 bg-[#FF5A00] shadow-[0_0_15px_#FF5A00]' 
                  : 'w-3 bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
