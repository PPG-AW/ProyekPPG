import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as RPE,
} from "react";
import { motion } from "framer-motion";
import { Eraser, Hand, HelpCircle, MousePointer2, Sparkles } from "lucide-react";
import { Card, Chip, Pill, SectionHead, Stage } from "../components/Craft";
import { BottleCap, CAP_ORDER, POLE_ACCENTS, type CapColor } from "../components/Cap";
import { InsightPanel, StatsGrid, TugasCard, TutorialModal } from "./SimulasiPanels";
import {
  LS_TUTOR,
  MAX_CAPS,
  POLE_COUNT,
  computeStats,
  emptyPoles,
  samplePoles,
  type PoleState,
} from "./simShared";

/* ---------- geometri kanvas 660 x 490 ---------- */
const W = 660;
const H = 490;
const PADX = 40;
const COLW = 58;
const CAPD = 44;
const STEP = 15;
const BASE = 132; // jarak tepi bawah tutup terbawah dari dasar kolom

type DragSource = { kind: "tray" } | { kind: "pole"; pole: number };
interface DragState {
  color: CapColor;
  source: DragSource;
  x: number;
  y: number;
  hover: number | null;
  pid: number; // identitas pointer, supaya pointer lain tidak mengganggu
}

export default function Simulasi() {
  const [poles, setPoles] = useState<PoleState[]>(samplePoles);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [tutor, setTutor] = useState(false);

  const colRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragRef = useRef<DragState | null>(null);

  const stats = useMemo(() => computeStats(poles), [poles]);

  const colorCounts = useMemo(() => {
    const m: Record<CapColor, number> = { red: 0, blue: 0, yellow: 0, green: 0, purple: 0, orange: 0 };
    poles.forEach((p) => p.caps.forEach((c) => (m[c] += 1)));
    return m;
  }, [poles]);

  const filledPoles = poles.filter((p) => p.caps.length > 0).length;
  const canLevel = filledPoles >= 2 && stats.n % filledPoles === 0 && stats.n / filledPoles <= MAX_CAPS;

  /* ---------- panduan pertama kali ---------- */
  useEffect(() => {
    if (!localStorage.getItem(LS_TUTOR)) setTutor(true);
  }, []);
  const closeTutor = () => {
    setTutor(false);
    try {
      localStorage.setItem(LS_TUTOR, "1");
    } catch {
      /* abaikan */
    }
  };

  /* ---------- deteksi tiang langsung dari viewport ---------- */
  function detectPole(x: number, y: number): number | null {
    let best: number | null = null;
    let bestDx = Infinity;
    colRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const extraX = i === 0 || i === POLE_COUNT - 1 ? 30 : 6;
      const inX = x >= r.left - extraX && x <= r.right + extraX;
      const inY = y >= r.top - 76 && y <= r.bottom + 40;
      if (inX && inY) {
        const dx = Math.abs(x - (r.left + r.right) / 2);
        if (dx < bestDx) {
          bestDx = dx;
          best = i;
        }
      }
    });
    return best;
  }

  /* ---------- memulai seret ---------- */
  const beginDrag = (color: CapColor, source: DragSource) => (e: RPE) => {
    if (e.pointerType === "mouse" && e.button !== 0) return; // hanya tombol kiri
    e.preventDefault();
    // Bila ada seret lama yang tertinggal (pointerup terlewat karena kursor/jari
    // dilepas di luar jendela dsb.), timpa dengan seret baru agar tidak macet.
    const d: DragState = {
      color,
      source,
      x: e.clientX,
      y: e.clientY,
      hover: detectPole(e.clientX, e.clientY),
      pid: e.pointerId,
    };
    dragRef.current = d;
    setDrag(d);
  };

  /* ---------- listener global saat menyeret ---------- */
  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    document.body.style.cursor = "grabbing";

    const finish = (commitIt: boolean, x?: number, y?: number) => {
      if (commitIt && x !== undefined && y !== undefined) {
        commit(detectPole(x, y));
      }
      dragRef.current = null;
      setDrag(null);
    };

    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pid) return;
      // Penyembuhan diri: tombol mouse ternyata sudah dilepas tetapi event
      // pointerup terlewat — tutup seretan di posisi ini, jangan biarkan macet.
      if (e.pointerType === "mouse" && (e.buttons & 1) === 0) {
        finish(true, e.clientX, e.clientY);
        return;
      }
      const x = e.clientX;
      const y = e.clientY;
      const hover = detectPole(x, y);
      setDrag((cur) => {
        if (!cur) return cur;
        const nd = { ...cur, x, y, hover };
        dragRef.current = nd;
        return nd;
      });
    };

    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pid) return;
      finish(true, e.clientX, e.clientY);
    };

    const cancel = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pid) return;
      finish(false);
    };

    const blur = () => finish(false);
    const hidden = () => {
      if (document.hidden) finish(false);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", hidden);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  /* ---------- melepas tutup ---------- */
  function commit(target: number | null) {
    const d = dragRef.current;
    if (!d) return;
    let changed = false;
    setPoles((prev) => {
      const next = prev.map((p) => ({ ...p, caps: [...p.caps] }));
      if (d.source.kind === "tray") {
        if (target !== null && next[target].caps.length < MAX_CAPS) {
          next[target].caps.push(d.color);
          changed = true;
        }
      } else {
        const from = d.source.pole;
        if (target !== null) {
          if (target !== from && next[target].caps.length < MAX_CAPS) {
            next[from].caps.pop();
            next[target].caps.push(d.color);
            changed = true;
          }
        } else {
          next[from].caps.pop(); // dilepas di luar tiang = diambil
          changed = true;
        }
      }
      return next;
    });
    void changed;
  }

  /* ---------- teks petunjuk kontekstual ---------- */
  let hint = "Seret tutup dari nampan ke tiang, atau geser tutup teratas untuk memindahkannya.";
  if (drag) {
    const hoverLabel = drag.hover !== null ? poles[drag.hover].label.trim() || `Tiang ${drag.hover + 1}` : "";
    const hoverFull = drag.hover !== null && poles[drag.hover].caps.length >= MAX_CAPS;
    if (drag.source.kind === "tray") {
      if (drag.hover === null) hint = "Arahkan ke sebuah tiang, lalu lepaskan untuk menaruh.";
      else if (hoverFull) hint = "Tiang ini penuh — maksimal 12 tutup. Cari tiang lain.";
      else hint = `Lepaskan untuk menaruh di tiang "${hoverLabel}".`;
    } else {
      const from = drag.source.pole;
      if (drag.hover === null) hint = "Lepaskan di luar tiang untuk mengambil tutup ini.";
      else if (drag.hover === from) hint = "Ini tiang asalnya — lepaskan untuk mengembalikan.";
      else if (hoverFull) hint = "Tiang tujuan penuh — maksimal 12 tutup.";
      else hint = `Lepaskan untuk memindahkan ke tiang "${hoverLabel}".`;
    }
  }

  /* ---------- mean: bagi rata tumpukan ---------- */
  const levelPoles = () => {
    if (!canLevel) return;
    const q = stats.n / filledPoles;
    const all = poles.flatMap((p) => p.caps);
    let k = 0;
    setPoles((prev) =>
      prev.map((p) =>
        p.caps.length === 0 ? { ...p, caps: [] } : { ...p, caps: all.slice(k, (k += q)) }
      )
    );
  };

  const resetSample = () => setPoles(samplePoles());
  const clearAll = () => setPoles(emptyPoles());

  return (
    <section>
      <SectionHead
        index="03"
        kicker="Bagian 03 · Simulasi media"
        title={
          <>
            Simulasi: <em className="italic text-capgreen">seret, susun,</em> selidiki
          </>
        }
        desc="Versi digital dari papan fisik. Seret tutup botol ke tiang untuk menyusun data — panel di samping menghitung jumlah data, modus, median, mean, dan peluang secara langsung."
        right={
          <Pill variant="paper" onClick={() => setTutor(true)}>
            <HelpCircle size={16} strokeWidth={2.6} /> Panduan
          </Pill>
        }
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* ============ PAPAN ============ */}
        <div className="min-w-0 flex-1">
          <Card tape tapeClass="tape-green" className="p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
              <span className="lbl flex items-center gap-2 text-ink2">
                <MousePointer2 size={14} strokeWidth={2.4} /> kardus · 10 sedotan · label solasi tulis-hapus
              </span>
              <div className="flex gap-2">
                <Pill variant="yellow" className="px-3 py-1 text-xs" onClick={resetSample}>
                  <Sparkles size={13} strokeWidth={2.6} /> Data contoh
                </Pill>
                <Pill variant="paper" className="px-3 py-1 text-xs" onClick={clearAll}>
                  <Eraser size={13} strokeWidth={2.6} /> Kosongkan
                </Pill>
              </div>
            </div>

            <Stage width={W} height={H} className="tex-grid rounded-2xl border-2 border-ink/15 bg-paper2">
              {/* papan kardus */}
              <div
                className="board-face absolute overflow-hidden rounded-xl border-2 border-ink"
                style={{ left: 16, top: 296, width: 628, height: 180 }}
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-ink/10" />
                <div className="board-flute absolute inset-x-0 bottom-0 h-3.5 border-t-2 border-ink/50" />
                <span className="lbl absolute bottom-5 right-4 text-ink/35">papan kardus bekas</span>
              </div>

              {/* keadaan papan kosong */}
              {stats.n === 0 && !drag && (
                <div className="pointer-events-none absolute inset-x-0 top-36 z-20 flex justify-center">
                  <span className="flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs font-bold shadow-off-sm">
                    <Hand size={14} strokeWidth={2.6} /> Papan kosong — seret tutup dari nampan ke tiang
                  </span>
                </div>
              )}

              {/* kolom tiang */}
              {poles.map((p, i) => {
                const isHover = drag !== null && drag.hover === i;
                const full = p.caps.length >= MAX_CAPS;
                const fromThis = drag?.source.kind === "pole" && drag.source.pole === i;
                const canLand = isHover && !full && !(fromThis && drag.hover === i);
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      colRefs.current[i] = el;
                    }}
                    className="absolute"
                    style={{ left: PADX + i * COLW, top: 8, width: COLW, height: 420 }}
                  >
                    {/* tiang sedotan */}
                    <div
                      className="straw-face absolute left-1/2 top-[52px] h-[270px] w-[10px] -translate-x-1/2 rounded-full border border-ink/60"
                      style={{ ["--straw" as string]: POLE_ACCENTS[i] }}
                    >
                      <div className="straw-rings absolute inset-y-0 inset-x-[2px] rounded-full opacity-55" />
                    </div>
                    {/* mulut sedotan */}
                    <div
                      className="absolute left-1/2 top-[47px] h-2.5 w-[14px] -translate-x-1/2 rounded-full border-2 border-ink"
                      style={{ background: POLE_ACCENTS[i], filter: "brightness(0.8)" }}
                    />
                    {/* gumpalan lem di dasar */}
                    <div className="absolute left-1/2 top-[280px] h-[10px] w-[30px] -translate-x-1/2 rounded-[50%] border border-ink/40 bg-ink/15" />

                    {/* bingkai area tangkap */}
                    {isHover && canLand && (
                      <div className="pointer-events-none absolute -inset-x-1 -bottom-2 top-[40px] rounded-2xl border-2 border-dashed border-ink/45 bg-ink/5" />
                    )}
                    {isHover && full && !fromThis && (
                      <div className="pointer-events-none absolute -inset-x-1 -bottom-2 top-[40px] rounded-2xl border-2 border-dashed border-capred bg-capred/10" />
                    )}

                    {/* tutup-tutup */}
                    {p.caps.map((c, j) => {
                      const isTop = j === p.caps.length - 1;
                      // Tetap bisa di-pointerdown walau sedang menyeret:
                      // seret baru otomatis menimpa seret lama yang macet.
                      const grabbable = isTop;
                      return (
                        <div
                          key={`${i}-${j}`}
                          className="absolute left-1/2 -translate-x-1/2"
                          style={{ bottom: BASE + j * STEP }}
                        >
                          <motion.div
                            initial={{ y: -18, opacity: 0, scale: 1.12 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 420, damping: 24, delay: j * 0.015 }}
                          >
                            <div
                              onPointerDown={grabbable ? beginDrag(c, { kind: "pole", pole: i }) : undefined}
                              onContextMenu={grabbable ? (e) => e.preventDefault() : undefined}
                            className={[
                              "relative rounded-full transition-transform",
                              grabbable ? "cursor-grab hover:-translate-y-1" : "",
                              drag && fromThis && isTop ? "opacity-30" : "",
                            ].join(" ")}
                            style={grabbable ? { touchAction: "none", userSelect: "none" } : undefined}
                          >
                              <BottleCap color={c} size={CAPD} />
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}

                    {/* pratinjau jatuh */}
                    {canLand && drag && (
                      <div
                        className="pointer-events-none absolute left-1/2"
                        style={{ bottom: BASE + p.caps.length * STEP, transform: "translateX(-50%)" }}
                      >
                        <BottleCap color={drag.color} size={CAPD} ghost />
                      </div>
                    )}

                    {/* label nilai — ditulis siswa */}
                    <div className="absolute left-1/2 top-[426px] -translate-x-1/2" style={{ width: 48 }}>
                      <input
                        value={p.label}
                        onChange={(e) =>
                          setPoles((prev) =>
                            prev.map((q, qi) => (qi === i ? { ...q, label: e.target.value } : q))
                          )
                        }
                        placeholder="…"
                        maxLength={5}
                        className="input-hand w-full px-1 py-1 text-center font-display text-base font-black"
                        title={`Nilai data tiang ${i + 1}`}
                      />
                    </div>
                  </div>
                );
              })}
            </Stage>

            {/* nampan tutup */}
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink bg-cream px-4 py-3 shadow-off-xs">
              <div className="mr-1">
                <span className="lbl block text-ink2">Nampan tutup</span>
                <span className="text-[10px] font-semibold text-ink2/80">stok selalu tersedia</span>
              </div>
              {CAP_ORDER.map((c) => (
                <div
                  key={c}
                  onPointerDown={beginDrag(c, { kind: "tray" })}
                  onContextMenu={(e) => e.preventDefault()}
                  className={[
                    "no-select cursor-grab rounded-full border-2 border-transparent transition-all hover:-translate-y-1.5 hover:border-ink/30",
                    drag?.source.kind === "tray" && drag.color === c ? "opacity-35" : "",
                  ].join(" ")}
                  style={{ touchAction: "none" }}
                  title="Tahan lalu seret ke tiang"
                >
                  <BottleCap color={c} size={46} />
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <Chip className="bg-paper2">{stats.n} tutup terpasang</Chip>
              </div>
            </div>

            {/* petunjuk kontekstual */}
            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border-2 border-ink bg-ink px-4 py-2.5 text-sm font-semibold text-cream shadow-off-xs">
              <Hand size={16} strokeWidth={2.6} className="shrink-0 text-capyellow" />
              <span className="leading-snug">{hint}</span>
            </div>
          </Card>
        </div>

        {/* ============ PANEL SAMPING ============ */}
        <aside className="w-full shrink-0 space-y-4 lg:w-[340px]">
          <StatsGrid stats={stats} />
          <InsightPanel
            stats={stats}
            colorCounts={colorCounts}
            onLevel={levelPoles}
            canLevel={canLevel}
          />
          <TugasCard />
        </aside>
      </div>

      {/* tutup hantu yang menempel di kursor */}
      {drag && (
        <div className="pointer-events-none fixed z-[70]" style={{ left: drag.x, top: drag.y }}>
          <div style={{ transform: "translate(-50%,-58%) scale(1.18)", filter: "drop-shadow(5px 6px 0 rgba(38,34,27,.35))" }}>
            <BottleCap color={drag.color} size={60} />
          </div>
        </div>
      )}

      <TutorialModal open={tutor} onClose={closeTutor} />
    </section>
  );
}
