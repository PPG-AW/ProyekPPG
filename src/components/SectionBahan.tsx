import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ListChecks, Recycle, Wrench } from "lucide-react";
import { cn } from "../utils/cn";
import {
  IllusBoard,
  IllusCaps,
  IllusGlue,
  IllusLabel,
  IllusSticks,
  IllusTools,
} from "./illustrations";

const CHECK_KEY = "psp_bahan_v1";

interface Material {
  name: string;
  qty: string;
  spec: string;
  desc: string;
  Illustration: (p: { className?: string }) => React.ReactNode;
}

const MATERIALS: Material[] = [
  {
    name: "Tutup Botol Plastik",
    qty: "± 70 buah, aneka warna",
    spec: "Dilubangi tepat di tengah (Ø ± 8 mm)",
    desc: "Tokoh utama media. Satu tutup mewakili satu data; lubang tengahnya menjadi jalan masuk ke tiang nilai.",
    Illustration: IllusCaps,
  },
  {
    name: "Papan Dasar",
    qty: "1 buah, 60 × 30 cm",
    spec: "Triplek bekas atau kardus tebal rangkap",
    desc: "Pijakan seluruh tiang sekaligus area menempel strip label nilai dan judul kegiatan.",
    Illustration: IllusBoard,
  },
  {
    name: "Tiang Nilai",
    qty: "10 batang, tinggi ± 25 cm",
    spec: "Lidi bambu / dowel bekas, dicat 10 warna",
    desc: "Setiap tiang mewakili satu nilai atau kategori. Warna yang berbeda membantu siswa membedakan tiang.",
    Illustration: IllusSticks,
  },
  {
    name: "Perekat",
    qty: "Lem tembak & lem kertas",
    spec: "Opsional: paku kecil sebagai penguat",
    desc: "Menegakkan tiang pada papan dengan kuat dan menempelkan strip label dengan rapi.",
    Illustration: IllusGlue,
  },
  {
    name: "Strip Label & Spidol",
    qty: "10 strip kertas laminating",
    spec: "Spidol whiteboard agar mudah dihapus",
    desc: "Area siswa menuliskan nilai data. Karena bisa dihapus-tulis, media dapat dipakai berulang untuk soal baru.",
    Illustration: IllusLabel,
  },
  {
    name: "Alat Bantu",
    qty: "Gunting, cutter, penggaris",
    spec: "Bor kecil / paku panas untuk melubangi",
    desc: "Merapikan tepi papan, mengukur jarak antar tiang (± 5 cm), dan melubangi tengah tutup botol.",
    Illustration: IllusTools,
  },
];

const STEPS = [
  {
    title: "Siapkan & rapikan papan",
    desc: "Potong triplek 60 × 30 cm, lalu amplas semua tepinya agar aman dipegang siswa.",
  },
  {
    title: "Tandai posisi 10 tiang",
    desc: "Ukur jarak antar titik ± 5 cm memakai penggaris, tandai dengan pensil sepanjang papan.",
  },
  {
    title: "Tegakkan tiang",
    desc: "Tempelkan tiang satu per satu dengan lem tembak; pastikan tegak lurus dan kokoh.",
  },
  {
    title: "Lubangi tutup botol",
    desc: "Bor atau panaskan paku tepat di titik tengah ± 70 tutup botol aneka warna.",
  },
  {
    title: "Pasang strip label",
    desc: "Rekatkan kertas laminating di depan setiap tiang sebagai area nilai yang bisa dihapus-tulis.",
  },
  {
    title: "Uji coba media",
    desc: "Masukkan tutup ke tiang, tulis nilainya, lalu coba tentukan modusnya — media siap dipresentasikan.",
  },
];

export default function SectionBahan() {
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(CHECK_KEY) ?? "null") as unknown;
      if (Array.isArray(raw) && raw.length === MATERIALS.length) {
        return raw.map(Boolean);
      }
    } catch {
      /* abaikan */
    }
    return Array(MATERIALS.length).fill(false);
  });

  const done = checked.filter(Boolean).length;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((c, idx) => (idx === i ? !c : c));
      try {
        localStorage.setItem(CHECK_KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });
  };

  return (
    <section className="py-12 sm:py-16">
      {/* ---------- kepala bagian ---------- */}
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_330px]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-capyellow/30 px-4 py-1.5 text-xs font-bold tracking-[0.22em] uppercase">
            Bagian 01
          </span>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">
            Kenali bahannya,
            <br />
            <span className="italic text-capblue">sebelum menjadi media</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
            Seluruh komponen Papan Statistik &amp; Peluang berasal dari barang bekas yang mudah
            ditemukan. Periksa setiap kartu berikut saat mempresentasikan bahan — ceklis yang sudah
            disiapkan agar kesiapannya terpantau.
          </p>
        </div>

        {/* kartu kesiapan */}
        <div className="tape rounded-3xl border-2 border-ink bg-cream p-5 hard-shadow">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-inksoft">
              <ListChecks className="size-4" />
              Kesiapan bahan
            </p>
            <p className="font-display text-3xl font-black">
              {done}
              <span className="text-ink/35">/6</span>
            </p>
          </div>
          <div className="mt-3 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-paper2">
            <motion.div
              className="h-full rounded-full bg-capgreen"
              animate={{ width: `${(done / MATERIALS.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/70">
            {done === MATERIALS.length
              ? "Semua bahan siap. Lanjutkan ke Bagian 02 untuk merakit medianya."
              : "Ceklis kartu bahan yang sudah terkumpul di hadapan audiens."}
          </p>
        </div>
      </div>

      {/* ---------- grid bahan ---------- */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MATERIALS.map((m, i) => {
          const isDone = checked[i];
          const Il = m.Illustration;
          return (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07, duration: 0.45, ease: "easeOut" }}
              className={cn(
                "tape relative flex flex-col rounded-3xl border-2 border-ink p-5 pt-6 transition-colors hard-shadow",
                i % 2 === 1 && "tape-alt",
                isDone ? "bg-capgreen/10" : "bg-cream",
              )}
            >
              {isDone && (
                <span className="absolute -top-1 right-4 z-10 rotate-6 rounded-lg border-2 border-capgreen bg-cream px-3 py-1 font-display text-sm font-black tracking-[0.2em] text-capgreen uppercase">
                  Siap
                </span>
              )}

              <div className="bg-grid mb-4 grid h-40 place-items-center rounded-2xl border-2 border-dashed border-line">
                <Il className="h-32 w-32" />
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-black italic text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl font-black tracking-tight">{m.name}</h3>
              </div>

              <div className="mt-3 space-y-1.5">
                <p className="flex items-start gap-2 text-sm font-semibold">
                  <span className="mt-[7px] size-2 shrink-0 rounded-[3px] bg-capred" />
                  {m.qty}
                </p>
                <p className="flex items-start gap-2 text-sm font-semibold text-ink/75">
                  <span className="mt-[7px] size-2 shrink-0 rounded-[3px] bg-capblue" />
                  {m.spec}
                </p>
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{m.desc}</p>

              <button
                onClick={() => toggle(i)}
                className={cn(
                  "mt-4 flex items-center justify-center gap-2 rounded-full border-2 py-2.5 text-sm font-bold transition-all",
                  isDone
                    ? "border-capgreen bg-capgreen text-white"
                    : "border-ink/30 bg-paper2 text-ink hover:border-ink hover:bg-paper",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-md border-2",
                    isDone ? "border-white bg-white/20" : "border-ink/40",
                  )}
                >
                  {isDone && <Check className="size-3.5" strokeWidth={3.5} />}
                </span>
                {isDone ? "Sudah disiapkan" : "Tandai sudah disiapkan"}
              </button>
            </motion.article>
          );
        })}
      </div>

      {/* ---------- langkah perakitan ---------- */}
      <div className="mt-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl border-2 border-ink bg-caporange hard-shadow-sm">
            <Wrench className="size-5 text-white" strokeWidth={2.4} />
          </span>
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-4xl">
            Urutan perakitan <span className="italic text-caporange">— 6 langkah</span>
          </h2>
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="relative rounded-2xl border-2 border-ink bg-paper2 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream font-display text-base font-black">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg leading-tight font-black">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute top-1/2 -right-4 hidden h-0.5 w-4 border-t-2 border-dashed border-ink/40 lg:block" />
              )}
            </motion.li>
          ))}
        </ol>
      </div>

      {/* ---------- pesan lingkungan ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 flex flex-col items-start gap-5 rounded-3xl border-2 border-dashed border-capgreen bg-capgreen/10 p-6 sm:flex-row sm:items-center sm:p-8"
      >
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-capgreen hard-shadow-sm">
          <Recycle className="size-7 text-white" strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="font-display text-xl font-black sm:text-2xl">Satu media, dua kebaikan</h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink/75 sm:text-[15px]">
            Selain membuat konsep statistik dan peluang menjadi konkret, media ini mengalihkan
            puluhan tutup botol dari tempat sampah menjadi alat belajar — menumbuhkan kreativitas
            sekaligus kepedulian lingkungan pada peserta didik.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
