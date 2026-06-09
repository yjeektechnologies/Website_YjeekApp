import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Apple, Play, Bell, CheckCircle2 } from "lucide-react";
import { useLang }       from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { SlideContainer } from "../shared/SlideContainer";

// ── Types ──────────────────────────────────────────────────────────────────────

interface LaunchData {
  id:             number;
  city:           string;
  cityAr:         string;
  country:        string;
  launchDate:     string;
  description:    string | null;
  descriptionAr:  string | null;
}

interface CountdownTime {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function calculateCountdown(launchDateString: string): CountdownTime {
  const remainingMs = Math.max(0, new Date(launchDateString).getTime() - Date.now());
  return {
    days:    Math.floor(remainingMs / 86_400_000),
    hours:   Math.floor((remainingMs / 3_600_000) % 24),
    minutes: Math.floor((remainingMs / 60_000) % 60),
    seconds: Math.floor((remainingMs / 1_000) % 60),
  };
}

function zeroPad(value: number): string {
  return String(value).padStart(2, "0");
}

// ── Translations (inline — this slide has unique non-CMS copy) ─────────────────

const COMING_SOON_TRANSLATIONS = {
  en: {
    badge:      "Coming Soon",
    heading:    (city: string, country: string) => `Launching in ${city}, ${country}`,
    subtext:    (desc: string | null) => desc ?? "Sign up to be first.",
    cta:        "Notify Me",
    placeholder: "Your email",
    thanks:     "You're on the list!",
    countdown:  ["Days", "Hours", "Min", "Sec"] as const,
    moreCities: "More cities coming soon",
    moreSubtext: "We're expanding fast across the GCC. Stay tuned for your city's launch.",
  },
  ar: {
    badge:      "قريباً",
    heading:    (city: string, country: string) => `الإطلاق في ${city}، ${country}`,
    subtext:    (desc: string | null) => desc ?? "سجّل لتكون أول من يعلم.",
    cta:        "أبلغني",
    placeholder: "بريدك الإلكتروني",
    thanks:     "أنت على القائمة!",
    countdown:  ["أيام", "ساعات", "دقائق", "ثواني"] as const,
    moreCities: "مدن أخرى قادمة قريباً",
    moreSubtext: "نتوسّع بسرعة في منطقة الخليج. ترقّب إطلاقنا في مدينتك.",
  },
} as const;

// ── ComingSoonSlide ───────────────────────────────────────────────────────────

export function ComingSoonSlide() {
  const { lang, isRTL }                = useLang();
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const tr                             = COMING_SOON_TRANSLATIONS[lang];

  const [upcomingLaunches, setUpcomingLaunches] = useState<LaunchData[]>([]);
  const [countdown, setCountdown]               = useState<CountdownTime | null>(null);
  const [subscriberEmail, setSubscriberEmail]   = useState("");
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);

  useEffect(() => {
    fetch("/api/launches")
      .then((r) => r.json())
      .then((data) => setUpcomingLaunches(data.launches ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const nearestLaunch = upcomingLaunches[0];
    if (!nearestLaunch) return;

    setCountdown(calculateCountdown(nearestLaunch.launchDate));
    const countdownIntervalId = setInterval(
      () => setCountdown(calculateCountdown(nearestLaunch.launchDate)),
      1000,
    );
    return () => clearInterval(countdownIntervalId);
  }, [upcomingLaunches]);

  const nearestLaunch = upcomingLaunches[0];

  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() || !nearestLaunch) return;

    try {
      const response = await fetch("/api/subscribers", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:    subscriberEmail.trim(),
          launchId: nearestLaunch.id,
          city:     nearestLaunch.city,
          country:  nearestLaunch.country,
        }),
      });
      if (response.ok) setHasSubmittedEmail(true);
    } catch {
      // Silently absorb network errors — the slide still functions without feedback
    }
  };

  return (
    <SlideContainer backgroundStyle="linear-gradient(135deg,#1B4332,#2D6A4F,#1a3a2a)">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#4CAF50]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-[#FFEB3B]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="h-full flex flex-col items-center justify-center text-center container mx-auto px-4 md:px-6 py-4 md:py-6 relative z-10">

        {/* No upcoming launches — show generic expansion message */}
        {!nearestLaunch ? (
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 md:mb-6"
              style={{ background: "rgba(255,235,59,0.15)", border: "1px solid rgba(255,235,59,0.3)" }}
            >
              <MapPin className="w-4 h-4 text-[#FFEB3B]" />
              <span className="text-sm font-bold text-[#FFEB3B] uppercase tracking-widest">{tr.badge}</span>
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-4">{tr.moreCities}</h2>
            <p className="text-white/50 max-w-md mx-auto text-sm md:text-base">{tr.moreSubtext}</p>
            <div className={`flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <a href={appStoreUrl || "https://apps.apple.com"} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Apple className="w-5 h-5" />App Store
              </a>
              <a href={googlePlayUrl || "https://play.google.com"} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl border border-white/20 font-bold hover:bg-white/20 transition-colors text-sm ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Play className="w-5 h-5 text-[#FFEB3B]" fill="currentColor" />Google Play
              </a>
            </div>
          </div>
        ) : (
          /* Specific city countdown + email signup */
          <div className="w-full max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 md:mb-5"
              style={{ background: "rgba(255,235,59,0.15)", border: "1px solid rgba(255,235,59,0.3)" }}
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFEB3B]" />
              <span className="text-xs font-bold text-[#FFEB3B] uppercase tracking-widest">{tr.badge}</span>
            </div>

            <h2 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-3 tracking-tight">
              {tr.heading(
                lang === "ar" ? nearestLaunch.cityAr : nearestLaunch.city,
                nearestLaunch.country,
              )}
            </h2>
            <p className="text-white/55 mb-5 md:mb-8 max-w-md mx-auto text-sm">
              {tr.subtext(lang === "ar" ? nearestLaunch.descriptionAr : nearestLaunch.description)}
            </p>

            {/* Live countdown timer */}
            {countdown && (
              <div className={`flex items-start justify-center gap-2 sm:gap-4 mb-5 md:mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  zeroPad(countdown.days),
                  zeroPad(countdown.hours),
                  zeroPad(countdown.minutes),
                  zeroPad(countdown.seconds),
                ].map((timeUnit, unitIndex) => (
                  <React.Fragment key={unitIndex}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-lg sm:text-2xl md:text-3xl font-black text-white tabular-nums">{timeUnit}</span>
                      </div>
                      <span className="text-[9px] sm:text-xs text-white/40 uppercase tracking-widest">{tr.countdown[unitIndex]}</span>
                    </div>
                    {unitIndex < 3 && <span className="text-white/25 text-xl sm:text-3xl font-black mt-2">:</span>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Email subscription form */}
            {!hasSubmittedEmail ? (
              <form
                onSubmit={handleEmailSubscription}
                className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto ${isRTL ? "sm:flex-row-reverse" : ""}`}
              >
                <input
                  type="email"
                  required
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder={tr.placeholder}
                  dir={isRTL ? "rtl" : "ltr"}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-[#4CAF50] transition-all text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                >
                  <Bell className="w-4 h-4" />{tr.cta}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[#4CAF50] font-bold">
                <CheckCircle2 className="w-5 h-5" />{tr.thanks}
              </div>
            )}
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
