import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FLOATERS = [
  { emoji: "🍕", angle: 0 },
  { emoji: "🌸", angle: 45, rBoost: 65 },
  { emoji: "🛵", angle: 90 },
  { emoji: "☕", angle: 135 },
  { emoji: "💊", angle: 180 },
  { emoji: "🛒", angle: 225 },
  { emoji: "📱", angle: 270 },
  { emoji: "🥗", angle: 315 },
];

export function PageIntro({ onComplete }: { onComplete: () => void }) {
  const [floatersGone, setFloatersGone] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Phase 1 (3.8s): floaters fade out, logo stays
    const t1 = setTimeout(() => setFloatersGone(true), 3800);
    // Phase 2 (5.3s): full screen collapses
    const t2 = setTimeout(() => setExiting(true), 5300);
    // Done (6.1s)
    const t3 = setTimeout(() => onComplete(), 6100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "#0F2419" }}
      animate={exiting ? { clipPath: "circle(0% at 50% 50%)" } : { clipPath: "circle(150% at 50% 50%)" }}
      transition={exiting ? { duration: 0.75, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
    >
      {/* Slowly rotating light-ray background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{
          opacity: 0.09,
          background: "conic-gradient(from 0deg, transparent 0deg, #4CAF50 35deg, transparent 70deg, #FFEB3B 150deg, transparent 190deg, #4CAF50 270deg, transparent 310deg, transparent 360deg)",
        }}
      />

      {/* Radial green glow behind logo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(76,175,80,0.38) 0%, transparent 65%)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2.2, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Main logo */}
      <div className="relative z-10 flex flex-col items-center" style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}>
        <motion.img
          src="/yjeek-logo-transparent.png"
          alt="Yjeek"
          className="select-none"
          style={{ width: "clamp(200px, 40vw, 320px)", transformStyle: "preserve-3d" }}
          initial={{ rotateY: -25, opacity: 0, scale: 0.75 }}
          animate={
            exiting
              ? { rotateY: 0, opacity: 0, scale: 1.1 }
              : { rotateY: 0, opacity: 1, scale: 1 }
          }
          transition={
            exiting
              ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.9, delay: 0.2, ease: [0.34, 1.4, 0.64, 1] }
          }
        />

        {/* Tagline — hidden once floaters gone */}
        <motion.p
          className="text-white/35 text-[11px] md:text-sm font-bold tracking-[0.32em] uppercase mt-6 select-none"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: floatersGone ? 0 : 1, y: floatersGone ? -8 : 0 }}
          transition={{ duration: floatersGone ? 0.4 : 0.55, delay: floatersGone ? 0 : 1.8 }}
        >
          delivery, done right
        </motion.p>
      </div>

      {/* Floating food/delivery particles */}
      {FLOATERS.map(({ emoji, angle, rBoost }, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 150 + (i % 3) * 30 + (rBoost ?? 0);
        return (
          <motion.span
            key={i}
            className="absolute select-none pointer-events-none text-2xl md:text-3xl"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              x: floatersGone ? 0 : Math.cos(rad) * r,
              y: floatersGone ? 0 : Math.sin(rad) * r,
              opacity: floatersGone ? 0 : 1,
              scale: floatersGone ? 0 : [0, 1.35, 1],
              rotate: floatersGone ? 0 : 360,
            }}
            transition={{
              x: { duration: floatersGone ? 0.4 : 0.75, delay: floatersGone ? 0 : 0.65 + i * 0.055, ease: [0.34, 1.4, 0.64, 1] },
              y: { duration: floatersGone ? 0.4 : 0.75, delay: floatersGone ? 0 : 0.65 + i * 0.055, ease: [0.34, 1.4, 0.64, 1] },
              opacity: { duration: floatersGone ? 0.35 : 0.5, delay: floatersGone ? i * 0.03 : 0.65 + i * 0.055 },
              scale: { duration: floatersGone ? 0.4 : 0.6, delay: floatersGone ? 0 : 0.65 + i * 0.055, ease: [0.34, 1.4, 0.64, 1] },
              rotate: { duration: 7, repeat: Infinity, ease: "linear" },
            }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
