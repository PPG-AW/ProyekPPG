/* ------------------------------------------------------------------ */
/*  Perhitungan statistik & peluang dari keadaan papan                 */
/* ------------------------------------------------------------------ */

import type { CapColorId, RodState } from "./types";

/** menerima "7", "7.5", maupun "7,5" */
export function parseNum(s: string): number | null {
  const t = s.trim().replace(",", ".");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** format angka gaya Indonesia, maks 2 desimal */
export function fmt(n: number, digits = 2): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: digits });
}

export interface DataPoint {
  value: number | null;
  label: string;
  color: CapColorId;
  rod: number;
}

export interface StatsResult {
  n: number;
  numeric: boolean;
  sum: number | null;
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  /** indeks tiang dengan frekuensi terbanyak */
  modusIdx: number[];
  maxFreq: number;
  /** data terurut (nilai bila numerik, urutan tiang bila tidak) */
  sorted: DataPoint[];
}

export function computeStats(rods: RodState[]): StatsResult {
  const points: DataPoint[] = [];
  rods.forEach((r, i) => {
    const v = parseNum(r.label);
    r.caps.forEach((c) => points.push({ value: v, label: r.label, color: c, rod: i }));
  });

  const n = points.length;
  const numeric = n > 0 && points.every((p) => p.value !== null);

  const freqs = rods.map((r) => r.caps.length);
  const maxFreq = freqs.length ? Math.max(...freqs) : 0;
  const modusIdx = maxFreq > 0 ? freqs.flatMap((f, i) => (f === maxFreq ? [i] : [])) : [];

  let sum: number | null = null;
  let mean: number | null = null;
  let median: number | null = null;
  let min: number | null = null;
  let max: number | null = null;

  let sorted: DataPoint[];
  if (numeric) {
    sorted = [...points].sort((a, b) => (a.value as number) - (b.value as number));
    sum = sorted.reduce((acc, p) => acc + (p.value as number), 0);
    mean = sum / n;
    min = sorted[0].value as number;
    max = sorted[n - 1].value as number;
    const mid = Math.floor(n / 2);
    median =
      n % 2 === 1
        ? (sorted[mid].value as number)
        : ((sorted[mid - 1].value as number) + (sorted[mid].value as number)) / 2;
  } else {
    sorted = [...points].sort((a, b) => a.rod - b.rod);
  }

  return { n, numeric, sum, mean, median, min, max, modusIdx, maxFreq, sorted };
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplifyFraction(a: number, b: number): [number, number] {
  if (b === 0) return [0, 0];
  const g = gcd(Math.abs(a), Math.abs(b)) || 1;
  return [a / g, b / g];
}

/** parse jawaban yang mungkin berbentuk "3/4", "0,75", atau "75%" */
export function parseAnswerValue(raw: string): number | null {
  const t = raw.trim().toLowerCase().replace(",", ".").replace("%", "");
  if (t === "") return null;
  if (t.includes("/")) {
    const [a, b] = t.split("/").map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return a / b;
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
