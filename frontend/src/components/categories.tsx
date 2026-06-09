import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Coffee, Flower2, Cpu, Watch, Heart } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { useLocation } from "wouter";
import { useSiteConfig, DEFAULT_CATEGORY_BADGES } from "@/hooks/useSiteConfig";

const BADGE_STYLES: Record<string, string> = {
  food:        "bg-orange-500/90 text-white",
  groceries:   "bg-[#4CAF50]/90 text-white",
  flowers:     "bg-pink-500/90 text-white",
  electronics: "bg-blue-500/90 text-white",
  accessories: "bg-amber-500/90 text-white",
  pets:        "bg-purple-500/90 text-white",
};

export function Categories() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().categories;
  const [, navigate] = useLocation();
  const { categoryBadges } = useSiteConfig();

  const categories = [
    { id: "food" as const,        icon: Coffee,      image: "/src/assets/images/cat-food.png",        color: "from-[#388E3C]/80 to-[#1B4332]/80",  colSpan: "col-span-1 md:col-span-2 lg:col-span-2" },
    { id: "groceries" as const,   icon: ShoppingBag, image: "/src/assets/images/cat-groceries.png",   color: "from-[#4CAF50]/80 to-[#388E3C]/80",  colSpan: "col-span-1 md:col-span-2 lg:col-span-2" },
    { id: "flowers" as const,     icon: Flower2,     image: "/src/assets/images/cat-flowers.png",     color: "from-pink-400/80 to-rose-500/80",     colSpan: "col-span-1 md:col-span-2 lg:col-span-1" },
    { id: "electronics" as const, icon: Cpu,         image: "/src/assets/images/cat-electronics.png", color: "from-blue-500/80 to-indigo-700/80",   colSpan: "col-span-1 md:col-span-2 lg:col-span-1" },
    { id: "accessories" as const, icon: Watch,       image: "/src/assets/images/cat-accessories.png", color: "from-amber-400/80 to-orange-600/80",  colSpan: "col-span-1 md:col-span-2 lg:col-span-1" },
    { id: "pets" as const,        icon: Heart,       image: "/src/assets/images/cat-pets.png",        color: "from-purple-400/80 to-purple-700/80", colSpan: "col-span-1 md:col-span-2 lg:col-span-1" },
  ];

  return (
    <section className="py-24 relative z-10" id="categories">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 ${isRTL ? "md:flex-row-reverse text-right" : ""}`}
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              {tr.heading1} <br />
              <span className="text-[#4CAF50]">{tr.heading2}</span>
            </h2>
            <p className="text-white/55 text-lg">{tr.subtext}</p>
          </div>
          <button
            onClick={() => navigate("/services")}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white/70 hover:text-white transition-colors w-fit ${isRTL ? "flex-row-reverse" : ""}`}
            style={{ border: "1px solid rgba(76,175,80,0.3)", background: "rgba(76,175,80,0.08)" }}
          >
            {tr.viewAll} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-[250px]">
          {categories.map((cat, index) => {
            const item = tr.items[cat.id];
            const badge = categoryBadges[cat.id] ?? DEFAULT_CATEGORY_BADGES[cat.id];
            const badgeStyle = BADGE_STYLES[cat.id] ?? "bg-gray-700/90 text-white";
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.025 }}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer ${cat.colSpan}`}
                style={{ willChange: "transform" }}
              >
                <div className="absolute inset-0" style={{ background: "#111E17" }}>
                  <img
                    src={cat.image}
                    alt={item?.title ?? ""}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700 ease-out"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = "none";
                      t.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className={`hidden absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {badge && (
                  <div className={`absolute top-4 z-20 ${isRTL ? "right-4" : "left-4"}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: -12 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.4, type: "spring", stiffness: 320, damping: 16 }}
                    >
                      <motion.span
                        animate={{ rotate: [0, -2, 1.2, -0.8, 0.4, 0], y: [0, -1.5, 0.5, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 3.8 + index * 0.55, ease: "easeInOut", delay: 0.5 + index * 0.4, times: [0, 0.2, 0.45, 0.65, 0.85, 1] }}
                        whileHover={{ scale: 1.1, rotate: 0, y: -2 }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeStyle} shadow-lg select-none`}
                      >
                        {lang === "ar" ? badge.labelAr : badge.label}
                      </motion.span>
                    </motion.div>
                  </div>
                )}

                <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-end ${isRTL ? "items-end text-right" : ""}`}>
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#4CAF50]/20 backdrop-blur-md flex items-center justify-center mb-4 border border-[#4CAF50]/40">
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto">
                      {item.desc}
                    </p>
                    <a
                      href="#app"
                      className="inline-flex items-center bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-full px-5 py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 transform translate-y-4 group-hover:translate-y-0 text-sm"
                    >
                      {tr.getTheApp}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
