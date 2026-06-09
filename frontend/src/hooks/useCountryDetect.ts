import { useState, useEffect, useRef } from "react";
import { useSiteConfig } from "./useSiteConfig";

export type SupportedCountry = {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  currency: string;
  cities: string[];
};

// Kept for backward compat — components that import this will still compile
export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: "BH", name: "Bahrain",      nameAr: "البحرين", flag: "🇧🇭", currency: "BHD", cities: ["Manama", "Seef", "Riffa", "Muharraq", "Isa Town"] },
  { code: "AE", name: "UAE",          nameAr: "الإمارات", flag: "🇦🇪", currency: "AED", cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"] },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية", flag: "🇸🇦", currency: "SAR", cities: ["Riyadh", "Jeddah", "Dammam", "Khobar"] },
  { code: "KW", name: "Kuwait",       nameAr: "الكويت",  flag: "🇰🇼", currency: "KWD", cities: ["Kuwait City", "Salmiya", "Hawally", "Farwaniya"] },
  { code: "QA", name: "Qatar",        nameAr: "قطر",     flag: "🇶🇦", currency: "QAR", cities: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail"] },
];

export function useCountryDetect() {
  const siteConfig = useSiteConfig();
  const supportedCountries = siteConfig?.supportedCountries ?? [];

  // Fallback Arabic names by country code for API-sourced countries that lack nameAr
  const AR_NAMES: Record<string, string> = {
    BH: "البحرين", AE: "الإمارات", SA: "السعودية", KW: "الكويت", QA: "قطر",
  };

  // Map API countries into SupportedCountry shape, ensuring nameAr is always present
  const countries: SupportedCountry[] = supportedCountries.length > 0
    ? supportedCountries.map((c) => ({
        ...c,
        nameAr: (c as SupportedCountry).nameAr ?? AR_NAMES[c.code] ?? c.name,
        cities: [],
      }))
    : SUPPORTED_COUNTRIES;

  const defaultCountry = countries[0];
  const [country, setCountry] = useState<SupportedCountry>(defaultCountry);
  const [detected, setDetected] = useState(false);
  const didDetect = useRef(false);

  // Keep selected country in sync when the supported list changes
  useEffect(() => {
    if (countries.length === 0) return;
    setCountry((prev) => {
      const still = countries.find((c) => c.code === prev.code);
      return still ?? countries[0];
    });
  }, [supportedCountries]);

  useEffect(() => {
    if (didDetect.current) return;
    didDetect.current = true;

    const hasConsent = () => !!localStorage.getItem("yjeek_cookie_consent");

    const saved = localStorage.getItem("yjeek_country");
    if (saved) {
      const found = countries.find((c) => c.code === saved);
      if (found) {
        setCountry(found);
        setDetected(true);
        return;
      }
    }

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then((data: { country_code?: string }) => {
        const found = countries.find((c) => c.code === data.country_code);
        const resolved = found ?? defaultCountry;
        setCountry(resolved);
        if (hasConsent()) localStorage.setItem("yjeek_country", resolved.code);
      })
      .catch(() => setCountry(defaultCountry))
      .finally(() => setDetected(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Flush current country to localStorage once consent is granted
  useEffect(() => {
    const onConsent = () => localStorage.setItem("yjeek_country", country.code);
    window.addEventListener("yjeek:consent", onConsent);
    return () => window.removeEventListener("yjeek:consent", onConsent);
  }, [country]);

  const changeCountry = (code: string) => {
    const found = countries.find((c) => c.code === code);
    if (found) {
      setCountry(found);
      if (localStorage.getItem("yjeek_cookie_consent")) {
        localStorage.setItem("yjeek_country", found.code);
      }
    }
  };

  return { country, detected, changeCountry, allCountries: countries };
}
