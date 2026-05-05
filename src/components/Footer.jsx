export default function Footer() {
  return (
    <footer className="bg-white pt-32 pb-12 relative z-10 overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <div className="font-display font-bold text-3xl tracking-tighter text-black uppercase flex items-center gap-3 mb-8">
              <div className="w-5 h-5 bg-[var(--color-accent)] rounded-sm transform rotate-45" />
              FUTURE BUILDERS
            </div>
            <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-sm">
              Ahmedabad’s most exclusive academy for young makers, coders, and innovators.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono font-bold text-black mb-8 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li><a href="#programs" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Programs</a></li>
              <li><a href="#experience" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">The Experience</a></li>
              <li><a href="#founding150" className="hover:text-[var(--color-accent)] transition-colors cursor-hover">Founding 150</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-mono font-bold text-black mb-8 uppercase tracking-widest text-sm">Connect</h4>
            <ul className="space-y-4 font-medium text-gray-500">
              <li className="cursor-hover hover:text-black transition-colors">hello@futurebuilders.academy</li>
              <li className="cursor-hover hover:text-black transition-colors">+91 (Placeholder) 000-0000</li>
              <li className="cursor-hover hover:text-black transition-colors mt-8 pt-8 border-t border-black/10">Instagram↗</li>
              <li className="cursor-hover hover:text-black transition-colors">LinkedIn↗</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs uppercase tracking-widest text-gray-400 font-bold">
          <p>© 2026 FUTURE BUILDERS ACADEMY.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors cursor-hover">Privacy</a>
            <a href="#" className="hover:text-black transition-colors cursor-hover">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
