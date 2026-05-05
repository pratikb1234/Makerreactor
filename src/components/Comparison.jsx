import { motion } from 'framer-motion';

const comparisons = [
  {
    not: "A weekend hobby class to kill time.",
    is: "A structured, premium academy pathway."
  },
  {
    not: "Following Lego instruction manuals.",
    is: "Ideating, prototyping, failing, and innovating."
  },
  {
    not: "A dusty room with old robotics kits.",
    is: "A state-of-the-art makerspace with 3D printers & AI."
  },
  {
    not: "Taking home a plastic toy.",
    is: "Building a portfolio of real-world solutions."
  }
];

export default function Comparison() {
  return (
    <section className="py-32 bg-[var(--color-light)] relative">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
          >
            The Distinction
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-black leading-[0.9]">
            Fundamentally <br/>
            Different.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 border-t border-black/10 pt-12">
          {comparisons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-4 group cursor-hover"
            >
              <div className="text-xl text-gray-400 line-through decoration-gray-300 font-medium">
                {item.not}
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-black group-hover:text-[var(--color-accent)] transition-colors">
                {item.is}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
