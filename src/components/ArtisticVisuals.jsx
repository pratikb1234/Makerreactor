// ── Artistic schematic illustrations ─────────────────────────────────────────
// Hand-drawn-style "studio blueprint" art that replaces photo-real imagery.
// Every variant shares one viewBox (1448×1086) and renders with
// preserveAspectRatio="xMidYMid slice" — the SVG equivalent of object-cover —
// so existing layout (and the Engineer easter-egg ring math) keeps working.

const VB_W = 1448;
const VB_H = 1086;

const INK = '#1A1510';
const ACCENT = '#FF5A00';
const CREAM = '#F5F0E8';

// Shared paper scaffolding: gradient wash, blueprint grid, corner ticks, big numeral.
function Paper({ id, from, to, num, label, dark = false }) {
  const line = dark ? 'rgba(245,240,232,0.07)' : 'rgba(26,21,16,0.06)';
  const tick = dark ? 'rgba(245,240,232,0.35)' : 'rgba(26,21,16,0.3)';
  return (
    <>
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <pattern id={`grid-${id}`} width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M 72 0 H 0 V 72" fill="none" stroke={line} strokeWidth="2" />
        </pattern>
      </defs>
      <rect width={VB_W} height={VB_H} fill={`url(#bg-${id})`} />
      <rect width={VB_W} height={VB_H} fill={`url(#grid-${id})`} />
      {/* big ghost numeral */}
      <text x={VB_W - 60} y="270" textAnchor="end" fontFamily="'Space Mono', monospace" fontWeight="700"
        fontSize="280" fill={dark ? 'rgba(245,240,232,0.06)' : 'rgba(26,21,16,0.05)'}>{num}</text>
      {/* corner ticks */}
      {[[40, 40], [VB_W - 40, 40], [40, VB_H - 40], [VB_W - 40, VB_H - 40]].map(([x, y], i) => (
        <g key={i} stroke={tick} strokeWidth="4">
          <line x1={x - 22} y1={y} x2={x + 22} y2={y} />
          <line x1={x} y1={y - 22} x2={x} y2={y + 22} />
        </g>
      ))}
      {/* schematic label */}
      <text x="64" y={VB_H - 64} fontFamily="'Space Mono', monospace" fontSize="30" letterSpacing="8"
        fill={dark ? 'rgba(245,240,232,0.5)' : 'rgba(26,21,16,0.4)'}>{label}</text>
    </>
  );
}

function Sparks({ pts, dark = false }) {
  const c = dark ? CREAM : INK;
  return pts.map(([x, y, s], i) => (
    <g key={i} stroke={i % 3 === 0 ? ACCENT : c} strokeWidth="5" strokeLinecap="round" opacity="0.7">
      <line x1={x - s} y1={y} x2={x + s} y2={y} />
      <line x1={x} y1={y - s} x2={x} y2={y + s} />
    </g>
  ));
}

// ── 01 TINKER · blocks, arch and a rolling marble ─────────────────────────────
function TinkerArt() {
  return (
    <>
      <Paper id="tinker" from="#FBEFDD" to="#F3D9B8" num="01" label="SCHEMATIC // TINKER" />
      <g className="bs-float">
        {/* marble run ramp */}
        <path d="M 220 320 Q 560 420 700 620 T 1190 760" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M 220 360 Q 560 460 700 660 T 1190 800" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" opacity="0.25" />
        {/* marble */}
        <circle cx="660" cy="560" r="40" fill={ACCENT} />
        <circle cx="646" cy="546" r="12" fill="#FFD9C2" />
      </g>
      {/* stacked blocks */}
      <g>
        <rect x="270" y="700" width="150" height="150" rx="18" fill="#fff" stroke={INK} strokeWidth="9" />
        <rect x="330" y="545" width="130" height="130" rx="16" fill={CREAM} stroke={INK} strokeWidth="9" transform="rotate(-8 395 610)" />
        <circle cx="345" cy="775" r="28" fill="none" stroke={ACCENT} strokeWidth="9" />
        <path d="M 360 585 l 60 60 M 420 585 l -60 60" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" transform="rotate(-8 395 610)" />
      </g>
      {/* pinwheel */}
      <g className="bs-spin" style={{ transformOrigin: '1080px 360px' }}>
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d="M 1080 360 L 1080 230 Q 1145 270 1080 360" fill={r % 180 ? ACCENT : 'none'}
            stroke={INK} strokeWidth="8" transform={`rotate(${r} 1080 360)`} />
        ))}
        <circle cx="1080" cy="360" r="16" fill={INK} />
      </g>
      <line x1="1080" y1="360" x2="1080" y2="860" stroke={INK} strokeWidth="9" />
      <Sparks pts={[[180, 200, 16], [880, 260, 13], [1280, 540, 18], [560, 880, 14]]} />
    </>
  );
}

// ── 02 BUILD · a friendly rover taking shape ─────────────────────────────────
function BuildArt() {
  return (
    <>
      <Paper id="build" from="#F6E6CF" to="#EBCFA8" num="02" label="SCHEMATIC // BUILD" />
      {/* ground line */}
      <line x1="120" y1="820" x2="1330" y2="820" stroke={INK} strokeWidth="9" strokeDasharray="2 38" strokeLinecap="round" />
      <g className="bs-float">
        {/* antenna */}
        <line x1="930" y1="420" x2="1010" y2="280" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <circle cx="1014" cy="272" r="22" fill={ACCENT} />
        <path d="M 1052 240 a 70 70 0 0 1 30 56 M 1090 200 a 120 120 0 0 1 50 96" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" opacity="0.55" />
        {/* body */}
        <rect x="500" y="420" width="470" height="250" rx="40" fill="#fff" stroke={INK} strokeWidth="10" />
        {/* eye */}
        <circle cx="640" cy="540" r="58" fill="none" stroke={INK} strokeWidth="10" />
        <circle cx="640" cy="540" r="22" fill={ACCENT} className="bs-blink" />
        {/* vents */}
        {[760, 810, 860].map((x) => <line key={x} x1={x} y1="490" x2={x} y2="600" stroke={INK} strokeWidth="9" strokeLinecap="round" opacity="0.35" />)}
        {/* arm holding bolt */}
        <path d="M 500 520 H 380 L 320 620" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <circle cx="306" cy="648" r="34" fill="none" stroke={ACCENT} strokeWidth="10" />
      </g>
      {/* wheels */}
      <g className="bs-spin-slow" style={{ transformOrigin: '600px 740px' }}>
        <circle cx="600" cy="740" r="76" fill={CREAM} stroke={INK} strokeWidth="10" />
        <path d="M 600 676 V 804 M 536 740 H 664" stroke={INK} strokeWidth="9" />
      </g>
      <g className="bs-spin-slow" style={{ transformOrigin: '880px 740px' }}>
        <circle cx="880" cy="740" r="76" fill={CREAM} stroke={INK} strokeWidth="10" />
        <path d="M 880 676 V 804 M 816 740 H 944" stroke={INK} strokeWidth="9" />
      </g>
      {/* blueprint callouts */}
      <path d="M 1020 560 H 1180 V 470" fill="none" stroke={INK} strokeWidth="6" opacity="0.45" />
      <circle cx="1180" cy="452" r="10" fill={INK} opacity="0.45" />
      <Sparks pts={[[240, 300, 16], [1240, 660, 14], [430, 250, 13]]} />
    </>
  );
}

// ── 03 ENGINEER · robotic arm + gear; orange ring kept at the easter-egg spot ─
// Ring center must remain at (0.619 × W, 0.7905 × H) ≈ (896, 858).
function EngineerArt() {
  return (
    <>
      <Paper id="engineer" from="#EFE9DC" to="#DDD2BC" num="03" label="SCHEMATIC // ENGINEER" />
      {/* base */}
      <path d="M 360 880 h 300 l -40 -90 h -220 z" fill="#fff" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      {/* arm segments */}
      <g className="bs-sway" style={{ transformOrigin: '510px 790px' }}>
        <line x1="510" y1="790" x2="640" y2="520" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <circle cx="510" cy="790" r="30" fill={CREAM} stroke={INK} strokeWidth="10" />
        <line x1="640" y1="520" x2="900" y2="430" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <circle cx="640" cy="520" r="26" fill={CREAM} stroke={INK} strokeWidth="10" />
        {/* claw */}
        <path d="M 900 430 q 60 -10 84 32 M 900 430 q 50 36 30 78" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <circle cx="900" cy="430" r="20" fill={ACCENT} />
      </g>
      {/* gear being machined */}
      <g className="bs-spin" style={{ transformOrigin: '1060px 620px' }}>
        {[...Array(8)].map((_, i) => (
          <rect key={i} x="1046" y="520" width="28" height="200" rx="8" fill={CREAM} stroke={INK} strokeWidth="8"
            transform={`rotate(${i * 45} 1060 620)`} />
        ))}
        <circle cx="1060" cy="620" r="62" fill="#fff" stroke={INK} strokeWidth="10" />
        <circle cx="1060" cy="620" r="20" fill="none" stroke={INK} strokeWidth="9" />
      </g>
      {/* the easter-egg ring — exact target of the reticle */}
      <circle cx="896" cy="858" r="42" fill="none" stroke={ACCENT} strokeWidth="12" className="bs-pulse" />
      <circle cx="896" cy="858" r="8" fill={ACCENT} />
      {/* measure line */}
      <path d="M 250 380 V 250 H 540" fill="none" stroke={INK} strokeWidth="6" opacity="0.45" strokeDasharray="14 14" />
      <Sparks pts={[[1280, 320, 16], [220, 560, 14], [1320, 880, 13]]} />
    </>
  );
}

// ── 04 INVENT · rocket leaving the workbench world ───────────────────────────
function InventArt() {
  return (
    <>
      <Paper id="invent" from="#221B13" to="#3A2614" num="04" label="SCHEMATIC // INVENT" dark />
      {/* orbit ring */}
      <ellipse cx="724" cy="560" rx="520" ry="210" fill="none" stroke="rgba(245,240,232,0.25)" strokeWidth="6" strokeDasharray="3 30" strokeLinecap="round" />
      {/* planet */}
      <circle cx="290" cy="700" r="90" fill="none" stroke={CREAM} strokeWidth="9" />
      <path d="M 214 652 a 90 90 0 0 1 152 96" fill="none" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" />
      {/* trajectory */}
      <path d="M 360 880 Q 700 760 940 480 T 1300 220" fill="none" stroke={ACCENT} strokeWidth="8" strokeDasharray="26 22" strokeLinecap="round" opacity="0.8" />
      {/* rocket */}
      <g className="bs-float" style={{ transformOrigin: '980px 430px' }}>
        <g transform="rotate(38 980 430)">
          <path d="M 980 300 q 64 70 64 170 q 0 60 -20 96 h -88 q -20 -36 -20 -96 q 0 -100 64 -170 z" fill={CREAM} stroke={INK} strokeWidth="8" />
          <circle cx="980" cy="430" r="34" fill="none" stroke={ACCENT} strokeWidth="10" />
          <circle cx="980" cy="430" r="12" fill={ACCENT} />
          <path d="M 936 540 l -52 70 l 64 -16 M 1024 540 l 52 70 l -64 -16" fill="none" stroke={CREAM} strokeWidth="9" strokeLinejoin="round" />
          <path d="M 962 580 q 18 70 18 110 q 0 -40 18 -110" fill="none" stroke={ACCENT} strokeWidth="10" strokeLinecap="round" className="bs-blink" />
        </g>
      </g>
      {/* stars */}
      <Sparks dark pts={[[1180, 720, 16], [520, 300, 14], [820, 200, 12], [1320, 480, 14], [640, 920, 13]]} />
    </>
  );
}

// ── WhyItWorks: ENVIRONMENT · the workbench ──────────────────────────────────
function EnvironmentArt() {
  return (
    <>
      <Paper id="env" from="#F7EBD8" to="#EFD9B8" num="A" label="STUDIO // ENVIRONMENT" />
      {/* pegboard */}
      <rect x="380" y="160" width="700" height="320" rx="24" fill="#fff" stroke={INK} strokeWidth="10" />
      {[...Array(15)].map((_, i) => (
        <circle key={i} cx={440 + (i % 5) * 145} cy={230 + Math.floor(i / 5) * 95} r="9" fill="rgba(26,21,16,0.15)" />
      ))}
      {/* wrench on board */}
      <g transform="rotate(-30 560 330)">
        <path d="M 560 250 a 36 36 0 1 1 -2 0 M 545 320 h 32 v 130 h -32 z" fill={CREAM} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
      </g>
      {/* screwdriver */}
      <g transform="rotate(22 860 330)">
        <rect x="845" y="240" width="34" height="90" rx="14" fill={ACCENT} stroke={INK} strokeWidth="8" />
        <line x1="862" y1="330" x2="862" y2="430" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      </g>
      {/* bench */}
      <line x1="180" y1="760" x2="1270" y2="760" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <line x1="260" y1="760" x2="260" y2="930" stroke={INK} strokeWidth="11" />
      <line x1="1190" y1="760" x2="1190" y2="930" stroke={INK} strokeWidth="11" />
      {/* lamp */}
      <g className="bs-sway" style={{ transformOrigin: '1120px 760px' }}>
        <path d="M 1120 760 L 1040 600 L 940 560" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M 968 524 a 52 52 0 0 1 -56 72 z" fill={ACCENT} stroke={INK} strokeWidth="8" />
        <path d="M 905 600 L 830 680" stroke="rgba(255,90,0,0.5)" strokeWidth="34" strokeLinecap="round" className="bs-blink" />
      </g>
      {/* project on bench */}
      <rect x="470" y="650" width="220" height="110" rx="16" fill={CREAM} stroke={INK} strokeWidth="9" />
      <circle cx="540" cy="705" r="26" fill="none" stroke={ACCENT} strokeWidth="9" className="bs-pulse" />
      <line x1="600" y1="680" x2="660" y2="680" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <line x1="600" y1="715" x2="645" y2="715" stroke={INK} strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      <Sparks pts={[[250, 280, 15], [1300, 380, 14], [330, 560, 12]]} />
    </>
  );
}

// ── WhyItWorks: CULTURE · makers in connection ───────────────────────────────
function CultureArt() {
  const Node = ({ x, y, s = 1, accent = false }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-26" r="34" fill={accent ? ACCENT : '#fff'} stroke={INK} strokeWidth="9" />
      <path d="M -52 64 a 52 46 0 0 1 104 0 z" fill={accent ? 'rgba(255,90,0,0.25)' : CREAM} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
    </g>
  );
  return (
    <>
      <Paper id="culture" from="#F4E4CC" to="#E8CDA4" num="B" label="STUDIO // CULTURE" />
      {/* connection lines */}
      <g stroke={INK} strokeWidth="6" strokeDasharray="4 26" strokeLinecap="round" opacity="0.5">
        <path d="M 420 480 Q 620 360 810 440" fill="none" />
        <path d="M 470 560 Q 720 700 990 540" fill="none" />
        <path d="M 880 470 Q 1040 380 1130 430" fill="none" />
      </g>
      <Node x={380} y={500} s={1.25} />
      <Node x={860} y={470} s={1.1} accent />
      <Node x={1160} y={480} s={0.95} />
      <Node x={640} y={730} s={1.05} />
      <Node x={1010} y={760} s={0.9} />
      {/* idea spark above the small maker */}
      <g className="bs-float">
        <circle cx="860" cy="330" r="30" fill="none" stroke={ACCENT} strokeWidth="9" />
        <path d="M 860 286 V 252 M 904 345 l 30 12 M 816 345 l -30 12" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" />
      </g>
      <Sparks pts={[[260, 300, 15], [1280, 300, 14], [520, 900, 13], [1240, 880, 12]]} />
    </>
  );
}

// ── WhyItWorks: OUTCOMES · the public stage ──────────────────────────────────
function OutcomesArt() {
  return (
    <>
      <Paper id="outcomes" from="#241D14" to="#43301A" num="C" label="STUDIO // OUTCOMES" dark />
      {/* spotlight beams */}
      <path d="M 540 90 L 380 660 H 760 z" fill="rgba(255,90,0,0.13)" />
      <path d="M 940 90 L 800 660 H 1140 z" fill="rgba(245,240,232,0.08)" />
      {/* podium */}
      <g stroke={CREAM} strokeWidth="9" fill="none" strokeLinejoin="round">
        <rect x="560" y="620" width="330" height="190" fill="rgba(245,240,232,0.06)" />
        <rect x="330" y="700" width="230" height="110" fill="rgba(245,240,232,0.04)" />
        <rect x="890" y="700" width="230" height="110" fill="rgba(245,240,232,0.04)" />
      </g>
      <text x="725" y="745" textAnchor="middle" fontFamily="'Space Mono', monospace" fontWeight="700" fontSize="76" fill={ACCENT}>1</text>
      {/* maker presenting: simple figure with raised build */}
      <g className="bs-float" style={{ transformOrigin: '725px 480px' }}>
        <circle cx="725" cy="430" r="38" fill={CREAM} stroke={INK} strokeWidth="6" />
        <path d="M 725 468 v 110 M 725 500 l -70 -50 M 725 500 l 70 -64 M 725 578 l -44 42 M 725 578 l 44 42" stroke={CREAM} strokeWidth="11" strokeLinecap="round" />
        {/* the build held high */}
        <rect x="770" y="396" width="64" height="48" rx="10" fill={ACCENT} stroke="#fff" strokeWidth="5" />
        <circle cx="802" cy="420" r="9" fill="#fff" />
      </g>
      {/* portfolio cards drifting */}
      <g className="bs-float-rev">
        <rect x="1090" y="300" width="150" height="100" rx="14" fill="rgba(245,240,232,0.1)" stroke={CREAM} strokeWidth="7" />
        <line x1="1115" y1="335" x2="1215" y2="335" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" />
        <line x1="1115" y1="365" x2="1185" y2="365" stroke={CREAM} strokeWidth="7" strokeLinecap="round" opacity="0.6" />
      </g>
      <Sparks dark pts={[[300, 260, 16], [1180, 560, 13], [420, 480, 12], [1300, 180, 14]]} />
    </>
  );
}

const VARIANTS = {
  tinker: TinkerArt,
  build: BuildArt,
  engineer: EngineerArt,
  invent: InventArt,
  environment: EnvironmentArt,
  culture: CultureArt,
  outcomes: OutcomesArt,
};

export default function MakerArt({ variant, className = '' }) {
  const Art = VARIANTS[variant] || TinkerArt;
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={`${variant} illustration`}
    >
      <style>{`
        .bs-spin { animation: bsSpin 14s linear infinite; }
        .bs-spin-slow { animation: bsSpin 24s linear infinite; }
        .bs-float { animation: bsFloat 5s ease-in-out infinite; }
        .bs-float-rev { animation: bsFloat 6s ease-in-out infinite reverse; }
        .bs-sway { animation: bsSway 6s ease-in-out infinite; }
        .bs-blink { animation: bsBlink 2.4s ease-in-out infinite; }
        .bs-pulse { animation: bsPulse 2.8s ease-in-out infinite; }
        @keyframes bsSpin { to { transform: rotate(360deg); } }
        @keyframes bsFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes bsSway { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
        @keyframes bsBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes bsPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (prefers-reduced-motion: reduce) {
          .bs-spin, .bs-spin-slow, .bs-float, .bs-float-rev, .bs-sway, .bs-blink, .bs-pulse { animation: none; }
        }
      `}</style>
      <Art />
    </svg>
  );
}
