/* ------------------------------------------------------------------ */
/*  Tipe & konstanta global media Papan Statistik & Peluang            */
/* ------------------------------------------------------------------ */

export type CapColorId = "merah" | "biru" | "kuning" | "hijau" | "ungu" | "oranye";

export interface CapColorDef {
  id: CapColorId;
  name: string;
  hex: string;
  dark: string;
  light: string;
  /** warna teks di atas tutup */
  on: string;
}

export const CAP_COLORS: CapColorDef[] = [
  { id: "merah", name: "Merah", hex: "#e5484d", dark: "#a12a30", light: "#ff9a9d", on: "#ffffff" },
  { id: "biru", name: "Biru", hex: "#3b82f6", dark: "#1c51bd", light: "#a6c8ff", on: "#ffffff" },
  { id: "kuning", name: "Kuning", hex: "#f2b705", dark: "#b98a00", light: "#ffe27e", on: "#26221b" },
  { id: "hijau", name: "Hijau", hex: "#22a06b", dark: "#11713f", light: "#86dcb5", on: "#ffffff" },
  { id: "ungu", name: "Ungu", hex: "#8b5cf6", dark: "#5c2fd0", light: "#ccaeff", on: "#ffffff" },
  { id: "oranye", name: "Oranye", hex: "#f0762b", dark: "#b04c0d", light: "#ffb887", on: "#ffffff" },
];

export const CAP_MAP: Record<CapColorId, CapColorDef> = Object.fromEntries(
  CAP_COLORS.map((c) => [c.id, c]),
) as Record<CapColorId, CapColorDef>;

export interface RodState {
  label: string;
  /** caps[0] = tutup paling bawah */
  caps: CapColorId[];
}

export const ROD_COUNT = 10;
export const MAX_STACK = 12;

/** warna cat 10 tiang pada media */
export const ROD_HUES = [
  "#e5484d",
  "#f0762b",
  "#f2b705",
  "#8fbf3f",
  "#22a06b",
  "#2ea8a0",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

export const emptyRods = (): RodState[] =>
  Array.from({ length: ROD_COUNT }, () => ({ label: "", caps: [] }));

export const totalCaps = (rods: RodState[]): number =>
  rods.reduce((acc, r) => acc + r.caps.length, 0);
