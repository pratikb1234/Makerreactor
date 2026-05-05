import { motion } from 'framer-motion';
import TextReveal from './TextReveal';
import { DragToBuildCTA } from './MakerElements';

export default function FinalCTA() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center cursor-hover">
      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Immersive background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[var(--color-secondary)]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center gap-16">

        {/* Headline */}
        <h2 className="text-[12vw] sm:text-[10vw] lg:text-[12vw] font-display font-bold text-white leading-[0.85] tracking-tighter uppercase text-center mix-blend-difference">
          <TextReveal text="Prepare Them" delay={0.1} />
          <br />
          <TextReveal text="For The" delay={0.3} className="text-[var(--color-accent)]" />
          <br />
          <TextReveal text="Future." delay={0.5} />
        </h2>

        {/* Drag-to-Build CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="w-full max-w-md"
        >
          <DragToBuildCTA />
        </motion.div>

      </div>
    </section>
  );
}
