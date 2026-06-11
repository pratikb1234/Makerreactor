import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WHATSAPP_NUMBER = '919535862541';
export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const VISIT_MESSAGE =
  "Hi! I'd like to book a studio visit at Bits & Studios for my child.";
export const INFO_MESSAGE =
  "Hi! I'd like to know more about Bits & Studios for my child.";

// Mobile-only action bar: appears after the hero, hides near the footer
// so it never covers contact details.
export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const nearFooter =
        window.scrollY + window.innerHeight > document.body.scrollHeight - 700;
      setVisible(pastHero && !nearFooter);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="fixed bottom-3 left-3 right-3 z-[80] flex gap-2.5 md:hidden"
        >
          <a
            href={waLink(VISIT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-accent)] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(255,90,0,0.35)]"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Book a Visit
          </a>
          <a
            href={waLink(INFO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-black text-white font-mono text-xs font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            <WhatsAppIcon className="w-4 h-4" />
            WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18a8.06 8.06 0 0 1-4.1-1.12l-.3-.18-3.08.89.86-3-.2-.31A8.05 8.05 0 1 1 12.04 20Zm4.43-6.04c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.94-1.2 7.3 7.3 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.59 1.63-1.16.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
