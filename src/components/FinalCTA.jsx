import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { CONTACT, whatsappLink } from '../config/contact';

const GRADES = ['K–3 (ages 5–9)', '4–5 (ages 9–11)', '6–7 (ages 11–13)', '8–12 (ages 13–18)'];

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30 transition';

export default function FinalCTA() {
  const [form, setForm] = useState({ parent: '', child: '', grade: '', phone: '' });
  const update = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = [
      "Hi Bits & Studios! I'd like to book a free studio visit.",
      `Parent: ${form.parent}`,
      form.child && `Child: ${form.child}`,
      `Grade: ${form.grade}`,
      `Phone: ${form.phone}`,
    ].filter(Boolean).join('\n');
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="apply" className="scroll-mt-16 relative bg-black overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[var(--color-secondary)]/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[90rem] w-full mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

        {/* Pitch + direct contact */}
        <div>
          <div className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-6">
            Founding Cohort · 2026
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-[0.9] tracking-tighter uppercase mb-8">
            Come see the <br /><span className="text-[var(--color-accent)]">studio.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-lg mb-10">
            Book a free visit. Your child gets a hands-on taster build, you get a walkthrough of the
            program — and you leave knowing whether it's the right fit. No obligation.
          </p>

          <ul className="space-y-4 text-gray-300">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5 text-[var(--color-accent)]" /> WhatsApp us — we usually reply the same day
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-[var(--color-accent)]" /> {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-[var(--color-accent)]" /> {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin className="w-5 h-5 text-[var(--color-accent)] shrink-0" /> {CONTACT.address}
            </li>
          </ul>
        </div>

        {/* Enquiry form — opens WhatsApp with the details pre-filled (no backend needed) */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-10 space-y-5"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">Book a free studio visit</h3>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-2">Your name</span>
            <input required autoComplete="name" value={form.parent} onChange={update('parent')} className={inputClass} placeholder="Parent / guardian name" />
          </label>

          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="block text-sm font-medium text-gray-300 mb-2">Child's name <span className="text-gray-500">(optional)</span></span>
              <input value={form.child} onChange={update('child')} className={inputClass} placeholder="First name" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-300 mb-2">Child's grade</span>
              <select required value={form.grade} onChange={update('grade')} className={`${inputClass} appearance-none`}>
                <option value="" disabled className="text-black">Select grade</option>
                {GRADES.map(g => <option key={g} value={g} className="text-black">Grade {g}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-2">Phone / WhatsApp</span>
            <input required type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+\s\-]{8,}" value={form.phone} onChange={update('phone')} className={inputClass} placeholder="+91 98765 43210" />
          </label>

          <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--color-accent)] text-white font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
            Request my visit <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 text-center">
            Sends your details to us on WhatsApp. Prefer a call? <a href={CONTACT.phoneHref} className="underline hover:text-white">{CONTACT.phoneDisplay}</a>
          </p>
        </motion.form>
      </div>
    </section>
  );
}
