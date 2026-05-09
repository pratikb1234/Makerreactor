import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MembershipSpecSheet() {
  const [activeTier, setActiveTier] = useState('junior'); // 'junior' or 'senior'

  const isJunior = activeTier === 'junior';
  const minsPerSession = isJunior ? 60 : 90;
  const hoursPerYear = isJunior ? 72 : 108;

  return (
    <div className="w-full max-w-5xl mx-auto font-sans text-black">
      {/* Top Toggle */}
      <div className="flex justify-center mb-16">
        <div className="flex bg-white p-1.5 rounded-full border border-black/10 shadow-sm">
          <button
            onClick={() => setActiveTier('junior')}
            className={`px-6 py-3 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest transition-all ${
              isJunior ? 'bg-[var(--color-accent)] text-white shadow-[0_4px_15px_rgba(255,90,0,0.3)]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Tinker & Explore · Gr 1–5
          </button>
          <button
            onClick={() => setActiveTier('senior')}
            className={`px-6 py-3 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest transition-all ${
              !isJunior ? 'bg-[var(--color-accent)] text-white shadow-[0_4px_15px_rgba(255,90,0,0.3)]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Build & Invent · Gr 6–9
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Sessions / Week</span>
          <span className="text-6xl font-display font-bold tracking-tighter text-black group-hover:scale-105 transition-transform origin-left">2</span>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Min / Session</span>
          <div className="flex items-baseline gap-3 group-hover:scale-105 transition-transform origin-left">
            <span className="text-6xl font-display font-bold tracking-tighter text-black">{minsPerSession}</span>
            <span className="text-xl text-gray-400 font-bold font-mono uppercase tracking-widest">min</span>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Hours / Year</span>
          <div className="flex items-baseline gap-3 group-hover:scale-105 transition-transform origin-left">
            <span className="text-6xl font-display font-bold tracking-tighter text-black">{hoursPerYear}</span>
            <span className="text-xl text-gray-400 font-bold font-mono uppercase tracking-widest">hrs</span>
          </div>
        </div>
      </div>

      {/* Spec Table */}
      <div className="border-t-2 border-black/10">
        <SpecSection title="Schedule">
          <SpecRow label="Sessions per week" value="2" />
          <SpecRow label="Session duration" value={`${minsPerSession} MIN`} />
          <SpecRow label="Weeks per year" value="36" />
          <SpecRow label="Total scheduled hours / year" value={hoursPerYear.toString()} />
          <SpecRow label="Open studio access" value="BY APPOINTMENT" sub="ADDITIONAL SESSIONS" />
        </SpecSection>

        <SpecSection title="Instruction">
          <SpecRow label="Mentor : maker ratio" value="1 : 6" />
          <SpecRow label="Max batch size" value="6 MAKERS" />
          <SpecRow label="Dedicated mentor" value="YES" sub="SAME MENTOR, FULL YEAR" />
          <SpecRow label="Progress tracking" value="MAKER PASSPORT" />
          <SpecRow label="Parent updates" value="QUARTERLY" />
        </SpecSection>

        <SpecSection title="Materials & Tools">
          <SpecRow label="Project materials" value="INCLUDED" sub="UP TO PROJECT BUDGET" />
          <SpecRow label="Excess materials" value="CHARGED AT COST" />
          <SpecRow label="Tools & equipment" value="INCLUDED" />
          <AnimatePresence mode="popLayout">
            {!isJunior && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <SpecRow label="3D printing" value="INCLUDED" />
              </motion.div>
            )}
          </AnimatePresence>
          <SpecRow label="Take-home projects" value="YES" sub="ALL BUILDS KEPT BY MAKER" />
        </SpecSection>

        <SpecSection title="Community">
          <SpecRow label="Quarterly showcases" value="4 PER YEAR" />
          <SpecRow label="Monthly build challenges" value="INCLUDED" />
          <SpecRow label="Competition pathways" value="AVAILABLE" />
          <SpecRow label="Parent Circle access" value="INCLUDED" />
          <SpecRow label="Founding member recognition" value="FOUNDING 150 ONLY" />
        </SpecSection>
      </div>
    </div>
  );
}

function SpecSection({ title, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-black/10">
      <div className="md:col-span-1">
        <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold sticky top-8">
          // {title}
        </h4>
      </div>
      <div className="md:col-span-3 flex flex-col gap-0">
        {children}
      </div>
    </div>
  );
}

function SpecRow({ label, value, sub }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between py-5 border-b border-black/5 last:border-0 last:pb-0 first:pt-0 group hover:bg-black/[0.02] -mx-4 px-4 rounded-lg transition-colors">
      <div className="text-[13px] font-mono uppercase tracking-tight text-gray-500 font-bold mb-1 sm:mb-0 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
        {label}
      </div>
      <div className="text-[14px] font-bold text-black text-left sm:text-right">
        {value} {sub && <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-2 block sm:inline mt-1 sm:mt-0">({sub})</span>}
      </div>
    </div>
  );
}
