import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

export default function FinalCTA() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center cursor-hover">
      {/* Maker Background Elements */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Immersive background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[var(--color-secondary)]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        
        <h2 className="text-[12vw] sm:text-[10vw] lg:text-[12vw] font-display font-bold text-white leading-[0.85] tracking-tighter uppercase mb-12 mix-blend-difference">
          <TextReveal text="Prepare Them" delay={0.1} />
          <br />
          <TextReveal text="For The" delay={0.3} className="text-[var(--color-accent)]" />
          <br />
          <TextReveal text="Future." delay={0.5} />
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <a href="#experience" className="inline-block px-12 py-6 bg-white text-black rounded-full font-bold text-xl uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-300 border-4 border-transparent hover:border-white/20">
            Apply For 2026
          </a>
        </motion.div>
      </div>
    </section>
  );
}
