import type { Request, Response } from "express";
import { NotFoundError } from "../utils/errors.js";
import { getSettingsMap, upsertSetting, upsertManySettings } from "../services/settings.service.js";
import { isSmtpConfigured, getConfiguration, sendMail } from "../services/mailer.service.js";
import { buildTestEmailHtml } from "../services/emailTemplates.js";

function safeParseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ── Default values ────────────────────────────────────────────────────────────

const DEFAULT_COMPANY_LINKS = ["About Us", "Careers", "Press", "Corporate", "Sustainability"];
const DEFAULT_PARTNER_LINKS = ["Partner with us", "Drive with us", "Success Stories"];
const DEFAULT_LEGAL_LINKS = ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Security", "FAQ"];

const DEFAULT_SOCIAL_LINKS = {
  facebook: { url: "", enabled: false }, twitter: { url: "", enabled: false },
  instagram: { url: "", enabled: false }, linkedin: { url: "", enabled: false },
  youtube: { url: "", enabled: false }, tiktok: { url: "", enabled: false },
  snapchat: { url: "", enabled: false }, whatsapp: { url: "", enabled: false },
};

const DEFAULT_SUPPORTED_COUNTRIES = [
  { code: "BH", name: "Bahrain", flag: "🇧🇭", currency: "BHD" },
  { code: "AE", name: "UAE", flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", currency: "QAR" },
];

const DEFAULT_CATEGORY_BADGES = {
  food: { label: "🔥 Most Popular", labelAr: "🔥 الأكثر طلباً" },
  groceries: { label: "⚡ Under 15 mins", labelAr: "⚡ أقل من ١٥ دقيقة" },
  flowers: { label: "🌸 Same day", labelAr: "🌸 نفس اليوم" },
  electronics: { label: "📦 Fast shipping", labelAr: "📦 شحن سريع" },
  accessories: { label: "✨ Trending", labelAr: "✨ الأكثر رواجاً" },
  pets: { label: "🐾 New arrivals", labelAr: "🐾 وصل جديد" },
};

const DEFAULT_COUNTRY_DATA = {
  BH: { cities: ["Manama", "Seef", "Riffa", "Muharraq", "Isa Town"], cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Harees"] },
  AE: { cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"], cuisines: ["Emirati", "Lebanese", "Indian", "Pakistani", "International"] },
  SA: { cities: ["Riyadh", "Jeddah", "Dammam", "Khobar"], cuisines: ["Kabsa", "Lebanese", "Indian", "Pakistani", "Mandi"] },
  KW: { cities: ["Kuwait City", "Salmiya", "Hawally", "Farwaniya"], cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Harees"] },
  QA: { cities: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail"], cuisines: ["Machboos", "Lebanese", "Indian", "Pakistani", "Shawarma"] },
};

const DEFAULT_CAROUSEL_CONFIG = [
  { id: "hero", label: "Home", visible: true, durationSeconds: 10 },
  { id: "categories", label: "What We Deliver", visible: true, durationSeconds: 10 },
  { id: "how", label: "How It Works", visible: true, durationSeconds: 10 },
  { id: "features", label: "Features", visible: true, durationSeconds: 10 },
  { id: "appDownload", label: "Get the App", visible: true, durationSeconds: 10 },
  { id: "partners", label: "Partners", visible: true, durationSeconds: 10 },
  { id: "reviews", label: "Reviews", visible: true, durationSeconds: 10 },
  { id: "comingSoon", label: "Coming Soon", visible: true, durationSeconds: 10 },
];

// ── Setting key groups ────────────────────────────────────────────────────────

const SMTP_KEYS = ["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "smtp_from", "smtp_from_name"];
const CONTACT_KEYS = ["partner_email", "driver_email"];
const STATS_KEYS = ["stat_partners", "stat_deliveries", "stat_cities", "stat_rating", "stat_rating_count"];
const FOOTER_KEYS = ["contact_email", "footer_company_links", "footer_partner_links", "footer_legal_links", "country_data"];
const LEGAL_KEYS = ["legal_terms", "legal_privacy", "legal_cookies", "legal_security", "legal_faq", "legal_terms_ar", "legal_privacy_ar", "legal_cookies_ar", "legal_security_ar", "legal_faq_ar"];
const PAGE_KEYS = ["page_about", "page_about_ar"];
const SITE_KEYS = ["logo_url", "favicon_url", "social_links", "app_store_url", "google_play_url", "supported_countries", "category_badges"];

const ALL_SETTING_KEYS = [...SMTP_KEYS, ...CONTACT_KEYS, ...STATS_KEYS, ...FOOTER_KEYS, ...LEGAL_KEYS, ...PAGE_KEYS, ...SITE_KEYS];

const SMTP_PASS_MASK = "••••••••";

const LEGAL_PAGE_TITLES: Record<string, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
  security: "Security",
  faq: "FAQ",
};

// ── Admin: settings ───────────────────────────────────────────────────────────

/** GET /api/admin/settings */
export async function readAdminSettings(_req: Request, res: Response): Promise<void> {
  const s = await getSettingsMap(ALL_SETTING_KEYS);

  const settings = {
    smtp_host: s["smtp_host"] ?? "",
    smtp_port: s["smtp_port"] ?? "587",
    smtp_secure: s["smtp_secure"] ?? "false",
    smtp_user: s["smtp_user"] ?? "",
    smtp_pass: s["smtp_pass"] ? SMTP_PASS_MASK : "",
    smtp_pass_is_set: !!s["smtp_pass"],
    smtp_from: s["smtp_from"] ?? "",
    smtp_from_name: s["smtp_from_name"] ?? "Yjeek Technologies",
    partner_email: s["partner_email"] ?? "sales@yjeektech.com",
    driver_email: s["driver_email"] ?? "hr@yjeektech.com",
    stat_partners: s["stat_partners"] ?? "500+",
    stat_deliveries: s["stat_deliveries"] ?? "1M+",
    stat_cities: s["stat_cities"] ?? "200+",
    stat_rating: s["stat_rating"] ?? "4.9",
    stat_rating_count: s["stat_rating_count"] ?? "100,000",
    contact_email: s["contact_email"] ?? "info@yjeektech.com",
    footer_company_links: s["footer_company_links"] ?? JSON.stringify(DEFAULT_COMPANY_LINKS),
    footer_partner_links: s["footer_partner_links"] ?? JSON.stringify(DEFAULT_PARTNER_LINKS),
    footer_legal_links: s["footer_legal_links"] ?? JSON.stringify(DEFAULT_LEGAL_LINKS),
    country_data: s["country_data"] ?? JSON.stringify(DEFAULT_COUNTRY_DATA),
    legal_terms: s["legal_terms"] ?? "",
    legal_privacy: s["legal_privacy"] ?? "",
    legal_cookies: s["legal_cookies"] ?? "",
    legal_security: s["legal_security"] ?? "",
    legal_faq: s["legal_faq"] ?? "",
    legal_terms_ar: s["legal_terms_ar"] ?? "",
    legal_privacy_ar: s["legal_privacy_ar"] ?? "",
    legal_cookies_ar: s["legal_cookies_ar"] ?? "",
    legal_security_ar: s["legal_security_ar"] ?? "",
    legal_faq_ar: s["legal_faq_ar"] ?? "",
    page_about: s["page_about"] ?? "",
    page_about_ar: s["page_about_ar"] ?? "",
    logo_url: s["logo_url"] ?? "",
    favicon_url: s["favicon_url"] ?? "",
    social_links: s["social_links"] ?? JSON.stringify(DEFAULT_SOCIAL_LINKS),
    app_store_url: s["app_store_url"] ?? "https://apps.apple.com",
    google_play_url: s["google_play_url"] ?? "https://play.google.com",
    supported_countries: s["supported_countries"] ?? JSON.stringify(DEFAULT_SUPPORTED_COUNTRIES),
    category_badges: s["category_badges"] ?? JSON.stringify(DEFAULT_CATEGORY_BADGES),
  };

  res.json({ settings });
}

/** PUT /api/admin/settings */
export async function writeAdminSettings(req: Request, res: Response): Promise<void> {
  const updates = (req.body ?? {}) as Record<string, string>;
  const allowed = new Set(ALL_SETTING_KEYS);
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (!allowed.has(key)) continue;
    if (key === "smtp_pass" && value === SMTP_PASS_MASK) continue;
    filtered[key] = value ?? "";
  }

  await upsertManySettings(filtered);
  req.log.info("Admin settings updated");
  res.json({ message: "Settings saved" });
}

/** POST /api/admin/settings/test-email */
export async function testEmail(req: Request, res: Response): Promise<void> {
  const { to } = req.body as { to?: string };
  if (!to) {
    res.status(400).json({ error: "Recipient email required" });
    return;
  }

  if (!(await isSmtpConfigured())) {
    res.status(400).json({ error: "SMTP is not configured. Please save your settings first." });
    return;
  }

  const config = await getConfiguration();
  await sendMail({
    to,
    subject: "✅ Yjeek Admin — SMTP Test Email",
    html: buildTestEmailHtml(config.smtpFrom),
  });

  req.log.info({ to }, "Test email sent successfully");
  res.json({ message: `Test email sent to ${to}` });
}

// ── Admin + public: site content / carousel ──────────────────────────────────

async function loadSiteContent(): Promise<object | null> {
  const s = await getSettingsMap(["site_content"]);
  return safeParseJson<object | null>(s["site_content"], null);
}

/** GET /api/admin/site-content & GET /api/site-content */
export async function getSiteContent(_req: Request, res: Response): Promise<void> {
  res.json({ content: await loadSiteContent() });
}

/** PUT /api/admin/site-content */
export async function saveSiteContent(req: Request, res: Response): Promise<void> {
  const { content } = req.body as { content?: unknown };
  if (!content || typeof content !== "object") {
    res.status(400).json({ error: "content must be a non-null object" });
    return;
  }
  await upsertSetting("site_content", JSON.stringify(content));
  req.log.info("Site content updated");
  res.json({ message: "Content saved" });
}

async function loadCarouselConfig(): Promise<unknown> {
  const s = await getSettingsMap(["carousel_config"]);
  return safeParseJson(s["carousel_config"], DEFAULT_CAROUSEL_CONFIG);
}

/** GET /api/admin/carousel-config & GET /api/carousel-config */
export async function getCarouselConfig(_req: Request, res: Response): Promise<void> {
  res.json({ slides: await loadCarouselConfig() });
}

/** PUT /api/admin/carousel-config */
export async function saveCarouselConfig(req: Request, res: Response): Promise<void> {
  const { slides } = req.body as { slides?: unknown };
  if (!Array.isArray(slides)) {
    res.status(400).json({ error: "slides must be an array" });
    return;
  }
  await upsertSetting("carousel_config", JSON.stringify(slides));
  req.log.info("Carousel config updated");
  res.json({ message: "Carousel config saved" });
}

// ── Public ────────────────────────────────────────────────────────────────────

/** GET /api/site-stats */
export async function getSiteStats(_req: Request, res: Response): Promise<void> {
  const s = await getSettingsMap(STATS_KEYS);
  res.json({
    partners: s["stat_partners"] ?? "500+",
    deliveries: s["stat_deliveries"] ?? "1M+",
    cities: s["stat_cities"] ?? "200+",
    rating: s["stat_rating"] ?? "4.9",
    ratingCount: s["stat_rating_count"] ?? "100,000",
  });
}

/** GET /api/site-config */
export async function getSiteConfig(_req: Request, res: Response): Promise<void> {
  const s = await getSettingsMap(SITE_KEYS);
  res.json({
    logoUrl: s["logo_url"] ?? "",
    faviconUrl: s["favicon_url"] ?? "",
    appStoreUrl: s["app_store_url"] ?? "https://apps.apple.com",
    googlePlayUrl: s["google_play_url"] ?? "https://play.google.com",
    socialLinks: safeParseJson(s["social_links"], DEFAULT_SOCIAL_LINKS),
    supportedCountries: safeParseJson(s["supported_countries"], DEFAULT_SUPPORTED_COUNTRIES),
    categoryBadges: safeParseJson(s["category_badges"], DEFAULT_CATEGORY_BADGES),
  });
}

/** GET /api/legal/:slug */
export async function getLegalPage(req: Request, res: Response): Promise<void> {
  const slug = req.params.slug;
  const title = LEGAL_PAGE_TITLES[slug];
  if (!title) throw new NotFoundError("Legal page", slug);

  const englishKey = `legal_${slug}`;
  const arabicKey = `legal_${slug}_ar`;
  const s = await getSettingsMap([englishKey, arabicKey]);

  res.json({
    slug,
    title,
    content: s[englishKey] ?? "",
    contentAr: s[arabicKey] ?? "",
  });
}

/** GET /api/about */
export async function getAboutPage(_req: Request, res: Response): Promise<void> {
  const s = await getSettingsMap(PAGE_KEYS);
  res.json({
    content: s["page_about"] ?? "",
    contentAr: s["page_about_ar"] ?? "",
  });
}

/** GET /api/footer-config */
export async function getFooterConfig(_req: Request, res: Response): Promise<void> {
  const s = await getSettingsMap(FOOTER_KEYS);
  res.json({
    contactEmail: s["contact_email"] ?? "info@yjeektech.com",
    companyLinks: safeParseJson<string[]>(s["footer_company_links"], DEFAULT_COMPANY_LINKS),
    partnerLinks: safeParseJson<string[]>(s["footer_partner_links"], DEFAULT_PARTNER_LINKS),
    legalLinks: safeParseJson<string[]>(s["footer_legal_links"], DEFAULT_LEGAL_LINKS),
    countryData: safeParseJson(s["country_data"], DEFAULT_COUNTRY_DATA),
  });
}
