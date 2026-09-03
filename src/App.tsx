import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Play, Presentation, Recycle, Wrench } from "lucide-react";
import Bahan from "./sections/Bahan";
import Rakit from "./sections/Rakit";
import Simulasi from "./sections/Simulasi";
import { BottleCap, CapLogo } from "./components/Cap";

type Tab = "bahan" | "rakit" | "simulasi";

const TABS: { id: Tab; no: string; label: string; icon: typeof Boxes }[] = [
  { id: "bahan", no: "01", label: "Bahan & Alat", icon: Boxes },
  { id: "rakit", no: "02", label: "Perakitan", icon: Wrench },
  { id: "simulasi", no: "03", label: "Simulasi", icon: Play },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("bahan");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [tab]);

  return (
    <div className="tex-dots min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <CapLogo size={42} />
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-black leading-tight sm:text-xl">
                Papan Statistik <em className="italic text-caporange">&amp;</em> Peluang
              </h1>
              <p className="lbl hidden text-ink2 sm:block">media manipulatif · tutup botol bekas</p>
            </div>
          </div>

          <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto px-1 pb-1 sm:order-none sm:ml-auto sm:w-auto sm:pb-0">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`btn-lift flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 border-ink px-3.5 py-1.5 text-xs font-bold sm:text-sm ${
                    active ? "bg-ink text-cream shadow-off-sm" : "bg-cream hover:bg-paper2"
                  }`}
                >
                  <span
                    className={`font-display italic ${
                      active ? "text-capyellow" : "text-ink/35"
                    }`}
                  >
                    {t.no}
                  </span>
                  <t.icon size={15} strokeWidth={2.6} />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <span className="ml-auto hidden items-center gap-1.5 rounded-full border-2 border-ink bg-capyellow px-3 py-1 text-[11px] font-bold lg:inline-flex">
            <Presentation size={13} strokeWidth={2.6} /> Mode presentasi guru
          </span>
        </div>
      </header>

      {/* ================= DEKORASI ================= */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[420px] overflow-hidden lg:block" aria-hidden>
        <span className="float-soft absolute right-[4%] top-28 block opacity-90" style={{ ["--fl-rot" as string]: "12deg" }}>
          <BottleCap color="yellow" size={64} />
        </span>
        <span className="float-soft absolute right-[12%] top-64 block opacity-80" style={{ ["--fl-rot" as string]: "-16deg", animationDelay: "-2s" }}>
          <BottleCap color="blue" size={44} />
        </span>
        <span className="float-soft absolute left-[3%] top-40 block opacity-80" style={{ ["--fl-rot" as string]: "20deg", animationDelay: "-3.5s" }}>
          <BottleCap color="red" size={52} />
        </span>
      </div>

      {/* ================= ISI ================= */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            {tab === "bahan" && <Bahan />}
            {tab === "rakit" && <Rakit />}
            {tab === "simulasi" && <Simulasi />}
          </motion.div>
        </AnimatePresence>

        {/* ================= FOOTER ================= */}
        <footer className="mt-16 border-t-2 border-dashed border-line pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-ink2">
              <Recycle size={15} strokeWidth={2.4} className="text-capgreen" />
              Papan Statistik &amp; Peluang — media pembelajaran dari barang bekas untuk mean, median, modus, dan peluang.
            </p>
            <p className="lbl text-ink2/70">kenalkan data, bukan hafalan</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
