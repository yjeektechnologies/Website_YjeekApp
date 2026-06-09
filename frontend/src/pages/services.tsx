import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Coffee, ShoppingBag, Flower2, Cpu, Watch, Heart, Truck, Box, Zap, Star, Apple, Play } from "lucide-react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface Service {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  imageUrl: string;
  sortOrder: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee, ShoppingBag, Flower2, Cpu, Watch, Heart, Truck, Box, Zap, Star,
};

const DEFAULT_SERVICES: Service[] = [
  { id: 1, name: "Order Food", nameAr: "اطلب الطعام", description: "From local favorites to international cuisine — hot, fresh, and delivered fast.", descriptionAr: "من المطاعم المحلية إلى المطبخ العالمي — ساخناً وطازجاً ويصلك بسرعة.", icon: "Coffee", imageUrl: "/src/assets/images/cat-food.png", sortOrder: 0 },
  { id: 2, name: "Groceries", nameAr: "البقالة", description: "Fresh produce, pantry essentials, and everything in between — delivered in minutes.", descriptionAr: "منتجات طازجة ومستلزمات يومية وكل ما بينهما — تصلك خلال دقائق.", icon: "ShoppingBag", imageUrl: "/src/assets/images/cat-groceries.png", sortOrder: 1 },
  { id: 3, name: "Flowers", nameAr: "الزهور", description: "Beautiful bouquets and arrangements for any occasion, delivered fresh to your door.", descriptionAr: "باقات زهور جميلة لأي مناسبة، تصل طازجة حتى بابك.", icon: "Flower2", imageUrl: "/src/assets/images/cat-flowers.png", sortOrder: 2 },
  { id: 4, name: "Electronics", nameAr: "الإلكترونيات", description: "Gadgets, accessories, and tech essentials from top local electronics stores — delivered today.", descriptionAr: "أجهزة وإكسسوارات ومنتجات تقنية من أفضل المحلات المحلية — تصلك اليوم.", icon: "Cpu", imageUrl: "/src/assets/images/cat-electronics.png", sortOrder: 3 },
  { id: 5, name: "Accessories", nameAr: "الإكسسوارات", description: "Fashion accessories, jewellery, watches, and more — style delivered on demand.", descriptionAr: "إكسسوارات الموضة والمجوهرات والساعات والمزيد — الأناقة بطلب واحد.", icon: "Watch", imageUrl: "/src/assets/images/cat-accessories.png", sortOrder: 4 },
  { id: 6, name: "Pet Shops", nameAr: "متاجر الحيوانات الأليفة", description: "Food, treats, toys, and supplies for your furry friends — because they deserve the best too.", descriptionAr: "طعام وحلويات وألعاب ومستلزمات لحيوانك الأليف — لأنه يستحق الأفضل.", icon: "Heart", imageUrl: "/src/assets/images/cat-pets.png", sortOrder: 5 },
];

const CARD_COLORS = [
  "from-[#388E3C]/80 to-[#1B4332]/80",
  "from-[#4CAF50]/80 to-[#388E3C]/80",
  "from-pink-400/80 to-rose-500/80",
  "from-blue-500/80 to-indigo-700/80",
  "from-amber-400/80 to-orange-600/80",
  "from-purple-400/80 to-purple-700/80",
  "from-teal-400/80 to-teal-700/80",
  "from-red-400/80 to-red-700/80",
];

export default function ServicesPage() {
  const { lang, isRTL } = useLang();
  const [, navigate] = useLocation();
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      })
      .catch(() => setServices(DEFAULT_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const tr = {
    en: {
      back: "Back to Home",
      badge: "What We Deliver",
      heading1: "All Yjeek",
      heading2: "Services",
      subtext: "One app. Every category. Ultra-fast delivery across the GCC & MENA region.",
      getApp: "Get the App",
      downloadPrefix: "Download on the",
      getItOn: "Get it on",
      ctaHeading: "Ready to order?",
      ctaSubtext: "Download the Yjeek app and get anything delivered in minutes.",
    },
    ar: {
      back: "العودة للرئيسية",
      badge: "ماذا نوصّل",
      heading1: "جميع خدمات",
      heading2: "يجيك",
      subtext: "تطبيق واحد. كل الفئات. توصيل فائق السرعة في منطقة الخليج والشرق الأوسط.",
      getApp: "حمّل التطبيق",
      downloadPrefix: "حمّل من",
      getItOn: "احصل عليه من",
      ctaHeading: "جاهز للطلب؟",
      ctaSubtext: "حمّل تطبيق يجيك واحصل على أي شيء خلال دقائق.",
    },
  }[lang];

  const displayServices = loading ? DEFAULT_SERVICES : services;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-[#f0f9f0] to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4CAF5008_1px,transparent_1px),linear-gradient(to_bottom,#4CAF5008_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#4CAF50]/8 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <button
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#388E3C] font-medium mb-10 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              {tr.back}
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20 mb-6">
                <Zap className="w-4 h-4 text-[#388E3C]" />
                <span className="text-sm font-bold text-[#388E3C] uppercase tracking-widest">{tr.badge}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                {tr.heading1}{" "}
                <span className="text-[#4CAF50]">{tr.heading2}</span>
              </h1>
              <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">{tr.subtext}</p>
            </motion.div>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayServices.map((service, index) => {
                  const IconComp = ICON_MAP[service.icon] ?? ShoppingBag;
                  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
                  const name = lang === "ar" && service.nameAr ? service.nameAr : service.name;
                  const desc = lang === "ar" && service.descriptionAr ? service.descriptionAr : service.description;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                      className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
                    >
                      {/* Background */}
                      <div className="absolute inset-0">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${colorClass}`} />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className={`absolute inset-0 p-7 flex flex-col justify-end ${isRTL ? "items-end text-right" : ""}`}>
                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center mb-4">
                            <IconComp className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-2xl font-black text-white mb-2">{name}</h3>
                          <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-xs">
                            {desc}
                          </p>
                          <a
                            href="#app"
                            onClick={() => navigate("/#app")}
                            className="inline-flex items-center gap-2 mt-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-full px-5 py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm"
                          >
                            {tr.getApp}
                            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20" style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #1a3a2a 100%)" }}>
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{tr.ctaHeading}</h2>
              <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{tr.ctaSubtext}</p>
              <div className={`flex items-center justify-center gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <a
                  href={appStoreUrl || "https://apps.apple.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5"
                >
                  <Apple className="w-6 h-6" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-50 leading-none">{tr.downloadPrefix}</span>
                    <span className="text-sm font-bold leading-tight">App Store</span>
                  </div>
                </a>
                <a
                  href={googlePlayUrl || "https://play.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3.5 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-0.5"
                >
                  <Play className="w-6 h-6 text-[#FFEB3B]" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[9px] uppercase tracking-wider opacity-50 leading-none">{tr.getItOn}</span>
                    <span className="text-sm font-bold leading-tight">Google Play</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
