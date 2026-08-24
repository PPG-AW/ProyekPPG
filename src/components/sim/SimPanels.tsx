import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownWideNarrow,
  BarChart3,
  CheckCircle2,
  Crown,
  Dices,
  FolderOpen,
  GraduationCap,
  Hash,
  RefreshCw,
  RotateCcw,
  Save,
  Sigma,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  CAP_COLORS,
  CAP_MAP,
  emptyRods,
  totalCaps,
  type CapColorId,
  type RodState,
} from "../../lib/types";
import { computeStats, fmt, parseAnswerValue, simplifyFraction } from "../../lib/stats";
import {
  loadSaves,
  persistSaves,
  presetNilai,
  presetWarna,
  timeStamp,
  type SaveSlot,
} from "../../lib/presets";
import { cn } from "../../utils/cn";
import { BottleCap } from "../illustrations";

interface PanelProps {
  rods: RodState[];
  setRods: (r: RodState[]) => void;
}

type Tab = "statistik" | "peluang" | "latihan" | "simpan";

const TABS: Array<{ id: Tab; label: string; icon: typeof BarChart3 }> = [
  { id: "statistik", label: "Statistik", icon: BarChart3 },
  { id: "peluang", label: "Peluang", icon: Dices },
  { id: "latihan", label: "Latihan", icon: GraduationCap },
  { id: "simpan", label: "Simpan", icon: Save },
];

export default function SimPanels({ rods, setRods }: PanelProps) {
  const [tab, setTab] = useState<Tab>("statistik");
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-ink bg-cream hard-shadow">
      <div className="grid grid-cols-4 border-b-2 border-ink">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-col items-center gap-1 border-r-2 border-ink/10 py-3 text-[10px] font-bold tracking-wider uppercase transition-colors last:border-r-0 sm:flex-row sm:justify-center sm:gap-2 sm:text-xs",
                active ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-paper2",
              )}
            >
              <Icon className="size-4" strokeWidth={2.4} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-[430px] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "statistik" && <StatsPanel rods={rods} />}
            {tab === "peluang" && <ProbPanel rods={rods} />}
            {tab === "latihan" && <QuizPanel rods={rods} setRods={setRods} />}
            {tab === "simpan" && <SavePanel rods={rods} setRods={setRods} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STATISTIK                                                          */
/* ================================================================== */

function StatsPanel({ rods }: { rods: RodState[] }) {
  const s = useMemo(() => computeStats(rods), [rods]);

  const modusLabels = s.modusIdx
    .map((i) => rods[i].label.trim() || `Tiang ${i + 1}`)
    .join(" / ");

  const cards = [
    {
      icon: Hash,
      tint: "#f2b705",
      label: "Jumlah Data (n)",
      value: s.n > 0 ? String(s.n) : "—",
      sub: "tutup botol terpasang",
    },
    {
      icon: Sigma,
      tint: "#3b82f6",
      label: "Mean (rata-rata)",
      value: s.mean !== null ? fmt(s.mean) : "—",
      sub: s.mean !== null ? "jumlah nilai ÷ banyak data" : "butuh label angka",
    },
    {
      icon: ArrowDownWideNarrow,
      tint: "#22a06b",
      label: "Median",
      value: s.median !== null ? fmt(s.median) : "—",
      sub: "nilai tengah data terurut",
    },
    {
      icon: Crown,
      tint: "#e5484d",
      label: "Modus",
      value: s.modusIdx.length > 0 ? modusLabels : "—",
      sub: s.modusIdx.length > 0 ? `muncul ${s.maxFreq}× pada tiang` : "belum ada data",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border-2 border-ink bg-paper2 p-4">
              <div className="flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-lg border-2 border-ink"
                  style={{ backgroundColor: c.tint }}
                >
                  <Icon className="size-4 text-white" strokeWidth={2.6} />
                </span>
                <p className="text-[11px] leading-tight font-bold tracking-wide uppercase text-inksoft">
                  {c.label}
                </p>
              </div>
              <p
                className={cn(
                  "mt-2.5 truncate font-display font-black tracking-tight",
                  c.value === "—" ? "text-3xl text-ink/25" : "text-[27px]",
                )}
                title={c.value}
              >
                {c.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-ink/55">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {s.n > 0 && !s.numeric && (
        <p className="mt-4 rounded-xl border-2 border-dashed border-caporange bg-caporange/10 px-4 py-3 text-sm font-semibold text-ink/80">
          Mean dan median memerlukan label berupa angka. Isi strip label dengan nilai numerik untuk
          mengaktifkannya.
        </p>
      )}

      {s.n > 0 ? (
        <div className="mt-5">
          <p className="flex items-center justify-between text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
            <span>{s.numeric ? "Data terurut (kecil → besar)" : "Data sesuai urutan tiang"}</span>
            <span>{s.n} butir</span>
          </p>
          <div className="mt-2.5 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-2xl border-2 border-dashed border-line bg-paper p-3">
            {s.sorted.slice(0, 90).map((p, i) => {
              const col = CAP_MAP[p.color];
              return (
                <span
                  key={i}
                  title={`${p.label.trim() || `Tiang ${p.rod + 1}`} • ${col.name}`}
                  className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink text-[8px] font-black"
                  style={{ backgroundColor: col.hex, color: col.on }}
                >
                  {p.value !== null ? fmt(p.value, 0) : "•"}
                </span>
              );
            })}
            {s.sorted.length > 90 && (
              <span className="grid h-7 shrink-0 place-items-center rounded-full border-2 border-dashed border-ink/40 px-2 text-[10px] font-black">
                +{s.sorted.length - 90}
              </span>
            )}
          </div>

          {s.modusIdx.length > 0 && (
            <p className="mt-4 rounded-xl bg-capgreen/10 px-4 py-3 text-sm leading-relaxed font-semibold text-ink/80">
              Tiang paling tinggi: <strong>{modusLabels}</strong> dengan {s.maxFreq} tutup — inilah
              modusnya.
              {s.numeric && s.min !== null && s.max !== null && (
                <>
                  {" "}
                  Rentang data: {fmt(s.min)} sampai {fmt(s.max)}.
                </>
              )}
            </p>
          )}
        </div>
      ) : (
        <EmptyNote text="Statistik akan muncul otomatis begitu ada tutup botol di papan." />
      )}
    </div>
  );
}

/* ================================================================== */
/*  PELUANG                                                            */
/* ================================================================== */

function ProbPanel({ rods }: { rods: RodState[] }) {
  const n = totalCaps(rods);
  const counts = useMemo(
    () =>
      CAP_COLORS.map((def) => ({
        def,
        count: rods.reduce((acc, r) => acc + r.caps.filter((c) => c === def.id).length, 0),
      })).filter((c) => c.count > 0),
    [rods],
  );

  const [selected, setSelected] = useState<CapColorId | null>(null);
  const activeId = counts.some((c) => c.def.id === selected) ? selected : (counts[0]?.def.id ?? null);
  const active = counts.find((c) => c.def.id === activeId) ?? null;

  const [history, setHistory] = useState<CapColorId[]>([]);
  const [last, setLast] = useState<{ color: CapColorId; uid: number } | null>(null);

  const draw = () => {
    const all = rods.flatMap((r) => r.caps);
    if (all.length === 0) return;
    const c = all[Math.floor(Math.random() * all.length)];
    setLast({ color: c, uid: Date.now() });
    setHistory((h) => [...h, c].slice(-60));
  };

  if (n === 0) {
    return <EmptyNote text="Papan masih kosong. Susun tutup botol terlebih dahulu, lalu lakukan percobaan penarikan acak di sini." />;
  }

  const p = active ? active.count / n : 0;
  const [fa, fb] = active ? simplifyFraction(active.count, n) : [0, 0];

  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
        1 · Pilih warna yang diamati
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {counts.map(({ def, count }) => (
          <button
            key={def.id}
            onClick={() => setSelected(def.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all",
              def.id === activeId
                ? "border-ink bg-ink text-cream"
                : "border-ink/25 bg-paper2 hover:border-ink",
            )}
          >
            <span
              className="size-3.5 rounded-full border border-ink/40"
              style={{ backgroundColor: def.hex }}
            />
            {def.name} ({count})
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-4 rounded-2xl border-2 border-ink bg-paper2 p-4">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
            2 · Peluang teoretis
          </p>
          <p className="mt-2 font-display text-xl font-black tracking-tight sm:text-2xl">
            P({active.def.name.toLowerCase()}) ={" "}
            <span className="text-capred">{active.count}</span>/<span>{n}</span>
            {(fa !== active.count || fb !== n) && (
              <>
                {" "}
                = <span className="text-capred">{fa}</span>/<span>{fb}</span>
              </>
            )}{" "}
            ≈ {fmt(p, 3)}
            <span className="ml-2 rounded-full border-2 border-ink bg-capyellow px-2.5 py-0.5 align-middle text-sm">
              {fmt(p * 100, 1)}%
            </span>
          </p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border-2 border-dashed border-ink/40 bg-paper p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
            3 · Percobaan acak
          </p>
          <div className="flex gap-2">
            <button
              onClick={draw}
              className="flex items-center gap-2 rounded-full border-2 border-ink bg-cappurple px-4 py-2 text-sm font-bold text-white hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Dices className="size-4" />
              Ambil 1 Tutup Acak
            </button>
            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  setLast(null);
                }}
                className="flex items-center gap-1.5 rounded-full border-2 border-ink/25 bg-cream px-3 py-2 text-xs font-bold hover:border-ink"
              >
                <RotateCcw className="size-3.5" />
                Ulangi
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex min-h-[92px] items-center gap-4">
          {last ? (
            <motion.div
              key={last.uid}
              initial={{ y: -56, opacity: 0, scale: 0.5, rotate: -24 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 17 }}
              className="shrink-0"
            >
              <BottleCap
                hex={CAP_MAP[last.color].hex}
                dark={CAP_MAP[last.color].dark}
                light={CAP_MAP[last.color].light}
                size={64}
              />
            </motion.div>
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-dashed border-ink/30 text-ink/30">
              <Dices className="size-6" />
            </div>
          )}
          <div>
            {last ? (
              <>
                <p className="font-display text-lg font-black">
                  Terambil: <span style={{ color: CAP_MAP[last.color].dark }}>{CAP_MAP[last.color].name}</span>
                </p>
                <p className="text-xs font-medium text-ink/60">
                  Penarikan ke-{history.length} · tutup dikembalikan setiap kali (peluang tetap)
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-ink/60">
                Tekan tombol untuk menarik satu tutup secara acak dari {n} tutup di papan.
              </p>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-2 border-t-2 border-dashed border-line pt-3">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-inksoft">
              Hasil percobaan ({history.length}× penarikan)
            </p>
            <div className="mt-2 space-y-1.5">
              {CAP_COLORS.map((def) => {
                const c = history.filter((h) => h === def.id).length;
                if (c === 0) return null;
                return (
                  <div key={def.id} className="flex items-center gap-2">
                    <span className="w-14 shrink-0 text-[11px] font-bold">{def.name}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full border border-ink/40 bg-cream">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(c / history.length) * 100}%`, backgroundColor: def.hex }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-[11px] font-bold">
                      ×{c} · {fmt((c / history.length) * 100, 0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  LATIHAN                                                            */
/* ================================================================== */

type QKind = "jumlah" | "modus" | "mean" | "median" | "peluang";

const KIND_NAME: Record<QKind, string> = {
  jumlah: "Jumlah data",
  modus: "Modus",
  mean: "Mean",
  median: "Median",
  peluang: "Peluang",
};

interface Question {
  kind: QKind;
  prompt: string;
  note: string;
  check: (raw: string) => boolean;
  explain: string;
}

function makeQuestion(rods: RodState[]): Question | null {
  const s = computeStats(rods);
  const kinds: QKind[] = [];
  if (s.n > 0) kinds.push("jumlah", "modus", "peluang");
  if (s.numeric && s.n > 2) kinds.push("mean", "median");
  if (kinds.length === 0) return null;
  const kind = kinds[Math.floor(Math.random() * kinds.length)];

  if (kind === "jumlah") {
    return {
      kind,
      prompt: "Berapa banyak data seluruhnya yang tersusun di papan?",
      note: "Hitung semua tutup botol pada setiap tiang.",
      check: (raw) => parseAnswerValue(raw) === s.n,
      explain: `Jumlah seluruh tutup botol adalah n = ${s.n}.`,
    };
  }

  if (kind === "modus") {
    const labels = s.modusIdx.map((i) => (rods[i].label.trim() || `tiang ${i + 1}`).toLowerCase());
    const shown = s.modusIdx.map((i) => rods[i].label.trim() || `Tiang ${i + 1}`).join(" / ");
    return {
      kind,
      prompt: "Nilai atau tiang manakah yang menjadi modus data ini?",
      note: "Cari tiang dengan susunan tutup paling tinggi.",
      check: (raw) => {
        const t = raw.trim().toLowerCase();
        if (labels.includes(t)) return true;
        const v = parseAnswerValue(raw);
        return v !== null && s.modusIdx.some((i) => parseAnswerValue(rods[i].label) === v);
      },
      explain: `Susunan tertinggi ada pada ${shown} dengan frekuensi ${s.maxFreq} — itulah modusnya.`,
    };
  }

  if (kind === "mean" && s.mean !== null && s.sum !== null) {
    const target = s.mean;
    return {
      kind,
      prompt: "Berapakah mean (rata-rata) dari data tersebut?",
      note: "Jumlahkan semua nilai, lalu bagi dengan banyak data. Koma atau titik desimal sama-sama diterima.",
      check: (raw) => {
        const v = parseAnswerValue(raw);
        return v !== null && Math.abs(v - target) <= 0.011;
      },
      explain: `Mean = ${s.sum} ÷ ${s.n} = ${fmt(target)}.`,
    };
  }

  if (kind === "median" && s.median !== null) {
    const target = s.median;
    return {
      kind,
      prompt: "Tentukan median (nilai tengah) dari data tersebut!",
      note: "Urutkan semua data, lalu temukan nilai di posisi tengah.",
      check: (raw) => {
        const v = parseAnswerValue(raw);
        return v !== null && Math.abs(v - target) <= 0.011;
      },
      explain: `Setelah diurutkan, nilai tengahnya adalah ${fmt(target)}.`,
    };
  }

  // peluang
  const colorCount = CAP_COLORS.map((def) => ({
    def,
    count: rods.reduce((a, r) => a + r.caps.filter((c) => c === def.id).length, 0),
  })).filter((c) => c.count > 0);
  const pick = colorCount[Math.floor(Math.random() * colorCount.length)];
  const target = pick.count / s.n;
  const [fa, fb] = simplifyFraction(pick.count, s.n);
  return {
    kind: "peluang",
    prompt: `Jika diambil satu tutup secara acak, berapa peluang terambil tutup warna ${pick.def.name.toLowerCase()}?`,
    note: "Jawab dengan pecahan (mis. 1/5) atau desimal (mis. 0,2).",
    check: (raw) => {
      const v = parseAnswerValue(raw);
      return v !== null && Math.abs(v - target) <= 0.01;
    },
    explain: `P = ${pick.count}/${s.n} = ${fa}/${fb} ≈ ${fmt(target, 3)}.`,
  };
}

function QuizPanel({ rods, setRods }: PanelProps) {
  const [q, setQ] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "benar" | "salah">("idle");
  const [score, setScore] = useState({ b: 0, t: 0 });
  const hasData = totalCaps(rods) > 0;

  const newQuestion = () => {
    setQ(makeQuestion(rods));
    setInput("");
    setStatus("idle");
  };

  const checkAnswer = () => {
    if (!q || !input.trim()) return;
    const ok = q.check(input);
    setStatus(ok ? "benar" : "salah");
    setScore((sc) => ({ b: sc.b + (ok ? 1 : 0), t: sc.t + 1 }));
  };

  if (!hasData) {
    return (
      <div className="grid place-items-center py-10 text-center">
        <GraduationCap className="size-10 text-ink/30" />
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
          Mode latihan menyusun soal dari data di papan. Isi papan terlebih dahulu — siswa yang
          menyusun, siswa pula yang menjawab.
        </p>
        <button
          onClick={() => setRods(presetNilai())}
          className="mt-4 rounded-full border-2 border-ink bg-capblue px-5 py-2.5 text-sm font-bold text-white hard-shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Isi Data Contoh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
          Soal dari data papan
        </p>
        <span className="rounded-full border-2 border-ink bg-capyellow px-3 py-1 text-xs font-black">
          Skor {score.b}/{score.t}
        </span>
      </div>

      {!q ? (
        <div className="grid place-items-center py-10 text-center">
          <p className="max-w-xs text-sm leading-relaxed text-ink/70">
            Tekan tombol di bawah untuk membuat soal acak: jumlah data, modus, mean, median, atau
            peluang — sesuai data yang sedang tersusun.
          </p>
          <button
            onClick={newQuestion}
            className="mt-4 flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 text-sm font-bold text-cream hard-shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <RefreshCw className="size-4" />
            Buat Soal
          </button>
        </div>
      ) : (
        <div>
          <div className="mt-3 rounded-2xl border-2 border-ink bg-paper2 p-4">
            <span className="rounded-full border-2 border-ink bg-caporange px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase">
              {KIND_NAME[q.kind]}
            </span>
            <p className="mt-2.5 font-display text-lg leading-snug font-black">{q.prompt}</p>
            <p className="mt-1.5 text-xs font-medium text-ink/60">{q.note}</p>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") checkAnswer();
              }}
              placeholder="Tulis jawabanmu…"
              aria-label="Jawaban latihan"
              className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-bold outline-none placeholder:font-medium placeholder:text-ink/40 focus:bg-cream"
            />
            <button
              onClick={checkAnswer}
              disabled={!input.trim()}
              className="rounded-xl border-2 border-ink bg-capgreen px-4 py-2.5 text-sm font-bold text-white transition-all enabled:hover:-translate-y-0.5 disabled:opacity-40"
            >
              Periksa
            </button>
          </div>

          <AnimatePresence>
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "mt-3 flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-sm",
                  status === "benar"
                    ? "border-capgreen bg-capgreen/15"
                    : "border-caporange bg-caporange/15",
                )}
              >
                {status === "benar" ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-capgreen" />
                ) : (
                  <XCircle className="mt-0.5 size-5 shrink-0 text-caporange" />
                )}
                <div>
                  <p className="font-black">{status === "benar" ? "Tepat sekali!" : "Kurang tepat."}</p>
                  <p className="mt-0.5 leading-relaxed text-ink/75">
                    {status === "benar"
                      ? q.explain
                      : "Amati lagi susunan tutup di papan, lalu coba jawab kembali."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={newQuestion}
            className="mt-4 flex items-center gap-2 rounded-full border-2 border-ink bg-paper2 px-4 py-2 text-sm font-bold transition-colors hover:bg-cream"
          >
            <RefreshCw className="size-4" />
            {status === "benar" ? "Soal Berikutnya" : "Ganti Soal"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  SIMPAN / MUAT                                                      */
/* ================================================================== */

function SavePanel({ rods, setRods }: PanelProps) {
  const [saves, setSaves] = useState<SaveSlot[]>(() => loadSaves());
  const [name, setName] = useState("Data tanpa judul");
  const n = totalCaps(rods);

  const save = () => {
    const slot: SaveSlot = {
      id: String(Date.now()),
      name: name.trim() || "Data tanpa judul",
      date: timeStamp(),
      rods,
    };
    const next = [slot, ...saves].slice(0, 30);
    setSaves(next);
    persistSaves(next);
  };

  const del = (id: string) => {
    const next = saves.filter((s) => s.id !== id);
    setSaves(next);
    persistSaves(next);
  };

  return (
    <div>
      <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">Muatan cepat</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          onClick={() => setRods(presetNilai())}
          className="rounded-full border-2 border-ink bg-capblue px-3.5 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Contoh: Nilai Ulangan
        </button>
        <button
          onClick={() => setRods(presetWarna())}
          className="rounded-full border-2 border-ink bg-capgreen px-3.5 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Contoh: Warna Favorit
        </button>
        <button
          onClick={() => setRods(emptyRods())}
          className="rounded-full border-2 border-ink/25 bg-paper2 px-3.5 py-2 text-xs font-bold transition-colors hover:border-ink"
        >
          Papan Kosong
        </button>
      </div>

      <div className="rule-dash mt-5 pt-5">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
          Simpan keadaan papan sekarang
        </p>
        <div className="mt-2.5 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama data…"
            aria-label="Nama data yang disimpan"
            className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-bold outline-none placeholder:font-medium placeholder:text-ink/40"
          />
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold text-cream hard-shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Save className="size-4" />
            Simpan
          </button>
        </div>
        <p className="mt-1.5 text-[11px] font-medium text-ink/55">
          Termasuk {n} tutup botol dan seluruh label tiang — tersimpan di perangkat ini.
        </p>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold tracking-[0.16em] uppercase text-inksoft">
          Arsip data ({saves.length})
        </p>
        {saves.length === 0 ? (
          <p className="mt-2.5 rounded-xl border-2 border-dashed border-ink/30 bg-paper2 px-4 py-5 text-center text-sm font-medium text-ink/55">
            Belum ada data tersimpan. Susun data di papan, lalu simpan untuk dipakai pada pertemuan
            berikutnya.
          </p>
        ) : (
          <ul className="mt-2.5 max-h-56 space-y-2 overflow-y-auto pr-1">
            {saves.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-xl border-2 border-ink/20 bg-paper2 px-3.5 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{s.name}</p>
                  <p className="text-[11px] font-medium text-ink/55">
                    {totalCaps(s.rods)} data · {s.date}
                  </p>
                </div>
                <button
                  onClick={() => setRods(s.rods)}
                  className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-capyellow px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5"
                >
                  <FolderOpen className="size-3.5" />
                  Muat
                </button>
                <button
                  onClick={() => del(s.id)}
                  aria-label={`Hapus ${s.name}`}
                  className="grid size-8 place-items-center rounded-full border-2 border-ink/25 bg-cream text-capred transition-colors hover:border-capred"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl border-2 border-dashed border-ink/25 bg-paper2/60 px-6 py-14 text-center">
      <p className="max-w-xs text-sm leading-relaxed font-medium text-ink/60">{text}</p>
    </div>
  );
}
