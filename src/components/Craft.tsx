import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

/* ---------------- Kartu kraft + selotip ---------------- */
export function Card({
  children,
  className,
  tape = false,
  tapeClass = "",
}: {
  children: ReactNode;
  className?: string;
  tape?: boolean;
  tapeClass?: string;
}) {
  return (
    <div className={cn("card-craft relative", className)}>
      {tape && (
        <span
          className={cn("tape -top-[13px] left-1/2 -translate-x-1/2", tapeClass)}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

/* ---------------- Chip kecil ---------------- */
export function Chip({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper2 px-3 py-1 text-[11px] font-bold",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Tombol pil ---------------- */
export function Pill({
  children,
  onClick,
  className,
  variant = "ink",
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "ink" | "paper" | "yellow" | "green" | "orange" | "red";
  disabled?: boolean;
  title?: string;
}) {
  const colors: Record<string, string> = {
    ink: "bg-ink text-cream",
    paper: "bg-paper2 text-ink",
    yellow: "bg-capyellow text-ink",
    green: "bg-capgreen text-cream",
    orange: "bg-caporange text-cream",
    red: "bg-capred text-cream",
  };
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "btn-lift shadow-off-sm inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold",
        colors[variant],
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- Kepala bagian ---------------- */
export function SectionHead({
  index,
  kicker,
  title,
  desc,
  accent = "text-capyellow",
  right,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  desc?: string;
  accent?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-3">
          <span className="font-display text-5xl font-black italic leading-none text-ink/15">
            {index}
          </span>
          <Chip className="bg-cream">{kicker}</Chip>
        </div>
        <h2 className="font-display text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          {title}
        </h2>
        {desc && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink2 sm:text-base">{desc}</p>}
      </div>
      {right}
      <span className={cn("hidden", accent)} aria-hidden />
    </div>
  );
}

/* ---------------- Stempel ---------------- */
export function Stamp({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("stamp", className)}>{children}</span>;
}

/* ---------------- Kanvas tetap yang diskalakan responsif ----------------
   Konten dirancang dalam koordinat piksel tetap (w x h), lalu diskalakan
   dengan transform agar posisi drag & getBoundingClientRect tetap akurat. */
export function Stage({
  width,
  height,
  children,
  className,
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(width);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setW(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = Math.min(1, w / width);

  return (
    <div ref={ref} className={cn("w-full overflow-hidden", className)} style={{ height: height * scale }}>
      <div
        className="relative"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
