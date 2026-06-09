/**
 * GetTheAppPage — /get-the-app
 *
 * Dedicated download landing page. Shows the animated PhoneAppMockup alongside
 * download CTAs, feature highlights, and social proof.
 * Fully bilingual EN/AR with RTL layout support.
 */

import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Apple, Play, Zap, MapPin, ShieldCheck, Clock,
  Star, ArrowLeft, ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { PhoneAppMockup } from "@/components/phone-app-mockup";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";

// ── Copy ──────────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    back:         "Back to home",
    badge:        "Free to download",
    headline1:    "Everything",
    headline2:    "delivered.",
    subtext:      "Food, groceries, pharmacy, flowers, electronics — all in one app. Order in seconds, track live, receive in minutes.",
    appStoreLabel: "App Store",
    googleLabel:   "Google Play",
    appStorePrefix: "Download on the",
    googlePrefix:   "Get it on",
    ratingLabel:   "4.9 · 100K+ reviews",
    features: [
      { icon: Zap,         title: "Under 30 min",    desc: "Most orders delivered in under 30 minutes." },
      { icon: MapPin,      title: "Live tracking",   desc: "Follow your order from the kitchen to your door." },
      { icon: ShieldCheck, title: "Safe & secure",   desc: "Encrypted payments, verified merchants." },
      { icon: Clock,       title: "Available 24/7",  desc: "Order any time, day or night." },
    ],
    screens: [
      {
        emoji: "🏠",
        title:  "Browse everything",
        desc:   "Food, groceries, pharmacy, flowers and more — all in one place.",
        label:  "Home Screen",
      },
      {
        emoji: "🛒",
        title:  "Shop in seconds",
        desc:   "Add items, customise your order and check out in one tap.",
        label:  "Store Screen",
      },
      {
        emoji: "📍",
        title:  "Track live",
        desc:   "See your driver in real time. Know exactly when your order arrives.",
        label:  "Tracking Screen",
      },
    ],
    ctaHeadline: "Join thousands across the GCC.",
    ctaSubtext:  "Bahrain · UAE · Saudi Arabia · Kuwait · Qatar",
    ctaBadge:    "Free download. No subscription.",
  },
  ar: {
    back:         "العودة إلى الرئيسية",
    badge:        "مجاني للتحميل",
    headline1:    "كل شيء",
    headline2:    "يوصَّل.",
    subtext:      "طعام، بقالة، صيدلية، زهور، إلكترونيات — كل شيء في تطبيق واحد. اطلب في ثوانٍ، تابع بشكل مباشر، واستلم في دقائق.",
    appStoreLabel: "App Store",
    googleLabel:   "Google Play",
    appStorePrefix: "تحميل من",
    googlePrefix:   "احصل عليه من",
    ratingLabel:   "٤٫٩ · أكثر من ١٠٠ ألف تقييم",
    features: [
      { icon: Zap,         title: "أقل من ٣٠ دقيقة",  desc: "معظم الطلبات تُوصَّل في أقل من ٣٠ دقيقة." },
      { icon: MapPin,      title: "تتبع مباشر",        desc: "تابع طلبك من المطبخ حتى بابك." },
      { icon: ShieldCheck, title: "آمن وموثوق",        desc: "مدفوعات مشفّرة وتجار موثّقون." },
      { icon: Clock,       title: "متاح ٢٤/٧",         desc: "اطلب في أي وقت، ليلاً أو نهاراً." },
    ],
    screens: [
      {
        emoji: "🏠",
        title:  "تصفّح كل شيء",
        desc:   "طعام، بقالة، صيدلية، زهور والمزيد — كل شيء في مكان واحد.",
        label:  "الشاشة الرئيسية",
      },
      {
        emoji: "🛒",
        title:  "تسوّق في ثوانٍ",
        desc:   "أضف العناصر وخصّص طلبك وادفع بنقرة واحدة.",
        label:  "شاشة المتجر",
      },
      {
        emoji: "📍",
        title:  "تابع مباشرة",
        desc:   "شاهد سائقك على الخريطة. اعرف متى يصل طلبك بالضبط.",
        label:  "شاشة التتبع",
      },
    ],
    ctaHeadline: "انضم لآلاف العملاء في دول الخليج.",
    ctaSubtext:  "البحرين · الإمارات · السعودية · الكويت · قطر",
    ctaBadge:    "مجاني للتحميل. بدون اشتراك.",
  },
} as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GetTheAppPage() {
  const { lang, isRTL } = useLang();
  const tr = COPY[lang as "en" | "ar"] ?? COPY.en;
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay, ease: [0.34, 1.1, 0.64, 1] as [number, number, number, number] },
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "linear-gradient(160deg,#0A1810 0%,#1B4332 55%,#0A1810 100%)" }}
    >
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex items-center pt-24 pb-16 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-[#4CAF50] opacity-10 blur-[180px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-[#C9A84C] opacity-8 blur-[160px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Back link */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft className="w-4 h-4" />
              {tr.back}
            </Link>
          </motion.div>

          <div className={`grid lg:grid-cols-2 gap-14 lg:gap-8 items-center ${isRTL ? "lg:grid-flow-col-dense" : ""}`}>

            {/* Left — copy + CTAs */}
            <div className={`flex flex-col gap-7 ${isRTL ? "items-end text-right" : ""}`}>
              {/* Badge */}
              <motion.div {...fadeUp(0.05)}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#239C55]/20 border border-[#239C55]/35 text-[#6DD89A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#239C55] animate-pulse" />
                  {tr.badge}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.02] text-white">
                {tr.headline1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFEB3B] to-[#FFF176]">
                  {tr.headline2}
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p {...fadeUp(0.15)} className="text-lg text-white/65 leading-relaxed max-w-lg">
                {tr.subtext}
              </motion.p>

              {/* Store buttons */}
              <motion.div {...fadeUp(0.2)} className={`flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={appStoreUrl || "https://apps.apple.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-black/30 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Apple className="w-7 h-7 shrink-0" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 leading-none">{tr.appStorePrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.appStoreLabel}</span>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={googlePlayUrl || "https://play.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-6 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 border border-white/20 transition-colors shadow-lg shadow-black/20 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Play className="w-7 h-7 text-[#FFEB3B] shrink-0" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 leading-none">{tr.googlePrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.googleLabel}</span>
                  </div>
                </motion.a>
              </motion.div>

              {/* Social proof row */}
              <motion.div {...fadeUp(0.25)} className={`flex items-center gap-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0A1810] bg-[#388E3C] flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 10}&backgroundColor=transparent`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <div className={`flex items-center gap-0.5 mb-0.5 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#FFEB3B] fill-[#FFEB3B]" />
                    ))}
                  </div>
                  <span className="text-sm text-white/50">{tr.ratingLabel}</span>
                </div>
              </motion.div>
            </div>

            {/* Right — large phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, type: "spring", stiffness: 45, damping: 18 }}
              className={`flex justify-center ${isRTL ? "lg:justify-start" : "lg:justify-end"}`}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <PhoneAppMockup
                  size="lg"
                  isRTL={isRTL}
                  lang={lang as "en" | "ar"}
                  intervalMs={3500}
                />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Features strip ───────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tr.features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.08)}
                className="flex flex-col gap-3 p-5 rounded-2xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(35,156,85,0.18)" }}>
                  <Icon className="w-5 h-5 text-[#239C55]" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-white font-bold text-[15px] leading-snug">{title}</p>
                  <p className="text-white/45 text-sm mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's inside the app ────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/8">
        <div className="container mx-auto px-4 md:px-6">
          <motion.p {...fadeUp(0)} className={`text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-10 ${isRTL ? "text-right" : ""}`}>
            {lang === "ar" ? "داخل التطبيق" : "Inside the app"}
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {tr.screens.map(({ emoji, title, desc, label }, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className={`group relative p-6 rounded-2xl border border-white/8 overflow-hidden cursor-default ${isRTL ? "text-right" : ""}`}
                style={{ background: "linear-gradient(135deg,rgba(35,156,85,0.08),rgba(255,255,255,0.03))" }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Screen index */}
                <div className="absolute top-4 right-4 text-white/12 font-black text-4xl select-none"
                  style={isRTL ? { left: 16, right: "auto" } : {}}>
                  {i + 1}
                </div>

                {/* Emoji */}
                <div className="text-4xl mb-4">{emoji}</div>

                {/* Label chip */}
                <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 bg-[#239C55]/15 text-[#6DD89A] border border-[#239C55]/25">
                  {label}
                </span>

                <h3 className="text-white font-bold text-lg leading-snug mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>

                {/* Hover arrow */}
                <div className={`mt-4 flex items-center gap-1 text-[#239C55]/60 text-xs font-semibold ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  <span>{lang === "ar" ? "شاشة " + (i + 1) : `Screen ${i + 1}`}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/8">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 text-center"
            style={{ background: "linear-gradient(135deg,#1B4332,#2D6A4F,#388E3C)" }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#4CAF50]/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C9A84C]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Yjeek logo */}
              <div className="flex justify-center mb-6">
                <img
                  src={`${import.meta.env.BASE_URL}yjeek-logo-transparent.png`}
                  alt="Yjeek"
                  className="h-8 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
                {tr.ctaHeadline}
              </h2>
              <p className="text-white/55 text-base md:text-lg mb-2">{tr.ctaSubtext}</p>
              <p className="text-[#6DD89A] text-sm font-semibold mb-8">{tr.ctaBadge}</p>

              <div className={`flex flex-wrap items-center justify-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.a
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  href={appStoreUrl || "https://apps.apple.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-7 py-4 bg-white text-gray-900 rounded-2xl font-bold shadow-xl shadow-black/30 hover:bg-gray-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Apple className="w-7 h-7 shrink-0" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 leading-none">{tr.appStorePrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.appStoreLabel}</span>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  href={googlePlayUrl || "https://play.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-7 py-4 bg-white/15 text-white rounded-2xl font-bold hover:bg-white/25 border border-white/25 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Play className="w-7 h-7 text-[#FFEB3B] shrink-0" fill="currentColor" />
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50 leading-none">{tr.googlePrefix}</span>
                    <span className="text-base font-bold leading-tight">{tr.googleLabel}</span>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CorpStrip />
    </div>
  );
}
