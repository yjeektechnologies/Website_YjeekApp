import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Apple, Play } from "lucide-react";
import { useLang }           from "@/context/LanguageContext";
import { useSiteConfig }     from "@/hooks/useSiteConfig";
import { useTranslations }   from "@/hooks/useSiteContent";
import { PhoneAppMockup }    from "@/components/phone-app-mockup";
import { SlideContainer }    from "../shared/SlideContainer";

// ── Stat counter ──────────────────────────────────────────────────────────────

const DEFAULT_STAT_VALUES = { partners: "500+", deliveries: "1M+", cities: "200+", rating: "4.9" };

/**
 * CountUp — animates a numeric string from 0 to its target value.
 * Runs the animation exactly once when `shouldAnimate` becomes true.
 */
function CountUp({ targetValue, shouldAnimate }: { targetValue: string; shouldAnimate: boolean }) {
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const numericMatch = targetValue.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!numericMatch) {
      setDisplayValue(targetValue);
      return;
    }

    const numericTarget     = parseFloat(numericMatch[1]);
    const suffix            = numericMatch[2];
    const animationDuration = 1200;
    const animationStartTime = Date.now();

    const tick = () => {
      const elapsedFraction = Math.min((Date.now() - animationStartTime) / animationDuration, 1);
      const easedFraction   = 1 - Math.pow(1 - elapsedFraction, 3); // ease-out cubic
      const currentValue    = numericTarget * easedFraction;

      setDisplayValue(
        (Number.isInteger(numericTarget) ? Math.round(currentValue) : parseFloat(currentValue.toFixed(1))) + suffix,
      );

      if (elapsedFraction < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [shouldAnimate, targetValue]);

  return <>{displayValue}</>;
}

// ── AppDownloadSlide ──────────────────────────────────────────────────────────

export function AppDownloadSlide() {
  const { lang, isRTL }                = useLang();
  const tr                             = useTranslations().appDownload;
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();

  const [statValues, setStatValues] = useState(DEFAULT_STAT_VALUES);
  const [shouldAnimateCounters, setShouldAnimateCounters] = useState(false);
  const slideRootRef = useRef<HTMLDivElement>(null);
  const isSlideInViewport = useInView(slideRootRef, { once: true });

  useEffect(() => {
    fetch("/api/site-stats")
      .then((r) => r.json())
      .then((data) => setStatValues({ ...DEFAULT_STAT_VALUES, ...data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isSlideInViewport) setShouldAnimateCounters(true);
  }, [isSlideInViewport]);

  return (
    <SlideContainer>
      <div ref={slideRootRef} className="h-full flex items-center container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div
          className="w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #388E3C 100%)",
            border:     "1px solid rgba(76,175,80,0.2)",
          }}
        >
          {/* Ambient glow blobs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4CAF50]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#FFEB3B]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className={`grid lg:grid-cols-2 gap-6 items-center p-5 sm:p-8 md:p-12 lg:p-16 ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>

            {/* Left — copy + CTA buttons + stats */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`relative z-10 ${isRTL ? "text-right" : ""}`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 tracking-tight">
                {tr.heading1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FFF176]">{tr.heading2}</span>
              </h2>
              <p className="text-white/65 mb-4 sm:mb-6 md:mb-8 max-w-md text-sm md:text-base">{tr.subtext}</p>

              {/* Store buttons */}
              <div className={`flex flex-wrap gap-3 mb-4 sm:mb-6 md:mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  href={appStoreUrl || "https://apps.apple.com"} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 h-12 md:h-14 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold shadow-lg transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Apple className="w-5 h-5 md:w-7 md:h-7" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.appStorePrefix}</span>
                    <span className="text-sm font-bold leading-tight">{tr.appStore}</span>
                  </div>
                </motion.a>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  href={googlePlayUrl || "https://play.google.com"} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 h-12 md:h-14 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 font-bold transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Play className="w-5 h-5 md:w-7 md:h-7 text-[#FFEB3B]" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.googlePlayPrefix}</span>
                    <span className="text-sm font-bold leading-tight">{tr.googlePlay}</span>
                  </div>
                </motion.a>
              </div>

              {/* Animated stats row */}
              <div className={`grid grid-cols-3 gap-2 md:gap-4 border-t border-white/15 pt-4 md:pt-6 ${isRTL ? "text-right" : ""}`}>
                {[
                  { statValue: statValues.partners,   label: tr.stats.restaurants },
                  { statValue: statValues.deliveries,  label: tr.stats.orders },
                  { statValue: statValues.cities,      label: tr.stats.cities },
                ].map(({ statValue, label }) => (
                  <div key={label}>
                    <p className="text-xl md:text-2xl font-black text-white tabular-nums">
                      <CountUp targetValue={statValue} shouldAnimate={shouldAnimateCounters} />
                    </p>
                    <p className="text-[10px] md:text-xs text-white/45 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — floating phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative h-[280px] md:h-[320px] hidden lg:block"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <PhoneAppMockup size="sm" lang={lang as "en" | "ar"} isRTL={isRTL} intervalMs={4000} />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
