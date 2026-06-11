import { motion } from 'framer-motion';
import { waLink } from './StickyCTA';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

// Spoken directly to the maker — not the parent. No other program in the city does this.
export default function MakerVoice() {
  return (
    <section className="relative py-28 md:py-40 bg-[var(--color-light)] border-b border-black/10 overflow-hidden font-sans">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="bg-[#141210] text-white rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden">
          {/* corner glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '36px 36px' }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--color-accent)]" />
                // FOR MAKERS — YES, YOU. NOT YOUR PARENTS.
              </motion.div>
              <motion.h2
                {...fadeUp}
                transition={{ delay: 0.1 }}
                className="font-display font-bold uppercase tracking-tighter leading-[0.92] text-4xl md:text-6xl mb-8"
              >
                You get the
                <br />
                real tools.
                <br />
                <span className="text-[var(--color-accent)]">We mean it.</span>
              </motion.h2>
              <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg text-white/70 leading-relaxed max-w-md">
                Soldering irons. CAD. Code that runs on actual hardware. A shelf for
                your half-finished build, doors that stay open, and a community that
                takes your ideas seriously — even the weird ones.{' '}
                <span className="text-white font-bold">Especially the weird ones.</span>
              </motion.p>
            </div>

            <div className="flex flex-col gap-6">
              {[
                ['BUILD WHAT YOU WANT', 'Your project, your problem, your call. Mentors help you get unstuck — they never hand you the answer.'],
                ['COMPETE FOR REAL', 'From Grade 3, take your work to real competitions. FTC and international stages for the Advanced Track.'],
                ['SHOW IT ON STAGE', 'MakerFest is a public exhibition. Your work, your demo, a real audience. Bring your friends.'],
              ].map(([title, body], i) => (
                <motion.div
                  key={title}
                  {...fadeUp}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="border-l-2 border-[var(--color-accent)]/40 pl-6 py-1 hover:border-[var(--color-accent)] transition-colors"
                >
                  <h3 className="font-mono text-sm font-bold tracking-widest text-white mb-1.5">{title}</h3>
                  <p className="text-white/60 leading-relaxed text-[15px]">{body}</p>
                </motion.div>
              ))}

              <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-bold mb-2">// THE DEAL</p>
                <p className="text-white/80 leading-relaxed text-[15px]">
                  You show up curious. We hand you things most adults aren't trusted
                  with. You build something real and present it on a stage.{' '}
                  <a
                    href={waLink('Hi! I want to join Bits & Studios as a maker. (Sent by a future maker, not a parent.)')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] font-bold cursor-hover underline decoration-2 underline-offset-4 hover:text-white transition-colors"
                  >
                    Deal?
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
