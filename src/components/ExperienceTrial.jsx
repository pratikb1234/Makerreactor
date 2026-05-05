import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { ScrollCircuitLine, LEDIndicator } from './MakerElements';

export default function ExperienceTrial() {
  const benefits = [
    "A 90-minute immersive hands-on project",
    "Expert observation of their problem-solving style",
    "A tangible creation they take home with pride",
    "A personalized roadmap for their future skills journey",
    "A 1-on-1 parent consultation with our academic leads"
  ];

  return (
    <section id="experience" className="py-32 bg-black relative text-white overflow-hidden">
      <ScrollCircuitLine 
        className="top-0 left-[20%] w-[300px] h-[600px] text-white/10" 
        pathD="M150 0 V300 H0 V600"
        viewBox="0 0 300 600"
      />
      <LEDIndicator className="top-[300px] left-[calc(20%+150px)]" />

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6"
            >
              The Entry Point
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
              Experience <br />
              <span className="text-gray-500">The Build.</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mb-12 max-w-2xl">
              Before you commit, let your child discover the thrill of building. A curated 90-minute session designed to unlock their creative potential.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-12">
              <div>
                <div className="text-6xl font-display font-bold">₹2,000</div>
                <div className="font-mono text-sm text-gray-500 uppercase tracking-widest mt-2">One-time Assessment</div>
              </div>
              <MagneticButton>
                <button className="px-10 py-5 bg-[var(--color-accent)] text-white rounded-full font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-hover">
                  Book Session
                </button>
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-10 backdrop-blur-md"
            >
              <h3 className="font-mono text-sm uppercase tracking-widest font-bold text-gray-400 mb-8 border-b border-white/10 pb-4">
                What You Unlock
              </h3>
              
              <ul className="space-y-6">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4 group">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                    <span className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
