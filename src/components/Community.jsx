import { motion } from 'framer-motion';

const rituals = [
  { title: "Maker Passport", desc: "A tangible record of every skill mastered." },
  { title: "The Maker Wall", desc: "A place of honor for the best student prototypes." },
  { title: "Monthly Builds", desc: "High-energy sprint sessions to solve surprise problems." },
  { title: "Quarterly Showcases", desc: "Demo days where children pitch their creations." },
  { title: "Founding 150", desc: "Exclusive early-member perks and recognition." },
  { title: "Parent Circle", desc: "A community for parents to track progress." }
];

export default function Community() {
  return (
    <section className="py-32 bg-[var(--color-light)] relative border-t border-black/10">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
            >
              Culture
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-black leading-[0.9] mb-8">
              Celebrate <br/>
              The Build.
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              We treat our young makers like real inventors. Because when you raise the bar, children jump over it.
            </p>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-x-8 gap-y-12">
            {rituals.map((ritual, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border-t-2 border-black pt-6 cursor-hover group"
              >
                <h4 className="text-2xl font-display font-bold text-black mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {ritual.title}
                </h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  {ritual.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
