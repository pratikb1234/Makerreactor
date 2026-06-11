import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { waLink, INFO_MESSAGE } from './StickyCTA';

const FAQS = [
  {
    q: 'My child has never built anything. Is that okay?',
    a: "That's exactly who the Tinker and Build levels are designed for. Curiosity is the only prerequisite — skill is the output, not the entry bar.",
  },
  {
    q: 'How often do makers come in, and when?',
    a: 'Regular weekly studio sessions, plus open-studio hours — the doors stay open for members who want to keep building. Weekend slots are available for every level.',
  },
  {
    q: 'Will this distract from school and exams?',
    a: 'Sessions are designed around school calendars and ease off during exam season. Most parents tell us the opposite happens — applied math and physics in the studio make the classroom versions click.',
  },
  {
    q: 'What does the membership cost?',
    a: 'One annual membership that includes all materials, tool access, mentorship, competition pathways and MakerFest. We share the full fee structure at your studio visit — and founding cohort members lock their rate.',
  },
  {
    q: 'Is the studio safe for a five-year-old?',
    a: 'Yes. Tools are gated by age-level certification — young makers earn access as they demonstrate readiness, the same way real workshops do it. Every session is mentor-supervised.',
  },
  {
    q: 'Does this actually help with college admissions?',
    a: 'A documented portfolio of original work is increasingly what selective universities and competitions look for beyond marks. Every maker leaves each year with real, presentable proof of how they think.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-28 md:py-40 bg-[var(--color-light)] border-b border-black/10 relative font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-sm uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] mb-6"
            >
              // ASKED BY EVERY PARENT
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-bold text-black uppercase tracking-tighter leading-[0.9] mb-8"
            >
              Fair questions,
              <br />
              <span className="text-black/20">straight answers.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 leading-relaxed max-w-sm"
            >
              Something we haven't covered?{' '}
              <a
                href={waLink(INFO_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] font-bold cursor-hover hover:underline decoration-2 underline-offset-4"
              >
                Ask us on WhatsApp
              </a>{' '}
              — a real person replies.
            </motion.p>
          </div>

          <div>
            {FAQS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className={`border-b border-black/10 ${idx === 0 ? 'border-t' : ''}`}
              >
                <button
                  onClick={() => setOpen(open === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-6 text-left py-6 cursor-hover group"
                  aria-expanded={open === idx}
                >
                  <span className={`text-lg md:text-xl font-display font-bold tracking-tight transition-colors ${open === idx ? 'text-[var(--color-accent)]' : 'text-black group-hover:text-[var(--color-accent)]'}`}>
                    {item.q}
                  </span>
                  <span
                    className={`flex-none w-9 h-9 rounded-full border flex items-center justify-center text-lg font-mono transition-all duration-300 ${
                      open === idx
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white rotate-45'
                        : 'border-black/15 text-black/60 group-hover:border-[var(--color-accent)]'
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-12 text-gray-600 leading-relaxed max-w-2xl">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
