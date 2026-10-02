import { lazy, Suspense, useState, useEffect } from 'react';

const VARIANTS = [
  { id: 1, name: 'Journey', comp: lazy(() => import('./HeroSection')) },
  { id: 2, name: 'Blueprint', comp: lazy(() => import('./HeroBlueprint')) },
  { id: 3, name: 'Exploded', comp: lazy(() => import('./HeroExploded')) },
  { id: 4, name: 'City', comp: lazy(() => import('./HeroCircuitCity')) },
  { id: 5, name: 'Kinetic', comp: lazy(() => import('./HeroKinetic')) },
];

function initialVariant() {
  if (typeof window === 'undefined') return 1;
  const q = parseInt(new URLSearchParams(window.location.search).get('hero'), 10);
  if (q >= 1 && q <= 5) return q;
  const saved = parseInt(localStorage.getItem('heroVariant'), 10);
  return saved >= 1 && saved <= 5 ? saved : 1;
}

export default function HeroSwitcher() {
  const [v, setV] = useState(initialVariant);

  const pick = (id) => {
    setV(id);
    try { localStorage.setItem('heroVariant', String(id)); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set('hero', String(id));
    window.history.replaceState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const Active = VARIANTS.find((x) => x.id === v).comp;

  return (
    <>
      <Suspense fallback={<div className="h-screen bg-[var(--color-light)]" />}>
        <Active key={v} />
      </Suspense>

      {/* Floating preview switcher */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-[#16120C]/90 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] cursor-hover"
        style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 pl-2 pr-1 hidden sm:inline">Hero</span>
        {VARIANTS.map((x) => (
          <button
            key={x.id}
            onClick={() => pick(x.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
              v === x.id ? 'bg-[var(--color-accent)] text-white' : 'text-white/55 hover:text-white'
            }`}
          >
            <span className="opacity-60 mr-1">{x.id}</span>{x.name}
          </button>
        ))}
      </div>
    </>
  );
}
