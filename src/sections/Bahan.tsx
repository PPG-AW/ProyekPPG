import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CircleDashed,
  Recycle,
  Palette,
  Sparkles,
  ShieldAlert,
  ClipboardCheck,
  PartyPopper,
} from "lucide-react";
import { Card, Chip, SectionHead, Stamp } from "../components/Craft";
import { MaterialArt, type MaterialKind } from "../components/MaterialArt";
import { BottleCap } from "../components/Cap";

interface Material {
  id: string;
  kind: MaterialKind;
  name: string;
  spec: string;
  qty: string;
  note?: string;
}

const MATERIALS: Material[] = [
  {
    id: "papan",
    kind: "board",
    name: "Kardus Bekas",
    spec: "± 40 × 30 cm, dirangkap 2–3 lapis agar tebal dan kuat menopang tiang",
    qty: "1 lembar",
  },
  {
    id: "tiang",
    kind: "sticks",
    name: "Sedotan Kokoh",
    spec: "sedotan plastik tebal/keras, tinggi ± 15 cm, tidak mudah tertekuk",
    qty: "10 batang",
  },
  {
    id: "tutup",
    kind: "caps",
    name: "Tutup Botol Plastik",
    spec: "bekas, dicuci, tengahnya dilubangi seukuran sedotan",
    qty: "± 60 buah · 6 warna",
    note: "bahan utama",
  },
  { id: "lem", kind: "glue", name: "Lem Tembak", spec: "merekatkan sedotan agar berdiri tegak di kardus", qty: "1 buah" },
  {
    id: "label",
    kind: "labels",
    name: "Solasi Bening & Spidol",
    spec: "solasi ditempel di kardus sebagai papan tulis mini — ditulis spidol, dihapus tisu",
    qty: "1 gulung",
    note: "tulis-hapus",
  },
  { id: "potong", kind: "scissors", name: "Gunting & Cutter", spec: "memotong kardus, sedotan, dan solasi", qty: "1 set" },
  { id: "ukur", kind: "ruler", name: "Penggaris & Spidol", spec: "menandai posisi tiang dan menulis nilai data", qty: "1 set" },
  { id: "lubang", kind: "drill", name: "Alat Pelubang", spec: "paku besar & palu untuk melubangi tutup botol", qty: "1 set", note: "dibantu guru" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
} as const;

export default function Bahan() {
  const [ready, setReady] = useState<Set<string>>(new Set());
  const allReady = ready.size === MATERIALS.length;

  const toggle = (id: string) =>
    setReady((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section>
      <SectionHead
        index="01"
        kicker="Bagian 01 · Bahan & Alat"
        accent="text-capyellow"
        title={
          <>
            Dari <em className="italic text-capyellow">barang bekas,</em>
            <br />
            jadi media belajar
          </>
        }
        desc="Semua komponen memanfaatkan sampah plastik dan barang bekas di sekitar. Centang tiap bahan saat presentasi untuk menunjukkan kesiapan sebelum dirakit."
        right={
          <Card tape className="w-64 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="lbl text-ink2">Kesiapan bahan</span>
              <ClipboardCheck size={16} strokeWidth={2.4} className="text-ink2" />
            </div>
            <div className="h-3.5 overflow-hidden rounded-full border-2 border-ink bg-paper2">
              <motion.div
                className="h-full bg-capyellow"
                animate={{ width: `${(ready.size / MATERIALS.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold">
                {ready.size}/{MATERIALS.length} terkumpul
              </span>
              {allReady && (
                <Stamp className="text-capgreen">
                  <PartyPopper size={12} strokeWidth={2.6} /> Siap merakit
                </Stamp>
              )}
            </div>
          </Card>
        }
      />

      {/* grid bahan */}
      <motion.div
        className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {MATERIALS.map((m) => {
          const on = ready.has(m.id);
          return (
            <motion.button
              key={m.id}
              type="button"
              variants={item}
              onClick={() => toggle(m.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`card-craft group relative cursor-pointer p-4 text-left transition-colors ${
                on ? "bg-cream" : "bg-cream"
              }`}
            >
              {on && (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 6 }}
                  className="stamp absolute right-3 top-3 z-10 bg-cream/80 text-capgreen"
                >
                  Tersedia
                </motion.span>
              )}
              <div
                className={`tex-dots relative mb-3 aspect-square overflow-hidden rounded-2xl border-2 border-ink/15 bg-paper2 transition-all ${
                  on ? "opacity-100" : "opacity-90"
                }`}
              >
                <div className="absolute inset-3 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                  <MaterialArt kind={m.kind} />
                </div>
                {on && (
                  <span className="absolute bottom-2 left-2 grid size-7 place-items-center rounded-full border-2 border-ink bg-capgreen text-cream">
                    <Check size={15} strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip className="bg-paper2">{m.qty}</Chip>
                {m.note && (
                  <Chip
                    className={
                      m.note === "bahan utama"
                        ? "bg-capyellow"
                        : m.note === "dibantu guru"
                          ? "bg-capred/15 text-capred"
                          : "bg-capblue/15 text-capblue"
                    }
                  >
                    {m.note}
                  </Chip>
                )}
              </div>
              <h3 className="mt-2 font-display text-base font-black leading-tight sm:text-lg">
                {m.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink2">{m.spec}</p>
              <span
                className={`lbl mt-3 flex items-center gap-1.5 ${
                  on ? "text-capgreen" : "text-ink2/70"
                }`}
              >
                {on ? <Check size={13} strokeWidth={3} /> : <CircleDashed size={13} strokeWidth={2.4} />}
                {on ? "Sudah ada" : "Ketuk untuk mencentang"}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* kenapa tutup botol + keamanan */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Card tape tapeClass="tape-blue" className="p-6 lg:col-span-2">
          <h3 className="font-display text-xl font-black">
            Kenapa <em className="italic text-capblue">tutup botol?</em>
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Recycle size={20} strokeWidth={2.4} />,
                title: "Mengolah sampah",
                text: "Sampah plastik rumah tangga berubah menjadi alat hitung yang bermakna.",
                tint: "text-capgreen",
              },
              {
                icon: <Palette size={20} strokeWidth={2.4} />,
                title: "Warna siap pakai",
                text: "Enam warna alami tutup botol cocok untuk kategori dan peluang warna.",
                tint: "text-cappurple",
              },
              {
                icon: <Sparkles size={20} strokeWidth={2.4} />,
                title: "Mudah dimanipulasi",
                text: "Ringan, seragam ukurannya, dan mudah dilubangi untuk dimasukkan ke tiang.",
                tint: "text-caporange",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border-2 border-ink/10 bg-paper2 p-4">
                <span className={`mb-2 inline-grid size-10 place-items-center rounded-xl border-2 border-ink bg-cream ${f.tint}`}>
                  {f.icon}
                </span>
                <p className="text-sm font-bold">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink2">{f.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <div className="tex-halftone absolute inset-x-0 top-0 h-2 bg-capyellow" />
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-capyellow">
              <ShieldAlert size={20} strokeWidth={2.4} />
            </span>
            <div>
              <h3 className="font-display text-lg font-black">Catatan keamanan</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink2">
                Melubangi tutup botol, memotong kardus, dan penggunaan lem tembak{" "}
                <b>dilakukan atau dibantu guru</b>. Sedotan dipilih yang kokoh dan ujungnya rata
                agar aman di tangan siswa.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex -space-x-2">
              {(["red", "blue", "yellow", "green"] as const).map((c) => (
                <BottleCap key={c} color={c} size={34} className="rounded-full border-2 border-cream bg-cream" />
              ))}
            </div>
            <span className="lbl text-ink2">ramah anak</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
