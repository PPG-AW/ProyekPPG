import { CAPS, type CapColor } from "./Cap";

const INK = "#26221B";

export type MaterialKind =
  | "board"
  | "sticks"
  | "caps"
  | "glue"
  | "labels"
  | "scissors"
  | "ruler"
  | "drill";

/* bayangan tanah lembut di bawah objek */
function Ground({ cx = 48, cy = 84, rx = 32 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={5.5} fill={INK} opacity="0.1" />;
}

/* tutup botol mini untuk disusun dalam ilustrasi */
function CapG({
  color,
  cx,
  cy,
  r = 14,
  rot = 0,
}: {
  color: CapColor;
  cx: number;
  cy: number;
  r?: number;
  rot?: number;
}) {
  const c = CAPS[color];
  const s = r / 30;
  const sw = 3 / s;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
      <circle r="30" fill={c.dark} stroke={INK} strokeWidth={sw} />
      <circle r="26.2" fill="none" stroke={c.light} strokeWidth="7" strokeDasharray="4.8 3.6" />
      <circle r="20.5" fill={c.base} stroke={c.dark} strokeWidth="1.6" />
      <ellipse cx="-8" cy="-10" rx="8.2" ry="4.6" fill="#fff" opacity="0.38" transform="rotate(-22)" />
      <circle r="4.4" fill="#F7F0E1" stroke={INK} strokeWidth={2.2 / s} />
    </g>
  );
}

function ArtBoard() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={82} rx={38} />
      <g transform="rotate(-3 48 50)">
        {/* lembar kardus */}
        <rect x="12" y="26" width="72" height="48" rx="4" fill="#D2A46B" stroke={INK} strokeWidth="3" />
        {/* sisi bergelombang khas kardus */}
        <rect x="12" y="68" width="72" height="6" fill="#C08F52" stroke={INK} strokeWidth="2" />
        <path
          d="M14 71q2-3 4 0t4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0 4 0"
          fill="none"
          stroke={INK}
          strokeWidth="1.4"
          opacity="0.55"
        />
        {/* serat & lipatan kardus */}
        <path d="M12 40h72M12 54h72" stroke={INK} strokeWidth="1.4" opacity="0.22" />
        <path d="M30 26v42M62 26v42" stroke={INK} strokeWidth="1.4" opacity="0.16" strokeDasharray="4 4" />
        {/* tanda titik posisi tiang */}
        {[22, 36, 50, 64, 78].map((x) => (
          <circle key={x} cx={x} cy={60} r="2" fill="#F0762B" stroke={INK} strokeWidth="1.4" />
        ))}
        {/* lapis atas */}
        <rect x="12" y="26" width="72" height="9" rx="4" fill="#fff" opacity="0.16" />
      </g>
    </svg>
  );
}

function ArtSticks() {
  // sedotan kokoh warna-warni
  const straws = [
    { x: 28, rot: -11, c: "#E5484D", d: "#B33639" },
    { x: 40, rot: -5, c: "#3B82F6", d: "#2C63C4" },
    { x: 52, rot: 0, c: "#22A06B", d: "#1A7C54" },
    { x: 64, rot: 6, c: "#F2B705", d: "#C29204" },
    { x: 76, rot: 12, c: "#8B5CF6", d: "#6F4AC5" },
  ];
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={50} cy={84} rx={34} />
      {straws.map((s, i) => (
        <g key={i} transform={`rotate(${s.rot} ${s.x} 78)`}>
          {/* badan sedotan */}
          <rect x={s.x - 4.5} y={14} width="9" height="64" rx="4.5" fill={s.c} stroke={INK} strokeWidth="2.6" />
          {/* garis spiral khas sedotan */}
          <path
            d={`M${s.x - 4.5} 26h9M${s.x - 4.5} 38h9M${s.x - 4.5} 50h9M${s.x - 4.5} 62h9`}
            stroke="#fff"
            strokeWidth="2.6"
            opacity="0.55"
          />
          {/* mulut sedotan (elips terbuka) */}
          <ellipse cx={s.x} cy="14" rx="4.5" ry="2.2" fill={s.d} stroke={INK} strokeWidth="2.2" />
        </g>
      ))}
      {/* pita penanda "kokoh" */}
      <rect
        x="24"
        y="52"
        width="50"
        height="12"
        rx="4"
        fill="#F2B705"
        fillOpacity="0.55"
        stroke={INK}
        strokeWidth="2.2"
        strokeDasharray="5 4"
      />
    </svg>
  );
}

function ArtCaps() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={84} rx={36} />
      <CapG color="blue" cx={26} cy={66} r={15} rot={-14} />
      <CapG color="green" cx={52} cy={72} r={16} rot={8} />
      <CapG color="orange" cx={74} cy={60} r={13} rot={18} />
      <CapG color="red" cx={38} cy={44} r={15} rot={-6} />
      <CapG color="yellow" cx={62} cy={36} r={12} rot={12} />
      <CapG color="purple" cx={22} cy={34} r={10} rot={-20} />
    </svg>
  );
}

function ArtGlue() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={86} rx={32} />
      <g transform="rotate(-24 48 48)">
        {/* kabel */}
        <path d="M70 62q14 8 10 18" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        {/* badan */}
        <rect x="18" y="34" width="46" height="20" rx="9" fill="#F0762B" stroke={INK} strokeWidth="3" />
        <rect x="52" y="30" width="16" height="12" rx="4" fill="#BC5C20" stroke={INK} strokeWidth="2.6" />
        {/* moncong */}
        <path d="M18 40 6 45l12 6z" fill="#D9CDB4" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        {/* gagang + pelatuk */}
        <path d="M46 54 42 74a5 5 0 0 0 10 2l4-20z" fill="#F0762B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M34 55q2 8 8 9" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        {/* lem menetes */}
        <path d="M6 50q1 6-2 8" fill="none" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
        <rect x="24" y="38" width="16" height="5" rx="2.5" fill="#fff" opacity="0.35" />
      </g>
    </svg>
  );
}

function ArtLabels() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={86} rx={34} />
      {/* gulungan solasi */}
      <g transform="translate(2 4)">
        <circle cx="32" cy="46" r="24" fill="#EFE4CC" stroke={INK} strokeWidth="3" />
        <circle cx="32" cy="46" r="16" fill="#D9CDB4" stroke={INK} strokeWidth="2.4" />
        <circle cx="32" cy="46" r="9" fill="#F7F0E1" stroke={INK} strokeWidth="2.6" />
        <path d="M20 34a17 17 0 0 1 12-5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        {/* ujung solasi terjulur */}
        <path d="M53 38q14 4 26 0v13q-13 4-27 0z" fill="#EFE4CC" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M56 45h20" stroke={INK} strokeWidth="1.6" strokeDasharray="3 3" opacity="0.5" />
      </g>
      {/* strip solasi ditempel + tulisan angka */}
      <g transform="rotate(-4 52 78)">
        <rect x="26" y="70" width="58" height="17" rx="3" fill="#FBF7EC" stroke={INK} strokeWidth="2.6" />
        <path d="M26 70v17M84 70v17" stroke={INK} strokeWidth="2" strokeDasharray="3 3" opacity="0.45" />
        {/* angka ditulis spidol */}
        <path d="M36 75v8M44 75v8M42 79h4M54 75h5v8h-5M66 75h6M69 75v8" stroke="#8B5CF6" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
      {/* spidol kecil */}
      <g transform="rotate(38 80 24)">
        <rect x="74" y="8" width="11" height="26" rx="5" fill="#8B5CF6" stroke={INK} strokeWidth="2.6" />
        <rect x="74" y="8" width="11" height="7" rx="3.5" fill="#6F4AC5" stroke={INK} strokeWidth="2.2" />
        <path d="M77 34h5l-2.5 6z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function ArtScissors() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={86} rx={30} />
      <g strokeLinecap="round">
        {/* bilah */}
        <path d="M34 54 72 14" stroke={INK} strokeWidth="3" />
        <path d="M33 52 70 14l4 3L38 55z" fill="#D9CDB4" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M40 55 76 44" stroke={INK} strokeWidth="3" />
        <path d="M38 53 76 41l1 5L40 58z" fill="#D9CDB4" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="36" cy="54" r="3" fill="#26221B" />
        {/* gagang */}
        <circle cx="24" cy="62" r="9" fill="none" stroke={INK} strokeWidth="3.4" />
        <circle cx="26" cy="62" r="9" fill="#3B82F6" fillOpacity="0.3" stroke="none" />
        <ellipse cx="38" cy="72" rx="11" ry="8" fill="none" stroke={INK} strokeWidth="3.4" />
        <ellipse cx="38" cy="72" rx="11" ry="8" fill="#3B82F6" fillOpacity="0.3" stroke="none" />
      </g>
    </svg>
  );
}

function ArtRuler() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={84} rx={36} />
      {/* penggaris */}
      <g transform="rotate(-14 46 44)">
        <rect x="10" y="32" width="64" height="20" rx="4" fill="#F2B705" stroke={INK} strokeWidth="3" />
        {[18, 26, 34, 42, 50, 58, 66].map((x, i) => (
          <path key={x} d={`M${x} 32v${i % 2 === 0 ? 8 : 5}`} stroke={INK} strokeWidth="2" />
        ))}
        <circle cx="18" cy="46" r="2.4" fill={INK} opacity="0.7" />
      </g>
      {/* spidol */}
      <g transform="rotate(16 68 60)">
        <rect x="60" y="40" width="14" height="36" rx="6" fill="#8B5CF6" stroke={INK} strokeWidth="3" />
        <rect x="60" y="40" width="14" height="9" rx="4" fill="#6F4AC5" stroke={INK} strokeWidth="2.4" />
        <path d="M64 76h6l-3 8z" fill="#26221B" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M66 86q4 4 9 2" fill="none" stroke="#8B5CF6" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ArtDrill() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <Ground cx={48} cy={86} rx={34} />
      {/* palu */}
      <g transform="rotate(-18 44 40)">
        <rect x="38" y="34" width="9" height="44" rx="4.5" fill="#C29356" stroke={INK} strokeWidth="2.8" />
        <rect x="24" y="14" width="36" height="20" rx="7" fill="#6B6252" stroke={INK} strokeWidth="3" />
        <rect x="24" y="14" width="10" height="20" rx="5" fill="#8A8069" stroke={INK} strokeWidth="2.4" />
        <rect x="30" y="18" width="22" height="5" rx="2.5" fill="#fff" opacity="0.25" />
      </g>
      {/* paku besar + tutup yang dilubangi */}
      <g>
        <CapG color="red" cx={66} cy={66} r={15} rot={14} />
        <path d="M66 48v14" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <circle cx="66" cy="46" r="4.4" fill="#D9CDB4" stroke={INK} strokeWidth="2.6" />
        <path d="M76 44l6-4M78 54l7-1" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

export function MaterialArt({ kind }: { kind: MaterialKind }) {
  switch (kind) {
    case "board":
      return <ArtBoard />;
    case "sticks":
      return <ArtSticks />;
    case "caps":
      return <ArtCaps />;
    case "glue":
      return <ArtGlue />;
    case "labels":
      return <ArtLabels />;
    case "scissors":
      return <ArtScissors />;
    case "ruler":
      return <ArtRuler />;
    case "drill":
      return <ArtDrill />;
  }
}
