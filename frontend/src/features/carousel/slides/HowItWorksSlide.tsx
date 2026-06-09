import React from "react";
import { motion } from "framer-motion";
import { MapPin, ShoppingBag, Clock } from "lucide-react";
import { useLang }         from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { SlideContainer }  from "../shared/SlideContainer";

const STEP_ICONS   = [MapPin, ShoppingBag, Clock] as const;
const STEP_ACCENTS = [
  { accentColour: "#4CAF50", stepNumberClass: "bg-[#4CAF50] text-white" },
  { accentColour: "#388E3C", stepNumberClass: "bg-[#388E3C] text-white" },
  { accentColour: "#FFEB3B", stepNumberClass: "bg-[#FFEB3B] text-gray-900" },
] as const;

export function HowItWorksSlide() {
  const { isRTL }  = useLang();
  const tr         = useTranslations().howItWorks;

  return (
    <SlideContainer>
      <div className="h-full flex flex-col justify-center container mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Dot-grid background decoration */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(76,175,80,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-10 relative z-10"
        >
          <h2 className="text-xl md:text-4xl font-black tracking-tight text-white mb-2">{tr.heading}</h2>
          <p className="text-white/50 text-sm max-w-lg mx-auto">{tr.subtext}</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 relative z-10">
          {/* Connector line between steps (desktop only) */}
          <div
            className="hidden md:block absolute top-12 left-[18%] right-[18%] h-[1px]"
            style={{ background: "linear-gradient(to right, rgba(76,175,80,0.4), rgba(76,175,80,0.15), rgba(255,235,59,0.3))" }}
          />

          {tr.steps.map((step, stepIndex) => {
            const StepIcon  = STEP_ICONS[stepIndex];
            const accent    = STEP_ACCENTS[stepIndex];

            return (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: stepIndex * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 md:flex-col md:items-center md:gap-0 md:text-center relative"
              >
                {/* Icon circle */}
                <div className="relative shrink-0 md:mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: stepIndex % 2 === 0 ? 5 : -5 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background:  `${accent.accentColour}12`,
                      border:      `1px solid ${accent.accentColour}25`,
                      boxShadow:   `0 0 30px ${accent.accentColour}15`,
                    }}
                  >
                    <StepIcon className="w-6 h-6 md:w-9 md:h-9" style={{ color: accent.accentColour }} />
                  </motion.div>

                  {/* Step number bubble */}
                  <div className={`absolute -top-2 ${isRTL ? "-left-2" : "-right-2"} w-6 h-6 rounded-full ${accent.stepNumberClass} flex items-center justify-center text-[11px] font-black shadow-lg`}>
                    {stepIndex + 1}
                  </div>
                </div>

                {/* Step text */}
                <div className="flex-1 md:contents">
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm max-w-xs hidden md:block">{step.desc}</p>
                  <p className="text-white/45 leading-relaxed text-xs md:hidden">{step.desc}</p>
                  {"aside" in step && step.aside && (
                    <p className="mt-1 text-[11px] italic text-white/25 font-medium hidden md:block">
                      {(step as { aside: string }).aside}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideContainer>
  );
}
