import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const CONSENT_KEY = "yjeek_cookie_consent";

export function CookieBanner() {
  const { lang, isRTL } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = (level: "all" | "essential") => {
    localStorage.setItem(CONSENT_KEY, level);
    window.dispatchEvent(new CustomEvent("yjeek:consent", { detail: level }));
    setVisible(false);
  };

  if (!visible) return null;

  const tr = {
    en: {
      title: "We use cookies",
      body: "We use cookies and similar technologies to remember your language and country preferences, and to improve your experience. You can accept all cookies or choose essential-only.",
      learnMore: "Cookie Policy",
      acceptAll: "Accept All Cookies",
      essential: "Essential Only",
    },
    ar: {
      title: "نستخدم ملفات تعريف الارتباط",
      body: "نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتذكّر تفضيلات اللغة والدولة، وتحسين تجربتك. يمكنك قبول جميع ملفات تعريف الارتباط أو الاكتفاء بالضرورية منها.",
      learnMore: "سياسة الكوكيز",
      acceptAll: "قبول جميع ملفات تعريف الارتباط",
      essential: "الضرورية فقط",
    },
  }[lang];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] ${isRTL ? "rtl" : "ltr"}`}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
      role="dialog"
      aria-label={tr.title}
      aria-live="polite"
    >
      {/* Backdrop blur bar */}
      <div
        className="mx-0 md:mx-auto md:max-w-4xl md:mb-4 md:rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgba(11,31,16,0.97),rgba(27,67,50,0.97))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(35,156,85,0.25)",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(35,156,85,0.1)",
        }}
      >
        <div className="px-5 py-4 md:px-6 md:py-5">
          <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Icon */}
            <div
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: "rgba(35,156,85,0.2)", border: "1px solid rgba(35,156,85,0.3)" }}
            >
              <Cookie className="w-5 h-5 text-[#239C55]" />
            </div>

            {/* Text + actions */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-start justify-between gap-3 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className="text-white font-bold text-sm">{tr.title}</h3>
                <button
                  onClick={() => accept("essential")}
                  className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className={`text-white/50 text-xs leading-relaxed mb-3 ${isRTL ? "text-right" : ""}`}>
                {tr.body}{" "}
                <Link href="/legal/cookies" className="text-[#239C55] hover:text-[#4CAF50] underline underline-offset-2 transition-colors">
                  {tr.learnMore}
                </Link>
              </p>

              <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => accept("all")}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#239C55,#1A7A40)" }}
                >
                  {tr.acceptAll}
                </button>
                <button
                  onClick={() => accept("essential")}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {tr.essential}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
