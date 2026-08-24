import { BarChart3, MousePointerClick, PencilLine, Save } from "lucide-react";
import type { RodState } from "../lib/types";
import SimBoard from "./sim/SimBoard";
import SimPanels from "./sim/SimPanels";

const FEATURES = [
  { icon: MousePointerClick, text: "Seret & lepas tutup ke 10 tiang" },
  { icon: PencilLine, text: "Label nilai bebas ditulis siswa" },
  { icon: BarChart3, text: "Statistik & peluang terhitung otomatis" },
  { icon: Save, text: "Data dapat disimpan dan dimuat ulang" },
];

export default function SectionSimulasi({
  rods,
  setRods,
}: {
  rods: RodState[];
  setRods: (r: RodState[]) => void;
}) {
  return (
    <section className="py-12 sm:py-16">
      <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-capblue/20 px-4 py-1.5 text-xs font-bold tracking-[0.22em] uppercase">
        Bagian 03
      </span>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">
        Coba medianya,
        <span className="italic text-capgreen"> langsung di layar</span>
      </h1>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
        Inilah versi digital papan yang baru saja dirakit. Setiap tiang mewakili satu nilai,
        susunan tutup menunjukkan frekuensinya — persis seperti media fisiknya. Gunakan untuk
        mendemokan jumlah data, urutan, modus, median, mean, hingga percobaan peluang.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <span
              key={f.text}
              className="flex items-center gap-2 rounded-full border-2 border-ink/25 bg-cream px-3.5 py-1.5 text-xs font-bold"
            >
              <Icon className="size-4 text-inksoft" strokeWidth={2.4} />
              {f.text}
            </span>
          );
        })}
      </div>

      <div className="mt-9 grid items-start gap-8 xl:grid-cols-[7fr_5fr]">
        <div className="min-w-0">
          <SimBoard rods={rods} setRods={setRods} />
        </div>
        <div className="min-w-0 xl:sticky xl:top-24">
          <SimPanels rods={rods} setRods={setRods} />
        </div>
      </div>
    </section>
  );
}
