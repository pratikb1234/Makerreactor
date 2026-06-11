import { useRef } from 'react';
import { motion } from 'framer-motion';
import { waLink, VISIT_MESSAGE, WhatsAppIcon } from './StickyCTA';

export default function AdmissionsTimeline() {

  const steps = [
    {
      num: '01',
      title: "Enquire",
      desc: "We form our cohort with care. Selection is currently by invitation and referral.",
    },
    {
      num: '02',
      title: "Connect",
      desc: "Let's talk. A conversation to understand your young maker, and for you to understand us.",
    },
    {
      num: '03',
      title: "Visit",
      desc: "Experience the space, the community, and the culture for yourself.",
    },
    {
      num: '04',
      title: "Begin",
      desc: "Begin this journey, alongside your cohort.",
    }
  ];

  return (
    <section id="admissions" className="py-24 md:py-40 bg-[#F5F0E8] relative">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6 flex items-center gap-3"
          >
            <div className="w-8 h-px bg-[var(--color-accent)]" />
            The Path In
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] uppercase tracking-tighter text-black">
              How to<br />
              <span className="text-black/25">Join.</span>
            </h2>
            <p className="text-lg md:text-xl text-black/50 font-medium max-w-sm md:text-right">
              Start with a visit. Most families decide within an hour of seeing the studio.
            </p>
          </div>
        </div>

        {/* Steps and Animation Container */}
        <div className="relative">
          {/* Subtle Side Animation (Hidden on mobile) */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[200px] pointer-events-none opacity-40">
            <svg width="100%" height="100%" viewBox="0 0 200 800" preserveAspectRatio="none">
              {/* Ghost track */}
              <path d="M 100 0 L 100 800" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
              <path d="M 100 150 L 180 200 L 180 300 L 100 350" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
              <path d="M 100 450 L 20 500 L 20 600 L 100 650" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
              
              {/* Animated Blazer */}
              <motion.path 
                d="M 100 0 L 100 800" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="4"
                strokeDasharray="100 800"
                initial={{ strokeDashoffset: 900 }}
                whileInView={{ strokeDashoffset: -100 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
              <motion.path 
                d="M 100 150 L 180 200 L 180 300 L 100 350" 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="2"
                strokeDasharray="50 500"
                initial={{ strokeDashoffset: 550 }}
                whileInView={{ strokeDashoffset: -50 }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity, delay: 1 }}
              />
            </svg>
          </div>

          <div className="flex flex-col divide-y divide-black/10 relative z-10 max-w-4xl">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="py-10 md:py-14 grid md:grid-cols-12 gap-4 md:gap-8 group cursor-hover"
              >
                {/* Number */}
                <div className="md:col-span-1 flex md:block items-center gap-4">
                  <span className="font-mono text-[11px] font-bold text-[var(--color-accent)] tracking-widest block">{step.num}</span>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h4 className="text-2xl md:text-4xl font-display font-bold text-black tracking-tighter group-hover:text-[var(--color-accent)] transition-colors duration-500">
                    {step.title}
                  </h4>
                </div>

                {/* Desc */}
                <div className="md:col-span-7">
                  <p className="text-lg md:text-2xl text-black/50 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Form Fallback */}
        <div className="mt-16 md:mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div>
            <h4 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tighter text-black mb-2">Start the Conversation</h4>
            <p className="text-black/60 font-medium">Take the first step to join the founding cohort — a real person replies on WhatsApp.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={waLink(VISIT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-white rounded-full font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-black transition-colors cursor-hover shadow-xl whitespace-nowrap"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Book a Visit
            </a>
            {/* REPLACE WITH GOOGLE FORM URL */}
            <a
              href="https://forms.gle/kcEJ65VXory9uRYk9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-10 py-5 border-2 border-black text-black rounded-full font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-hover whitespace-nowrap"
            >
              Request an Invitation →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
