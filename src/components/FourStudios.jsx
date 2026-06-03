import { useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const studios = [
  { num: '01', title: 'TECH', desc: 'Engineering, electronics, and code. Building things that work.' },
  { num: '02', title: 'DESIGN', desc: 'Form, craft, and iteration. Building things well.' },
  { num: '03', title: 'PRESENTATION', desc: 'Demos, writing, and speaking. Making work understood.' },
  { num: '04', title: 'ENTREPRENEURSHIP', desc: 'Solving real problems. Building things that matter.' },
];

/* ── Generate neural network topology ── */
function generateNetwork() {
  const layers = [
    // Layer 0: Input — 4 studio neurons (spaced vertically)
    [
      { x: 60, y: 80, label: 'TECH', studio: 0 },
      { x: 60, y: 200, label: 'DESIGN', studio: 1 },
      { x: 60, y: 320, label: 'PRES.', studio: 2 },
      { x: 60, y: 440, label: 'ENTRE.', studio: 3 },
    ],
    // Layer 1: Hidden — 6 neurons
    [
      { x: 280, y: 60 },
      { x: 280, y: 150 },
      { x: 280, y: 240 },
      { x: 280, y: 330 },
      { x: 280, y: 420 },
      { x: 280, y: 480 },
    ],
    // Layer 2: Hidden — 5 neurons
    [
      { x: 480, y: 100 },
      { x: 480, y: 200 },
      { x: 480, y: 300 },
      { x: 480, y: 400 },
      { x: 480, y: 460 },
    ],
    // Layer 3: Hidden — 4 neurons
    [
      { x: 660, y: 140 },
      { x: 660, y: 230 },
      { x: 660, y: 320 },
      { x: 660, y: 420 },
    ],
    // Layer 4: Output — 1 neuron
    [
      { x: 860, y: 260, label: 'COMPLETE\nMAKER', isOutput: true },
    ],
  ];

  // Generate connections between adjacent layers
  const connections = [];
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l].length; i++) {
      for (let j = 0; j < layers[l + 1].length; j++) {
        // Not fully connected — skip some for visual clarity
        const dist = Math.abs(layers[l][i].y - layers[l + 1][j].y);
        if (dist < 300) { // Only connect nearby-ish neurons
          connections.push({
            from: layers[l][i],
            to: layers[l + 1][j],
            layer: l,
            // Activation timing based on layer depth
            activateAt: 0.15 + l * 0.15,
          });
        }
      }
    }
  }

  const allNodes = layers.flat();
  return { layers, connections, allNodes };
}

/* ── Animated Neural Network Canvas ── */
function NeuralNetworkSVG({ progress }) {
  const canvasRef = useRef(null);
  const network = useMemo(() => generateNetwork(), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const p = progress.get();
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const scaleX = w / 920;
    const scaleY = h / 520;

    // Draw connections
    network.connections.forEach(conn => {
      const activation = Math.max(0, Math.min(1, (p - conn.activateAt) / 0.12));
      const x1 = conn.from.x * scaleX;
      const y1 = conn.from.y * scaleY;
      const x2 = conn.to.x * scaleX;
      const y2 = conn.to.y * scaleY;

      // Base line (very faint)
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(0, 0, 0, 0.03)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (activation > 0) {
        // Activated connection
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255, 90, 0, ${activation * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Traveling pulse — a bright dot moving along the connection
        const pulseT = ((Date.now() * 0.001 + conn.from.y * 0.01) % 1.5) / 1.5;
        if (pulseT < 1 && activation > 0.3) {
          const px = x1 + (x2 - x1) * pulseT;
          const py = y1 + (y2 - y1) * pulseT;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 90, 0, ${activation * 0.7})`;
          ctx.fill();
        }
      }
    });

    // Draw nodes
    network.layers.forEach((layer, layerIdx) => {
      layer.forEach(node => {
        const activateAt = 0.1 + layerIdx * 0.15;
        const activation = Math.max(0, Math.min(1, (p - activateAt) / 0.1));
        const x = node.x * scaleX;
        const y = node.y * scaleY;
        const isInput = layerIdx === 0;
        const isOutput = node.isOutput;
        const baseR = isOutput ? 22 : isInput ? 14 : 8;
        const r = baseR * (0.6 + activation * 0.4);

        // Outer glow
        if (activation > 0) {
          const gradient = ctx.createRadialGradient(x, y, r, x, y, r * 3);
          gradient.addColorStop(0, `rgba(255, 90, 0, ${activation * 0.15})`);
          gradient.addColorStop(1, 'rgba(255, 90, 0, 0)');
          ctx.beginPath();
          ctx.arc(x, y, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (activation > 0.5) {
          ctx.fillStyle = `rgba(255, 90, 0, ${0.1 + activation * 0.15})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 90, 0, ${activation * 0.8})`;
          ctx.lineWidth = isOutput ? 2.5 : isInput ? 2 : 1.5;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, 0.01)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.06 + activation * 0.15})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Inner dot
        if (activation > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, isOutput ? 6 : isInput ? 4 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 90, 0, ${activation * 0.9})`;
          ctx.fill();
        }

        // Pulsing ring on output
        if (isOutput && activation > 0.8) {
          const pulseR = r + 8 + Math.sin(Date.now() * 0.003) * 4;
          ctx.beginPath();
          ctx.arc(x, y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 90, 0, ${(1 - (pulseR - r - 4) / 12) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Labels
        if (node.label) {
          ctx.font = `bold ${isOutput ? 9 : 8}px "Space Mono", monospace`;
          ctx.textAlign = isOutput ? 'center' : 'right';
          ctx.fillStyle = activation > 0.5 ? `rgba(255, 90, 0, ${activation})` : `rgba(0, 0, 0, 0.2)`;
          if (isOutput) {
            const lines = node.label.split('\n');
            lines.forEach((line, li) => {
              ctx.fillText(line, x, y + r + 14 + li * 12);
            });
          } else {
            ctx.fillText(node.label, x - r - 8, y + 3);
          }
        }
      });
    });

    ctx.restore();
  }, [network, progress]);

  // Animation loop
  useEffect(() => {
    let frame;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      draw();
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default function FourStudios() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 20%"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 30, mass: 0.8 });

  // Card activations tied to scroll
  const cardActivations = studios.map((_, i) => {
    const start = 0.08 + i * 0.1;
    return {
      opacity: useTransform(smoothProgress, [start, start + 0.12], [0, 1]),
      x: useTransform(smoothProgress, [start, start + 0.12], [-20, 0]),
    };
  });

  // Output text
  const outputOpacity = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);
  const outputY = useTransform(smoothProgress, [0.65, 0.8], [20, 0]);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 bg-[var(--color-light)] overflow-hidden border-t border-black/5">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6"
          >
            // THE FOUR STUDIOS
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-black uppercase tracking-tighter leading-[0.85] lg:w-1/2"
            >
              FOUR STUDIOS.<br /><span className="text-black/15">ONE MAKER.</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2 space-y-4"
            >
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-tight">Every maker works across all four studios, every year.</p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">Not as subjects to study, but as four ways to build, think, and grow. When all four connect, a complete maker emerges.</p>
            </motion.div>
          </div>
        </div>

        {/* ── Neural Network + Cards (Desktop) ── */}
        <div className="hidden lg:grid grid-cols-[280px_1fr_280px] gap-8 items-center mb-16">

          {/* Left — Input Studio Cards */}
          <div className="flex flex-col gap-5">
            {studios.map((studio, idx) => (
              <motion.div
                key={studio.num}
                style={{ opacity: cardActivations[idx].opacity, x: cardActivations[idx].x }}
                className="group cursor-hover"
              >
                <div className="bg-white border border-black/[0.06] rounded-xl p-5 group-hover:border-[var(--color-accent)]/30 group-hover:shadow-[0_10px_40px_-10px_rgba(255,90,0,0.1)] transition-all duration-500">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{studio.num}</span>
                    <h3 className="text-lg font-display font-bold text-black tracking-tighter group-hover:text-[var(--color-accent)] transition-colors duration-400">{studio.title}</h3>
                  </div>
                  <div className="w-6 h-0.5 bg-[var(--color-accent)]/20 group-hover:w-12 group-hover:bg-[var(--color-accent)] transition-all duration-600 mb-2" />
                  <p className="text-xs text-gray-500 leading-relaxed">{studio.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center — Neural Network Canvas */}
          <div className="relative" style={{ height: '480px' }}>
            <NeuralNetworkSVG progress={smoothProgress} />
          </div>

          {/* Right — Output */}
          <motion.div
            style={{ opacity: outputOpacity, y: outputY }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-full border-2 border-[var(--color-accent)]/30 flex items-center justify-center mb-5 relative">
              <div className="w-4 h-4 rounded-full bg-[var(--color-accent)] shadow-[0_0_20px_rgba(255,90,0,0.4)]" />
              <div className="absolute inset-0 rounded-full border border-[var(--color-accent)]/10 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            <div className="font-mono text-[9px] text-[var(--color-accent)] font-bold uppercase tracking-[0.3em] mb-1">Output</div>
            <div className="font-display text-2xl font-bold text-black tracking-tighter uppercase mb-3">Complete<br/>Maker</div>
            <p className="text-xs text-gray-400 leading-relaxed">All four studios activate together. The network fires. A maker who can build, design, present, and ship.</p>
          </motion.div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {studios.map((studio, idx) => (
            <motion.div
              key={studio.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="group cursor-hover"
            >
              <div className="bg-white border border-black/[0.06] rounded-2xl p-6 group-hover:border-[var(--color-accent)]/30 transition-all duration-500">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{studio.num}</span>
                  <h3 className="text-xl font-display font-bold text-black tracking-tighter">{studio.title}</h3>
                </div>
                <div className="w-8 h-0.5 bg-[var(--color-accent)]/20 mb-3" />
                <p className="text-sm text-gray-500 leading-relaxed">{studio.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl text-black font-display font-bold uppercase tracking-tighter leading-snug">
            Together, they shape a complete maker:{' '}
            <span className="text-[var(--color-accent)]">
              one who can make it work, make it good, make it understood, and make it matter.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
