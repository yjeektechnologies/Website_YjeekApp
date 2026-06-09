import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music2, Ghost, MessageCircle, MapPin, Mail, Apple, Play } from "lucide-react";
import { useCountryDetect } from "@/hooks/useCountryDetect";
import { useLang } from "@/context/LanguageContext";
import { useTranslations } from "@/hooks/useSiteContent";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface FooterConfig {
  contactEmail: string;
  companyLinks: string[];
  partnerLinks: string[];
  legalLinks: string[];
  countryData: Record<string, { cities: string[]; cuisines: string[] }>;
}

const DEFAULT_CONFIG: FooterConfig = {
  contactEmail: "info@yjeektech.com",
  companyLinks: ["About Us", "Careers", "Press", "Corporate", "Sustainability"],
  partnerLinks: ["Partner with us", "Drive with us", "Success Stories"],
  legalLinks: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Security", "FAQ"],
  countryData: {
    BH: { cities: ["Manama", "Seef", "Riffa", "Muharraq", "Isa Town"],       cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Harees"] },
    AE: { cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],                 cuisines: ["Emirati", "Lebanese", "Indian", "Pakistani", "International"] },
    SA: { cities: ["Riyadh", "Jeddah", "Dammam", "Khobar"],                  cuisines: ["Kabsa", "Lebanese", "Indian", "Pakistani", "Mandi"] },
    KW: { cities: ["Kuwait City", "Salmiya", "Hawally", "Farwaniya"],         cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Harees"] },
    QA: { cities: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail"],               cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Shawarma"] },
  },
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook:  Facebook,
  twitter:   Twitter,
  instagram: Instagram,
  linkedin:  Linkedin,
  youtube:   Youtube,
  tiktok:    Music2,
  snapchat:  Ghost,
  whatsapp:  MessageCircle,
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook:  "Facebook",
  twitter:   "X / Twitter",
  instagram: "Instagram",
  linkedin:  "LinkedIn",
  youtube:   "YouTube",
  tiktok:    "TikTok",
  snapchat:  "Snapchat",
  whatsapp:  "WhatsApp",
};

export function Footer() {
  const { country } = useCountryDetect();
  const { lang, isRTL } = useLang();
  const tr = useTranslations().footer;
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_CONFIG);
  const { logoUrl, appStoreUrl, googlePlayUrl, socialLinks } = useSiteConfig();

  useEffect(() => {
    fetch("/api/footer-config")
      .then((r) => r.json())
      .then((d: FooterConfig) => {
        if (d && d.contactEmail) setConfig({ ...DEFAULT_CONFIG, ...d });
      })
      .catch(() => {});
  }, []);

  const countryEntry = config.countryData[country.code] ?? config.countryData["BH"] ?? { cities: [], cuisines: [] };

  // Only render enabled social links that have a URL
  const enabledSocials = Object.entries(socialLinks).filter(
    ([, v]) => v.enabled && v.url && v.url.trim() !== ""
  );

  return (
    <footer
      className="pt-20 pb-10 border-t border-[#4CAF50]/20"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #1A3A2A 100%)" }}
      id="footer"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 ${isRTL ? "text-right" : ""}`}>

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className={`flex cursor-pointer mb-6 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
              <img
                src={logoUrl || "/yjeek-logo-transparent.png"}
                alt="Yjeek"
                className="h-14 w-auto object-contain"
                style={{ maxWidth: "190px", marginLeft: "8px" }}
              />
            </Link>
            <p className={`text-white/50 max-w-sm mb-6 leading-relaxed ${isRTL ? "mr-0 ml-auto" : ""}`}>{tr.tagline}</p>

            <div className={`flex flex-col gap-3 mb-8 ${isRTL ? "items-end" : ""}`}>
              <a href={appStoreUrl || "https://apps.apple.com"} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-all w-fit ${isRTL ? "flex-row-reverse" : ""}`}>
                <Apple className="w-5 h-5" />
                <div className={`flex flex-col leading-none ${isRTL ? "items-end" : "items-start"}`}>
                  <span className="text-[9px] uppercase tracking-wider opacity-60">{tr.appStorePrefix}</span>
                  <span className="text-sm font-bold">{tr.appStore}</span>
                </div>
              </a>
              <a href={googlePlayUrl || "https://play.google.com"} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-all w-fit ${isRTL ? "flex-row-reverse" : ""}`}>
                <Play className="w-5 h-5 text-[#FFEB3B]" fill="currentColor" />
                <div className={`flex flex-col leading-none ${isRTL ? "items-end" : "items-start"}`}>
                  <span className="text-[9px] uppercase tracking-wider opacity-60">{tr.googlePlayPrefix}</span>
                  <span className="text-sm font-bold">{tr.googlePlay}</span>
                </div>
              </a>
            </div>

            {/* Social links — only show enabled ones with URLs */}
            {enabledSocials.length > 0 && (
              <div className={`flex items-center flex-wrap gap-3 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                {enabledSocials.map(([platform, { url }]) => {
                  const Icon = SOCIAL_ICONS[platform];
                  if (!Icon) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                      title={SOCIAL_LABELS[platform] ?? platform}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-[#FFEB3B] hover:bg-white/15 transition-all">
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">{tr.company}</h4>
            <ul className="space-y-4">
              {config.companyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-[#4CAF50] text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner */}
          <div>
            <h4 className="text-white font-bold mb-6">{tr.partner}</h4>
            <ul className="space-y-4">
              {config.partnerLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-[#4CAF50] text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">{tr.legal}</h4>
            <ul className="space-y-4">
              {config.legalLinks.map((item, idx) => {
                const slugs = ["terms", "privacy", "cookies", "security", "faq"];
                const slug = slugs[idx];
                return (
                  <li key={item}>
                    {slug ? (
                      <Link href={`/legal/${slug}`} className="text-white/50 hover:text-[#4CAF50] text-sm transition-colors">{item}</Link>
                    ) : (
                      <a href="#" className="text-white/50 hover:text-[#4CAF50] text-sm transition-colors">{item}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom info row */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-white/10 ${isRTL ? "text-right" : ""}`}>
          <div className="flex flex-col gap-2">
            <h5 className="text-white font-bold text-sm mb-2">
              {tr.popularCities} {isRTL ? (country.nameAr ?? country.name) : country.name}
            </h5>
            {countryEntry.cities.map((city) => (
              <span key={city} className="text-white/40 text-sm">{city}</span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-white font-bold text-sm mb-2">{tr.topCuisines}</h5>
            {countryEntry.cuisines.map((c) => (
              <span key={c} className="text-white/40 text-sm">{c}</span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-white font-bold text-sm mb-2">{tr.contact}</h5>
            <a href={`mailto:${config.contactEmail}`}
              className={`text-white/40 hover:text-[#4CAF50] text-sm flex items-center gap-2 transition-colors ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
              <Mail className="w-4 h-4 shrink-0" />
              {config.contactEmail}
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-white font-bold text-sm mb-2">{tr.headquarters}</h5>
            <span className={`text-white/40 text-sm flex items-start gap-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span style={{ whiteSpace: "pre-line" }}>{tr.address}</span>
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className={`flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 mt-8 gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`}>
          <p className="text-white/40 text-sm">{tr.copyright(new Date().getFullYear())}</p>
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-white/50 text-xs">{lang === "en" ? "English" : "العربية"}</div>
            <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-white/50 text-xs">
              {country.flag} {isRTL ? (country.nameAr ?? country.name) : country.name}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
