import { useState, useEffect } from "react";

export interface SocialLink {
  url: string;
  enabled: boolean;
}

export interface SiteCountry {
  code: string;
  name: string;
  nameAr?: string;
  flag: string;
  currency: string;
}

export interface CategoryBadge {
  label: string;
  labelAr: string;
}

export interface Service {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export const DEFAULT_CATEGORY_BADGES: Record<string, CategoryBadge> = {
  food:        { label: "🔥 Most Popular",  labelAr: "🔥 الأكثر طلباً" },
  groceries:   { label: "⚡ Under 15 mins", labelAr: "⚡ أقل من ١٥ دقيقة" },
  flowers:     { label: "🌸 Same day",       labelAr: "🌸 نفس اليوم" },
  electronics: { label: "📦 Fast shipping",  labelAr: "📦 شحن سريع" },
  accessories: { label: "✨ Trending",        labelAr: "✨ الأكثر رواجاً" },
  pets:        { label: "🐾 New arrivals",   labelAr: "🐾 وصل جديد" },
};

export interface SiteConfig {
  logoUrl: string;
  faviconUrl: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  socialLinks: Record<string, SocialLink>;
  supportedCountries: SiteCountry[];
  categoryBadges: Record<string, CategoryBadge>;
  services: Service[];
}

export const DEFAULT_SOCIAL_LINKS: Record<string, SocialLink> = {
  facebook:  { url: "", enabled: false },
  twitter:   { url: "", enabled: false },
  instagram: { url: "", enabled: false },
  linkedin:  { url: "", enabled: false },
  youtube:   { url: "", enabled: false },
  tiktok:    { url: "", enabled: false },
  snapchat:  { url: "", enabled: false },
  whatsapp:  { url: "", enabled: false },
};

export const DEFAULT_SUPPORTED_COUNTRIES: SiteCountry[] = [
  { code: "BH", name: "Bahrain",      nameAr: "البحرين", flag: "🇧🇭", currency: "BHD" },
  { code: "AE", name: "UAE",          nameAr: "الإمارات", flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", nameAr: "السعودية", flag: "🇸🇦", currency: "SAR" },
  { code: "KW", name: "Kuwait",       nameAr: "الكويت",  flag: "🇰🇼", currency: "KWD" },
  { code: "QA", name: "Qatar",        nameAr: "قطر",     flag: "🇶🇦", currency: "QAR" },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  logoUrl: "",
  faviconUrl: "",
  appStoreUrl: "https://apps.apple.com",
  googlePlayUrl: "https://play.google.com",
  socialLinks: DEFAULT_SOCIAL_LINKS,
  supportedCountries: DEFAULT_SUPPORTED_COUNTRIES,
  categoryBadges: DEFAULT_CATEGORY_BADGES,
  services: [],
};

// Module-level cache so all components share one fetch
let _cache: SiteConfig | null = null;
let _promise: Promise<SiteConfig> | null = null;

function fetchSiteConfig(): Promise<SiteConfig> {
  if (_promise) return _promise;
  _promise = Promise.all([
    fetch("/api/site-config").then((r) => r.json()),
    fetch("/api/services").then((r) => r.json()),
  ])
    .then(([siteConfigData, servicesData]) => {
      _cache = {
        logoUrl: siteConfigData.logoUrl ?? "",
        faviconUrl: siteConfigData.faviconUrl ?? "",
        appStoreUrl: siteConfigData.appStoreUrl ?? DEFAULT_SITE_CONFIG.appStoreUrl,
        googlePlayUrl: siteConfigData.googlePlayUrl ?? DEFAULT_SITE_CONFIG.googlePlayUrl,
        socialLinks: { ...DEFAULT_SOCIAL_LINKS, ...(siteConfigData.socialLinks ?? {}) },
        supportedCountries: Array.isArray(siteConfigData.supportedCountries) && siteConfigData.supportedCountries.length > 0
          ? siteConfigData.supportedCountries
          : DEFAULT_SUPPORTED_COUNTRIES,
        categoryBadges: { ...DEFAULT_CATEGORY_BADGES, ...(siteConfigData.categoryBadges ?? {}) },
        services: Array.isArray(servicesData.services) ? servicesData.services : [],
      };
      return _cache;
    })
    .catch(() => {
      _promise = null;
      return DEFAULT_SITE_CONFIG;
    });
  return _promise;
}

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(_cache ?? DEFAULT_SITE_CONFIG);

  useEffect(() => {
    if (_cache) return;
    fetchSiteConfig().then(setConfig);
  }, []);

  return config;
}

export function invalidateSiteConfig() {
  _cache = null;
  _promise = null;
}
