import React from "react";
import { motion } from "framer-motion";
import { MapPin, Apple, Play } from "lucide-react";
import { useCountryDetect } from "@/hooks/useCountryDetect";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useTranslations } from "@/hooks/useSiteContent";
import { PhoneAppMockup } from "@/components/phone-app-mockup";

const TICKER_ITEMS = [
  "🍕 Pizza", "🥗 Salads", "💊 Pharmacy", "🌸 Flowers", "📱 Electronics",
  "🐾 Pet Supplies", "☕ Coffee", "🍣 Sushi", "🧁 Bakery", "🥩 Butcher",
  "🎂 Cakes", "🧴 Beauty", "🥦 Groceries", "🍔 Burgers", "🧃 Juice",
];

const TICKER_ITEMS_AR = [
  "🍕 بيتزا", "🥗 سلطات", "💊 صيدلية", "🌸 زهور", "📱 إلكترونيات",
  "🐾 حيوانات", "☕ قهوة", "🍣 سوشي", "🧁 مخبوزات", "🥩 لحوم",
  "🎂 كيك", "🧴 جمال", "🥦 بقالة", "🍔 برغر", "🧃 عصير",
];

const HERO_PARTICLES = [
  { emoji: "🍕", x: "82%", y: "18%", delay: 0,   dur: 7  },
  { emoji: "🌸", x: "8%",  y: "38%", delay: 1.4, dur: 9  },
  { emoji: "☕", x: "76%", y: "80%", delay: 0.6, dur: 8  },
  { emoji: "🥗", x: "6%",  y: "75%", delay: 2.1, dur: 11 },
  { emoji: "📱", x: "68%", y: "12%", delay: 1.9, dur: 7  },
  { emoji: "🛵", x: "93%", y: "55%", delay: 0.3, dur: 10 },
  { emoji: "💊", x: "14%", y: "88%", delay: 2.7, dur: 8  },
  { emoji: "🎂", x: "88%", y: "38%", delay: 1.1, dur: 9  },
];

function HeroParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {HERO_PARTICLES.map(({ emoji, x, y, delay, dur }, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-2xl md:text-3xl"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.55, 0.4],
            scale: [0, 1.1, 1],
            y: ["0px", "-18px", "0px"],
            rotate: [0, i % 2 === 0 ? 12 : -12, 0],
          }}
          transition={{
            opacity:  { duration: 0.8, delay: delay + 3.2 },
            scale:    { duration: 0.8, delay: delay + 3.2, ease: [0.34,1.4,0.64,1] },
            y:        { duration: dur, delay: delay + 3.8, repeat: Infinity, ease: "easeInOut" },
            rotate:   { duration: dur * 1.3, delay: delay + 3.8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

function Ticker({ items, isRTL }: { items: string[]; isRTL: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative w-full overflow-hidden py-1"
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
    >
      <motion.div
        animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        className="flex gap-3 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm font-medium backdrop-blur-sm shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { country } = useCountryDetect();
  const { lang, isRTL } = useLang();
  const tr = useTranslations().hero;
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const tickerItems = lang === "ar" ? TICKER_ITEMS_AR : TICKER_ITEMS;

  return (
    <section
      className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A1810 0%, #1B4332 50%, #0A1810 100%)" }}
    >
      {/* Background depth layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.25),transparent_55%)]" />
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-[#4CAF50] blur-[180px] opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-[#FFEB3B] blur-[160px] opacity-8 rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Floating food particles (appear after intro exits) */}
      <HeroParticles />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-8 items-center ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col gap-7 max-w-2xl pt-10 lg:pt-0 ${isRTL ? "items-end text-right" : ""}`}
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFEB3B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFEB3B]" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/90">
                {tr.badge} <strong className="text-[#FFEB3B]">{country.name}</strong>
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-white">
              {tr.headline1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FFF176]">
                {tr.headline2}
              </span>
            </h1>

            <div className="w-full -mx-1">
              <Ticker items={tickerItems} isRTL={isRTL} />
            </div>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl">
              {tr.subtext(country.name)}
            </p>

            {/* App download CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className={`flex flex-col gap-4 ${isRTL ? "items-end" : ""}`}
            >
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">{tr.cta}</p>
              <div className={`flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={appStoreUrl || "https://apps.apple.com"}
                  target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/30 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Apple className="w-7 h-7" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.appStorePrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.appStore}</span>
                  </div>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={googlePlayUrl || "https://play.google.com"}
                  target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 border border-white/20 transition-colors shadow-lg shadow-black/20 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Play className="w-7 h-7 text-[#FFEB3B]" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.googlePlayPrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.googlePlay}</span>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Social proof */}
            <div className={`flex items-center gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A1810] bg-[#388E3C] flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className={`flex flex-col ${isRTL ? "items-end" : ""}`}>
                <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-[#FFEB3B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-white/60">{tr.socialProof}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: animated app mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="relative h-[500px] lg:h-[700px] w-full hidden md:block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Glow backdrop behind phone */}
              <div
                className="absolute z-10 rounded-full pointer-events-none"
                style={{
                  width: 420,
                  height: 420,
                  background: "radial-gradient(circle, rgba(35,156,85,0.35) 0%, rgba(35,156,85,0.12) 45%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />

              {/* Phone — floats gently */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-20"
              >
                <PhoneAppMockup
                  size="lg"
                  isRTL={isRTL}
                  lang={lang as "en" | "ar"}
                  intervalMs={3500}
                />
              </motion.div>

              {/* Floating badge — Driver ETA */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className={`absolute top-1/4 z-30 rounded-2xl p-4 flex items-center gap-4 ${isRTL ? "-right-12 flex-row-reverse" : "-left-12"}`}
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="w-10 h-10 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-xs text-white/50 font-medium">{tr.driverBadge}</p>
                  <p className="text-lg font-bold text-white">{tr.driverMins}</p>
                </div>
              </motion.div>

              {/* Floating badge — Order Status */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className={`absolute bottom-1/3 z-30 rounded-2xl p-4 flex items-center gap-4 ${isRTL ? "-left-8 flex-row-reverse" : "-right-8"}`}
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="w-10 h-10 rounded-full bg-[#FFEB3B]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#FFEB3B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-xs text-white/50 font-medium">{tr.orderStatus}</p>
                  <p className="text-lg font-bold text-[#FFEB3B]">{tr.onTheWay}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
