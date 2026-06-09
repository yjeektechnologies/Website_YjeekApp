import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";

interface DBTestimonial {
  id: number;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  city: string;
  text: string;
  textAr: string;
  rating: number;
}

export function Testimonials() {
  const { lang, isRTL } = useLang();
  const tr = useTranslations().testimonials;
  const [reviews, setReviews] = useState<DBTestimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => { setReviews(d.testimonials ?? []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || reviews.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#4CAF50]/6 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            {tr.heading}
          </h2>
          <p className="text-white/50 text-lg">{tr.subtext}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => {
            const name = lang === "ar" && review.nameAr ? review.nameAr : review.name;
            const role = lang === "ar" && review.roleAr ? review.roleAr : review.role;
            const text = lang === "ar" && review.textAr ? review.textAr : review.text;
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.2)" }}
                className={`rounded-3xl p-8 flex flex-col transition-all duration-300 cursor-default ${isRTL ? "text-right" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  willChange: "transform",
                }}
              >
                <div className={`flex text-[#FFEB3B] mb-6 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 text-lg leading-relaxed mb-8 flex-1 italic">
                  "{text}"
                </p>
                <div className={`flex items-center gap-4 mt-auto ${isRTL ? "flex-row-reverse" : ""}`}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-[#4CAF50] flex items-center justify-center font-bold text-white text-lg shrink-0"
                  >
                    {name.charAt(0)}
                  </motion.div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h4 className="text-white font-bold">{name}</h4>
                    <p className="text-white/40 text-sm">{role}{review.city ? ` • ${review.city}` : ""}</p>
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
