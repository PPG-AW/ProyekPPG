/* ------------------------------------------------------------------ */
/*  Data contoh, papan acak, dan penyimpanan lokal (simpan/muat)       */
/* ------------------------------------------------------------------ */

import { CAP_COLORS, ROD_COUNT, type CapColorId, type RodState } from "./types";

export function presetNilai(): RodState[] {
  const labels = ["55", "60", "65", "70", "75", "80", "85", "90", "95", "100"];
  const freq = [1, 3, 4, 6, 8, 9, 7, 4, 2, 1];
  return labels.map((label, i) => ({
    label,
    caps: Array.from({ length: freq[i] }, (_, k) => CAP_COLORS[(i + k) % CAP_COLORS.length].id),
  }));
}

export function presetWarna(): RodState[] {
  const data: Array<[string, CapColorId, number]> = [
    ["Merah", "merah", 6],
    ["Biru", "biru", 9],
    ["Kuning", "kuning", 4],
    ["Hijau", "hijau", 7],
    ["Ungu", "ungu", 3],
    ["Oranye", "oranye", 5],
    ["Merah Muda", "merah", 3],
    ["Cokelat", "oranye", 2],
    ["Abu-abu", "biru", 1],
    ["Hitam", "ungu", 1],
  ];
  return data.map(([label, color, count]) => ({
    label,
    caps: Array.from({ length: count }, () => color),
  }));
}

export function randomRods(): RodState[] {
  const start = 1 + Math.floor(Math.random() * 5);
  const rods: RodState[] = Array.from({ length: ROD_COUNT }, (_, i) => {
    const f = Math.floor(Math.random() * Math.random() * 10);
    return {
      label: String(start + i),
      caps: Array.from(
        { length: f },
        () => CAP_COLORS[Math.floor(Math.random() * CAP_COLORS.length)].id,
      ),
    };
  });
  if (rods.reduce((a, r) => a + r.caps.length, 0) < 5) {
    const i = Math.floor(Math.random() * ROD_COUNT);
    rods[i] = {
      ...rods[i],
      caps: Array.from({ length: 7 }, () => CAP_COLORS[Math.floor(Math.random() * 6)].id),
    };
  }
  return rods;
}

/* ------------------------- simpan / muat ------------------------- */

export interface SaveSlot {
  id: string;
  name: string;
  date: string;
  rods: RodState[];
}

const SAVES_KEY = "psp_saves_v1";
const RODS_KEY = "psp_rods_v1";

const isColor = (c: unknown): c is CapColorId =>
  typeof c === "string" && CAP_COLORS.some((d) => d.id === c);

export function sanitizeRods(raw: unknown): RodState[] | null {
  if (!Array.isArray(raw)) return null;
  const rods: RodState[] = Array.from({ length: ROD_COUNT }, (_, i) => {
    const src = raw[i];
    if (!src || typeof src !== "object") return { label: "", caps: [] };
    const label = typeof (src as RodState).label === "string" ? (src as RodState).label : "";
    const caps = Array.isArray((src as RodState).caps)
      ? ((src as RodState).caps as unknown[]).filter(isColor).slice(0, 12)
      : [];
    return { label: label.slice(0, 8), caps };
  });
  return rods;
}

export function loadSaves(): SaveSlot[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVES_KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((s) => {
        const slot = s as SaveSlot;
        const rods = sanitizeRods(slot.rods);
        if (!rods || typeof slot.name !== "string") return null;
        return { id: String(slot.id), name: slot.name.slice(0, 40), date: String(slot.date), rods };
      })
      .filter((s): s is SaveSlot => s !== null)
      .slice(0, 30);
  } catch {
    return [];
  }
}

export function persistSaves(saves: SaveSlot[]): void {
  try {
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves.slice(0, 30)));
  } catch {
    /* abaikan */
  }
}

export function loadRodsFromStorage(): RodState[] | null {
  try {
    const raw = localStorage.getItem(RODS_KEY);
    if (!raw) return null;
    return sanitizeRods(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function persistRods(rods: RodState[]): void {
  try {
    localStorage.setItem(RODS_KEY, JSON.stringify(rods));
  } catch {
    /* abaikan */
  }
}

export const timeStamp = (): string =>
  new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
