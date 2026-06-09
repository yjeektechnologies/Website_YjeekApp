import React from "react";
import { Link } from "wouter";
import { Apple, Play } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useTranslations } from "@/hooks/useSiteContent";

const LINKS = [
  { label: "Partner",  labelAr: "شراكة",          href: "/partner" },
  { label: "Drive",    labelAr: "اشتغل معنا",      href: "/drive" },
  { label: "About Us", labelAr: "من نحن",          href: "/about" },
  { label: "Terms",    labelAr: "الشروط",           href: "/legal/terms" },
  { label: "Privacy",  labelAr: "الخصوصية",        href: "/legal/privacy" },
  { label: "Cookies",  labelAr: "الكوكيز",          href: "/legal/cookies" },
  { label: "Security", labelAr: "الأمان",           href: "/legal/security" },
  { label: "FAQ",      labelAr: "الأسئلة الشائعة", href: "/legal/faq" },
];

export function CorpStrip() {
  const { isRTL } = useLang();
  const { appStoreUrl, googlePlayUrl } = useSiteConfig();
  const tr = useTranslations().footer;

  return (
    <div
      className="shrink-0 h-12 flex items-center justify-between px-4 md:px-8 gap-4 overflow-hidden"
      style={{
        background: "rgba(5,15,10,0.85)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Copyright + HQ */}
      <p className="text-white/25 text-[11px] font-medium whitespace-nowrap shrink-0">
        {tr.copyright(new Date().getFullYear())}
        <span className="hidden md:inline"> · {tr.address.replace(/\n/g, ", ")}</span>
      </p>

      {/* Quick links — dir="rtl" on <html> handles visual order when Arabic */}
      <nav className="hidden md:flex items-center gap-4">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-white/25 hover:text-white/70 text-[11px] font-medium transition-colors whitespace-nowrap"
          >
            {isRTL ? l.labelAr : l.label}
          </Link>
        ))}
      </nav>

      {/* App store icons */}
      <div className="flex items-center gap-4 shrink-0">
        <a
          href={appStoreUrl || "https://apps.apple.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/25 hover:text-white/70 transition-colors flex items-center gap-1"
          title="App Store"
        >
          <Apple className="w-4 h-4" />
          <span className="text-[11px] font-medium hidden md:inline">App Store</span>
        </a>
        <a
          href={googlePlayUrl || "https://play.google.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/25 hover:text-white/70 transition-colors flex items-center gap-1"
          title="Google Play"
        >
          <Play className="w-4 h-4" />
          <span className="text-[11px] font-medium hidden md:inline">Google Play</span>
        </a>
      </div>
    </div>
  );
}
