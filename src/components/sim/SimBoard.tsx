import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dices, Eraser, Hand, MousePointer2, Sparkles } from "lucide-react";
import {
  CAP_COLORS,
  CAP_MAP,
  MAX_STACK,
  ROD_HUES,
  totalCaps,
  type CapColorId,
  type RodState,
} from "../../lib/types";
import { presetNilai, randomRods } from "../../lib/presets";
import { cn } from "../../utils/cn";
import { BottleCap } from "../illustrations";

interface SimBoardProps {
  rods: RodState[];
  setRods: (r: RodState[]) => void;
}

const CAP_STEP = 15;
const CAP_SIZE = 44;

interface DragSession {
  kind: "tray" | "stack";
  color: CapColorId;
  fromRod?: number;
  pointerId: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
}

export default function SimBoard({ rods, setRods }: SimBoardProps) {
  const rodRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [drag, setDrag] = useState<DragSession | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const n = totalCaps(rods);

  const usedPerColor = useMemo(() => {
    const map = new Map<CapColorId, number>();
    rods.forEach((r) => r.caps.forEach((c) => map.set(c, (map.get(c) ?? 0) + 1)));
    return map;
  }, [rods]);

  const rodAtPoint = (x: number, y: number): number | null => {
    for (let i = 0; i < rodRefs.current.length; i++) {
      const el = rodRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left - 16 && x <= r.right + 16 && y >= r.top - 40 && y <= r.bottom + 14) return i;
    }
    return null;
  };

  /* ---------------- aksi papan ---------------- */

  const addCap = (rod: number, color: CapColorId) =>
    setRods(
      rods.map((r, i) =>
        i === rod && r.caps.length < MAX_STACK ? { ...r, caps: [...r.caps, color] } : r,
      ),
    );

  const removeTop = (rod: number) =>
    setRods(rods.map((r, i) => (i === rod ? { ...r, caps: r.caps.slice(0, -1) } : r)));

  const moveTop = (from: number, to: number) => {
    const color = rods[from].caps[rods[from].caps.length - 1];
    if (!color || rods[to].caps.length >= MAX_STACK) return;
    setRods(
      rods.map((r, i) => {
        if (i === from) return { ...r, caps: r.caps.slice(0, -1) };
        if (i === to) return { ...r, caps: [...r.caps, color] };
        return r;
      }),
    );
  };

  const setLabel = (i: number, label: string) =>
    setRods(rods.map((r, idx) => (idx === i ? { ...r, label: label.slice(0, 9) } : r)));

  /* ---------------- mesin seret (pointer) ---------------- */

  const beginDrag = (e: React.PointerEvent, session: Omit<DragSession, "pointerId" | "x" | "y" | "startX" | "startY">) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    setDrag({
      ...session,
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  useEffect(() => {
    if (!drag) return;

    const move = (e: PointerEvent) => {
      if (e.pointerId !== drag.pointerId) return;
      e.preventDefault();
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      setOver(rodAtPoint(e.clientX, e.clientY));
    };

    const up = (e: PointerEvent) => {
      if (e.pointerId !== drag.pointerId) return;
      const target = rodAtPoint(e.clientX, e.clientY);
      if (drag.kind === "tray") {
        if (target !== null && rods[target].caps.length < MAX_STACK) addCap(target, drag.color);
      } else if (drag.fromRod !== undefined) {
        const moved = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 20;
        if (target !== null && target !== drag.fromRod && rods[target].caps.length < MAX_STACK) {
          moveTop(drag.fromRod, target);
        } else if (target === null && moved) {
          removeTop(drag.fromRod);
        }
      }
      setDrag(null);
      setOver(null);
    };

    const cancel = () => {
      setDrag(null);
      setOver(null);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag?.pointerId, drag?.kind, drag?.fromRod, drag?.color, drag?.startX, drag?.startY, rods]);

  const dragCol = drag ? CAP_MAP[drag.color] : null;

  return (
    <div>
      {/* ---------- toolbar ---------- */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="mr-auto flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-inksoft">
          <MousePointer2 className="size-4" />
          Papan interaktif
        </p>
        <button
          onClick={() => setRods(presetNilai())}
          className="flex items-center gap-2 rounded-full border-2 border-ink bg-capblue px-4 py-2 text-sm font-bold text-white hard-shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="size-4" />
          Data Contoh
        </button>
        <button
          onClick={() => setRods(randomRods())}
          className="flex items-center gap-2 rounded-full border-2 border-ink bg-capyellow px-4 py-2 text-sm font-bold hard-shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Dices className="size-4" />
          Acak
        </button>
        <button
          onClick={() => setRods(rods.map((r) => ({ ...r, caps: [] })))}
          className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper2 px-4 py-2 text-sm font-bold transition-colors hover:bg-cream"
        >
          <Eraser className="size-4" />
          Bersihkan
        </button>
      </div>

      {/* ---------- papan ---------- */}
      <div className="relative">
        <div className="overflow-hidden rounded-3xl border-2 border-ink bg-wood hard-shadow">
          <div className="overflow-x-auto">
            <div className="relative min-w-[880px] px-6 pt-12 pb-5">
              {/* papan nama */}
              <div className="absolute top-3 left-5 rounded-md border-2 border-ink bg-cream px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase">
                Papan Statistik &amp; Peluang
              </div>
              <div className="absolute top-3 right-5 rounded-full border-2 border-ink/40 bg-cream/80 px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
                1 tutup = 1 data
              </div>

              {/* baris tiang */}
              <div className="flex items-end justify-between">
                {rods.map((r, i) => {
                  const full = r.caps.length >= MAX_STACK;
                  const isOver = over === i;
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        rodRefs.current[i] = el;
                      }}
                      className={cn(
                        "relative w-[76px] rounded-t-2xl pt-9 transition-colors",
                        drag?.kind === "stack" && drag.fromRod === i && "z-20",
                        isOver && !full && "bg-white/30",
                        isOver && full && "bg-capred/20",
                      )}
                      style={
                        isOver
                          ? {
                              outline: `2px dashed ${full ? "#e5484d" : ROD_HUES[i]}`,
                              outlineOffset: -2,
                            }
                          : undefined
                      }
                    >
                      <div className="relative h-[240px]">
                        {/* tiang */}
                        <div
                          className="absolute bottom-0 left-1/2 h-[238px] w-[9px] -translate-x-1/2 rounded-full border border-ink/50"
                          style={{ backgroundColor: ROD_HUES[i] }}
                        />
                        <div className="absolute bottom-0 left-1/2 h-[12px] w-[24px] -translate-x-1/2 rounded-t-md border border-ink/60 bg-wood2" />

                        {/* bayangan posisi jatuh tutup */}
                        {isOver && drag && !full && (
                          <div
                            className="absolute left-1/2 opacity-45"
                            style={{
                              bottom: 4 + r.caps.length * CAP_STEP,
                              zIndex: 90,
                              marginLeft: -CAP_SIZE / 2,
                            }}
                          >
                            <BottleCap
                              hex={dragCol!.hex}
                              dark={dragCol!.dark}
                              light={dragCol!.light}
                              size={CAP_SIZE}
                            />
                          </div>
                        )}

                        {/* susunan tutup */}
                        <AnimatePresence>
                          {r.caps.map((c, idx) => {
                            const col = CAP_MAP[c];
                            const isTop = idx === r.caps.length - 1;
                            const isDraggedTop =
                              isTop && drag?.kind === "stack" && drag.fromRod === i;
                            return (
                              <motion.div
                                key={`${idx}-${c}`}
                                initial={{ y: -90, opacity: 0, scale: 0.6 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -56, opacity: 0, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                                className="absolute left-1/2"
                                style={{
                                  bottom: 4 + idx * CAP_STEP,
                                  zIndex: 10 + idx,
                                  marginLeft: -CAP_SIZE / 2,
                                }}
                              >
                                <div
                                  onPointerDown={
                                    isTop ? (e) => beginDrag(e, { kind: "stack", color: c, fromRod: i }) : undefined
                                  }
                                  onContextMenu={(e) => {
                                    if (isTop) e.preventDefault();
                                  }}
                                  className={cn(
                                    "select-none",
                                    isTop
                                      ? "cursor-grab touch-none active:cursor-grabbing"
                                      : "pointer-events-none",
                                    isDraggedTop && "opacity-30",
                                  )}
                                  title={isTop ? "Seret keluar tiang untuk mengambil" : undefined}
                                >
                                  <BottleCap hex={col.hex} dark={col.dark} light={col.light} size={CAP_SIZE} />
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>

                      {/* jumlah */}
                      <div className="mt-1.5 grid place-items-center">
                        <span
                          className={cn(
                            "min-w-7 rounded-full border-2 px-1.5 py-0.5 text-center text-[11px] font-black",
                            r.caps.length > 0
                              ? "border-ink bg-cream"
                              : "border-ink/30 bg-cream/60 text-ink/40",
                          )}
                        >
                          {r.caps.length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* baris label */}
              <div className="mt-3 flex justify-between">
                {rods.map((r, i) => (
                  <div key={i} className="flex w-[76px] justify-center">
                    <input
                      value={r.label}
                      onChange={(e) => setLabel(i, e.target.value)}
                      placeholder="nilai"
                      aria-label={`Label nilai tiang ${i + 1}`}
                      className={cn(
                        "w-[68px] rounded-lg border-2 border-dashed bg-cream px-1 py-1.5 text-center text-sm font-bold transition-colors outline-none placeholder:text-ink/35",
                        r.label.trim()
                          ? "border-solid border-ink focus:bg-white"
                          : "border-ink/45 focus:border-ink focus:bg-white",
                      )}
                      style={
                        r.label.trim()
                          ? { boxShadow: `inset 0 -4px 0 ${ROD_HUES[i]}` }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>

              {/* strip bawah papan */}
              <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-ink/30 pt-2.5 text-[10px] font-bold tracking-[0.18em] text-ink/55 uppercase">
                <span>Maks {MAX_STACK} tutup / tiang</span>
                <span>Tarik tutup teratas untuk mengambil</span>
              </div>
            </div>
          </div>
        </div>

        {/* keadaan kosong */}
        <AnimatePresence>
          {n === 0 && !drag && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-20 grid place-items-center p-6"
            >
              <div className="max-w-sm rounded-2xl border-2 border-dashed border-ink bg-cream/95 px-6 py-5 text-center hard-shadow-sm">
                <p className="font-display text-lg font-black">Papan masih kosong</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">
                  Seret tutup botol dari nampan di bawah ke tiang mana pun, lalu tulis nilainya pada
                  strip di bawah tiang. Atau tekan <strong>Data Contoh</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- petunjuk seret ---------- */}
      <div className="mt-3 h-6">
        <AnimatePresence mode="wait">
          {drag ? (
            <motion.p
              key="drag"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="wiggle-hint flex items-center gap-2 text-sm font-bold text-capblue"
            >
              <Hand className="size-4" />
              {drag.kind === "tray"
                ? "Arahkan tutup ke tiang, lalu lepaskan untuk menyusunnya."
                : "Lepaskan di luar tiang untuk mengambil, atau pindahkan ke tiang lain."}
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-ink/55"
            >
              Total terpasang: <strong className="text-ink">{n}</strong> tutup botol pada{" "}
              {rods.filter((r) => r.caps.length > 0).length} tiang.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- nampan tutup ---------- */}
      <div className="mt-4 rounded-3xl border-2 border-ink bg-cream p-5 hard-shadow">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-inksoft">
            <Hand className="size-4" />
            Nampan tutup botol
          </p>
          <p className="text-[11px] font-semibold text-ink/55">
            Tahan lalu seret ke tiang — angka menunjukkan yang sudah terpasang
          </p>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-4 sm:gap-x-7">
          {CAP_COLORS.map((col) => {
            const isDragged = drag?.kind === "tray" && drag.color === col.id;
            return (
              <div key={col.id} className="flex flex-col items-center gap-1.5">
                <div
                  onPointerDown={(e) => beginDrag(e, { kind: "tray", color: col.id })}
                  onContextMenu={(e) => e.preventDefault()}
                  className={cn(
                    "cursor-grab touch-none rounded-full border-2 border-transparent p-1 transition-all select-none hover:border-ink/30 active:cursor-grabbing",
                    isDragged && "opacity-30",
                  )}
                  title={`Seret tutup ${col.name} ke tiang`}
                >
                  <BottleCap hex={col.hex} dark={col.dark} light={col.light} size={48} />
                </div>
                <span className="rounded-full border border-ink/25 bg-paper2 px-2 py-0.5 text-[11px] font-bold whitespace-nowrap">
                  {col.name} · ×{usedPerColor.get(col.id) ?? 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- tutup yang mengikuti kursor ---------- */}
      {drag && dragCol && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[90]"
          style={{
            left: drag.x,
            top: drag.y,
            transform: "translate(-50%, -55%) scale(1.18)",
            filter: "drop-shadow(0 10px 12px rgba(38,34,27,.35))",
          }}
        >
          <BottleCap hex={dragCol.hex} dark={dragCol.dark} light={dragCol.light} size={58} />
        </div>
      )}
    </div>
  );
}
