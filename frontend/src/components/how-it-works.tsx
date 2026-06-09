import React from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Zap } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";

export function HowItWorks() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().howItWorks;

  const icons = [MapPin, Search, Zap];
  const accents = [
    { color: "#4CAF50", num: "bg-[#4CAF50]", numText: "text-white" },
    { color: "#388E3C", num: "bg-[#388E3C]", numText: "text-white" },
    { color: "#FFEB3B", num: "bg-[#FFEB3B]", numText: "text-gray-900" },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(76,175,80,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#4CAF50]/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.2)" }}>
            <span className="text-sm">👇</span>
            <span className="text-xs font-semibold tracking-wide text-[#4CAF50]">{tr.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-5">
            {tr.heading}
          </h2>
          <p className="text-white/55 text-lg">{tr.subtext}</p>
        </motion.div>

        <div className="relative">
          {/* Glowing connector line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: isRTL ? 1 : 0 }}
            className="hidden md:block absolute top-[3.25rem] left-[14%] right-[14%] h-[1px] z-0"
            css-ignore="true"
          >
            <div className="w-full h-full bg-gradient-to-r from-[#4CAF50]/40 via-[#4CAF50]/20 to-[#FFEB3B]/30" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {tr.steps.map((step, index) => {
              const Icon = icons[index];
              const a = accents[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: index * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-7">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className="w-24 h-24 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `${a.color}12`,
                        border: `1px solid ${a.color}25`,
                        boxShadow: `0 0 30px ${a.color}15`,
                      }}
                    >
                      <Icon className="w-10 h-10" style={{ color: a.color }} />
                    </motion.div>
                    <div className={`absolute -top-3 ${isRTL ? "-left-3" : "-right-3"} w-7 h-7 rounded-full ${a.num} ${a.numText} flex items-center justify-center text-xs font-black shadow-lg`}>
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/55 leading-relaxed max-w-xs text-sm">{step.desc}</p>

                  {"aside" in step && step.aside && (
                    <p className="mt-3 text-[12px] italic text-white/30 font-medium">{step.aside}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
