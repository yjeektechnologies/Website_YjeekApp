import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Bell, Apple, Play, CheckCircle2, Calendar } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface LaunchData {
  id: number;
  city: string;
  cityAr: string;
  country: string;
  countryCode: string;
  launchDate: string;
  description: string | null;
  descriptionAr: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CountBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center"
      >
        <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white tabular-nums">
          {value}
        </span>
      </motion.div>
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white/50 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function daysUntil(date: string) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));
}

export function ComingSoon() {
  const { lang, isRTL } = useLang();
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const [launches, setLaunches] = useState<LaunchData[]>([]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);

  const tr = {
    en: {
      badge: "Coming Soon",
      heading: (city: string, country: string) => `Launching in ${city}, ${country}`,
      subtext: (d: string | null) =>
        d ?? "We're working hard to bring Yjeek to your neighbourhood. Sign up to be the first to know.",
      notifyLabel: "Get notified on launch day",
      placeholder: "Your email address",
      cta: "Notify Me",
      thanks: "You're on the list! We'll notify you the moment we go live.",
      orDownload: "Or download the app now to be ready",
      countdown: ["Days", "Hours", "Minutes", "Seconds"],
      moreCities: "More cities coming soon",
      daysLeft: (n: number) => n === 0 ? "Launching today!" : `${n} day${n === 1 ? "" : "s"} away`,
    },
    ar: {
      badge: "قريباً",
      heading: (city: string, country: string) => `الإطلاق في ${city}، ${country}`,
      subtext: (d: string | null) =>
        d ?? "نعمل بجد لإيصال يجيك إلى حيّك. سجّل الآن لتكون أول من يعلم.",
      notifyLabel: "احصل على إشعار يوم الإطلاق",
      placeholder: "بريدك الإلكتروني",
      cta: "أبلغني",
      thanks: "أنت على القائمة! سنخبرك فور انطلاقنا.",
      orDownload: "أو حمّل التطبيق الآن لتكون جاهزاً",
      countdown: ["أيام", "ساعات", "دقائق", "ثواني"],
      moreCities: "مدن أخرى قادمة قريباً",
      daysLeft: (n: number) => n === 0 ? "اليوم!" : `${n} يوم`,
    },
  }[lang];

  useEffect(() => {
    fetch("/api/launches")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.launches) && data.launches.length > 0) {
          setLaunches(data.launches);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const primary = launches[0] ?? null;
  const rest = launches.slice(1);

  useEffect(() => {
    if (!primary) return;
    setTimeLeft(calcTimeLeft(primary.launchDate));
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(primary.launchDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [primary]);

  if (loading || !primary || !timeLeft) return null;

  const cityName = lang === "ar" ? primary.cityAr : primary.city;
  const desc = lang === "ar" ? primary.descriptionAr : primary.description;
  const isLaunched =
    timeLeft.days === 0 && timeLeft.hours === 0 &&
    timeLeft.minutes === 0 && timeLeft.seconds === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          launchId: primary.id,
          city: primary.city,
          country: primary.country,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #1a3a2a 100%)" }}
      id="coming-soon"
    >
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#4CAF50]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#FFEB3B]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* ── Primary launch ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`max-w-4xl mx-auto text-center ${isRTL ? "text-right" : ""}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFEB3B]/15 border border-[#FFEB3B]/30 mb-8">
            <MapPin className="w-4 h-4 text-[#FFEB3B]" />
            <span className="text-sm font-bold text-[#FFEB3B] uppercase tracking-widest">{tr.badge}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            {tr.heading(cityName, primary.country)}
          </h2>

          <p className="text-white/60 text-lg mb-14 max-w-xl mx-auto leading-relaxed">
            {tr.subtext(desc)}
          </p>

          {/* Countdown */}
          {!isLaunched ? (
            <div className={`flex items-start justify-center gap-2 sm:gap-4 md:gap-6 mb-14 ${isRTL ? "flex-row-reverse" : ""}`}>
              <CountBox value={pad(timeLeft.days)} label={tr.countdown[0]} />
              <span className="text-white/30 text-xl sm:text-4xl md:text-6xl font-black mt-2 sm:mt-3">:</span>
              <CountBox value={pad(timeLeft.hours)} label={tr.countdown[1]} />
              <span className="text-white/30 text-xl sm:text-4xl md:text-6xl font-black mt-2 sm:mt-3">:</span>
              <CountBox value={pad(timeLeft.minutes)} label={tr.countdown[2]} />
              <span className="text-white/30 text-xl sm:text-4xl md:text-6xl font-black mt-2 sm:mt-3">:</span>
              <CountBox value={pad(timeLeft.seconds)} label={tr.countdown[3]} />
            </div>
          ) : (
            <div className="mb-14 text-4xl font-black text-[#FFEB3B]">🎉 We're Live!</div>
          )}

          {/* Email signup */}
          {!submitted ? (
            <div className="max-w-lg mx-auto">
              <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">{tr.notifyLabel}</p>
              <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr.placeholder}
                  disabled={submitting}
                  className="flex-1 px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/30 transition-all text-base disabled:opacity-60"
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  {submitting ? "…" : tr.cta}
                </button>
              </form>
              {submitError && (
                <p className="mt-3 text-red-300 text-sm text-center">{submitError}</p>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-[#4CAF50] font-bold text-lg"
            >
              <CheckCircle2 className="w-7 h-7" />
              {tr.thanks}
            </motion.div>
          )}

          {/* App download links */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <p className="text-white/40 text-sm mb-6">{tr.orDownload}</p>
            <div className={`flex items-center justify-center gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
              <a
                href={appStoreUrl || "https://apps.apple.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-6 py-3.5 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Apple className="w-6 h-6" />
                <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                  <span className="text-[9px] uppercase tracking-wider opacity-50 leading-none">
                    {lang === "ar" ? "حمّل من" : "Download on the"}
                  </span>
                  <span className="text-sm font-bold leading-tight">App Store</span>
                </div>
              </a>
              <a
                href={googlePlayUrl || "https://play.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-6 py-3.5 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-0.5 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Play className="w-6 h-6 text-[#FFEB3B]" fill="currentColor" />
                <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                  <span className="text-[9px] uppercase tracking-wider opacity-50 leading-none">
                    {lang === "ar" ? "احصل عليه من" : "Get it on"}
                  </span>
                  <span className="text-sm font-bold leading-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Additional launches grid ── */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 pt-12 border-t border-white/10"
          >
            <p className="text-center text-white/50 text-sm font-semibold uppercase tracking-widest mb-8">
              {tr.moreCities}
            </p>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto`}>
              {rest.map((l, i) => {
                const name = lang === "ar" ? l.cityAr : l.city;
                const days = daysUntil(l.launchDate);
                const launched = days === 0;
                return (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#4CAF50]/40 rounded-2xl p-5 transition-all group"
                  >
                    <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#4CAF50]" />
                          <span className="text-xs font-semibold text-[#4CAF50] uppercase tracking-wide">{l.country}</span>
                        </div>
                        <h3 className="text-xl font-black text-white leading-tight">{name}</h3>
                      </div>
                      <div className={`shrink-0 text-right px-3 py-2 rounded-xl ${launched ? "bg-[#4CAF50]/20" : "bg-white/8"}`}>
                        <p className={`text-2xl font-black tabular-nums ${launched ? "text-[#4CAF50]" : "text-white"}`}>
                          {launched ? "🎉" : days}
                        </p>
                        {!launched && <p className="text-[10px] text-white/40 font-medium">{lang === "ar" ? "يوم" : "days"}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-white/30 text-xs">
                      <Calendar className="w-3 h-3" />
                      {new Date(l.launchDate).toLocaleDateString(lang === "ar" ? "ar-BH" : "en-GB", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
