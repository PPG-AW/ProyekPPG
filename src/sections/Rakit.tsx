import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Recycle,
  CircleDot,
  Layers,
  Ruler,
  Hammer,
  Tag,
  BadgeCheck,
  Wrench,
  Repeat2,
  PencilLine,
  Leaf,
  MousePointerClick,
} from "lucide-react";
import { Card, Chip, Pill, SectionHead, Stage, Stamp } from "../components/Craft";
import { BottleCap, CAP_ORDER, POLE_ACCENTS, type CapColor } from "../components/Cap";

/* ---------- data adegan perakitan (kanvas 660 x 520) ---------- */
const POLE_COUNT = 10;
const COL_W = 58;
const PAD_X = (660 - POLE_COUNT * COL_W) / 2; // 40
const centerX = (i: number) => PAD_X + i * COL_W + COL_W / 2;
const DEMO_STACKS = [2, 3, 5, 7, 4, 6, 8, 3, 2, 1];
const PLANK_TOP = 292;

/* posisi tersebar: bahan beterbangan di sekitar kanvas */
const scatterBoard = { x: -280, y: -220, r: -15, d: 0 };
const scatterStick = (i: number) => ({
  x: 210 + (i % 4) * 52,
  y: -270 + (i % 3) * 26,
  r: 20 + i * 6,
  d: 0.12 + i * 0.06,
});
const scatterCaps = (i: number) => ({
  x: (i - 4.5) * 18,
  y: 285 + (i % 3) * 16,
  r: i % 2 === 0 ? 10 : -9,
  d: 0.55 + i * 0.05,
});
const scatterLabel = (i: number) => ({
  x: 230 + (i % 5) * 34,
  y: -260 - (i % 4) * 20,
  r: -14 + i * 3,
  d: 1.0 + i * 0.04,
});

const HOTSPOTS: { ax: number; ay: number; cx: number; cy: number; text: string }[] = [
  { ax: 185, ay: 24, cx: 14, cy: 10, text: "Tiang sedotan — 10 batang" },
  { ax: centerX(6), ay: 148, cx: 468, cy: 120, text: "1 tutup = 1 data" },
  { ax: centerX(9), ay: 465, cx: 424, cy: 486, text: "Solasi — tulis & hapus berulang" },
  { ax: 44, ay: 392, cx: 18, cy: 346, text: "Papan kardus bekas" },
];

const STEPS = [
  {
    icon: Recycle,
    title: "Cuci & sortir tutup",
    text: "Kumpulkan tutup botol bekas, cuci hingga bersih, lalu sortir berdasarkan warna.",
  },
  {
    icon: CircleDot,
    title: "Lubangi tengah tutup",
    text: "Lubangi bagian tengah tiap tutup seukuran sedotan — langkah ini dibantu guru.",
  },
  {
    icon: Layers,
    title: "Siapkan papan kardus",
    text: "Potong kardus ± 40 × 30 cm, rangkap 2–3 lapis lalu rekatkan agar tebal dan kokoh.",
  },
  {
    icon: Ruler,
    title: "Tandai posisi tiang",
    text: "Beri 10 tanda berjarak sama di atas kardus memakai penggaris dan spidol.",
  },
  {
    icon: Hammer,
    title: "Tegakkan sedotan",
    text: "Tancapkan sedotan pada tiap tanda, kuatkan dengan lem tembak agar berdiri tegak lurus.",
  },
  {
    icon: Tag,
    title: "Tempel solasi bening",
    text: "Tempel solasi di bawah tiap tiang sebagai papan tulis mini: ditulis spidol, dihapus tisu, dipakai lagi.",
  },
  {
    icon: BadgeCheck,
    title: "Uji media",
    text: "Masukkan tutup ke sedotan; bila meluncur mulus, media siap dipakai berulang kali.",
  },
];

function Scene({ runId }: { runId: number }) {
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    setAssembled(false);
    const t = setTimeout(() => setAssembled(true), 500);
    return () => clearTimeout(t);
  }, [runId]);

  const spring = (d: number) => ({
    type: "spring" as const,
    stiffness: 130,
    damping: 17,
    delay: assembled ? d : 0,
  });

  return (
    <Stage width={660} height={520} className="tex-grid rounded-2xl border-2 border-ink/15 bg-paper2">
      {/* papan kardus */}
      <motion.div
        className="board-face absolute overflow-hidden rounded-xl border-2 border-ink"
        style={{ left: 20, top: PLANK_TOP, width: 620, height: 180 }}
        animate={assembled ? { x: 0, y: 0, rotate: 0 } : { x: scatterBoard.x, y: scatterBoard.y, rotate: scatterBoard.r }}
        transition={spring(scatterBoard.d)}
      >
        <div className="absolute inset-x-0 top-0 h-2 bg-ink/10" />
        <div className="board-flute absolute inset-x-0 bottom-0 h-3.5 border-t-2 border-ink/50" />
        {Array.from({ length: POLE_COUNT }).map((_, i) => (
          <span
            key={i}
            className="absolute top-2.5 h-2 w-2 rounded-full border border-ink/40 bg-ink/20"
            style={{ left: centerX(i) - 24 }}
          />
        ))}
      </motion.div>

      {/* sedotan (tiang) */}
      {Array.from({ length: POLE_COUNT }).map((_, i) => (
        <motion.div
          key={`stick-${i}`}
          className="absolute"
          style={{ left: centerX(i) - 5.5, top: 12, width: 11, height: 308 }}
          animate={
            assembled
              ? { x: 0, y: 0, rotate: 0, opacity: 1 }
              : { x: scatterStick(i).x, y: scatterStick(i).y, rotate: scatterStick(i).r, opacity: 0.95 }
          }
          transition={spring(scatterStick(i).d)}
        >
          <div
            className="straw-face relative h-full w-full rounded-full border-2 border-ink/70"
            style={{ ["--straw" as string]: POLE_ACCENTS[i] }}
          >
            <div className="straw-rings absolute inset-y-0 inset-x-[2px] rounded-full opacity-60" />
          </div>
          {/* mulut sedotan */}
          <div
            className="absolute -top-1 left-1/2 h-2 w-[13px] -translate-x-1/2 rounded-full border-2 border-ink"
            style={{ background: POLE_ACCENTS[i], filter: "brightness(0.8)" }}
          />
        </motion.div>
      ))}

      {/* tumpukan tutup per tiang */}
      {DEMO_STACKS.map((count, i) => (
        <motion.div
          key={`caps-${i}`}
          className="absolute"
          style={{ left: centerX(i) - 22, bottom: 520 - PLANK_TOP - 4, width: 44, height: count * 15 + 32 }}
          animate={
            assembled
              ? { x: 0, y: 0, rotate: 0 }
              : { x: scatterCaps(i).x, y: scatterCaps(i).y, rotate: scatterCaps(i).r }
          }
          transition={spring(scatterCaps(i).d)}
        >
          {Array.from({ length: count }).map((_, j) => (
            <div key={j} className="absolute" style={{ bottom: j * 15 }}>
              <BottleCap color={CAP_ORDER[(i + j) % CAP_ORDER.length] as CapColor} size={44} />
            </div>
          ))}
        </motion.div>
      ))}

      {/* strip label nilai */}
      {Array.from({ length: POLE_COUNT }).map((_, i) => (
        <motion.div
          key={`label-${i}`}
          className="absolute grid place-items-center rounded-sm border-2 border-dashed border-ink/60 bg-cream/75 shadow-off-xs"
          style={{ left: centerX(i) - 23, bottom: 520 - 482, width: 46, height: 34 }}
          animate={
            assembled
              ? { x: 0, y: 0, rotate: 0 }
              : { x: scatterLabel(i).x, y: scatterLabel(i).y, rotate: scatterLabel(i).r }
          }
          transition={spring(scatterLabel(i).d)}
        >
          <span className="font-display text-lg font-black">{i + 1}</span>
        </motion.div>
      ))}

      {/* hotspot penjelasan */}
      {HOTSPOTS.map((h, i) => (
        <motion.div
          key={`hot-${i}`}
          className="pointer-events-none absolute z-20"
          style={{ left: 0, top: 0 }}
          initial={false}
          animate={assembled ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: assembled ? 1.45 + i * 0.18 : 0, duration: 0.3 }}
        >
          <span
            className="absolute block size-3 rounded-full border-2 border-ink bg-capred"
            style={{ left: h.ax - 6, top: h.ay - 6 }}
          />
          <motion.span
            className="absolute block whitespace-nowrap rounded-full border-2 border-ink bg-cream px-2.5 py-1 text-[11px] font-bold shadow-off-xs"
            style={{ left: h.cx, top: h.cy }}
            initial={false}
            animate={assembled ? { scale: 1 } : { scale: 0.6 }}
            transition={{ delay: assembled ? 1.45 + i * 0.18 : 0, type: "spring", stiffness: 300, damping: 18 }}
          >
            {h.text}
          </motion.span>
        </motion.div>
      ))}

      {/* stempel selesai */}
      <motion.div
        className="absolute inset-x-0 bottom-3 flex justify-center"
        initial={false}
        animate={assembled ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ delay: assembled ? 2.2 : 0, type: "spring", stiffness: 260, damping: 15 }}
      >
        <Stamp className="bg-cream/70 text-capgreen">Media siap dipakai</Stamp>
      </motion.div>
    </Stage>
  );
}

export default function Rakit() {
  const [runId, setRunId] = useState(0);

  return (
    <section>
      <SectionHead
        index="02"
        kicker="Bagian 02 · Perakitan"
        title={
          <>
            Tonton bahannya <em className="italic text-caporange">menjadi media</em>
          </>
        }
        desc="Animasi ini mensimulasikan proses perakitan: bahan yang tadinya tercecer tersusun menjadi Papan Statistik & Peluang yang utuh. Ikuti juga urutan cara pembuatannya."
        right={
          <Pill variant="orange" onClick={() => setRunId((v) => v + 1)}>
            <RotateCcw size={16} strokeWidth={2.6} /> Putar ulang animasi
          </Pill>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* langkah pembuatan */}
        <Card tape tapeClass="tape-orange" className="order-2 p-5 lg:order-1">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl border-2 border-ink bg-caporange text-cream">
              <Wrench size={17} strokeWidth={2.6} />
            </span>
            <h3 className="font-display text-xl font-black">Urutan cara pembuatan</h3>
          </div>
          <ol className="space-y-1.5">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
                className="flex gap-3 rounded-2xl border-2 border-transparent p-2.5 transition-colors hover:border-ink/15 hover:bg-paper2"
              >
                <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-cream">
                  <s.icon size={16} strokeWidth={2.4} />
                  <span className="absolute -left-1.5 -top-2 font-display text-sm font-black italic text-ink/40">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink2">{s.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </Card>

        {/* panggung animasi */}
        <div className="order-1 lg:order-2">
          <Card className="p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 pt-1">
              <div className="flex items-center gap-2">
                <MousePointerClick size={16} strokeWidth={2.4} className="text-ink2" />
                <span className="lbl text-ink2">animasi bahan → media</span>
              </div>
              <div className="flex gap-2">
                <Chip className="bg-paper2">kardus</Chip>
                <Chip className="bg-paper2">10 sedotan</Chip>
                <Chip className="bg-paper2">tutup</Chip>
                <Chip className="bg-paper2">solasi</Chip>
              </div>
            </div>
            <Scene runId={runId} />
          </Card>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Chip className="bg-capgreen/15 text-capgreen">
              <Leaf size={13} strokeWidth={2.6} /> Ramah lingkungan
            </Chip>
            <Chip className="bg-capyellow/30">
              <Repeat2 size={13} strokeWidth={2.6} /> Dapat dipakai berulang
            </Chip>
            <Chip className="bg-capblue/15 text-capblue">
              <PencilLine size={13} strokeWidth={2.6} /> Data mudah diganti-ganti
            </Chip>
          </div>
        </div>
      </div>
    </section>
  );
}
