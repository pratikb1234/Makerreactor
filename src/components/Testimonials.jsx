import { motion } from 'framer-motion';

const testimonials = [
  "He used to spend weekends gaming. Now he spends them debugging the autonomous car he built.",
  "When she presented her capstone project, she spoke with the authority of an engineer.",
  "It's not just a coding class. It's an ecosystem where they learn how to think.",
  "Best investment in his education. He finally found a place that challenges him.",
  "The shift in his mindset is unbelievable. He says 'I built this' with so much pride."
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-black relative overflow-hidden text-white flex flex-col justify-center">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="w-full flex overflow-hidden whitespace-nowrap mb-8 relative">
        {/* Left/Right fading masks */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-16 pr-16 items-center"
        >
          {/* Double the array for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((quote, idx) => (
            <div key={idx} className="flex items-center gap-16 cursor-hover">
              <p className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter opacity-80 hover:opacity-100 transition-opacity">
                "{quote}"
              </p>
              <div className="w-4 h-4 bg-[var(--color-accent)] rounded-full shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 w-full mt-12 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-gray-500 font-bold">
          Stories from the Founding Families
        </p>
      </div>
    </section>
  );
}
