import { motion } from 'framer-motion';
import { OscilloscopeWidget, MultimeterStat } from './MakerElements';

const stats = [
  { value: 600,  unit: '+',  label: 'Students mentored',    delay: 0 },
  { value: 12,   unit: 'x',  label: 'National competitions', delay: 0.15 },
  { value: 8,    unit: 'yr', label: 'Years of expertise',   delay: 0.3 },
  { value: 3,    unit: 'k+', label: 'Hours of making',      delay: 0.45 },
];

const points = [
  "Mentored 600+ students in robotics, coding, and design.",
  "Architected massive MakerFest-style showcases.",
  "Guided teams to success in national robotics competitions.",
  "Pioneered AI and hands-on learning curriculums."
];

export default function Credibility() {
  return (
    <section className="py-32 bg-[var(--color-accent)] relative text-white">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Top row — heading + oscilloscope */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-widest text-black font-bold mb-6"
            >
              The Credentials
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter leading-[0.9]">
              Built by <br/>Educators.<br/>
              <span className="text-black">Proven by Experience.</span>
            </h2>
          </div>

          {/* Oscilloscope lives here — feels like it's measuring the impact */}
          <div className="flex flex-col gap-6 justify-start">
            <p className="font-mono text-xs uppercase tracking-widest text-black/50">
              Signal output · student impact
            </p>
            <OscilloscopeWidget className="w-full" />
          </div>
        </div>

        {/* Multimeter stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((s, i) => (
            <MultimeterStat key={i} value={s.value} unit={s.unit} label={s.label} delay={s.delay} />
          ))}
        </div>

        {/* Credential points */}
        <div className="flex flex-col gap-8 border-t-2 border-black/20 pt-8">
          {points.map((point, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-6 cursor-hover group"
            >
              <div className="w-8 h-8 rounded-full bg-black text-[var(--color-accent)] font-mono font-bold flex items-center justify-center shrink-0 mt-1">
                {idx + 1}
              </div>
              <p className="text-2xl font-display font-bold uppercase tracking-tighter group-hover:pl-4 transition-all duration-300">
                {point}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
