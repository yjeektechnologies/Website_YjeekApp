import React from "react";
import { motion } from "framer-motion";
import { Store, Car, ArrowRight } from "lucide-react";
import { Link }            from "wouter";
import { useLang }         from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { SlideContainer, GLASS_CARD_STYLE } from "../shared/SlideContainer";

export function PartnersSlide() {
  const { isRTL }  = useLang();
  const tr         = useTranslations().partners;

  return (
    <SlideContainer>
      <div className="h-full flex flex-col justify-center container mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-4 md:mb-8"
        >
          <h2 className="text-xl md:text-4xl font-black text-white">
            {tr.heading} <span className="text-[#4CAF50]">Yjeek</span>
          </h2>
          <p className="text-white/50 text-sm mt-1">{tr.subtext}</p>
        </motion.div>

        {/* Vendor + Driver cards */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">

          {/* Vendor card */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.3)" }}
            className={`group rounded-2xl p-4 sm:p-6 md:p-7 relative overflow-hidden transition-all duration-400 ${isRTL ? "text-right" : ""}`}
            style={GLASS_CARD_STYLE}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-5 ${isRTL ? "ml-auto" : ""}`}
              style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.25)" }}
            >
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-[#4CAF50]" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2">{tr.vendor.title}</h3>
            <p className="text-white/50 text-sm mb-2 sm:mb-5">{tr.vendor.desc}</p>
            <ul className="hidden sm:flex flex-col space-y-2 mb-4 sm:mb-6">
              {tr.vendor.perks.map((perkText) => (
                <li key={perkText} className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] shrink-0" />{perkText}
                </li>
              ))}
            </ul>
            <Link href="/partner">
              <button
                className={`inline-flex items-center gap-2 px-5 h-10 sm:h-11 text-sm font-bold rounded-xl text-white transition-all ${isRTL ? "flex-row-reverse" : ""}`}
                style={{ background: "#4CAF50" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#388E3C")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#4CAF50")}
              >
                {tr.vendor.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </Link>
          </motion.div>

          {/* Driver card */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,235,59,0.3)" }}
            className={`group rounded-2xl p-4 sm:p-6 md:p-7 relative overflow-hidden transition-all duration-400 ${isRTL ? "text-right" : ""}`}
            style={{ background: "linear-gradient(135deg,#1B4332,#0F2419)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEB3B]/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-5 ${isRTL ? "ml-auto" : ""}`}
              style={{ background: "rgba(255,235,59,0.15)", border: "1px solid rgba(255,235,59,0.25)" }}
            >
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFEB3B]" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2">{tr.driver.title}</h3>
            <p className="text-white/50 text-sm mb-2 sm:mb-5">{tr.driver.desc}</p>
            <ul className="hidden sm:flex flex-col space-y-2 mb-4 sm:mb-6">
              {tr.driver.perks.map((perkText) => (
                <li key={perkText} className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFEB3B] shrink-0" />{perkText}
                </li>
              ))}
            </ul>
            <Link href="/drive">
              <button
                className={`inline-flex items-center gap-2 px-5 h-10 sm:h-11 text-sm font-bold rounded-xl text-gray-900 shadow-lg transition-all ${isRTL ? "flex-row-reverse" : ""}`}
                style={{ background: "#FFEB3B" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#FDD835")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#FFEB3B")}
              >
                {tr.driver.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </Link>
          </motion.div>

        </div>
      </div>
    </SlideContainer>
  );
}
