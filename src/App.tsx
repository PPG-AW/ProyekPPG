import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav, { type View } from "./components/Nav";
import TutorialModal, { TUTORIAL_KEY } from "./components/TutorialModal";
import SectionBahan from "./components/SectionBahan";
import SectionPerakitan from "./components/SectionPerakitan";
import SectionSimulasi from "./components/SectionSimulasi";
import { emptyRods, type RodState } from "./lib/types";
import { loadRodsFromStorage, persistRods } from "./lib/presets";

export default function App() {
  const [view, setView] = useState<View>("bahan");
  const [rods, setRods] = useState<RodState[]>(() => loadRodsFromStorage() ?? emptyRods());
  const [help, setHelp] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(TUTORIAL_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    persistRods(rods);
  }, [rods]);

  return (
    <div className="relative min-h-screen">
      {/* dekorasi latar */}
      <div
        aria-hidden
        className="bg-halftone pointer-events-none fixed -top-24 -right-24 z-0 size-96 rounded-full opacity-40"
      />
      <div
        aria-hidden
        className="bg-halftone pointer-events-none fixed -bottom-32 -left-32 z-0 size-[26rem] rounded-full opacity-30"
      />

      <Nav view={view} onNavigate={setView} onHelp={() => setHelp(true)} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {view === "bahan" && <SectionBahan />}
            {view === "media" && <SectionPerakitan />}
            {view === "simulasi" && <SectionSimulasi rods={rods} setRods={setRods} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-10 border-t-2 border-dashed border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs font-semibold text-ink/60 sm:px-6">
          <p>
            Papan Statistik &amp; Peluang — media manipulatif dari tutup botol bekas untuk analisis
            data dan peluang.
          </p>
          <p className="tracking-[0.16em] uppercase">
            01 Bahan · 02 Perakitan · 03 Simulasi
          </p>
        </div>
      </footer>

      <TutorialModal open={help} onClose={() => setHelp(false)} />
    </div>
  );
}
