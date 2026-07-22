import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit, Navigation2, Clock, ShoppingCart, ShieldCheck, ChefHat,
} from "lucide-react";
import { useLang }         from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { SlideContainer, GLASS_CARD_STYLE } from "../shared/SlideContainer";

// ── Feature card metadata (icons + accent colours + emoji markers) ─────────────

const FEATURE_CARD_CONFIG = [
  { Icon: BrainCircuit, accentColour: "#4CAF50", emojiMarker: "⚡" },
  { Icon: Navigation2,  accentColour: "#3B82F6", emojiMarker: "👀" },
  { Icon: Clock,        accentColour: "#06B6D4", emojiMarker: "🏃" },
  { Icon: ShoppingCart, accentColour: "#F59E0B", emojiMarker: "🛒" },
  { Icon: ShieldCheck,  accentColour: "#8B5CF6", emojiMarker: "🔒" },
  { Icon: ChefHat,      accentColour: "#EC4899", emojiMarker: "🌙" },
] as const;

export function FeaturesSlide() {
  const { isRTL }  = useLang();
  const tr         = useTranslations().features;

  return (
    <SlideContainer>
      <div className="h-full flex flex-col justify-center container mx-auto px-4 md:px-6 py-3 md:py-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`mb-3 md:mb-6 ${isRTL ? "text-right" : ""}`}
        >
          <h2 className="text-xl md:text-4xl font-black tracking-tight text-white">
            {tr.heading1} <span className="text-[#4CAF50]">{tr.heading2}</span>
          </h2>
          <p className="text-white/50 text-sm mt-1">{tr.subtext}</p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {tr.items.slice(0, 6).map((featureItem, featureIndex) => {
            const { Icon, accentColour, emojiMarker } = FEATURE_CARD_CONFIG[featureIndex];

            return (
              <motion.div
                key={featureIndex}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: featureIndex * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y:         -4,
                  boxShadow: `0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accentColour}40`,
                }}
                className={`rounded-2xl p-3 sm:p-4 relative overflow-hidden transition-all duration-300 ${isRTL ? "text-right" : ""}`}
                style={GLASS_CARD_STYLE}
              >
                {/* Coloured top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: accentColour }} />

                {/* Icon row */}
                <div className={`flex items-center gap-2 mb-2 md:mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${accentColour}18`, border: `1px solid ${accentColour}28` }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accentColour }} />
                  </div>
                  <span className="text-sm md:text-base">{emojiMarker}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{featureItem.title}</h3>
                <p className="text-white/45 text-[10px] sm:text-xs leading-relaxed">{featureItem.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideContainer>
  );
}
