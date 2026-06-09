import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Navigation2, Clock, ShoppingCart, ShieldCheck, ChefHat } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";

const CARD_ACCENTS = [
  { color: "#4CAF50", emoji: "⚡" },
  { color: "#3B82F6", emoji: "👀" },
  { color: "#06B6D4", emoji: "🏃" },
  { color: "#F59E0B", emoji: "🛒" },
  { color: "#8B5CF6", emoji: "🔒" },
];

const ICONS = [BrainCircuit, Navigation2, Clock, ShoppingCart, ShieldCheck, ChefHat];

const GLASS = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};

function FeatureCard({
  feature, index, className = "",
}: {
  feature: { title: string; tag: string; desc: string };
  index: number;
  className?: string;
}) {
  const style = CARD_ACCENTS[index] ?? CARD_ACCENTS[0];
  const Icon = ICONS[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${style.color}40` }}
      className={`group rounded-3xl p-7 relative overflow-hidden cursor-default transition-all duration-300 ${className}`}
      style={{ ...GLASS, willChange: "transform" }}
    >
      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ background: style.color }} />

      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${style.color}18`, border: `1px solid ${style.color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: style.color }} />
        </div>
        <span className="text-xl" role="img">{style.emoji}</span>
      </div>

      <h3 className="text-base font-bold text-white mb-1.5">{feature.title}</h3>
      <span
        className="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-3"
        style={{ background: `${style.color}15`, color: style.color }}
      >
        {feature.tag}
      </span>
      <p className="text-white/50 leading-relaxed text-sm">{feature.desc}</p>
    </motion.div>
  );
}

export function Features() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().features;

  return (
    <section className="py-24 relative" style={{ background: "rgba(15,36,25,0.6)" }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4CAF50]/6 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`mb-16 ${isRTL ? "text-right" : ""}`}
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            {tr.heading1}<br />
            <span className="text-[#4CAF50]">{tr.heading2}</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl">{tr.subtext}</p>
        </motion.div>

        {/* Row 1 — three equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {tr.items.slice(0, 3).map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>

        {/* Row 2 — wide card + normal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.3)" }}
            className={`rounded-3xl p-7 relative overflow-hidden cursor-default transition-all duration-300 lg:col-span-2 ${isRTL ? "text-right" : ""}`}
            style={{ ...GLASS, willChange: "transform" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-amber-400" />
            <div className={`md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <div className={`flex items-center gap-2.5 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}>
                    <ShoppingCart className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xl">🛒</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5">{tr.items[3].title}</h3>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-3" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                  {tr.items[3].tag}
                </span>
                <p className="text-white/50 leading-relaxed text-sm max-w-md">{tr.items[3].desc}</p>
              </div>
              <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-3xl shrink-0 mt-4 md:mt-0" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <span className="text-5xl select-none">🍱</span>
              </div>
            </div>
          </motion.div>

          <FeatureCard feature={tr.items[4]} index={4} />
        </div>

        {/* Row 3 — dark featured full-width card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,235,59,0.3)" }}
          className={`rounded-3xl p-8 md:p-10 relative overflow-hidden cursor-default transition-all duration-300 ${isRTL ? "text-right" : ""}`}
          style={{
            background: "linear-gradient(135deg, rgba(27,67,50,0.9) 0%, rgba(15,36,25,0.95) 100%)",
            border: "1px solid rgba(255,235,59,0.15)",
            willChange: "transform",
          }}
        >
          <div className={`md:flex items-center gap-10 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 md:mb-0" style={{ background: "rgba(255,235,59,0.12)", border: "1px solid rgba(255,235,59,0.2)" }}>
              <span className="text-4xl select-none">🌙</span>
            </div>
            <div className="flex-1">
              <div className={`flex flex-wrap items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="text-2xl font-black text-white">{tr.items[5].title}</h3>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full" style={{ background: "rgba(255,235,59,0.15)", color: "#FFEB3B" }}>
                  {tr.items[5].tag}
                </span>
              </div>
              <p className="text-white/55 leading-relaxed max-w-2xl">{tr.items[5].desc}</p>
            </div>
            <div className="hidden lg:block select-none opacity-8 text-[120px] leading-none">🌙</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
