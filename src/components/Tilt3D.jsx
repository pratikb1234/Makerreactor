import { useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

// ── Site-wide depth system: cards exist in space ─────────────────────────────
// Wraps any card in a perspective container: it tilts toward the cursor with a
// moving light sheen, like a physical plate on a workbench. No WebGL cost.
// Inert for touch-only devices and prefers-reduced-motion.
export default function Tilt3D({ children, className = '', max = 6, radiusClass = 'rounded-3xl', sheen = true }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const inert = useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !window.matchMedia('(hover: hover)').matches),
    []
  );

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 24 });
  const sy = useSpring(py, { stiffness: 220, damping: 24 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const sheenX = useTransform(sx, [0, 1], [18, 82]);
  const sheenY = useTransform(sy, [0, 1], [12, 88]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.32), transparent 58%)`;

  if (inert) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    setHovered(false);
  };

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full will-change-transform"
      >
        {children}
        {sheen && (
          <motion.div
            aria-hidden
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${radiusClass}`}
            style={{ background: sheenBg, opacity: hovered ? 1 : 0, mixBlendMode: 'soft-light' }}
          />
        )}
      </motion.div>
    </div>
  );
}

// Floating CSS-3D maker block — a slowly tumbling cube in brand materials.
export function MakerCube({ size = 64, dark = false, duration = 16, className = '' }) {
  const half = size / 2;
  const face = dark
    ? 'rgba(36,27,18,0.92)'
    : 'rgba(245,240,232,0.95)';
  const edge = dark ? 'rgba(255,90,0,0.7)' : 'rgba(255,90,0,0.55)';
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div className={`pointer-events-none ${className}`} style={{ perspective: 700, width: size, height: size }} aria-hidden>
      <motion.div
        animate={{ rotateX: 360, rotateY: -360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        style={{ width: size, height: size, transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {faces.map((t, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              transform: t,
              background: face,
              border: `1.5px solid ${edge}`,
              boxShadow: 'inset 0 0 18px rgba(255,90,0,0.12)',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
