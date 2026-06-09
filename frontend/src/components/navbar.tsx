import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, ChevronDown, MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCountryDetect } from "@/hooks/useCountryDetect";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useTranslations } from "@/hooks/useSiteContent";
import { useSlide } from "@/context/SlideContext";

// Map anchor ids to slide indices on the landing carousel
const SLIDE_MAP: Record<string, number> = {
  "#how-it-works": 2,
  "#categories":   1,
  "#features":     3,
  "#app":          4,
  "#partners":     5,
  "#reviews":      6,
  "#footer":       7,
  "#coming-soon":  7,
};

const LEGAL_LINKS = [
  { label: "Terms & Conditions", labelAr: "الشروط والأحكام", href: "/legal/terms" },
  { label: "Privacy Policy",     labelAr: "سياسة الخصوصية",  href: "/legal/privacy" },
  { label: "FAQ",                labelAr: "الأسئلة الشائعة", href: "/legal/faq" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const { country, changeCountry, allCountries } = useCountryDetect();
  const { lang, setLang, isRTL } = useLang();
  const [location, setLocation] = useLocation();
  const tr = useTranslations().nav;
  const { logoUrl } = useSiteConfig();
  const { goToSlide } = useSlide();

  const isLanding = location === "/";

  const scrolledClass = isLanding
    ? "bg-transparent py-4"
    : "bg-[#0F4D27]/95 backdrop-blur-lg border-b border-white/10 py-3 shadow-sm";
  const textClass       = "text-white";
  const mutedTextClass  = "text-white/75 hover:text-white";
  const btnBorderClass  = "text-white/75 hover:text-white border border-white/20";

  const navLinks = [
    { name: tr.howItWorks,    href: "#how-it-works", isAnchor: true },
    { name: tr.partnerWithUs, href: "/partner",       isAnchor: false },
    { name: tr.becomeDriver,  href: "/drive",         isAnchor: false },
    { name: lang === "ar" ? "من نحن" : "About Us",   href: "/about",   isAnchor: false },
    { name: tr.getTheApp,     href: "/get-the-app",   isAnchor: false },
  ];

  function handleAnchorClick(href: string) {
    setMobileMenuOpen(false);
    if (isLanding) {
      goToSlide(SLIDE_MAP[href] ?? 0);
    } else {
      if (SLIDE_MAP[href] !== undefined) {
        sessionStorage.setItem("gotoSlide", String(SLIDE_MAP[href]));
      }
      setLocation("/");
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`shrink-0 left-0 right-0 z-50 transition-all duration-300 ${scrolledClass}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo + desktop nav group — dir="rtl" on <html> handles visual order */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={() => { if (isLanding) goToSlide(0); }}
              className="flex items-center group"
            >
              <img
                src={logoUrl || "/yjeek-logo-transparent.png"}
                alt="Yjeek"
                className="h-9 md:h-14 w-auto object-contain"
                style={{ maxWidth: "160px", marginInlineStart: "8px" }}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <button
                    key={link.name}
                    onClick={() => handleAnchorClick(link.href)}
                    className={`text-sm font-medium transition-colors cursor-pointer ${mutedTextClass}`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-[#4CAF50] font-bold"
                        : mutedTextClass
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Country selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`rounded-full px-4 ${btnBorderClass}`}>
                  <MapPin className={`w-4 h-4 text-[#4CAF50] ${isRTL ? "ms-2" : "me-2"}`} />
                  {isRTL ? (country.nameAr ?? country.name) : country.name}
                  <ChevronDown className={`w-4 h-4 opacity-50 ${isRTL ? "me-1" : "ms-1"}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1B4332] border-white/10 max-h-72 overflow-y-auto">
                {allCountries.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => changeCountry(c.code)}
                    className={`text-white/80 hover:text-white hover:bg-white/10 ${country.code === c.code ? "text-[#4CAF50] font-semibold" : ""}`}
                  >
                    {c.flag} {isRTL ? (c.nameAr ?? c.name) : c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`rounded-full px-3 gap-2 font-semibold ${btnBorderClass}`}>
                  <Globe className="w-4 h-4" />
                  {lang === "en" ? "EN" : "ع"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="bg-[#1B4332] border-white/10">
                <DropdownMenuItem
                  onClick={() => setLang("en")}
                  className={`text-white/80 hover:text-white hover:bg-white/10 ${lang === "en" ? "text-[#4CAF50] font-semibold" : ""}`}
                >
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLang("ar")}
                  className={`text-white/80 hover:text-white hover:bg-white/10 ${lang === "ar" ? "text-[#4CAF50] font-semibold" : ""}`}
                >
                  🇧🇭 العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => { setMobileMenuOpen(false); setLocation("/get-the-app"); }}
              className="bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-full px-6 shadow-md transition-all cursor-pointer"
            >
              <Smartphone className={`w-4 h-4 ${isRTL ? "ms-2" : "me-2"}`} />
              {tr.getTheApp}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden ${textClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="lg:hidden fixed left-0 right-0 border-b shadow-2xl z-[9998]"
          style={{ background: "#1B4332", borderColor: "rgba(255,255,255,0.08)", top: "56px" }}
        >
          <div className={`flex flex-col p-4 gap-1 ${isRTL ? "text-end" : ""}`}>
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.name}
                  onClick={() => handleAnchorClick(link.href)}
                  className="text-base font-medium text-white/80 hover:text-white p-3 rounded-xl hover:bg-white/8 transition-all text-start"
                >
                  {link.name}
                </button>
              ) : link.href === "/about" ? (
                /* About Us — expandable with legal sub-items */
                <div key={link.name}>
                  <button
                    onClick={() => setAboutExpanded((v) => !v)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-base font-medium ${
                      location.startsWith("/about") || location.startsWith("/legal")
                        ? "text-[#4CAF50] bg-[#4CAF50]/10 font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${aboutExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {aboutExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <Link
                          href="/about"
                          className={`flex items-center gap-2 ms-4 ps-3 border-s border-white/10 p-2.5 rounded-e-xl text-sm font-medium transition-all ${
                            location === "/about"
                              ? "text-[#4CAF50] font-bold"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                          onClick={() => { setMobileMenuOpen(false); setAboutExpanded(false); }}
                        >
                          {lang === "ar" ? "من نحن" : "About Us"}
                        </Link>
                        {LEGAL_LINKS.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className={`flex items-center gap-2 ms-4 ps-3 border-s border-white/10 p-2.5 rounded-e-xl text-sm font-medium transition-all ${
                              location === l.href
                                ? "text-[#4CAF50] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                            onClick={() => { setMobileMenuOpen(false); setAboutExpanded(false); }}
                          >
                            {lang === "ar" ? l.labelAr : l.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium p-3 rounded-xl transition-all ${
                    location === link.href
                      ? "text-[#4CAF50] bg-[#4CAF50]/10 font-bold"
                      : "text-white/80 hover:text-white hover:bg-white/8"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
            <div className="h-px bg-white/8 my-2" />
            <div className="flex items-center justify-between p-3">
              <span className="text-white/50 font-medium text-sm">{isRTL ? "الدولة" : "Country"}</span>
              <span className="text-white font-bold flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4 text-[#4CAF50]" />
                {country.flag} {isRTL ? (country.nameAr ?? country.name) : country.name}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-white/50 font-medium text-sm">{isRTL ? "اللغة" : "Language"}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${lang === "en" ? "bg-[#4CAF50] text-white" : "text-white/50"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("ar")}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${lang === "ar" ? "bg-[#4CAF50] text-white" : "text-white/50"}`}
                >
                  ع
                </button>
              </div>
            </div>
            <Button
              onClick={() => { setMobileMenuOpen(false); setLocation("/get-the-app"); }}
              className="w-full mt-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-xl py-6 cursor-pointer"
            >
              <Smartphone className={`w-5 h-5 ${isRTL ? "ms-2" : "me-2"}`} />
              {tr.getTheApp}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
