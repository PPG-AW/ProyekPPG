/* ------------------------------------------------------------------ */
/*  Ilustrasi SVG bergaya poster untuk tiap komponen bahan             */
/* ------------------------------------------------------------------ */

const INK = "#26221b";

interface CapProps {
  hex: string;
  dark: string;
  light: string;
  size?: number;
  className?: string;
}

/** Tutup botol plastik dilihat dari atas */
export function BottleCap({ hex, dark, light, size = 48, className }: CapProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle cx="32" cy="32" r="30" fill={dark} />
      <circle
        cx="32"
        cy="32"
        r="26.5"
        fill="none"
        stroke={light}
        strokeWidth="7"
        strokeDasharray="4.8 3.6"
        opacity="0.95"
      />
      <circle cx="32" cy="32" r="20.5" fill={hex} />
      <circle cx="32" cy="32" r="20.5" fill="none" stroke={dark} strokeWidth="2.5" opacity="0.55" />
      <ellipse
        cx="24"
        cy="20.5"
        rx="9"
        ry="4.6"
        fill="#ffffff"
        opacity="0.38"
        transform="rotate(-22 24 20.5)"
      />
    </svg>
  );
}

interface IllusProps {
  className?: string;
}

function GroundShadow() {
  return <ellipse cx="48" cy="82" rx="36" ry="6" fill={INK} opacity="0.1" />;
}

/** Tumpukan tutup botol berbagai warna */
export function IllusCaps({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <g transform="translate(8 26)">
        <circle cx="26" cy="30" r="22" fill="#a12a30" />
        <circle cx="26" cy="30" r="19" fill="none" stroke="#ff9a9d" strokeWidth="5.5" strokeDasharray="3.6 2.8" />
        <circle cx="26" cy="30" r="14" fill="#e5484d" />
      </g>
      <g transform="translate(46 18)">
        <circle cx="26" cy="30" r="22" fill="#1c51bd" />
        <circle cx="26" cy="30" r="19" fill="none" stroke="#a6c8ff" strokeWidth="5.5" strokeDasharray="3.6 2.8" />
        <circle cx="26" cy="30" r="14" fill="#3b82f6" />
      </g>
      <g transform="translate(28 44)">
        <circle cx="26" cy="30" r="22" fill="#b98a00" />
        <circle cx="26" cy="30" r="19" fill="none" stroke="#ffe27e" strokeWidth="5.5" strokeDasharray="3.6 2.8" />
        <circle cx="26" cy="30" r="14" fill="#f2b705" />
        <circle cx="26" cy="30" r="6" fill={INK} />
        <circle cx="24" cy="28" r="2" fill="#fbf7ec" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Papan triplek bekas */
export function IllusBoard({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <rect x="10" y="26" width="76" height="38" rx="5" fill="#ddb987" stroke={INK} strokeWidth="3" />
      <rect x="10" y="52" width="76" height="12" rx="5" fill="#c29356" stroke={INK} strokeWidth="3" />
      <path d="M18 36 Q 36 32 52 36 T 82 37" fill="none" stroke="#b08147" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 45 Q 40 42 62 45" fill="none" stroke="#b08147" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="57" r="2.4" fill={INK} />
      <circle cx="78" cy="57" r="2.4" fill={INK} />
      <rect x="36" y="14" width="24" height="10" rx="3" fill="#fbf7ec" stroke={INK} strokeWidth="2.5" />
      <path d="M40 19 h16" stroke={INK} strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
    </svg>
  );
}

/** Sepuluh tiang lidi berwarna */
export function IllusSticks({ className }: IllusProps) {
  const colors = ["#e5484d", "#f0762b", "#f2b705", "#22a06b", "#3b82f6"];
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      {colors.map((c, i) => (
        <g key={c} transform={`rotate(${(i - 2) * 9} 48 80)`}>
          <rect x={30 + i * 8} y={16} width="7" height="60" rx="3.5" fill={c} stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      <rect x="24" y="56" width="52" height="12" rx="6" fill="#8b5cf6" stroke={INK} strokeWidth="2.5" />
      <path d="M30 62 h40" stroke="#fbf7ec" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
    </svg>
  );
}

/** Lem tembak */
export function IllusGlue({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <path d="M14 44 C 30 30 52 26 70 30 L 78 40 L 70 46 C 52 42 36 46 24 56 Z" fill="#f2b705" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="72" y="30" width="16" height="12" rx="5" fill="#9aa3ab" stroke={INK} strokeWidth="3" transform="rotate(14 80 36)" />
      <rect x="34" y="50" width="14" height="24" rx="6" fill="#f0762b" stroke={INK} strokeWidth="3" transform="rotate(-12 41 62)" />
      <rect x="18" y="38" width="12" height="9" rx="4.5" fill="#8b5cf6" stroke={INK} strokeWidth="2.5" />
      <path d="M88 40 q 6 3 0 8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="86" cy="54" r="3.4" fill="#22a06b" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

/** Spidol & strip label laminating */
export function IllusLabel({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <rect x="16" y="30" width="44" height="34" rx="5" fill="#fbf7ec" stroke={INK} strokeWidth="3" />
      <rect x="12" y="24" width="18" height="10" rx="3" fill="rgba(242,183,5,.6)" stroke={INK} strokeWidth="2" transform="rotate(-8 21 29)" />
      <path d="M23 40 h28 M23 48 h22 M23 56 h28" stroke={INK} strokeWidth="2.4" strokeDasharray="4 4" strokeLinecap="round" />
      <g transform="rotate(32 66 52)">
        <rect x="58" y="30" width="11" height="36" rx="4" fill="#e5484d" stroke={INK} strokeWidth="2.5" />
        <rect x="58" y="26" width="11" height="10" rx="4" fill="#26221b" />
        <path d="M60.5 66 h6 l -3 9 z" fill="#d9cdb4" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <path d="M64 80 q 10 3 18 -2" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Alat bantu: penggaris & gunting */
export function IllusTools({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <g transform="rotate(-24 46 44)">
        <rect x="16" y="34" width="58" height="14" rx="3" fill="#f2b705" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${24 + i * 6} 34 v${i % 2 === 0 ? 7 : 4.5}`} stroke={INK} strokeWidth="2" />
        ))}
      </g>
      <g transform="rotate(18 60 66)">
        <circle cx="48" cy="72" r="7" fill="none" stroke={INK} strokeWidth="3.4" />
        <circle cx="64" cy="76" r="7" fill="none" stroke={INK} strokeWidth="3.4" />
        <path d="M53 66 L 78 44 M 59 70 L 84 50" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M53 66 L 78 44 L 84 50" fill="none" stroke="#9aa3ab" strokeWidth="2" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Bor / paku panas kecil untuk melubangi tutup */
export function IllusDrill({ className }: IllusProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <GroundShadow />
      <rect x="20" y="28" width="34" height="26" rx="9" fill="#3b82f6" stroke={INK} strokeWidth="3" />
      <rect x="26" y="52" width="14" height="24" rx="6" fill="#1c51bd" stroke={INK} strokeWidth="3" />
      <rect x="52" y="34" width="12" height="14" rx="4" fill="#9aa3ab" stroke={INK} strokeWidth="2.5" />
      <path d="M64 41 h18" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M70 36 l4 5 -4 5 M76 36 l4 5 -4 5" fill="none" stroke="#9aa3ab" strokeWidth="2" strokeLinecap="round" />
      <circle cx="31" cy="41" r="4" fill="#f2b705" stroke={INK} strokeWidth="2" />
      <path d="M22 22 q 6 -8 14 -8 M20 18 l 0 6 M20 18 l 6 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
