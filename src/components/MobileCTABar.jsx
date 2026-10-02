import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../config/contact';

// Thumb-reachable CTA bar for phones. Appears after the hero and hides once the
// enquiry form itself is on screen so it never covers the form.
export default function MobileCTABar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const apply = document.getElementById('apply');
    let pastHero = false;
    let formInView = false;
    const update = () => setVisible(pastHero && !formInView);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.6;
      update();
    };
    const observer = new IntersectionObserver(([entry]) => {
      formInView = entry.isIntersecting;
      update();
    });
    if (apply) observer.observe(apply);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur border-t border-black/10 flex gap-3 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      aria-hidden={!visible}
    >
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-black font-bold text-sm"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <a
        href="#apply"
        tabIndex={visible ? 0 : -1}
        className="flex-[1.4] flex items-center justify-center py-3 rounded-full bg-[var(--color-accent)] text-white font-bold text-sm"
      >
        Book a free visit
      </a>
    </div>
  );
}
