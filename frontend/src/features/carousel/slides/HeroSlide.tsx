import React from "react";
import { motion } from "framer-motion";
import { MapPin, Apple, Play } from "lucide-react";
import { PhoneAppMockup }    from "@/components/phone-app-mockup";
import { useLang }           from "@/context/LanguageContext";
import { useSiteConfig }     from "@/hooks/useSiteConfig";
import { useCountryDetect }  from "@/hooks/useCountryDetect";
import { useTranslations }   from "@/hooks/useSiteContent";
import { SlideContainer }    from "../shared/SlideContainer";

// ── Ticker data ───────────────────────────────────────────────────────────────

const TICKER_ITEMS_EN = ["🍕 Pizza","🥗 Salads","💊 Pharmacy","🌸 Flowers","📱 Electronics","🐾 Pets","☕ Coffee","🍣 Sushi","🧁 Bakery","🥩 Butcher","🎂 Cakes","🧴 Beauty","🥦 Groceries","🍔 Burgers","🧃 Juice"];
const TICKER_ITEMS_AR = ["🍕 بيتزا","🥗 سلطات","💊 صيدلية","🌸 زهور","📱 إلكترونيات","🐾 حيوانات","☕ قهوة","🍣 سوشي","🧁 مخبوزات","🥩 لحوم","🎂 كيك","🧴 جمال","🥦 بقالة","🍔 برغر","🧃 عصير"];

// ── Floating emoji particles ───────────────────────────────────────────────────

const FLOATING_HERO_PARTICLES = [
  { emoji: "🍕", x: "82%", y: "18%", delay: 0,   dur: 7 },
  { emoji: "🌸", x: "8%",  y: "38%", delay: 1.4, dur: 9 },
  { emoji: "☕", x: "76%", y: "80%", delay: 0.6, dur: 8 },
  { emoji: "🥗", x: "6%",  y: "72%", delay: 2.1, dur: 11 },
  { emoji: "📱", x: "68%", y: "10%", delay: 1.9, dur: 7 },
  { emoji: "🛵", x: "93%", y: "55%", delay: 0.3, dur: 10 },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function HeroTicker({ items, isRTL }: { items: string[]; isRTL: boolean }) {
  const doubledItems = [...items, ...items];
  return (
    <div
      className="relative w-full overflow-hidden py-1"
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)" }}
    >
      <motion.div
        animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex gap-2 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {doubledItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-medium shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── HeroSlide ─────────────────────────────────────────────────────────────────

export function HeroSlide() {
  const { country }                    = useCountryDetect();
  const { lang, isRTL }                = useLang();
  const tr                             = useTranslations().hero;
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const tickerItems                    = lang === "ar" ? TICKER_ITEMS_AR : TICKER_ITEMS_EN;

  return (
    <SlideContainer backgroundStyle="linear-gradient(135deg, #0A1810 0%, #1B4332 55%, #0A1810 100%)">
      {/* Ambient background layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.22),transparent_55%)]" />
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-[#4CAF50] blur-[180px] opacity-10 rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {FLOATING_HERO_PARTICLES.map(({ emoji, x, y, delay, dur }, i) => (
          <motion.span
            key={i}
            className="absolute select-none text-xl md:text-2xl"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.5, 0.38],
              scale:   [0, 1.1, 1],
              y:       ["0px", "-16px", "0px"],
              rotate:  [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: delay + 3.2 },
              scale:   { duration: 0.8, delay: delay + 3.2, ease: [0.34, 1.4, 0.64, 1] },
              y:       { duration: dur, delay: delay + 3.8, repeat: Infinity, ease: "easeInOut" },
              rotate:  { duration: dur * 1.3, delay: delay + 3.8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main content grid */}
      <div className="relative z-10 min-h-full flex items-center container mx-auto px-4 md:px-6 py-10 md:py-8">
        <div className={`grid lg:grid-cols-2 gap-10 lg:gap-8 items-center w-full ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>

          {/* Left column — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`flex flex-col gap-4 md:gap-5 ${isRTL ? "items-end text-right" : ""}`}
          >
            {/* Country badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFEB3B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFEB3B]" />
              </span>
              <span className="text-xs font-medium text-white/85">
                {tr.badge} <strong className="text-[#FFEB3B]">{lang === "ar" ? country.nameAr : country.name}</strong>
              </span>
            </div>

            {/* Headline */}
            <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white ${isRTL ? "leading-[1.35]" : "leading-[1.05]"}`}>
              {tr.headline1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FFF176]">
                {tr.headline2}
              </span>
            </h1>

            {/* Scrolling ticker */}
            <div className="w-full">
              <HeroTicker items={tickerItems} isRTL={isRTL} />
            </div>

            <p className="text-sm md:text-lg text-white/65 leading-relaxed max-w-lg">
              {tr.subtext(lang === "ar" ? country.nameAr : country.name)}
            </p>

            {/* Store buttons */}
            <div className={`flex flex-col gap-2 md:gap-3 ${isRTL ? "items-end" : ""}`}>
              <p className="text-white/35 text-[11px] font-semibold uppercase tracking-widest">{tr.cta}</p>
              <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  href={appStoreUrl || "https://apps.apple.com"} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/30 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Apple className="w-5 h-5 md:w-6 md:h-6" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.appStorePrefix}</span>
                    <span className="text-sm font-bold leading-tight">{tr.appStore}</span>
                  </div>
                </motion.a>
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  href={googlePlayUrl || "https://play.google.com"} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 border border-white/20 transition-colors shadow-lg shadow-black/20 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-[#FFEB3B]" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.googlePlayPrefix}</span>
                    <span className="text-sm font-bold leading-tight">{tr.googlePlay}</span>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Social proof row */}
            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-[#0A1810] bg-[#388E3C] flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <div className={`flex items-center gap-0.5 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-3 h-3 text-[#FFEB3B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-white/50">{tr.socialProof}</span>
              </div>
            </div>
          </motion.div>

          {/* Right column — phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, type: "spring", stiffness: 50 }}
            className="relative h-[360px] lg:h-[480px] hidden md:block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-20"
              >
                <PhoneAppMockup size="sm" lang={lang as "en" | "ar"} isRTL={isRTL} intervalMs={3500} />
              </motion.div>

              {/* Driver ETA badge */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className={`absolute top-1/4 z-30 rounded-xl p-3.5 flex items-center gap-3 ${isRTL ? "-right-10 flex-row-reverse" : "-left-10"}`}
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="w-9 h-9 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-[10px] text-white/50 font-medium">{tr.driverBadge}</p>
                  <p className="text-base font-bold text-white">{tr.driverMins}</p>
                </div>
              </motion.div>

              {/* Order status badge */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className={`absolute bottom-1/3 z-30 rounded-xl p-3.5 flex items-center gap-3 ${isRTL ? "-left-6 flex-row-reverse" : "-right-6"}`}
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="w-9 h-9 rounded-full bg-[#FFEB3B]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#FFEB3B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-[10px] text-white/50 font-medium">{tr.orderStatus}</p>
                  <p className="text-base font-bold text-[#FFEB3B]">{tr.onTheWay}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </SlideContainer>
  );
}
