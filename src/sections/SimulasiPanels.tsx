import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignCenterHorizontal,
  BarChart3,
  ClipboardList,
  Divide,
  HelpCircle,
  Lightbulb,
  PencilLine,
  RefreshCw,
  Sigma,
  Target,
  X,
  Hand,
  RotateCcw,
} from "lucide-react";
import { Card, Pill } from "../components/Craft";
import { BottleCap, CAPS, CAP_ORDER, type CapColor } from "../components/Cap";
import type { BoardStats } from "./simShared";

/* ================== grid 4 statistik ================== */
function StatBox({
  icon,
  label,
  value,
  sub,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-cream p-3.5 shadow-off-sm">
      <div className="flex items-center justify-between">
        <span className="lbl text-ink2">{label}</span>
        <span className={`grid size-7 place-items-center rounded-lg border-2 border-ink ${tint}`}>{icon}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-black leading-none sm:text-3xl">{value}</p>
      <p className="mt-1 text-[11px] font-semibold text-ink2">{sub ?? "\u00A0"}</p>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: BoardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatBox
        icon={<Sigma size={14} strokeWidth={2.6} />}
        label="Jumlah data"
        value={String(stats.n)}
        sub="seluruh tutup di tiang"
        tint="bg-capblue text-cream"
      />
      <StatBox
        icon={<BarChart3 size={14} strokeWidth={2.6} />}
        label="Modus"
        value={stats.n === 0 ? "—" : stats.modus === "seragam" ? "seragam" : (stats.modus ?? "—")}
        sub={
          stats.n === 0
            ? "belum ada data"
            : stats.modus === "seragam"
              ? "semua nilai sama sering"
              : `muncul ${stats.maxCount} kali, terbanyak`
        }
        tint="bg-capred text-cream"
      />
      <StatBox
        icon={<AlignCenterHorizontal size={14} strokeWidth={2.6} />}
        label="Median"
        value={stats.median === null ? "—" : String(stats.median)}
        sub={stats.allNumeric ? "nilai tengah data terurut" : "butuh label angka"}
        tint="bg-capyellow text-ink"
      />
      <StatBox
        icon={<Divide size={14} strokeWidth={2.6} />}
        label="Mean"
        value={stats.mean === null ? "—" : stats.mean.toFixed(2)}
        sub={stats.allNumeric ? "rata-rata hitung" : "butuh label angka"}
        tint="bg-capgreen text-cream"
      />
    </div>
  );
}

/* ================== pecahan atas–bawah ================== */
export function Fraction({
  atas,
  bawah,
  size = "md",
  color,
}: {
  atas: string | number;
  bawah: string | number;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const s = {
    sm: { f: "text-sm", w: "min-w-[22px]", b: "border-t-2" },
    md: { f: "text-base", w: "min-w-[28px]", b: "border-t-2" },
    lg: { f: "text-2xl", w: "min-w-[40px]", b: "border-t-[3px]" },
  }[size];
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none" style={{ color }}>
      <span className={`font-display font-black ${s.f} ${s.w} px-1 text-center`}>{atas}</span>
      <span className={`${s.b} w-full border-current`} />
      <span className={`font-display font-black ${s.f} ${s.w} px-1 text-center`}>{bawah}</span>
    </span>
  );
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/* ================== panel tab: data terurut & peluang ================== */
export function InsightPanel({
  stats,
  colorCounts,
  onLevel,
  canLevel,
}: {
  stats: BoardStats;
  colorCounts: Record<CapColor, number>;
  onLevel: () => void;
  canLevel: boolean;
}) {
  const [tab, setTab] = useState<"urut" | "peluang">("urut");
  const present = CAP_ORDER.filter((c) => colorCounts[c] > 0);
  const [focus, setFocus] = useState<CapColor>("red");
  const fokusWarna: CapColor = colorCounts[focus] > 0 ? focus : (present[0] ?? "red");

  const n = stats.n;
  const k = colorCounts[fokusWarna];
  const g = n > 0 && k > 0 ? gcd(k, n) : 1;

  return (
    <Card className="p-4">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("urut")}
          className={`flex-1 cursor-pointer rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold transition-colors ${
            tab === "urut" ? "bg-ink text-cream" : "bg-paper2 hover:bg-cream"
          }`}
        >
          Data terurut
        </button>
        <button
          type="button"
          onClick={() => setTab("peluang")}
          className={`flex-1 cursor-pointer rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold transition-colors ${
            tab === "peluang" ? "bg-ink text-cream" : "bg-paper2 hover:bg-cream"
          }`}
        >
          Peluang warna
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "urut" ? (
          <motion.div
            key="urut"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {stats.n === 0 ? (
              <EmptyNote text="Papan masih kosong. Seret tutup dari nampan ke tiang untuk mulai mengisi data." />
            ) : !stats.allNumeric ? (
              <EmptyNote text="Isi label tiang dengan angka agar median, mean, dan urutan data bisa dihitung." />
            ) : (
              <>
                <div className="max-h-36 overflow-y-auto rounded-xl border-2 border-dashed border-line bg-paper2 p-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {stats.sorted.map((v, i) => (
                      <span
                        key={i}
                        className={`grid min-w-8 place-items-center rounded-lg border-2 px-1 py-0.5 text-xs font-bold ${
                          stats.medianIdx.includes(i)
                            ? "border-ink bg-capyellow shadow-off-xs"
                            : "border-ink/25 bg-cream"
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink2">
                  <span className="inline-block size-3 rounded border-2 border-ink bg-capyellow" />
                  kotak kuning = posisi median
                </p>
              </>
            )}

            <div className="divider-dash my-3" />
            <Pill
              variant="green"
              className="w-full py-1.5 text-xs"
              onClick={onLevel}
              disabled={!canLevel}
              title="Mean pada media asli: kumpulkan semua tutup lalu bagi rata ke tiang"
            >
              <AlignCenterHorizontal size={14} strokeWidth={2.6} />
              Bagi rata tumpukan (ide mean)
            </Pill>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink2">
              {canLevel
                ? "Semua tutup dikumpulkan lalu dibagi merata ke tiang yang berisi data."
                : "Aktif bila jumlah tutup habis dibagi banyak tiang berisi."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="peluang"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {n === 0 ? (
              <EmptyNote text="Isi papan dengan tutup dulu, lalu peluang tiap warna akan dihitung di sini." />
            ) : (
              <>
                {/* langkah 1: jumlah seluruh tutup */}
                <div className="rounded-xl border-2 border-ink bg-paper2 px-3 py-2.5">
                  <span className="lbl text-ink2">Langkah 1 · Hitung semua tutup</span>
                  <p className="mt-1 text-xs font-semibold leading-relaxed">
                    Seluruh tutup di papan ada <b className="font-display text-base">{n}</b> buah. Angka ini
                    menjadi <b>penyebut</b> (bilangan bawah).
                  </p>
                </div>

                {/* langkah 2: pilih warna */}
                <div className="mt-2.5 rounded-xl border-2 border-ink bg-paper2 px-3 py-2.5">
                  <span className="lbl text-ink2">Langkah 2 · Pilih warna</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CAP_ORDER.map((c) => {
                      const on = fokusWarna === c;
                      const ada = colorCounts[c] > 0;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFocus(c)}
                          disabled={!ada}
                          title={CAPS[c].name}
                          className={`grid size-9 cursor-pointer place-items-center rounded-full border-2 transition-all ${
                            on ? "border-ink bg-cream shadow-off-xs" : "border-transparent"
                          } ${ada ? "hover:-translate-y-0.5" : "cursor-not-allowed opacity-25"}`}
                        >
                          <BottleCap color={c} size={28} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-relaxed">
                    Tutup warna <b>{CAPS[fokusWarna].name}</b> ada{" "}
                    <b className="font-display text-base">{k}</b> buah. Angka ini menjadi{" "}
                    <b>pembilang</b> (bilangan atas).
                  </p>
                </div>

                {/* langkah 3: pecahan peluang */}
                <div className="mt-2.5 rounded-xl border-2 border-ink bg-capyellow/25 px-3 py-3">
                  <span className="lbl text-ink2">Langkah 3 · Tulis peluangnya</span>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-center">
                    <span className="text-xs font-bold leading-tight">
                      Peluang
                      <br />
                      terambil {CAPS[fokusWarna].name}
                    </span>
                    <span className="font-display text-xl font-black">=</span>
                    <Fraction
                      atas={`tutup ${CAPS[fokusWarna].name.toLowerCase()}`}
                      bawah="semua tutup"
                      size="sm"
                    />
                    <span className="font-display text-xl font-black">=</span>
                    <Fraction atas={k} bawah={n} size="lg" color={CAPS[fokusWarna].dark} />
                    {g > 1 && (
                      <>
                        <span className="font-display text-xl font-black">=</span>
                        <Fraction atas={k / g} bawah={n / g} size="lg" color={CAPS[fokusWarna].dark} />
                      </>
                    )}
                  </div>
                  <p className="mt-2.5 text-center text-[11px] font-semibold leading-relaxed text-ink2">
                    Dibaca: dari {n} tutup, {k} di antaranya berwarna {CAPS[fokusWarna].name.toLowerCase()}
                    {g > 1 && ` (pecahan paling sederhana ${k / g}/${n / g})`}.
                  </p>
                </div>

                {/* rekap semua warna */}
                <div className="divider-dash my-3" />
                <span className="lbl text-ink2">Peluang semua warna</span>
                <div className="mt-2 space-y-2">
                  {CAP_ORDER.map((c) => {
                    const count = colorCounts[c];
                    const pct = (count / n) * 100;
                    return (
                      <div key={c} className="flex items-center gap-2">
                        <BottleCap color={c} size={22} />
                        <span className="w-12 text-[11px] font-bold">{CAPS[c].name}</span>
                        <div className="h-3.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper2">
                          <motion.div
                            className="h-full"
                            style={{ background: CAPS[c].base }}
                            animate={{ width: `${pct}%` }}
                            transition={{ type: "spring", stiffness: 140, damping: 22 }}
                          />
                        </div>
                        <Fraction atas={count} bawah={n} size="sm" />
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2.5 rounded-lg border-2 border-dashed border-line bg-paper2 px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-ink2">
                  Bila semua pembilang dijumlahkan hasilnya {n} dari {n}, yaitu 1 — artinya pasti terambil
                  salah satu warna.
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-line bg-paper2 px-3 py-3 text-xs font-semibold leading-relaxed text-ink2">
      {text}
    </p>
  );
}

/* ================== kartu tugas / mode latihan ================== */
interface Task {
  topik: string;
  warna: string;
  soal: string;
  langkah: string[];
  petunjuk: string;
}

const TASKS: Task[] = [
  {
    topik: "Jumlah data",
    warna: "bg-capblue text-cream",
    soal: "Lima temanmu ditanya berapa buku cerita yang mereka baca bulan ini. Jawabannya: 3, 5, 3, 4, dan 5 buku.",
    langkah: [
      "Tulis angka 3, 4, dan 5 pada solasi di bawah tiang.",
      "Masukkan 2 tutup di tiang 3, 1 tutup di tiang 4, dan 2 tutup di tiang 5.",
      "Hitung semua tutup di papan. Ada berapa data seluruhnya?",
    ],
    petunjuk: "Satu tutup mewakili jawaban satu anak. Jawaban benar: 5 data.",
  },
  {
    topik: "Modus",
    warna: "bg-capred text-cream",
    soal: "Nilai ulangan matematika delapan anak: 7, 8, 9, 8, 7, 8, 10, dan 8.",
    langkah: [
      "Tulis angka 7, 8, 9, dan 10 pada tiang.",
      "Masukkan tutup sesuai banyaknya tiap nilai.",
      "Lihat tiang mana yang tumpukannya paling tinggi.",
    ],
    petunjuk: "Tiang paling tinggi menunjukkan nilai yang paling sering muncul. Itulah modus, yaitu 8.",
  },
  {
    topik: "Median",
    warna: "bg-capyellow text-ink",
    soal: "Tinggi lompatan lima anak (dalam dm): 6, 4, 7, 5, dan 6.",
    langkah: [
      "Tulis angka 4, 5, 6, dan 7 berurutan dari kiri ke kanan.",
      "Masukkan tutup sesuai datanya.",
      "Hitung tutup dari kiri ke kanan sampai berhenti tepat di tengah.",
    ],
    petunjuk: "Karena datanya 5 buah, data tengah adalah urutan ke-3. Median = 6.",
  },
  {
    topik: "Mean",
    warna: "bg-capgreen text-cream",
    soal: "Empat anak mengumpulkan botol bekas sebanyak 2, 4, 3, dan 3 botol.",
    langkah: [
      "Tulis angka 2, 3, dan 4 pada tiang, lalu susun tutupnya.",
      "Kumpulkan semua tutup, lalu bagi rata ke empat tiang.",
      "Berapa tutup yang didapat setiap tiang?",
    ],
    petunjuk: "Membagi rata sama dengan mencari rata-rata. Jumlah 12 dibagi 4 anak = 3 botol.",
  },
  {
    topik: "Peluang",
    warna: "bg-cappurple text-cream",
    soal: "Di dalam sebuah kantong ada 4 tutup merah dan 6 tutup biru.",
    langkah: [
      "Susun 4 tutup merah dan 6 tutup biru di papan.",
      "Hitung semua tutup untuk mendapat bilangan bawah pecahan.",
      "Hitung tutup merah saja untuk bilangan atas pecahan.",
    ],
    petunjuk: "Peluang terambil merah adalah 4 dari 10, ditulis 4/10 atau disederhanakan menjadi 2/5.",
  },
  {
    topik: "Membaca data",
    warna: "bg-caporange text-cream",
    soal: "Perhatikan papan yang sudah tersusun. Ceritakan isinya kepada teman sebangkumu.",
    langkah: [
      "Sebutkan ada berapa tiang yang berisi tutup.",
      "Sebutkan nilai yang paling banyak dan paling sedikit muncul.",
      "Ceritakan dengan kalimatmu sendiri, misalnya: paling banyak anak menjawab 8.",
    ],
    petunjuk: "Membaca data berarti menceritakan apa yang terlihat pada susunan tutup botol.",
  },
  {
    topik: "Membuat data sendiri",
    warna: "bg-capteal text-cream",
    soal: "Tanyakan kepada 10 temanmu: berapa jam mereka belajar di rumah setiap hari?",
    langkah: [
      "Tulis pilihan jawaban 1 sampai 5 jam pada solasi.",
      "Masukkan satu tutup setiap kali ada teman yang menjawab.",
      "Setelah selesai, tentukan modus dan mediannya.",
    ],
    petunjuk: "Data dari kelas sendiri membuat belajar statistik terasa lebih nyata dan menyenangkan.",
  },
];

export function TugasCard() {
  const [i, setI] = useState(0);
  const t = TASKS[i];
  return (
    <Card tape tapeClass="tape-green" className="p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border-2 border-ink bg-capgreen text-cream">
            <ClipboardList size={15} strokeWidth={2.6} />
          </span>
          <span className="lbl text-ink2">Kartu tugas · latihan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="lbl text-ink2/70">
            {i + 1}/{TASKS.length}
          </span>
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % TASKS.length)}
            className="btn-lift grid size-8 cursor-pointer place-items-center rounded-full border-2 border-ink bg-paper2 shadow-off-xs"
            title="Kartu tugas berikutnya"
          >
            <RefreshCw size={14} strokeWidth={2.6} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-1 text-[11px] font-bold ${t.warna}`}
          >
            <Target size={12} strokeWidth={2.8} /> {t.topik}
          </span>

          <p className="mt-2.5 rounded-xl border-2 border-ink bg-capyellow/25 px-3 py-2.5 text-xs font-semibold leading-relaxed">
            {t.soal}
          </p>

          <p className="lbl mt-3 text-ink2">Langkah mengerjakan</p>
          <ol className="mt-1.5 space-y-1.5">
            {t.langkah.map((l, k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-[1px] grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream font-display text-[11px] font-black">
                  {k + 1}
                </span>
                <span className="text-[11px] font-semibold leading-relaxed">{l}</span>
              </li>
            ))}
          </ol>

          <div className="mt-3 flex items-start gap-2 rounded-xl border-2 border-dashed border-line bg-paper2 px-2.5 py-2">
            <Lightbulb size={14} strokeWidth={2.6} className="mt-[1px] shrink-0 text-capyellow" />
            <p className="text-[11px] font-semibold leading-relaxed text-ink2">{t.petunjuk}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

/* ================== modal panduan pertama kali ================== */
export function TutorialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const steps = [
    { icon: Hand, tint: "bg-capyellow text-ink", text: "Seret tutup dari nampan ke tiang. Tutup bayangan besar mengikuti kursor atau jarimu." },
    { icon: RotateCcw, tint: "bg-capred text-cream", text: "Ambil tutup teratas tiang: seret ke tiang lain untuk memindah, lepas di luar tiang untuk mengambilnya." },
    { icon: PencilLine, tint: "bg-capblue text-cream", text: "Tulis sendiri nilai data pada solasi di bawah tiang — boleh dihapus dan diganti kapan saja." },
    { icon: BarChart3, tint: "bg-capgreen text-cream", text: "Panel kanan menghitung jumlah data, modus, median, mean, dan peluang warna secara langsung." },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card-craft relative w-full max-w-md p-6"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="tape -top-[13px] left-1/2 -translate-x-1/2" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-ink bg-paper2 hover:bg-capred hover:text-cream"
            >
              <X size={15} strokeWidth={2.6} />
            </button>
            <div className="mb-1 flex items-center gap-2">
              <HelpCircle size={18} strokeWidth={2.4} className="text-ink2" />
              <span className="lbl text-ink2">Panduan singkat</span>
            </div>
            <h3 className="font-display text-2xl font-black">
              Cara memakai <em className="italic text-capgreen">simulasi</em>
            </h3>
            <ul className="mt-4 space-y-2.5">
              {steps.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.09 }}
                  className="flex items-start gap-3 rounded-2xl border-2 border-ink/10 bg-paper2 p-2.5"
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink ${s.tint}`}>
                    <s.icon size={16} strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="lbl mr-2 text-ink/30">0{i + 1}</span>
                    <span className="text-xs font-semibold leading-relaxed">{s.text}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Pill variant="green" className="mt-5 w-full" onClick={onClose}>
              Mengerti, mulai bereksperimen
            </Pill>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
