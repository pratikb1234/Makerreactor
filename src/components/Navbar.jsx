import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-4' : 'bg-transparent py-8'}`}
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="font-display font-bold text-2xl tracking-tighter text-black flex items-center gap-3 cursor-hover">
            <div className="w-4 h-4 bg-[var(--color-accent)] rounded-sm transform rotate-45" />
            FUTURE BUILDERS
          </a>

          <div className="hidden md:flex items-center gap-10">
            <a href="#programs" className="text-sm font-mono font-bold hover:text-[var(--color-accent)] transition-colors uppercase tracking-widest cursor-hover">Programs</a>
            <a href="#experience" className="text-sm font-mono font-bold hover:text-[var(--color-accent)] transition-colors uppercase tracking-widest cursor-hover">Experience</a>
            <MagneticButton>
              <a href="#founding150" className="px-6 py-3 bg-black text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors cursor-hover inline-block">
                Join 150
              </a>
            </MagneticButton>
          </div>

          <button className="md:hidden text-black cursor-hover" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] bg-white flex flex-col justify-center items-center"
          >
            <button className="absolute top-8 right-6 text-black cursor-hover p-2" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-8 text-center">
              <a href="#programs" className="text-5xl font-display font-bold text-black hover:text-[var(--color-accent)] transition-colors cursor-hover" onClick={() => setMobileMenuOpen(false)}>Programs</a>
              <a href="#experience" className="text-5xl font-display font-bold text-black hover:text-[var(--color-accent)] transition-colors cursor-hover" onClick={() => setMobileMenuOpen(false)}>Experience</a>
              <a href="#founding150" className="text-5xl font-display font-bold text-black hover:text-[var(--color-accent)] transition-colors cursor-hover" onClick={() => setMobileMenuOpen(false)}>Join 150</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
