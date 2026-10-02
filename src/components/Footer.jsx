import { CONTACT, whatsappLink } from '../config/contact';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 md:pt-32 pb-28 md:pb-12 relative z-10 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <div className="font-display font-bold text-3xl tracking-tighter text-black uppercase flex items-center gap-3 mb-8">
              <div className="w-5 h-5 bg-[var(--color-accent)] rounded-sm transform rotate-45" />
              BITS & STUDIOS
            </div>
            <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-sm">
              Where serious makers do real work. Ahmedabad.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono font-bold text-black mb-8 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li><a href="#programs" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Programs</a></li>
              <li><a href="#team" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Team</a></li>
              <li><a href="#admissions" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Admissions</a></li>
              <li><a href="#apply" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Book a free visit</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-mono font-bold text-black mb-8 uppercase tracking-widest text-sm">Connect</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-black transition-colors">{CONTACT.email}</a></li>
              <li><a href={CONTACT.phoneHref} className="hover:text-black transition-colors">{CONTACT.phoneDisplay}</a></li>
              <li><a href={CONTACT.altPhoneHref} className="hover:text-black transition-colors">{CONTACT.altPhoneDisplay}</a></li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">WhatsApp↗</a></li>
              <li className="text-sm text-gray-400 mt-4 leading-relaxed">{CONTACT.address}</li>
              <li className="cursor-hover hover:text-black transition-colors mt-8 pt-8 border-t border-black/10">Instagram↗</li>
              <li className="cursor-hover hover:text-black transition-colors">LinkedIn↗</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs uppercase tracking-widest text-gray-400 font-bold">
          <p>© 2026 BITS & STUDIOS.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors cursor-hover">Privacy</a>
            <a href="#" className="hover:text-black transition-colors cursor-hover">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
