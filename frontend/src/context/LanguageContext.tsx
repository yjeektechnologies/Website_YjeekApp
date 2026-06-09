import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar";

interface LanguageContextValue {
  lang: Lang;
  isRTL: boolean;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  isRTL: false,
  toggleLang: () => {},
  setLang: () => {},
});

const hasConsent = () => !!localStorage.getItem("yjeek_cookie_consent");

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("yjeek_lang") as Lang) ?? "en";
  });

  const isRTL = lang === "ar";

  useEffect(() => {
    const root = document.documentElement;
    root.dir = isRTL ? "rtl" : "ltr";
    root.lang = isRTL ? "ar" : "en";

    // Load Cairo Arabic font dynamically when needed
    const fontId = "yjeek-arabic-font";
    if (isRTL && !document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }

    // Switch font family on body
    document.body.style.fontFamily = isRTL
      ? "'Cairo', sans-serif"
      : "'Inter', sans-serif";
  }, [isRTL]);

  // Flush in-memory lang to localStorage once consent is granted
  useEffect(() => {
    const onConsent = () => localStorage.setItem("yjeek_lang", lang);
    window.addEventListener("yjeek:consent", onConsent);
    return () => window.removeEventListener("yjeek:consent", onConsent);
  }, [lang]);

  const setLang = (l: Lang) => {
    if (hasConsent()) localStorage.setItem("yjeek_lang", l);
    setLangState(l);
  };

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <LanguageContext.Provider value={{ lang, isRTL, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
