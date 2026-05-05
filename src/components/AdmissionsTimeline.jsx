import { motion } from 'framer-motion';

const timeline = [
  {
    step: "01",
    title: "Book the Experience",
    desc: "Reserve a spot for the 90-minute introductory hands-on session. This is where the spark happens."
  },
  {
    step: "02",
    title: "The First Build",
    desc: "Your child builds a real project inside our premium makerspace while mentors assess their learning style."
  },
  {
    step: "03",
    title: "The Roadmap",
    desc: "We sit down with you to present a tailored pathway recommendation based on their performance and interests."
  },
  {
    step: "04",
    title: "Join the 150",
    desc: "Accept your invitation to become one of the Founding 150 Makers and begin the journey."
  }
];

export default function AdmissionsTimeline() {
  return (
    <section className="py-32 bg-[var(--color-light)] relative">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
          >
            The Onboarding
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-black leading-[0.9]">
            Admissions <br/>Process.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-x-8 gap-y-16 relative">
          {/* Horizontal line for desktop connecting the steps */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-black/10" />
          
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative cursor-hover group"
            >
              <div className="w-24 h-24 rounded-full bg-white border-2 border-black flex items-center justify-center mb-10 relative z-10 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <span className="font-mono font-bold text-2xl">{item.step}</span>
              </div>

              <h3 className="text-3xl font-display font-bold text-black mb-4 uppercase tracking-tighter leading-none">{item.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
