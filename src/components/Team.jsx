import { motion } from 'framer-motion';

const photo = (file) => `${import.meta.env.BASE_URL}${file}`;

const team = [
  { name: "Pratik Bhatt", role: "Maker-in-Chief", bio: "Hand him anything complicated and he will light up taking it apart. For Pratik, the fun starts when things stop working.", image: photo('pratik.jpg') },
  { name: "Anjalee Bhatt", role: "Designer-in-Chief", bio: "A designer at heart and a teacher by calling. Trained at CEPT, Anjalee has spent a decade preparing learners for university and for life. She is endlessly curious, deeply empathetic, and happiest helping a young maker find their voice.", image: photo('anjalee.jpg') },
  { name: "Mohit Ahuja", role: "Senior Educator", bio: "A maker who genuinely wears many hats, science one day, design the next. A B.Sc. gold medalist and formerly of Riverside, Mohit brings range, rigour, and real warmth to the studio." },
  { name: "Aryan Parmar", role: "Robotics Educator & Coach", bio: "The one you want in your corner on competition day. With a Master's in Computer Science, Aryan coaches our teams and helps makers turn rough ideas into machines that win." },
  { name: "Mantasha Sheikh", role: "Educator", bio: "She makes code click for makers who thought it wasn't for them. A B.Tech in Computer Science, she loves teaching coding and digital design." },
  { name: "Foram Mendha", role: "Educator", bio: "Patient, precise, and endlessly encouraging, Foram has a gift for meeting makers exactly where they are. B.Tech, Computer Science." },
  { name: "Sohil Sheikh", role: "Educator", bio: "The steady hand in the room, Sohil keeps every build moving and every maker unstuck. B.Tech, Computer Science." }
];

const initials = (name) => name.split(' ').map(p => p[0]).join('');

function Avatar({ member, large }) {
  const size = large ? 'w-24 h-24 md:w-28 md:h-28 text-3xl' : 'w-16 h-16 text-xl';
  if (member.image) {
    return <img src={member.image} alt={member.name} loading="lazy" className={`${size} rounded-2xl object-cover bg-white/10 shrink-0`} />;
  }
  return (
    <div className={`${size} rounded-2xl shrink-0 flex items-center justify-center font-display font-bold bg-white/5 border border-white/10 text-[var(--color-accent)]`}>
      {initials(member.name)}
    </div>
  );
}

export default function Team() {
  const [founders, educators] = [team.slice(0, 2), team.slice(2)];

  return (
    <section id="team" className="scroll-mt-20 py-24 md:py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <div className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)] font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-px bg-[var(--color-accent)]" />
            The People
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-6">
            Who your child <br />builds with.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-medium">
            Engineers, designers and educators who make things themselves — with one mentor for every five makers.
          </p>
        </div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {founders.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[var(--color-accent)]/60 transition-colors"
            >
              <Avatar member={m} large />
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-bold mb-2">{m.role}</div>
                <h3 className="text-2xl md:text-3xl font-display font-bold uppercase mb-3 leading-tight">{m.name}</h3>
                <p className="text-gray-400 leading-relaxed">{m.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Educators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {educators.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[var(--color-accent)]/60 transition-colors"
            >
              <Avatar member={m} />
              <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-bold mt-5 mb-1">{m.role}</div>
              <h3 className="text-xl font-display font-bold uppercase mb-2 leading-tight">{m.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{m.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
