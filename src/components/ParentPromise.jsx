import { motion } from 'framer-motion';

export default function ParentPromise() {
  const promises = [
    "Visible, measurable progress in technical and soft skills.",
    "Unshakeable confidence when presenting ideas.",
    "Detailed milestone updates from their mentor.",
    "High-production portfolio showcases."
  ];

  return (
    <section className="py-32 bg-black relative text-white border-b border-white/10">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6">
            The Parent Promise
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-12 leading-[0.9]">
            An investment in <br/>
            <span className="text-gray-500">their future capability.</span>
          </h2>
          
          <ul className="space-y-8">
            {promises.map((promise, idx) => (
              <li key={idx} className="flex items-start gap-6 group cursor-hover">
                <div className="w-3 h-3 bg-[var(--color-accent)] mt-3 shrink-0 group-hover:scale-[2] transition-transform duration-300" />
                <span className="text-2xl font-display font-bold uppercase tracking-tighter text-gray-300 group-hover:text-white transition-colors">{promise}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-full min-h-[500px]"
        >
          <div className="absolute inset-0 bg-white/5 border border-white/10 p-12 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-hover group">
            <div className="text-[12vw] lg:text-[10vw] font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-6 group-hover:scale-105 transition-transform duration-500 leading-none tracking-tighter">
              “I built <br/>this.”
            </div>
            <p className="text-2xl font-mono uppercase tracking-widest text-[var(--color-accent)] font-bold">
              The ultimate ROI.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
