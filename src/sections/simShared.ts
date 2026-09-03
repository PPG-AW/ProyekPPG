import type { CapColor } from "../components/Cap";

export interface PoleState {
  label: string;
  caps: CapColor[];
}

export interface BoardStats {
  n: number;
  mean: number | null;
  median: number | null;
  medianIdx: number[];
  sorted: number[];
  modus: string | null; // "seragam" bila semua sama
  maxCount: number;
  allNumeric: boolean;
  groups: { label: string; count: number }[];
}

export const MAX_CAPS = 12;
export const POLE_COUNT = 10;

export const LS_TUTOR = "psp-tutor-v1";

export function emptyPoles(): PoleState[] {
  return Array.from({ length: POLE_COUNT }, () => ({ label: "", caps: [] }));
}

export function samplePoles(): PoleState[] {
  return [
    { label: "5", caps: ["red", "blue"] },
    { label: "6", caps: ["blue", "red", "yellow", "green"] },
    { label: "7", caps: ["green", "red", "blue", "purple", "red", "orange", "yellow"] },
    { label: "8", caps: ["orange", "green", "blue", "purple", "yellow", "green"] },
    { label: "9", caps: ["purple", "red", "blue"] },
    { label: "10", caps: ["green", "orange"] },
    { label: "", caps: [] },
    { label: "", caps: [] },
    { label: "", caps: [] },
    { label: "", caps: [] },
  ];
}

/** Hitung statistik dari keadaan tiang. Label sama digabung. */
export function computeStats(poles: PoleState[]): BoardStats {
  const map = new Map<string, { label: string; num: number; count: number }>();
  poles.forEach((p, i) => {
    if (p.caps.length === 0) return;
    const raw = p.label.trim();
    const key = raw === "" ? `Tiang ${i + 1}` : raw;
    const g = map.get(key) ?? {
      label: key,
      num: raw === "" || Number.isNaN(Number(raw)) ? NaN : Number(raw),
      count: 0,
    };
    g.count += p.caps.length;
    map.set(key, g);
  });
  const groupsFull = [...map.values()];
  const groups = groupsFull.map((g) => ({ label: g.label, count: g.count }));
  const n = groupsFull.reduce((a, g) => a + g.count, 0);
  const allNumeric = n > 0 && groupsFull.every((g) => !Number.isNaN(g.num));

  let mean: number | null = null;
  let median: number | null = null;
  let medianIdx: number[] = [];
  let sorted: number[] = [];

  if (allNumeric) {
    sorted = groupsFull
      .slice()
      .sort((a, b) => a.num - b.num)
      .flatMap((g) => Array(g.count).fill(g.num) as number[]);
    mean = groupsFull.reduce((a, g) => a + g.num * g.count, 0) / n;
    if (n % 2 === 1) {
      median = sorted[(n - 1) / 2];
      medianIdx = [(n - 1) / 2];
    } else {
      median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      medianIdx = [n / 2 - 1, n / 2];
    }
  }

  const maxCount = groupsFull.reduce((a, g) => Math.max(a, g.count), 0);
  const modeGroups = groupsFull.filter((g) => g.count === maxCount);
  const modus =
    n === 0
      ? null
      : groupsFull.length > 1 && modeGroups.length === groupsFull.length
        ? "seragam"
        : modeGroups.map((g) => g.label).join(", ");

  return { n, mean, median, medianIdx, sorted, modus, maxCount, allNumeric, groups };
}
