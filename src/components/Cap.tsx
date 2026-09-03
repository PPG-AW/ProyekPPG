export const CAPS = {
  red: { base: "#E5484D", dark: "#B33639", light: "#F48185", name: "Merah" },
  blue: { base: "#3B82F6", dark: "#2C63C4", light: "#7FACF9", name: "Biru" },
  yellow: { base: "#F2B705", dark: "#C29204", light: "#F7CF57", name: "Kuning" },
  green: { base: "#22A06B", dark: "#1A7C54", light: "#58C093", name: "Hijau" },
  purple: { base: "#8B5CF6", dark: "#6F4AC5", light: "#B392FA", name: "Ungu" },
  orange: { base: "#F0762B", dark: "#BC5C20", light: "#F59E63", name: "Oranye" },
} as const;

export type CapColor = keyof typeof CAPS;
export const CAP_ORDER: CapColor[] = ["red", "blue", "yellow", "green", "purple", "orange"];

/** Warna aksen 10 tiang */
export const POLE_ACCENTS = [
  "#E5484D",
  "#3B82F6",
  "#F2B705",
  "#22A06B",
  "#8B5CF6",
  "#F0762B",
  "#EC4899",
  "#2EA8A0",
  "#6366F1",
  "#8FBF3F",
];

interface BottleCapProps {
  color: CapColor;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** varian bayangan: cincin putus-putus untuk pratinjau jatuh */
  ghost?: boolean;
}

/** Tutup botol dilihat dari atas: gerigi bergerigi + lubang tengah */
export function BottleCap({ color, size = 64, className, style, ghost = false }: BottleCapProps) {
  const c = CAPS[color];
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      {ghost ? (
        <>
          <circle
            cx="32"
            cy="32"
            r="29"
            fill={c.base}
            fillOpacity="0.14"
            stroke="#26221B"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
          />
          <circle
            cx="32"
            cy="32"
            r="18"
            fill="none"
            stroke="#26221B"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </>
      ) : (
        <>
          {/* cincin luar gelap */}
          <circle cx="32" cy="32" r="30" fill={c.dark} stroke="#26221B" strokeWidth="3" />
          {/* gerigi khas tutup botol */}
          <circle
            cx="32"
            cy="32"
            r="26.2"
            fill="none"
            stroke={c.light}
            strokeWidth="7"
            strokeDasharray="4.8 3.6"
          />
          {/* muka tutup */}
          <circle cx="32" cy="32" r="20.5" fill={c.base} stroke={c.dark} strokeWidth="1.6" />
          {/* kilau */}
          <ellipse
            cx="24.5"
            cy="21.5"
            rx="8.2"
            ry="4.6"
            fill="#fff"
            opacity="0.38"
            transform="rotate(-22 24.5 21.5)"
          />
          {/* lubang tengah (hasil pelubangan) */}
          <circle cx="32" cy="32" r="7.2" fill="none" stroke={c.dark} strokeWidth="1.4" opacity="0.85" />
          <circle cx="32" cy="32" r="4.4" fill="#F7F0E1" stroke="#26221B" strokeWidth="2.2" />
        </>
      )}
    </svg>
  );
}

/** Tumpukan tutup kecil untuk logo */
export function CapLogo({ size = 40 }: { size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span className="absolute left-0 top-1 -rotate-12">
        <BottleCap color="blue" size={size * 0.72} />
      </span>
      <span className="absolute right-0 top-0 rotate-12">
        <BottleCap color="red" size={size * 0.72} />
      </span>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <BottleCap color="yellow" size={size * 0.72} />
      </span>
    </span>
  );
}
