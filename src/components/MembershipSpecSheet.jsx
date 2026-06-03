import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ageGroups = [
  {
    id: 'ages-5-9',
    label: 'Ages 5–9',
    grades: 'Grades K–3',
    schedule: {
      sessionsPerWeek: '2',
      sessionDuration: '90 MINUTES',
      hoursPerYear: '~120 HOURS',
    },
    instruction: {
      mentorRatio: '1 : 6',
    },
    competitions: 'FIRST FRIENDLY COMPETITIONS FROM GRADE 3',
  },
  {
    id: 'ages-9-11',
    label: 'Ages 9–11',
    grades: 'Grades 4–5',
    schedule: {
      sessionsPerWeek: '2',
      sessionDuration: '2 HOURS',
      hoursPerYear: '~160 HOURS',
    },
    instruction: {
      mentorRatio: '1 : 6',
    },
    competitions: 'INCLUDED',
    competitionsSub: 'HACKATHONS & EVENTS',
  },
  {
    id: 'ages-11-13',
    label: 'Ages 11–13',
    grades: 'Grades 6–7',
    schedule: {
      sessionsPerWeek: '2',
      sessionDuration: '2.5 HOURS',
      hoursPerYear: '~200 HOURS',
    },
    instruction: {
      mentorRatio: '1 : 5',
    },
    competitionSeason: 'ADDITIONAL HOURS ON TOP',
    competitions: 'NATIONAL / INTERNATIONAL INCLUDED',
    competitionsSub: 'ROBOTICS (FIRST) INVITE ONLY',
  },
  {
    id: 'ages-13-18',
    label: 'Ages 13–18',
    grades: 'Grades 8–12',
    schedule: {
      sessionsPerWeek: '3',
      sessionDuration: '2 HOURS',
      hoursPerYear: '200+ HOURS',
    },
    instruction: {
      mentorRatio: '1 : 5',
    },
    competitionSeason: 'ADDITIONAL HOURS ON TOP',
    competitions: 'NATIONAL / INTERNATIONAL INCLUDED',
    competitionsSub: 'ROBOTICS (FTC / FRC) INVITE ONLY',
  },
];

export default function MembershipSpecSheet() {
  const [activeIdx, setActiveIdx] = useState(0);
  const group = ageGroups[activeIdx];

  return (
    <div className="w-full max-w-5xl mx-auto font-sans text-black">
      {/* Age Group Toggle */}
      <div className="flex justify-center mb-16">
        <div className="flex flex-wrap justify-center bg-white p-1.5 rounded-full border border-black/10 shadow-sm gap-1">
          {ageGroups.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-4 md:px-6 py-3 rounded-full text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-widest transition-all ${
                activeIdx === idx
                  ? 'bg-[var(--color-accent)] text-white shadow-[0_4px_15px_rgba(255,90,0,0.3)]'
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Sessions / Week</span>
              <span className="text-6xl font-display font-bold tracking-tighter text-black group-hover:scale-105 transition-transform origin-left">{group.schedule.sessionsPerWeek}</span>
            </div>
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Per Session</span>
              <span className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-black group-hover:scale-105 transition-transform origin-left">{group.schedule.sessionDuration}</span>
            </div>
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-8 md:p-10 flex flex-col justify-between items-start group hover:border-[var(--color-accent)]/30 transition-colors">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold mb-6">Hours / Year</span>
              <span className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-black group-hover:scale-105 transition-transform origin-left">{group.schedule.hoursPerYear}</span>
            </div>
          </div>

          {/* Spec Table */}
          <div className="border-t-2 border-black/10">
            <SpecSection title="Schedule">
              <SpecRow label="Sessions per week" value={group.schedule.sessionsPerWeek} />
              <SpecRow label="Session duration" value={group.schedule.sessionDuration} />
              <SpecRow label="Hours per year" value={group.schedule.hoursPerYear} />
              <SpecRow label="Open studio access" value="THE SPACE IS YOURS" sub="STAY AS LONG AS YOU NEED" />
              {group.competitionSeason && (
                <SpecRow label="Competition season" value={group.competitionSeason} />
              )}
            </SpecSection>

            <SpecSection title="Instruction">
              <SpecRow label="Mentor : maker ratio" value={group.instruction.mentorRatio} />
              <SpecRow label="Dedicated mentor" value="YES" sub="SAME MENTOR, FULL YEAR" />
              <SpecRow label="Progress tracking" value="MAKER PORTFOLIO & SKILL PASSPORT" />
              <SpecRow label="Parent updates" value="REGULAR" />
            </SpecSection>

            <SpecSection title="Competitions">
              <SpecRow label="Competitions" value={group.competitions} sub={group.competitionsSub} />
              <SpecRow label="CAS activities" value="INCLUDED" />
            </SpecSection>

            <SpecSection title="Materials & Tools">
              <SpecRow label="Project materials" value="ALL INCLUDED" />
              <SpecRow label="Tools & equipment" value="FREE ACCESS FOR PERSONAL USE" />
              <SpecRow label="3D printing & fabrication" value="INCLUDED" />
              <SpecRow label="Take-home projects" value="ALWAYS" sub="EVERY BUILD BELONGS TO THE MAKER" />
            </SpecSection>

            <SpecSection title="Community">
              <SpecRow label="Showcase" value="MAKERFEST" sub="ANNUAL PUBLIC EXHIBITION" />
              <SpecRow label="Parent Circle access" value="INCLUDED" />
            </SpecSection>
          </div>
        </motion.div>
      </AnimatePresence>
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
