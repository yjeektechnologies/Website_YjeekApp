import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Store, Car, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";

export function Partners() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().partners;

  const GLASS = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
  };

  return (
    <section className="py-24 relative" id="partners">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#4CAF50]/6 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            {tr.heading} <span className="text-[#4CAF50]">Yjeek</span>
          </h2>
          <p className="text-white/55 text-lg">{tr.subtext}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

          {/* Vendor card — dark glass */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.3)" }}
            className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 cursor-default"
            style={{ ...GLASS, willChange: "transform" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`p-10 lg:p-14 relative z-10 flex flex-col h-full ${isRTL ? "text-right" : ""}`}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className={`w-16 h-16 rounded-2xl text-[#4CAF50] flex items-center justify-center mb-8 ${isRTL ? "self-end" : ""}`}
                style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.25)" }}
              >
                <Store className="w-8 h-8" />
              </motion.div>
              <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">{tr.vendor.title}</h3>
              <p className="text-white/55 text-lg mb-10 flex-1">{tr.vendor.desc}</p>
              <ul className="space-y-3 mb-10 text-white/60">
                {tr.vendor.perks.map((perk) => (
                  <li key={perk} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-2 h-2 rounded-full bg-[#4CAF50] shrink-0" /> {perk}
                  </li>
                ))}
              </ul>
              <Link href="/partner" className={`w-fit ${isRTL ? "self-end" : ""}`}>
                <button
                  className={`inline-flex items-center gap-2 px-8 h-14 text-base font-bold rounded-xl transition-all text-white ${isRTL ? "flex-row-reverse" : ""}`}
                  style={{ background: "#4CAF50" }}
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#388E3C")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = "#4CAF50")}
                >
                  {tr.vendor.cta} <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Driver card — yellow-accented dark */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,235,59,0.3)" }}
            className="group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 cursor-default"
            style={{ background: "linear-gradient(135deg, #1B4332 0%, #0F2419 100%)", border: "1px solid rgba(255,255,255,0.06)", willChange: "transform" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEB3B]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`p-10 lg:p-14 relative z-10 flex flex-col h-full ${isRTL ? "text-right" : ""}`}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className={`w-16 h-16 rounded-2xl text-[#FFEB3B] flex items-center justify-center mb-8 ${isRTL ? "self-end" : ""}`}
                style={{ background: "rgba(255,235,59,0.15)", border: "1px solid rgba(255,235,59,0.25)" }}
              >
                <Car className="w-8 h-8" />
              </motion.div>
              <h3 className="text-3xl lg:text-4xl font-black text-white mb-4">{tr.driver.title}</h3>
              <p className="text-white/55 text-lg mb-10 flex-1">{tr.driver.desc}</p>
              <ul className="space-y-3 mb-10 text-white/60">
                {tr.driver.perks.map((perk) => (
                  <li key={perk} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-2 h-2 rounded-full bg-[#FFEB3B] shrink-0" /> {perk}
                  </li>
                ))}
              </ul>
              <Link href="/drive" className={`w-fit ${isRTL ? "self-end" : ""}`}>
                <button
                  className={`inline-flex items-center gap-2 px-8 h-14 text-base font-bold rounded-xl transition-all text-gray-900 shadow-lg ${isRTL ? "flex-row-reverse" : ""}`}
                  style={{ background: "#FFEB3B" }}
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#FDD835")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = "#FFEB3B")}
                >
                  {tr.driver.cta} <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
