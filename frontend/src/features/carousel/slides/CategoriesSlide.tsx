import React from "react";
import { motion } from "framer-motion";
import {
  Coffee, ShoppingBag, Flower2, Cpu, Watch, Heart, Truck, Box, Zap, Star,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig, DEFAULT_CATEGORY_BADGES } from "@/hooks/useSiteConfig";
import { useTranslations } from "@/hooks/useSiteContent";
import { SlideContainer } from "../shared/SlideContainer";

// ── Icon mapping ───────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  ShoppingBag,
  Flower2,
  Cpu,
  Watch,
  Heart,
  Truck,
  Box,
  Zap,
  Star,
};

// ── Badge colour options ───────────────────────────────────────────────────────

const BADGE_COLOUR_OPTIONS = [
  "bg-orange-500/90 text-white",
  "bg-[#4CAF50]/90 text-white",
  "bg-pink-500/90 text-white",
  "bg-blue-500/90 text-white",
  "bg-amber-500/90 text-white",
  "bg-purple-500/90 text-white",
];

// ── Default badge options ───────────────────────────────────────────────────────

const DEFAULT_BADGE_OPTIONS = [
  { label: "🔥 Most Popular", labelAr: "🔥 الأكثر طلباً" },
  { label: "⚡ Under 15 mins", labelAr: "⚡ أقل من ١٥ دقيقة" },
  { label: "🌸 Same day", labelAr: "🌸 نفس اليوم" },
  { label: "📦 Fast shipping", labelAr: "📦 شحن سريع" },
  { label: "✨ Trending", labelAr: "✨ الأكثر رواجاً" },
  { label: "🐾 New arrivals", labelAr: "🐾 وصل جديد" },
];

// ── Default gradient fallbacks for categories ───────────────────────────────────

const GRADIENT_OPTIONS = [
  "from-[#388E3C]/80 to-[#1B4332]/80",
  "from-[#4CAF50]/80 to-[#388E3C]/80",
  "from-pink-400/80 to-rose-500/80",
  "from-blue-500/80 to-indigo-700/80",
  "from-amber-400/80 to-orange-600/80",
  "from-purple-400/80 to-purple-700/80",
];

// Helper function to get consistent random value based on ID
function getByIndex<T>(array: T[], id: number): T {
  return array[id % array.length];
}

// ── CategoriesSlide ───────────────────────────────────────────────────────────

export function CategoriesSlide() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().categories;
  const { categoryBadges, services } = useSiteConfig();

  return (
    <SlideContainer>
      <div className="h-full flex flex-col justify-center container mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`flex items-end justify-between mb-4 md:mb-6 ${isRTL ? "flex-row-reverse text-right" : ""}`}
        >
          <div>
            <h2 className="text-xl md:text-4xl font-black tracking-tight text-white">
              {tr.heading1} <span className="text-[#4CAF50]">{tr.heading2}</span>
            </h2>
            <p className="text-white/50 text-sm mt-1">{tr.subtext}</p>
          </div>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4" style={{ gridAutoRows: "clamp(100px, 16vh, 200px)" }}>
          {services.map((service, tileIndex) => {
            const IconComponent = ICON_MAP[service.icon] || ShoppingBag;
            const title = lang === "ar" ? service.nameAr : service.name;
            const adminBadge = categoryBadges[service.id.toString()] ?? getByIndex(DEFAULT_BADGE_OPTIONS, service.id);
            const badgeColourClass = getByIndex(BADGE_COLOUR_OPTIONS, service.id);
            const gradientFallback = getByIndex(GRADIENT_OPTIONS, service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: tileIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ willChange: "transform" }}
              >
                {/* Background image with gradient fallback */}
                <div className="absolute inset-0 bg-[#111E17]">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700"
                      onError={(e) => {
                        const imageElement = e.target as HTMLImageElement;
                        imageElement.style.display = "none";
                        imageElement.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`hidden absolute inset-0 bg-gradient-to-br ${gradientFallback}`} />
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Admin-configurable promo badge */}
                {adminBadge && (
                  <motion.span
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5 + tileIndex * 0.4, ease: "easeInOut" }}
                    className={`absolute top-1.5 left-1.5 z-10 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold ${badgeColourClass} shadow-md select-none hidden sm:inline-flex`}
                  >
                    {lang === "ar" ? adminBadge.labelAr : adminBadge.label}
                  </motion.span>
                )}

                {/* Category label */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                  <h3 className="text-white font-bold text-xs md:text-sm leading-tight">{title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideContainer>
  );
}
