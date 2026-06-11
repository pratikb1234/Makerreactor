import { motion } from 'framer-motion';

export default function Community() {
  return (
    <section className="py-32 bg-[#141210] relative text-white border-t border-white/5">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
          >
            // THE CULTURE
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] lg:w-1/2">
              Life at Bits <br/>
              & Studios.
            </h2>
            <p className="text-xl text-gray-400 font-medium lg:w-1/2 md:pt-4">
              More than a place they attend, it becomes a place they belong. Serious makers, building alongside others who feel the same, with the doors open whenever they want to come in.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-32">
          {/* How It Feels */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold mb-10 pb-4 border-b border-white/10">
              // HOW IT FEELS
            </h4>
            <div className="space-y-12">
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">An Open Studio</h5>
                <p className="text-gray-400 leading-relaxed">The doors stay open. Makers come in to finish a build, start something new, or simply work.</p>
              </div>
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">A Real Community</h5>
                <p className="text-gray-400 leading-relaxed">Makers learn from each other as much as from mentors. The best idea in the room might belong to an eleven-year-old.</p>
              </div>
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">Ownership</h5>
                <p className="text-gray-400 leading-relaxed">This is their space. They help shape it, and they take pride in it the way makers do.</p>
              </div>
            </div>
          </div>

          {/* The Rhythm of a Year */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold mb-10 pb-4 border-b border-white/10">
              // THE RHYTHM OF A YEAR
            </h4>
            <div className="space-y-12">
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">Build</h5>
                <p className="text-gray-400 leading-relaxed">Real projects, with real tools, all year.</p>
              </div>
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">Compete</h5>
                <p className="text-gray-400 leading-relaxed">From Grade 3, makers take their work to real competitions.</p>
              </div>
              <div className="group cursor-hover">
                <h5 className="text-2xl font-display font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">Show</h5>
                <p className="text-gray-400 leading-relaxed">Showcases through the year, and MakerFest, our big annual public exhibition.</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-tighter leading-snug">
            By the end of the year, the work is not the only thing that has grown.{' '}
            <span className="text-[var(--color-accent)]">The maker has too.</span>
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
