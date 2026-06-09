import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLang }         from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { SlideContainer, GLASS_CARD_STYLE } from "../shared/SlideContainer";

interface DatabaseReview {
  id:     number;
  name:   string;
  nameAr: string;
  role:   string;
  roleAr: string;
  city:   string;
  text:   string;
  textAr: string;
  rating: number;
}

export function TestimonialsSlide() {
  const { lang, isRTL }        = useLang();
  const tr                     = useTranslations().testimonials;
  const [reviews, setReviews]  = useState<DatabaseReview[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setReviews(data.testimonials ?? []))
      .catch(() => {});
  }, []);

  return (
    <SlideContainer>
      <div className="h-full flex flex-col justify-center container mx-auto px-4 md:px-6 py-4 md:py-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-4 md:mb-8"
        >
          <h2 className="text-xl md:text-4xl font-black text-white">{tr.heading}</h2>
          <p className="text-white/50 text-sm mt-1">{tr.subtext}</p>
        </motion.div>

        {/* Review cards */}
        {reviews.length === 0 ? (
          <div className="flex items-center justify-center text-white/30 text-sm">Loading reviews…</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {reviews.slice(0, 3).map((review, reviewIndex) => {
              const displayName = lang === "ar" && review.nameAr ? review.nameAr : review.name;
              const displayRole = lang === "ar" && review.roleAr ? review.roleAr : review.role;
              const displayText = lang === "ar" && review.textAr ? review.textAr : review.text;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: reviewIndex * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, boxShadow: "0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(76,175,80,0.2)" }}
                  className={`rounded-2xl p-4 md:p-6 flex flex-col transition-all duration-300 ${isRTL ? "text-right" : ""}`}
                  style={GLASS_CARD_STYLE}
                >
                  {/* Star rating */}
                  <div className={`flex gap-0.5 text-[#FFEB3B] mb-2 md:mb-4 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                    {[...Array(review.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-white/65 text-xs md:text-sm leading-relaxed flex-1 italic mb-3 md:mb-5">
                    "{displayText}"
                  </p>

                  {/* Reviewer identity */}
                  <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#4CAF50] flex items-center justify-center font-bold text-white shrink-0 text-sm">
                      {displayName.charAt(0)}
                    </div>
                    <div className={isRTL ? "text-right" : ""}>
                      <h4 className="text-white font-bold text-sm">{displayName}</h4>
                      <p className="text-white/35 text-xs">{displayRole}{review.city ? ` · ${review.city}` : ""}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
