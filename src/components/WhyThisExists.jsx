import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollCircuitLine } from './MakerElements';

export default function WhyThisExists() {
  const sectionRef = useRef(null);

  const cards = [
    {
      title: "01 // Ideation",
      desc: "We don't hand out instruction manuals. Children are given real-world problems and the freedom to conceptualize their own solutions.",
    },
    {
      title: "02 // Engineering",
      desc: "Concepts become tangible. Using 3D printers, microcontrollers, and raw materials, they build what they imagined.",
    },
    {
      title: "03 // Articulation",
      desc: "A prototype is useless if you can't explain it. We train our makers to present their work with the confidence of a seasoned founder.",
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-[var(--color-dark)] relative text-[var(--color-light)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Central PCB Trace */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 pointer-events-none z-0" style={{ width: 80 }}>
        <ScrollCircuitLine 
          sectionRef={sectionRef}
          className="top-0 left-0 w-full h-full"
          pathD="M 40 0 V 1000"
          viewBox="0 0 80 1000"
          components={[
            { type: 'quantum', cx: 40, cy: 150, threshold: 0.15 },
            { type: 'linkage', cx: 40, cy: 350, threshold: 0.35 },
            { type: 'brain', cx: 40, cy: 550, threshold: 0.55 },
            { type: 'satellite', cx: 40, cy: 750, threshold: 0.75 },
            { type: 'rocket', cx: 40, cy: 950, threshold: 0.95 },
          ]}
        />
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 relative">
          
          {/* Sticky Left Column */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-40">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
              >
                The Philosophy
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] mb-8 uppercase tracking-tighter">
                Stop <br/>Consuming.<br/>
                <span className="text-gray-500">Start <br/>Building.</span>
              </h2>
              <p className="text-xl text-gray-400 font-medium max-w-sm">
                Most extracurriculars keep children busy. We prepare them to shape the future.
              </p>
            </div>
          </div>

          {/* Scrolling Right Column */}
          <div className="lg:col-span-7 flex flex-col gap-12 md:gap-32 lg:pt-40 pb-20">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="border-b border-white/20 pb-12 cursor-hover"
              >
                <h4 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">{card.title}</h4>
                <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl">{card.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
