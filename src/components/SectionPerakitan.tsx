import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Hammer, RotateCcw } from "lucide-react";
import { CAP_COLORS, ROD_HUES } from "../lib/types";
import { cn } from "../utils/cn";
import { BottleCap } from "./illustrations";

type Phase = "exploded" | "assembling" | "assembled";

const ROD_LEFT = (i: number) => 12 + i * (76 / 9); // persen, 12% .. 88%
const STACKS = [2, 4, 3, 6, 5, 8, 4, 7, 3, 5];
const LABELS = ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"];

const rodScatter = (i: number) => ({
  x: -330 + i * 62,
  y: -170 + (i % 3) * 40,
  r: -30 + (i % 5) * 15,
  d: 0.12 + i * 0.06,
});
const capScatter = (i: number) => ({
  x: 270 + (i % 4) * 70,
  y: -130 + (i % 3) * 65,
  r: 20 - (i % 3) * 14,
  d: 0.55 + i * 0.05,
});
const labelScatter = (i: number) => ({
  x: -180 + i * 42,
  y: 200,
  r: -14 + (i % 4) * 9,
  d: 1.0 + i * 0.04,
});

const STEPS = [
  { title: "Papan dipasang", desc: "Triplek 60×30 cm menjadi alas media." },
  { title: "Tiang berdiri tegak", desc: "10 tiang aneka warna dilem lurus pada papan." },
  { title: "Tutup botol masuk", desc: "Tutup berlubang disusun sesuai nilai tiang." },
  { title: "Label nilai dipasang", desc: "Strip laminating siap ditulis angka." },
  { title: "Media siap digunakan", desc: "Papan Statistik & Peluang selesai dirakit." },
];

const HOTSPOTS = [
  {
    title: "Tiang nilai",
    desc: "10 tiang berdiri tegak; setiap tiang mewakili satu nilai atau kategori data. Warnanya sengaja berbeda agar mudah dibedakan siswa.",
    pos: { left: `${ROD_LEFT(1)}%`, top: "30%" },
    place: "right" as const,
  },
  {
    title: "Susunan tutup botol",
    desc: "Satu tutup = satu data. Semakin tinggi susunan pada sebuah tiang, semakin besar frekuensi nilai tersebut — modus terlihat sekilas.",
    pos: { left: `${ROD_LEFT(5)}%`, top: "46%" },
    place: "bottom" as const,
  },
  {
    title: "Label tulis-ulang",
    desc: "Kertas laminating di depan tiap tiang. Tulis nilai dengan spidol, hapus, lalu ganti soal baru — media dapat dipakai berulang.",
    pos: { left: `${ROD_LEFT(8)}%`, bottom: "14%" },
    place: "left" as const,
  },
  {
    title: "Papan dasar",
    desc: "Triplek atau kardus tebal bekas berukuran 60×30 cm yang menopang seluruh komponen media.",
    pos: { left: "9%", bottom: "9%" },
    place: "right" as const,
  },
];

const CAPTIONS = [
  { text: "10 tiang lidi berwarna", cls: "left-[1%] top-[4%]" },
  { text: "± 70 tutup botol berlubang", cls: "right-[1%] top-[6%]" },
  { text: "papan triplek / kardus tebal", cls: "left-[2%] bottom-[30%]" },
  { text: "10 strip label laminating", cls: "right-[4%] bottom-[2%]" },
];

export default function SectionPerakitan() {
  const [phase, setPhase] = useState<Phase>("exploded");
  const [step, setStep] = useState(-1);
  const [activeHot, setActiveHot] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  const assembled = phase !== "exploded";

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  const assemble = () => {
    if (timer.current) window.clearInterval(timer.current);
    setActiveHot(null);
    setPhase("assembling");
    setStep(0);
    let s = 0;
    timer.current = window.setInterval(() => {
      s += 1;
      if (s >= STEPS.length) {
        if (timer.current) window.clearInterval(timer.current);
        setPhase("assembled");
      } else {
        setStep(s);
      }
    }, 560);
  };

  const disassemble = () => {
    if (timer.current) window.clearInterval(timer.current);
    setActiveHot(null);
    setStep(-1);
    setPhase("exploded");
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_350px]">
        {/* ---------------- panggung animasi ---------------- */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-caporange/25 px-4 py-1.5 text-xs font-bold tracking-[0.22em] uppercase">
            Bagian 02
          </span>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">
            Dari bahan terurai,
            <br />
            <span className="italic text-caporange">menjadi media utuh</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
            Tekan tombol <strong>Rakit Media</strong> dan perhatikan setiap komponen terbang ke
            posisinya — persis seperti merakit media sungguhan di depan kelas. Setelah utuh, sentuh
            penanda bernomor untuk menjelaskan fungsi tiap bagian.
          </p>

          {/* panggung */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border-2 border-ink bg-cream hard-shadow">
            <div className="bg-grid relative aspect-[4/5] w-full sm:aspect-[16/10]">
              {/* label sudut */}
              <div className="absolute top-3 left-3 z-20 rounded-full border-2 border-ink bg-paper2 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                Tampak depan media
              </div>

              {/* keterangan bahan saat terurai */}
              <AnimatePresence>
                {!assembled &&
                  CAPTIONS.map((c) => (
                    <motion.span
                      key={c.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "pointer-events-none absolute z-20 rounded-full border-2 border-dashed border-ink/50 bg-cream/90 px-3 py-1 text-[10px] font-bold tracking-wide uppercase sm:text-xs",
                        c.cls,
                      )}
                    >
                      {c.text}
                    </motion.span>
                  ))}
              </AnimatePresence>

              {/* papan dasar */}
              <motion.div
                className="absolute right-[6%] bottom-[6%] left-[6%] h-[20%] overflow-hidden rounded-2xl border-2 border-ink"
                animate={assembled ? { y: 0, rotate: 0 } : { y: 30, rotate: -1.5 }}
                transition={{ type: "spring", stiffness: 130, damping: 16 }}
              >
                <div className="absolute inset-0 bg-wood" />
                <div className="absolute top-[22%] left-[8%] h-1 w-[55%] rounded-full bg-wood2/50" />
                <div className="absolute top-[42%] left-[30%] h-1 w-[60%] rounded-full bg-wood2/50" />
                <div className="absolute inset-x-0 bottom-0 h-[36%] border-t-2 border-ink bg-wood2" />
                <div className="absolute top-2 left-3 hidden rounded-md border-2 border-ink bg-cream px-2 py-0.5 text-[9px] font-black tracking-[0.18em] uppercase sm:block">
                  Papan Statistik &amp; Peluang
                </div>
              </motion.div>

              {/* tiang */}
              {ROD_HUES.map((hue, i) => (
                <div
                  key={hue}
                  className="absolute h-[50%] w-4 -translate-x-1/2"
                  style={{ left: `${ROD_LEFT(i)}%`, bottom: "15%" }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    animate={
                      assembled
                        ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                        : { x: rodScatter(i).x, y: rodScatter(i).y, rotate: rodScatter(i).r, opacity: 0.95 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 15,
                      delay: assembled ? rodScatter(i).d : 0,
                    }}
                  >
                    <div
                      className="absolute inset-x-1 bottom-0 h-[94%] rounded-full border-2 border-ink/60"
                      style={{ backgroundColor: hue }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-3 rounded-t-lg border-2 border-ink/60 bg-wood2" />
                    <div
                      className="absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-ink/60"
                      style={{ backgroundColor: hue }}
                    />
                  </motion.div>
                </div>
              ))}

              {/* susunan tutup botol */}
              {STACKS.map((h, i) => (
                <div
                  key={`caps-${i}`}
                  className="absolute w-[38px] -translate-x-1/2"
                  style={{ left: `${ROD_LEFT(i)}%`, bottom: "17.5%" }}
                >
                  <motion.div
                    className="relative w-full"
                    style={{ height: 38 + (h - 1) * 11 }}
                    animate={
                      assembled
                        ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                        : { x: capScatter(i).x, y: capScatter(i).y, rotate: capScatter(i).r, opacity: 0.95 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 115,
                      damping: 15,
                      delay: assembled ? capScatter(i).d : 0,
                    }}
                  >
                    {Array.from({ length: h }, (_, k) => {
                      const col = CAP_COLORS[(i + k) % CAP_COLORS.length];
                      return (
                        <div key={k} className="absolute left-0" style={{ bottom: k * 11 }}>
                          <BottleCap hex={col.hex} dark={col.dark} light={col.light} size={38} />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              ))}

              {/* label nilai */}
              {LABELS.map((lb, i) => (
                <div
                  key={`lb-${i}`}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${ROD_LEFT(i)}%`, bottom: "7%" }}
                >
                  <motion.div
                    className="grid h-[24px] w-[42px] place-items-center rounded-md border-2 border-ink bg-cream text-[10px] font-black hard-shadow-sm"
                    animate={
                      assembled
                        ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                        : { x: labelScatter(i).x, y: labelScatter(i).y, rotate: labelScatter(i).r, opacity: 0 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 130,
                      damping: 16,
                      delay: assembled ? labelScatter(i).d : 0,
                    }}
                  >
                    {lb}
                  </motion.div>
                </div>
              ))}

              {/* hotspot penjelasan */}
              <AnimatePresence>
                {phase === "assembled" &&
                  HOTSPOTS.map((h, i) => (
                    <div key={h.title} className="absolute z-30" style={h.pos}>
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: 0.9 + i * 0.18, type: "spring", stiffness: 260, damping: 16 }}
                        onClick={() => setActiveHot(activeHot === i ? null : i)}
                        className={cn(
                          "grid size-8 place-items-center rounded-full border-2 border-ink font-display text-sm font-black hard-shadow-sm transition-colors sm:size-9",
                          activeHot === i
                            ? "bg-capred text-white"
                            : "bg-capyellow text-ink hover:bg-caporange hover:text-white",
                        )}
                        aria-label={`Penjelasan: ${h.title}`}
                      >
                        {i + 1}
                      </motion.button>
                      <AnimatePresence>
                        {activeHot === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            className={cn(
                              "absolute z-40 w-48 rounded-xl border-2 border-ink bg-cream p-3 hard-shadow-sm sm:w-56",
                              h.place === "right" && "left-full top-1/2 ml-3 -translate-y-1/2",
                              h.place === "left" && "right-full top-1/2 mr-3 -translate-y-1/2",
                              h.place === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2",
                            )}
                          >
                            <p className="font-display text-sm font-black">{h.title}</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-ink/75">{h.desc}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ---------------- panel kendali ---------------- */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <div className="tape rounded-3xl border-2 border-ink bg-cream p-5 hard-shadow">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-inksoft">
                Panel perakitan
              </p>
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase",
                  phase === "assembled"
                    ? "bg-capgreen/20 text-capgreen"
                    : phase === "assembling"
                      ? "bg-capyellow/30"
                      : "bg-paper2 text-inksoft",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    phase === "assembling" ? "pulse-soft bg-caporange" : phase === "assembled" ? "bg-capgreen" : "bg-ink/40",
                  )}
                />
                {phase === "assembled" ? "Media utuh" : phase === "assembling" ? "Merakit…" : "Terurai"}
              </span>
            </div>

            <button
              onClick={assembled ? disassemble : assemble}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink py-3.5 font-display text-lg font-black tracking-tight hard-shadow transition-transform hover:-translate-y-0.5 active:translate-y-0",
                assembled ? "bg-paper2 text-ink" : "bg-ink text-cream",
              )}
            >
              {assembled ? (
                <>
                  <RotateCcw className="size-5" />
                  Uraikan Lagi
                </>
              ) : (
                <>
                  <Hammer className="size-5" />
                  Rakit Media Sekarang
                </>
              )}
            </button>

            {/* langkah sinkron */}
            <ol className="mt-5 space-y-2">
              {STEPS.map((s, i) => {
                const done = phase === "assembled" || i < step;
                const active = phase === "assembling" && i === step;
                return (
                  <li
                    key={s.title}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-3 transition-colors",
                      active
                        ? "border-ink bg-capyellow/25"
                        : done
                          ? "border-capgreen/60 bg-capgreen/10"
                          : "border-ink/15 bg-paper2",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-black",
                        done ? "bg-capgreen text-white" : "bg-cream",
                      )}
                    >
                      {done ? <Check className="size-3.5" strokeWidth={3.5} /> : i + 1}
                    </span>
                    <div>
                      <p className="text-sm leading-tight font-bold">{s.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink/65">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* legenda hotspot */}
          <div
            className={cn(
              "rounded-3xl border-2 p-5 transition-colors",
              phase === "assembled" ? "border-ink bg-cream hard-shadow" : "border-dashed border-ink/30 bg-paper2/60",
            )}
          >
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-inksoft">
              Kenali bagian media
            </p>
            {phase !== "exploded" ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {HOTSPOTS.map((h, i) => (
                  <button
                    key={h.title}
                    onClick={() => setActiveHot(activeHot === i ? null : i)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-xs leading-tight font-bold transition-colors",
                      activeHot === i ? "border-ink bg-ink text-cream" : "border-ink/25 bg-paper2 hover:border-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border-2 font-display font-black",
                        activeHot === i ? "border-cream bg-capred text-white" : "border-ink bg-capyellow",
                      )}
                    >
                      {i + 1}
                    </span>
                    {h.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                Rakit media terlebih dahulu — penanda bernomor akan muncul pada tiang, susunan tutup,
                label, dan papan dasar untuk Anda jelaskan.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
