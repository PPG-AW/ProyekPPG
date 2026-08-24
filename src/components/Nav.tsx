import { useEffect, useState } from "react";
import { CircleHelp, Layers, Maximize2, Minimize2, MousePointer2, Package } from "lucide-react";
import { cn } from "../utils/cn";
import { CAP_MAP } from "../lib/types";
import { BottleCap } from "./illustrations";

export type View = "bahan" | "media" | "simulasi";

interface NavProps {
  view: View;
  onNavigate: (v: View) => void;
  onHelp: () => void;
}

const ITEMS: Array<{ id: View; num: string; label: string; icon: typeof Package }> = [
  { id: "bahan", num: "01", label: "Bahan & Komponen", icon: Package },
  { id: "media", num: "02", label: "Perakitan Media", icon: Layers },
  { id: "simulasi", num: "03", label: "Simulasi Papan", icon: MousePointer2 },
];

export default function Nav({ view, onNavigate, onHelp }: NavProps) {
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const onChange = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFs = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        {/* merek */}
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl border-2 border-ink bg-cream hard-shadow-sm">
            <BottleCap
              hex={CAP_MAP.merah.hex}
              dark={CAP_MAP.merah.dark}
              light={CAP_MAP.merah.light}
              size={30}
            />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-black tracking-tight sm:text-xl">
              Papan Statistik <span className="italic text-capred">&amp;</span> Peluang
            </p>
            <p className="hidden text-[11px] font-medium tracking-wide text-inksoft uppercase sm:block">
              Media manipulatif dari tutup botol bekas
            </p>
          </div>
        </div>

        {/* tab bagian */}
        <nav className="order-3 flex w-full items-center gap-2 overflow-x-auto no-scrollbar sm:order-2 sm:w-auto sm:flex-1 sm:justify-center">
          {ITEMS.map((it) => {
            const active = view === it.id;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => onNavigate(it.id)}
                className={cn(
                  "group flex shrink-0 items-center gap-2 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-all",
                  active
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/25 bg-cream text-ink hover:border-ink hover:bg-paper2",
                )}
              >
                <span
                  className={cn(
                    "font-display text-xs font-black italic",
                    active ? "text-capyellow" : "text-ink/40",
                  )}
                >
                  {it.num}
                </span>
                <Icon className="size-4" strokeWidth={2.4} />
                <span className="whitespace-nowrap">{it.label}</span>
              </button>
            );
          })}
        </nav>

        {/* aksi kanan */}
        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3 sm:ml-0">
          <button
            onClick={toggleFs}
            title={fs ? "Keluar layar penuh" : "Mode layar penuh (nyaman untuk presentasi)"}
            className="grid size-10 place-items-center rounded-full border-2 border-ink/25 bg-cream text-ink transition-colors hover:border-ink hover:bg-paper2"
          >
            {fs ? <Minimize2 className="size-4.5" /> : <Maximize2 className="size-4.5" />}
          </button>
          <button
            onClick={onHelp}
            title="Buka panduan presentasi"
            className="flex items-center gap-2 rounded-full border-2 border-ink bg-capyellow px-3.5 py-2 text-sm font-bold hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <CircleHelp className="size-4.5" strokeWidth={2.4} />
            <span className="hidden sm:inline">Panduan</span>
          </button>
        </div>
      </div>
    </header>
  );
}
