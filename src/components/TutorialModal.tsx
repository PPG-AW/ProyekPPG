import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Layers,
  MousePointer2,
  Recycle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

export const TUTORIAL_KEY = "psp_hide_tutorial";

interface Slide {
  icon: typeof Recycle;
  accent: string;
  title: string;
  points: string[];
}

const SLIDES: Slide[] = [
  {
    icon: Recycle,
    accent: "#22a06b",
    title: "Selamat datang, Bapak/Ibu Guru",
    points: [
      "Ini prototipe digital media Papan Statistik & Peluang berbahan tutup botol bekas.",
      "Dirancang khusus untuk presentasi: jelajahi tiga bagian lewat menu di atas layar.",
      "Bagian 1 memaparkan bahan mentah, Bagian 2 animasi perakitannya, Bagian 3 simulasi interaktif media yang sudah jadi.",
    ],
  },
  {
    icon: Layers,
    accent: "#f0762b",
    title: "Bagian 1 & 2 — Bahan dan Perakitan",
    points: [
      "Ceklis kartu bahan satu per satu saat menjelaskan komponen kepada guru atau siswa.",
      "Pelajari enam langkah perakitan secara berurutan, dari papan hingga uji coba.",
      "Tekan tombol Rakit Media pada Bagian 2 untuk melihat bahan-bahan terbang menyatu menjadi media utuh.",
    ],
  },
  {
    icon: MousePointer2,
    accent: "#3b82f6",
    title: "Bagian 3 — Simulasi Papan",
    points: [
      "Seret tutup botol dari nampan ke tiang mana pun — maksimal 12 tutup per tiang.",
      "Tulis nilai atau kategori data pada label di bawah tiang; isinya bebas diganti-ganti oleh siswa.",
      "Untuk mengambil tutup, tarik tutup paling atas keluar dari tiangnya.",
    ],
  },
  {
    icon: BarChart3,
    accent: "#8b5cf6",
    title: "Panel Analisis & Latihan",
    points: [
      "Jumlah data, mean, median, dan modus terhitung otomatis mengikuti isi papan.",
      "Tab Peluang melakukan percobaan penarikan tutup acak lengkap dengan peluang teoretis dan hasil percobaan.",
      "Tab Latihan menyusun soal dari data di papan; tab Simpan menyimpan data agar bisa dimuat kembali kapan pun.",
    ],
  },
];

export default function TutorialModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const last = idx === SLIDES.length - 1;
  const slide = SLIDES[idx];
  const Icon = slide.icon;

  const finish = () => {
    try {
      localStorage.setItem(TUTORIAL_KEY, "1");
    } catch {
      /* abaikan */
    }
    setIdx(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={finish}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border-2 border-ink bg-cream hard-shadow"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            {/* kepala kartu */}
            <div className="flex items-center justify-between border-b-2 border-ink/10 bg-paper2 px-6 py-4">
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-inksoft">
                Panduan Presentasi
              </p>
              <button
                onClick={finish}
                className="grid size-8 place-items-center rounded-full border-2 border-ink/25 bg-cream transition-colors hover:border-ink"
                aria-label="Tutup panduan"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 42 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -42 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div
                    className="mb-5 grid size-16 place-items-center rounded-2xl border-2 border-ink hard-shadow-sm"
                    style={{ backgroundColor: slide.accent }}
                  >
                    <Icon className="size-8 text-white" strokeWidth={2.2} />
                  </div>
                  <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                    {slide.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {slide.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/85">
                        <span
                          className="mt-2 size-2.5 shrink-0 rounded-full border border-ink"
                          style={{ backgroundColor: slide.accent }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* kaki kartu */}
            <div className="flex items-center justify-between gap-4 border-t-2 border-ink/10 bg-paper2 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Ke slide ${i + 1}`}
                    className={cn(
                      "h-2.5 rounded-full border border-ink transition-all",
                      i === idx ? "w-7 bg-ink" : "w-2.5 bg-cream hover:bg-ink/30",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {idx > 0 ? (
                  <button
                    onClick={() => setIdx((i) => i - 1)}
                    className="flex items-center gap-1.5 rounded-full border-2 border-ink/25 bg-cream px-4 py-2 text-sm font-bold transition-colors hover:border-ink"
                  >
                    <ArrowLeft className="size-4" />
                    Kembali
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="rounded-full border-2 border-ink/25 bg-cream px-4 py-2 text-sm font-bold transition-colors hover:border-ink"
                  >
                    Lewati
                  </button>
                )}
                <button
                  onClick={() => (last ? finish() : setIdx((i) => i + 1))}
                  className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-cream hard-shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  {last ? "Mulai Jelajah" : "Lanjut"}
                  {!last && <ArrowRight className="size-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
