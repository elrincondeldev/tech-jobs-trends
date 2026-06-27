"use client";

import { motion, useScroll, useSpring, AnimatePresence, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const pct = useTransform(scrollYProgress, (v) => Math.round(v * 100));
  const [showTop, setShowTop] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsub = pct.on("change", setDisplayPct);
    return unsub;
  }, [pct]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #8B5CF6 0%, #111111 100%)",
        }}
      />

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center justify-center gap-0.5 h-12 w-12 rounded-full border border-[var(--border)] bg-[var(--primary)] text-white shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="text-[9px] font-mono leading-none opacity-70">{displayPct}%</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
