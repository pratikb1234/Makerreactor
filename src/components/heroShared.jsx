import { useEffect } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import { useCircuit } from '../context/CircuitContext';
import { waLink, VISIT_MESSAGE } from './StickyCTA';

// Every hero variant calls this so the REST of the site still powers on and the
// circuit handoff into the next section still fires — regardless of which hero
// is active.
export function useCircuitTriggers(scrollYProgress, { bridgeAt = 0.8 } = {}) {
  const { isPowered, togglePower, setIsPowerFlowComplete, setIsHeroBridgeComplete } = useCircuit();
  // power on shortly after mount even if the user hasn't scrolled yet
  useEffect(() => {
    const t = setTimeout(() => { if (!isPowered) togglePower(); }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.02 && !isPowered) togglePower();
    if (v > 0.04) setIsPowerFlowComplete(true);
    if (v > bridgeAt) setIsHeroBridgeComplete(true);
  });
}

export function HeroCTAs({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <a
        href={waLink(VISIT_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-7 py-3 bg-[var(--color-accent)] text-white font-mono text-sm uppercase tracking-widest font-bold rounded-full shadow-[0_0_24px_rgba(255,90,0,0.35)] transition-transform duration-300 hover:scale-105 cursor-hover"
      >
        BOOK A STUDIO VISIT →
      </a>
      <a
        href="#admissions"
        className="font-mono text-xs uppercase tracking-widest font-bold text-gray-600 hover:text-[var(--color-accent)] transition-colors cursor-hover underline decoration-black/20 underline-offset-4"
      >
        How admissions work
      </a>
    </div>
  );
}

export const EYEBROW = 'A MAKERSPACE FOR K–12 · BODAKDEV, AHMEDABAD';
