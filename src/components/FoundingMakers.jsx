import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function FoundingMakers() {
  return (
    <section id="founding150" className="py-32 bg-[var(--color-light)] relative border-b border-black/10">
      
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
            >
              The Community
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 uppercase tracking-tighter text-black leading-[0.9]">
              Join the <br/>
              Founding 150.
            </h2>
            <p className="text-xl text-gray-600 max-w-md font-medium mb-12">
              This is an exclusive cohort. A community of children who don’t just consume technology, but create with it.
            </p>
            
            <div className="flex gap-6">
              <MagneticButton>
                <button className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors cursor-hover">
                  Apply Now
                </button>
              </MagneticButton>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-12 md:p-16 rounded-[3rem] border border-black/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <h3 className="font-mono text-sm uppercase tracking-widest font-bold text-gray-500 mb-6">Current Applications</h3>
              
              <div className="text-[10vw] lg:text-[8vw] font-display font-bold leading-none text-black tracking-tighter mb-8">
                0<span className="text-gray-300">/150</span>
              </div>
              
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "5%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute top-0 left-0 h-full bg-black rounded-full"
                />
              </div>
              
              <p className="text-[var(--color-accent)] font-mono text-sm font-bold animate-pulse">
                WAITLIST OPENS IN 2026
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
