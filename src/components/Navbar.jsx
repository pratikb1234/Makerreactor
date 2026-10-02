import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#programs', label: 'Programs' },
  { href: '#studios', label: 'Studios' },
  { href: '#team', label: 'Team' },
  { href: '#admissions', label: 'Admissions' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,border-color] duration-300 border-b ${scrolled ? 'bg-white/90 backdrop-blur-xl border-black/5 py-3' : 'bg-transparent border-transparent py-5 md:py-6'}`}
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="font-display font-bold text-xl md:text-2xl tracking-tighter text-black flex items-center gap-3">
            <div className="w-4 h-4 bg-[var(--color-accent)] rounded-sm transform rotate-45" />
            BITS & STUDIOS
          </a>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-mono font-bold hover:text-[var(--color-accent)] transition-colors uppercase tracking-widest">
                {link.label}
              </a>
            ))}
            <a href="#apply" className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors">
              Book a free visit
            </a>
          </div>

          <button className="md:hidden text-black p-2 -mr-2" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col justify-center items-center"
          >
            <button className="absolute top-5 right-4 text-black p-2" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-7 text-center">
              {LINKS.map(link => (
                <a key={link.href} href={link.href} className="text-4xl font-display font-bold text-black hover:text-[var(--color-accent)] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="#apply" className="mt-4 px-8 py-4 bg-[var(--color-accent)] text-white rounded-full text-lg font-bold uppercase tracking-wider" onClick={() => setMobileMenuOpen(false)}>
                Book a free visit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
