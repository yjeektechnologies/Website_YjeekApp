import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useTranslations } from "@/hooks/useSiteContent";

interface SiteStats {
  partners: string;
  deliveries: string;
  cities: string;
  rating: string;
  ratingCount: string;
}

const DEFAULTS: SiteStats = {
  partners: "500+",
  deliveries: "1M+",
  cities: "200+",
  rating: "4.9",
  ratingCount: "100,000",
};

function useCountUp(target: string, inView: boolean, duration = 1400): string {
  const [display, setDisplay] = useState("0");
  const ranRef = useRef(false);

  useEffect(() => {
    if (!inView || ranRef.current) return;
    ranRef.current = true;
    const match = target.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) { setDisplay(target); return; }
    const num = parseFloat(match[1]);
    const suffix = match[2];
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      const formatted = Number.isInteger(num)
        ? Math.round(current).toString()
        : parseFloat(current.toFixed(1)).toString();
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return display;
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const display = useCountUp(value, inView);
  return (
    <div ref={ref}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl font-black text-white mb-1 tabular-nums"
      >
        {display}
      </motion.p>
      <p className="text-sm text-white/50 font-medium">{label}</p>
    </div>
  );
}

export function AppDownload() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().appDownload;
  const [stats, setStats] = useState<SiteStats>(DEFAULTS);
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();

  useEffect(() => {
    fetch("/api/site-stats")
      .then((r) => r.json())
      .then((d) => setStats({ ...DEFAULTS, ...d }))
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 bg-background" id="app">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="rounded-[3rem] overflow-hidden relative border border-[#4CAF50]/20"
          style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #388E3C 100%)" }}
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4CAF50]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFEB3B]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className={`grid lg:grid-cols-2 gap-12 items-center p-8 md:p-16 lg:p-24 ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`relative z-10 ${isRTL ? "text-right" : ""}`}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                {tr.heading1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FFF176]">
                  {tr.heading2}
                </span>
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-md">{tr.subtext}</p>

              <div className={`flex flex-wrap gap-4 mb-12 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild className="h-16 px-6 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl shadow-lg">
                    <a href={appStoreUrl || "https://apps.apple.com"} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Apple className="w-8 h-8" />
                      <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"} justify-center`}>
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.appStorePrefix}</span>
                        <span className="text-lg font-bold leading-tight">{tr.appStore}</span>
                      </div>
                    </a>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild className="h-16 px-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20">
                    <a href={googlePlayUrl || "https://play.google.com"} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Play className="w-8 h-8 text-[#FFEB3B]" fill="currentColor" />
                      <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"} justify-center`}>
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 leading-none">{tr.googlePlayPrefix}</span>
                        <span className="text-lg font-bold leading-tight">{tr.googlePlay}</span>
                      </div>
                    </a>
                  </Button>
                </motion.div>
              </div>

              <div className={`grid grid-cols-3 gap-6 border-t border-white/15 pt-8 ${isRTL ? "text-right" : ""}`}>
                <AnimatedStat value={stats.partners} label={tr.stats.restaurants} />
                <AnimatedStat value={stats.deliveries} label={tr.stats.orders} />
                <AnimatedStat value={stats.cities} label={tr.stats.cities} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative h-[600px] hidden lg:block"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="w-[280px] aspect-[9/16] bg-[#1B4332] border border-white/20 rounded-[3rem] p-4 shadow-2xl overflow-hidden"
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/60 rounded-b-xl z-30" />
                  <div className="w-full h-full bg-[#2D6A4F] rounded-[2.5rem] overflow-hidden p-4 pt-10">
                    <div className="h-28 bg-[#4CAF50]/20 rounded-2xl border border-[#4CAF50]/30 mb-4" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="h-20 bg-white/5 rounded-xl" />
                      <div className="h-20 bg-white/5 rounded-xl" />
                    </div>
                    <div className="h-12 bg-[#FFEB3B]/10 rounded-xl mb-3" />
                    <div className="h-12 bg-white/5 rounded-xl" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
