import { motion } from 'framer-motion';

const comparisons = [
  {
    not: "Teach a skill for a term",
    is: "A year-long journey that compounds"
  },
  {
    not: "Follow instructions to a fixed result",
    is: "Real problems, with no answer key"
  },
  {
    not: "Kits and worksheets",
    is: "Real tools and real materials"
  },
  {
    not: "A finished toy to take home",
    is: "A growing body of real work"
  },
  {
    not: "A certificate at the end",
    is: "A portfolio that speaks for itself"
  }
];

export default function Comparison() {
  return (
    <section className="py-32 bg-[#F5F0E8] relative">
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

        {/* Headers */}
        <div className="hidden md:grid grid-cols-2 gap-16 border-b border-black/10 pb-6 mb-8">
          <h4 className="font-mono text-sm uppercase tracking-widest text-black/40 font-bold">Most Programs</h4>
          <h4 className="font-mono text-sm uppercase tracking-widest text-black/70 font-bold">Bits &amp; Studios</h4>
        </div>

        <div className="flex flex-col gap-8 md:gap-12">
          {comparisons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="grid md:grid-cols-2 gap-4 md:gap-16 group cursor-hover border-b border-black/8 pb-8 last:border-0 last:pb-0"
            >
              <div className="text-xl md:text-2xl text-black/35 font-medium md:flex md:items-center">
                <span className="md:hidden font-mono text-[10px] uppercase tracking-widest text-black/40 font-bold block mb-2">Most Programs</span>
                {item.not}
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-black group-hover:text-[var(--color-accent)] transition-colors md:flex md:items-center">
                <span className="md:hidden font-mono text-[10px] uppercase tracking-widest text-black/60 font-bold block mb-2 mt-4">Bits &amp; Studios</span>
                {item.is}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
