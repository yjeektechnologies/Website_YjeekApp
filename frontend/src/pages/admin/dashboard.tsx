import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, CheckCircle2, XCircle, LogOut,
  MapPin, Calendar, Globe, RefreshCw, ChevronDown, Save, X,
  Users, Mail, Download, Search, Filter, Settings,
  Eye, EyeOff, Send, Bell, Megaphone, AlertCircle, ChevronRight,
  Star, MessageSquare, BarChart2, Image, Link2, Upload, Smartphone,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Music2, Ghost, MessageCircle,
  Layers, Coffee, ShoppingBag, Flower2, Cpu, Watch, Heart, Truck, Box, Zap,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ALL_COUNTRIES, CountryOption } from "@/data/allCountries";
import { invalidateSiteConfig } from "@/hooks/useSiteConfig";
import { ContentEditor } from "./content-editor";

type Tab = "launches" | "subscribers" | "settings" | "testimonials" | "services" | "carousel" | "content";

interface Service {
  id: number; name: string; nameAr: string; description: string; descriptionAr: string;
  icon: string; imageUrl: string; isActive: boolean; sortOrder: number; createdAt: string;
}
const emptyService = { name: "", nameAr: "", description: "", descriptionAr: "", icon: "ShoppingBag", imageUrl: "", isActive: true, sortOrder: 0 };
const SERVICE_ICONS = [
  { key: "Coffee", label: "Food", Icon: Coffee },
  { key: "ShoppingBag", label: "Groceries", Icon: ShoppingBag },
  { key: "Flower2", label: "Flowers", Icon: Flower2 },
  { key: "Cpu", label: "Electronics", Icon: Cpu },
  { key: "Watch", label: "Accessories", Icon: Watch },
  { key: "Heart", label: "Pets", Icon: Heart },
  { key: "Truck", label: "Logistics", Icon: Truck },
  { key: "Box", label: "Packages", Icon: Box },
  { key: "Zap", label: "Express", Icon: Zap },
  { key: "Star", label: "Premium", Icon: Star },
];

interface Launch {
  id: number; city: string; cityAr: string; country: string; countryCode: string;
  launchDate: string; description: string | null; descriptionAr: string | null;
  isActive: boolean; createdAt: string;
}
interface Subscriber {
  id: number; email: string; city: string | null; country: string | null;
  launchId: number | null; createdAt: string;
}
interface ByCity { city: string | null; country: string | null; count: number; }
interface AllSettings {
  smtp_host: string; smtp_port: string; smtp_secure: string;
  smtp_user: string; smtp_pass: string; smtp_from: string; smtp_from_name: string;
  smtp_pass_is_set: boolean;
  partner_email: string; driver_email: string;
  stat_partners: string; stat_deliveries: string; stat_cities: string;
  stat_rating: string; stat_rating_count: string;
}
interface Testimonial {
  id: number; name: string; nameAr: string; role: string; roleAr: string;
  city: string; text: string; textAr: string; rating: number;
  isActive: boolean; sortOrder: number; createdAt: string;
}

const COUNTRIES = [
  { code: "BH", name: "Bahrain" }, { code: "AE", name: "UAE" },
  { code: "SA", name: "Saudi Arabia" }, { code: "KW", name: "Kuwait" },
  { code: "QA", name: "Qatar" },
];

const DEFAULT_SOCIAL: Record<string, { url: string; enabled: boolean }> = {
  facebook:  { url: "", enabled: false },
  twitter:   { url: "", enabled: false },
  instagram: { url: "", enabled: false },
  linkedin:  { url: "", enabled: false },
  youtube:   { url: "", enabled: false },
  tiktok:    { url: "", enabled: false },
  snapchat:  { url: "", enabled: false },
  whatsapp:  { url: "", enabled: false },
};
const SOCIAL_PLATFORMS: { key: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "facebook",  label: "Facebook",    Icon: Facebook },
  { key: "twitter",   label: "X / Twitter", Icon: Twitter },
  { key: "instagram", label: "Instagram",   Icon: Instagram },
  { key: "linkedin",  label: "LinkedIn",    Icon: Linkedin },
  { key: "youtube",   label: "YouTube",     Icon: Youtube },
  { key: "tiktok",    label: "TikTok",      Icon: Music2 },
  { key: "snapchat",  label: "Snapchat",    Icon: Ghost },
  { key: "whatsapp",  label: "WhatsApp",    Icon: MessageCircle },
];
const DEFAULT_SUPPORTED_COUNTRIES: CountryOption[] = [
  { code: "BH", name: "Bahrain",      flag: "🇧🇭", currency: "BHD" },
  { code: "AE", name: "UAE",          flag: "🇦🇪", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
  { code: "KW", name: "Kuwait",       flag: "🇰🇼", currency: "KWD" },
  { code: "QA", name: "Qatar",        flag: "🇶🇦", currency: "QAR" },
];
const emptyForm = {
  city: "", cityAr: "", country: "Bahrain", countryCode: "BH",
  launchDate: "", description: "", descriptionAr: "", isActive: true,
};
const emptySettings: AllSettings = {
  smtp_host: "", smtp_port: "587", smtp_secure: "false",
  smtp_user: "", smtp_pass: "", smtp_from: "", smtp_from_name: "Yjeek Technologies",
  smtp_pass_is_set: false,
  partner_email: "sales@yjeektech.com", driver_email: "hr@yjeektech.com",
  stat_partners: "500+", stat_deliveries: "1M+", stat_cities: "200+",
  stat_rating: "4.9", stat_rating_count: "100,000",
};
const emptyTestimonial = {
  name: "", nameAr: "", role: "", roleAr: "",
  city: "", text: "", textAr: "", rating: 5, isActive: true, sortOrder: 0,
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900 ${className}`}
    />
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-black text-gray-900 mb-5 pb-3 border-b border-gray-100">{children}</h3>;
}

export default function AdminDashboard() {
  const { token, email, logout, isLoading, fetchWithAuth } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("launches");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("adminDarkMode") === "true");

  function toggleDarkMode() {
    setDarkMode((d) => {
      localStorage.setItem("adminDarkMode", String(!d));
      return !d;
    });
  }

  // ── Launches ────────────────────────────────────────────────────
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [fetchingLaunches, setFetchingLaunches] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [notifyLaunchId, setNotifyLaunchId] = useState<number | null>(null);
  const [notifyMsg, setNotifyMsg] = useState("");
  const [notifySending, setNotifySending] = useState(false);

  // ── Subscribers ─────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [byCity, setByCity] = useState<ByCity[]>([]);
  const [totalSubs, setTotalSubs] = useState(0);
  const [fetchingSubs, setFetchingSubs] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subPage, setSubPage] = useState(1);
  const [subPages, setSubPages] = useState(1);
  const [deleteSubConfirm, setDeleteSubConfirm] = useState<number | null>(null);
  const [deletingSubId, setDeletingSubId] = useState<number | null>(null);

  // ── Settings ────────────────────────────────────────────────────
  const [settings, setSettings] = useState<AllSettings>({ ...emptySettings });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSending, setTestSending] = useState(false);

  // ── Carousel Config ──────────────────────────────────────────────
  const [carouselConfig, setCarouselConfig] = useState<{id: string; label: string; visible: boolean; durationSeconds: number}[]>([]);
  const [carouselLoaded, setCarouselLoaded] = useState(false);
  const [savingCarousel, setSavingCarousel] = useState(false);

  // ── Footer content ───────────────────────────────────────────────
  const FOOTER_COUNTRY_NAMES: Record<string, string> = {
    BH: "Bahrain 🇧🇭", AE: "UAE 🇦🇪", SA: "Saudi Arabia 🇸🇦", KW: "Kuwait 🇰🇼", QA: "Qatar 🇶🇦",
  };
  const [footerLinks, setFooterLinks] = useState({
    contact_email: "info@yjeektech.com",
    company: "About Us\nCareers\nPress\nCorporate\nSustainability",
    partner: "Partner with us\nDrive with us\nSuccess Stories",
    legal: "Terms & Conditions\nPrivacy Policy\nCookie Policy\nSecurity\nFAQ",
  });
  const [countryData, setCountryData] = useState<Record<string, { cities: string; cuisines: string }>>({});
  const [expandedCountry, setExpandedCountry] = useState<string>("BH");

  // ── Category Badges ──────────────────────────────────────────────
  const DEFAULT_BADGE_VALUES: Record<string, { label: string; labelAr: string }> = {
    food:        { label: "🔥 Most Popular",  labelAr: "🔥 الأكثر طلباً" },
    groceries:   { label: "⚡ Under 15 mins", labelAr: "⚡ أقل من ١٥ دقيقة" },
    flowers:     { label: "🌸 Same day",       labelAr: "🌸 نفس اليوم" },
    electronics: { label: "📦 Fast shipping",  labelAr: "📦 شحن سريع" },
    accessories: { label: "✨ Trending",        labelAr: "✨ الأكثر رواجاً" },
    pets:        { label: "🐾 New arrivals",   labelAr: "🐾 وصل جديد" },
  };
  const BADGE_CATEGORIES = [
    { key: "food",        name: "Food",         icon: "🍔" },
    { key: "groceries",   name: "Groceries",    icon: "🛒" },
    { key: "flowers",     name: "Flowers",      icon: "🌸" },
    { key: "electronics", name: "Electronics",  icon: "💻" },
    { key: "accessories", name: "Accessories",  icon: "⌚" },
    { key: "pets",        name: "Pet Supplies", icon: "🐾" },
  ];
  const [categoryBadges, setCategoryBadges] = useState<Record<string, { label: string; labelAr: string }>>({ ...DEFAULT_BADGE_VALUES });

  // ── Logo / Favicon / App Links / Social / Supported Countries ──────────────
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [appStoreUrl, setAppStoreUrl] = useState("https://apps.apple.com");
  const [googlePlayUrl, setGooglePlayUrl] = useState("https://play.google.com");
  const [socialLinks, setSocialLinks] = useState<Record<string, { url: string; enabled: boolean }>>({ ...DEFAULT_SOCIAL });
  const [supportedCountries, setSupportedCountries] = useState<CountryOption[]>(DEFAULT_SUPPORTED_COUNTRIES);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { notify("error", "Logo must be under 1 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) { notify("error", "Favicon must be under 512 KB"); return; }
    const reader = new FileReader();
    reader.onload = () => setFaviconUrl(reader.result as string);
    reader.readAsDataURL(file);
  }
  function addSupportedCountry(c: CountryOption) {
    if (!supportedCountries.find((x) => x.code === c.code)) {
      setSupportedCountries((prev) => [...prev, c]);
      // Initialize country data for the new country
      setCountryData((prev) => ({
        ...prev,
        [c.code]: { cities: "", cuisines: "" },
      }));
    }
    setCountrySearch(""); setShowCountryPicker(false);
  }
  function removeSupportedCountry(code: string) {
    setSupportedCountries((prev) => prev.filter((c) => c.code !== code));
    // Remove country data for the removed country
    setCountryData((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }
  const filteredAllCountries = ALL_COUNTRIES.filter((c) =>
    !supportedCountries.find((x) => x.code === c.code) &&
    (countrySearch === "" || c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.toLowerCase().includes(countrySearch.toLowerCase()))
  );

  // ── Legal content ────────────────────────────────────────────────
  const LEGAL_SLUGS = [
    { slug: "terms",    label: "Terms & Conditions" },
    { slug: "privacy",  label: "Privacy Policy" },
    { slug: "cookies",  label: "Cookie Policy" },
    { slug: "security", label: "Security" },
    { slug: "faq",      label: "FAQ" },
  ] as const;
  const [legalContent, setLegalContent] = useState<Record<string, string>>({
    terms: "", privacy: "", cookies: "", security: "", faq: "",
  });
  const [legalContentAr, setLegalContentAr] = useState<Record<string, string>>({
    terms: "", privacy: "", cookies: "", security: "", faq: "",
  });
  const [expandedLegal, setExpandedLegal] = useState<string>("terms");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutContentAr, setAboutContentAr] = useState("");

  // ── Services ─────────────────────────────────────────────────────
  const [services, setServices] = useState<Service[]>([]);
  const [fetchingServices, setFetchingServices] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({ ...emptyService });
  const [savingService, setSavingService] = useState(false);
  const [deleteServiceConfirm, setDeleteServiceConfirm] = useState<number | null>(null);
  const serviceImageRef = useRef<HTMLInputElement>(null);

  // ── Testimonials ────────────────────────────────────────────────
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [fetchingTestimonials, setFetchingTestimonials] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({ ...emptyTestimonial });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [deleteTestimonialConfirm, setDeleteTestimonialConfirm] = useState<number | null>(null);

  // ── Shared ──────────────────────────────────────────────────────
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => { if (!isLoading && !token) setLocation("/admin"); }, [token, isLoading]);

  function notify(type: "success" | "error", msg: string) {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 5000);
  }

  // ── Launches ────────────────────────────────────────────────────
  const fetchLaunches = useCallback(async () => {
    if (!token) return;
    setFetchingLaunches(true);
    try {
      const res = await fetch("/api/admin/launches", { headers: { "x-admin-token": token } });
      setLaunches((await res.json()).launches ?? []);
    } catch { notify("error", "Failed to load launches"); }
    finally { setFetchingLaunches(false); }
  }, [token]);
  useEffect(() => { fetchLaunches(); }, [fetchLaunches]);

  function openCreate() { setForm({ ...emptyForm }); setEditingId(null); setShowForm(true); }
  function openEdit(l: Launch) {
    setForm({
      city: l.city, cityAr: l.cityAr, country: l.country, countryCode: l.countryCode,
      launchDate: new Date(l.launchDate).toISOString().slice(0, 16),
      description: l.description ?? "", descriptionAr: l.descriptionAr ?? "", isActive: l.isActive,
    });
    setEditingId(l.id); setShowForm(true);
  }
  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const body = { ...form, launchDate: new Date(form.launchDate).toISOString(), description: form.description || null, descriptionAr: form.descriptionAr || null };
    try {
      const res = await fetch(editingId ? `/api/admin/launches/${editingId}` : "/api/admin/launches", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      notify("success", editingId ? "Launch updated!" : "Launch created!");
      setShowForm(false); fetchLaunches();
    } catch (err: any) { notify("error", err.message ?? "Save failed"); }
    finally { setSaving(false); }
  }
  async function handleToggleActive(l: Launch) {
    try {
      await fetch(`/api/admin/launches/${l.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ isActive: !l.isActive }),
      });
      notify("success", l.isActive ? "Launch hidden" : "Launch activated"); fetchLaunches();
    } catch { notify("error", "Update failed"); }
  }
  async function handleDeleteLaunch(id: number) {
    try {
      const res = await fetch(`/api/admin/launches/${id}`, { method: "DELETE", headers: { "x-admin-token": token! } });
      if (!res.ok) throw new Error();
      notify("success", "Launch removed"); setDeleteConfirm(null); fetchLaunches();
    } catch { notify("error", "Delete failed"); }
  }
  async function handleNotify(launchId: number) {
    setNotifySending(true);
    try {
      const res = await fetch(`/api/admin/launches/${launchId}/notify`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ customMessage: notifyMsg || undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      notify("success", d.message); setNotifyLaunchId(null); setNotifyMsg("");
    } catch (err: any) { notify("error", err.message ?? "Send failed"); }
    finally { setNotifySending(false); }
  }
  const handleCountryChange = (name: string) => {
    const c = COUNTRIES.find((x) => x.name === name);
    setForm((f) => ({ ...f, country: name, countryCode: c?.code ?? "BH" }));
  };

  // ── Subscribers ─────────────────────────────────────────────────
  const fetchSubscribers = useCallback(async (page = 1, city = "") => {
    if (!token) return;
    setFetchingSubs(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (city) params.set("city", city);
      const res = await fetch(`/api/admin/subscribers?${params}`, { headers: { "x-admin-token": token } });
      const data = await res.json();
      setSubscribers(data.subscribers ?? []); setTotalSubs(data.total ?? 0);
      setSubPage(data.page ?? 1); setSubPages(data.pages ?? 1); setByCity(data.byCity ?? []);
    } catch { notify("error", "Failed to load subscribers"); }
    finally { setFetchingSubs(false); }
  }, [token]);
  useEffect(() => { if (activeTab === "subscribers") fetchSubscribers(1, cityFilter); }, [activeTab, fetchSubscribers]);
  const handleCityFilter = (city: string) => { setCityFilter(city); setSubPage(1); fetchSubscribers(1, city); };
  async function handleDeleteSub(id: number) {
    setDeletingSubId(id);
    try {
      await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE", headers: { "x-admin-token": token! } });
      notify("success", "Subscriber removed"); setDeleteSubConfirm(null); fetchSubscribers(subPage, cityFilter);
    } catch { notify("error", "Remove failed"); }
    finally { setDeletingSubId(null); }
  }
  const handleExport = () => {
    const params = cityFilter ? `?city=${encodeURIComponent(cityFilter)}` : "";
    fetch(`/api/admin/subscribers/export${params}`, { headers: { "x-admin-token": token! } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = cityFilter ? `yjeek-${cityFilter.toLowerCase()}.csv` : "yjeek-subscribers.csv";
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      })
      .catch(() => notify("error", "Export failed"));
  };
  const filteredSubs = searchQuery
    ? subscribers.filter((s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()) || (s.city ?? "").toLowerCase().includes(searchQuery.toLowerCase()))
    : subscribers;

  // ── Settings ────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/settings", { headers: { "x-admin-token": token } });
      const data = await res.json();
      setSettings({ ...emptySettings, ...data.settings }); setSettingsLoaded(true);
      const s = data.settings as Record<string, string>;
      const parseLinks = (raw: string | undefined, fallback: string) => {
        if (!raw) return fallback;
        try { return (JSON.parse(raw) as string[]).join("\n"); } catch { return fallback; }
      };
      setFooterLinks({
        contact_email: s["contact_email"] ?? "info@yjeektech.com",
        company: parseLinks(s["footer_company_links"], "About Us\nCareers\nPress\nCorporate\nSustainability"),
        partner: parseLinks(s["footer_partner_links"], "Partner with us\nDrive with us\nSuccess Stories"),
        legal: parseLinks(s["footer_legal_links"], "Terms & Conditions\nPrivacy Policy\nCookie Policy\nSecurity\nFAQ"),
      });
      setLegalContent({
        terms:    s["legal_terms"]    ?? "",
        privacy:  s["legal_privacy"]  ?? "",
        cookies:  s["legal_cookies"]  ?? "",
        security: s["legal_security"] ?? "",
        faq:      s["legal_faq"]      ?? "",
      });
      setLegalContentAr({
        terms:    s["legal_terms_ar"]    ?? "",
        privacy:  s["legal_privacy_ar"]  ?? "",
        cookies:  s["legal_cookies_ar"]  ?? "",
        security: s["legal_security_ar"] ?? "",
        faq:      s["legal_faq_ar"]      ?? "",
      });
      setAboutContent(s["page_about"] ?? "");
      setAboutContentAr(s["page_about_ar"] ?? "");
      setLogoUrl(s["logo_url"] ?? "");
      setFaviconUrl(s["favicon_url"] ?? "");
      setAppStoreUrl(s["app_store_url"] ?? "https://apps.apple.com");
      setGooglePlayUrl(s["google_play_url"] ?? "https://play.google.com");
      if (s["social_links"]) {
        try { setSocialLinks({ ...DEFAULT_SOCIAL, ...JSON.parse(s["social_links"]) }); } catch {}
      }
      if (s["supported_countries"]) {
        try {
          const parsed = JSON.parse(s["supported_countries"]) as CountryOption[];
          if (Array.isArray(parsed) && parsed.length > 0) setSupportedCountries(parsed);
        } catch {}
      }
      if (s["category_badges"]) {
        try { setCategoryBadges((prev) => ({ ...prev, ...JSON.parse(s["category_badges"]) })); } catch {}
      }
      if (s["country_data"]) {
        try {
          const parsed = JSON.parse(s["country_data"]) as Record<string, { cities: string[]; cuisines: string[] }>;
          setCountryData((prev) => {
            const next = { ...prev };
            for (const code of Object.keys(parsed)) {
              if (parsed[code]) next[code] = { cities: parsed[code].cities.join("\n"), cuisines: parsed[code].cuisines.join("\n") };
            }
            return next;
          });
        } catch {}
      }
    } catch { notify("error", "Failed to load settings"); }
  }, [token]);
  useEffect(() => { if (activeTab === "settings" && !settingsLoaded) fetchSettings(); }, [activeTab, settingsLoaded, fetchSettings]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault(); setSavingSettings(true);
    try {
      const toArr = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
      const cdJson = Object.fromEntries(
        supportedCountries.map((c) => [c.code, {
          cities: toArr(countryData[c.code]?.cities ?? ""),
          cuisines: toArr(countryData[c.code]?.cuisines ?? ""),
        }])
      );
      const payload = {
        ...settings,
        contact_email: footerLinks.contact_email,
        footer_company_links: JSON.stringify(toArr(footerLinks.company)),
        footer_partner_links: JSON.stringify(toArr(footerLinks.partner)),
        footer_legal_links: JSON.stringify(toArr(footerLinks.legal)),
        country_data: JSON.stringify(cdJson),
        legal_terms:       legalContent.terms,
        legal_privacy:     legalContent.privacy,
        legal_cookies:     legalContent.cookies,
        legal_security:    legalContent.security,
        legal_faq:         legalContent.faq,
        legal_terms_ar:    legalContentAr.terms,
        legal_privacy_ar:  legalContentAr.privacy,
        legal_cookies_ar:  legalContentAr.cookies,
        legal_security_ar: legalContentAr.security,
        legal_faq_ar:      legalContentAr.faq,
        page_about:        aboutContent,
        page_about_ar:     aboutContentAr,
        logo_url:       logoUrl,
        favicon_url:    faviconUrl,
        app_store_url:  appStoreUrl,
        google_play_url: googlePlayUrl,
        social_links:   JSON.stringify(socialLinks),
        supported_countries: JSON.stringify(supportedCountries),
        category_badges: JSON.stringify(categoryBadges),
      };
      invalidateSiteConfig();
      const res = await fetch("/api/admin/settings", {
        method: "PUT", headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      notify("success", "Settings saved!"); setSettingsLoaded(false);
    } catch (err: any) { notify("error", err.message ?? "Save failed"); }
    finally { setSavingSettings(false); }
  }
  async function handleTestEmail(e: React.FormEvent) {
    e.preventDefault(); setTestSending(true);
    try {
      const res = await fetch("/api/admin/settings/test-email", {
        method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ to: testEmail }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      notify("success", d.message);
    } catch (err: any) { notify("error", err.message ?? "Test failed"); }
    finally { setTestSending(false); }
  }

  // ── Testimonials ────────────────────────────────────────────────
  const fetchTestimonials = useCallback(async () => {
    if (!token) return;
    setFetchingTestimonials(true);
    try {
      const res = await fetch("/api/admin/testimonials", { headers: { "x-admin-token": token } });
      setTestimonials((await res.json()).testimonials ?? []);
    } catch { notify("error", "Failed to load testimonials"); }
    finally { setFetchingTestimonials(false); }
  }, [token]);
  useEffect(() => { if (activeTab === "testimonials") fetchTestimonials(); }, [activeTab, fetchTestimonials]);

  // ── Services callbacks ───────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    if (!token) return;
    setFetchingServices(true);
    try {
      const res = await fetch("/api/admin/services", { headers: { "x-admin-token": token } });
      setServices((await res.json()).services ?? []);
    } catch { notify("error", "Failed to load services"); }
    finally { setFetchingServices(false); }
  }, [token]);
  useEffect(() => { if (activeTab === "services") fetchServices(); }, [activeTab, fetchServices]);

  function openCreateService() { setEditingServiceId(null); setServiceForm({ ...emptyService }); setShowServiceForm(true); }
  function openEditService(s: Service) {
    setEditingServiceId(s.id);
    setServiceForm({ name: s.name, nameAr: s.nameAr, description: s.description, descriptionAr: s.descriptionAr, icon: s.icon, imageUrl: s.imageUrl, isActive: s.isActive, sortOrder: s.sortOrder });
    setShowServiceForm(true);
  }
  function handleServiceImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { notify("error", "Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setServiceForm((f) => ({ ...f, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }
  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceForm.name.trim()) { notify("error", "Service name is required"); return; }
    setSavingService(true);
    try {
      const url = editingServiceId ? `/api/admin/services/${editingServiceId}` : "/api/admin/services";
      const res = await fetch(url, { method: editingServiceId ? "PATCH" : "POST", headers: { "Content-Type": "application/json", "x-admin-token": token! }, body: JSON.stringify(serviceForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      notify("success", editingServiceId ? "Service updated!" : "Service created!");
      setShowServiceForm(false); fetchServices(); invalidateSiteConfig();
    } catch (err: any) { notify("error", err.message ?? "Save failed"); }
    finally { setSavingService(false); }
  }
  async function handleDeleteService(id: number) {
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE", headers: { "x-admin-token": token! } });
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteServiceConfirm(null);
      notify("success", "Service deleted");
      invalidateSiteConfig();
    } catch { notify("error", "Failed to delete service"); }
  }
  async function handleToggleService(s: Service) {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-token": token! }, body: JSON.stringify({ isActive: !s.isActive }) });
      const data = await res.json();
      if (data.service) setServices((prev) => prev.map((x) => x.id === s.id ? data.service : x));
      invalidateSiteConfig();
    } catch { notify("error", "Failed to update service"); }
  }

  function openCreateTestimonial() {
    setTestimonialForm({ ...emptyTestimonial }); setEditingTestimonialId(null); setShowTestimonialForm(true);
  }
  function openEditTestimonial(t: Testimonial) {
    setTestimonialForm({ name: t.name, nameAr: t.nameAr, role: t.role, roleAr: t.roleAr, city: t.city, text: t.text, textAr: t.textAr, rating: t.rating, isActive: t.isActive, sortOrder: t.sortOrder });
    setEditingTestimonialId(t.id); setShowTestimonialForm(true);
  }
  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault(); setSavingTestimonial(true);
    try {
      const res = await fetch(editingTestimonialId ? `/api/admin/testimonials/${editingTestimonialId}` : "/api/admin/testimonials", {
        method: editingTestimonialId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify(testimonialForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      notify("success", editingTestimonialId ? "Review updated!" : "Review added!");
      setShowTestimonialForm(false); fetchTestimonials();
    } catch (err: any) { notify("error", err.message ?? "Save failed"); }
    finally { setSavingTestimonial(false); }
  }
  async function handleDeleteTestimonial(id: number) {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE", headers: { "x-admin-token": token! } });
      notify("success", "Review removed"); setDeleteTestimonialConfirm(null); fetchTestimonials();
    } catch { notify("error", "Delete failed"); }
  }

  // ── Carousel Config ──────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "carousel" || carouselLoaded) return;
    fetch("/api/admin/carousel-config", { headers: { "x-admin-token": token! } })
      .then((r) => r.json())
      .then((d) => { setCarouselConfig(d.slides ?? []); setCarouselLoaded(true); })
      .catch(() => notify("error", "Failed to load carousel config"));
  }, [activeTab, carouselLoaded, token]);

  function updateCarouselSlide(i: number, patch: Partial<{id: string; label: string; visible: boolean; durationSeconds: number}>) {
    setCarouselConfig((c) => c.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  }
  async function handleSaveCarousel() {
    setSavingCarousel(true);
    try {
      const res = await fetch("/api/admin/carousel-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token! },
        body: JSON.stringify({ slides: carouselConfig }),
      });
      if (!res.ok) throw new Error("Save failed");
      notify("success", "Carousel settings saved!");
    } catch { notify("error", "Failed to save carousel settings"); }
    finally { setSavingCarousel(false); }
  }

  if (isLoading) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "launches", label: "Launches", icon: <MapPin className="w-4 h-4" />, count: launches.length },
    { id: "subscribers", label: "Subscribers", icon: <Users className="w-4 h-4" />, count: totalSubs || undefined },
    { id: "testimonials", label: "Reviews", icon: <Star className="w-4 h-4" />, count: testimonials.length || undefined },
    { id: "services", label: "Services", icon: <Layers className="w-4 h-4" />, count: services.length || undefined },
    { id: "carousel" as Tab, label: "Carousel", icon: <Smartphone className="w-4 h-4" /> },
    { id: "content" as Tab, label: "Content", icon: <Globe className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "admin-dark" : "bg-gray-50"}`}
      style={darkMode ? { background: "#081410" } : {}}>
      {/* Dark mode CSS overrides — uses Yjeek brand dark green palette */}
      {darkMode && (
        <style>{`
          .admin-dark .border-gray-200 { border-color: rgba(35,156,85,0.15) !important; }
          .admin-dark .border-gray-100 { border-color: rgba(35,156,85,0.10) !important; }
          .admin-dark .bg-white { background: #0F2419 !important; }
          .admin-dark .bg-gray-50 { background: #0B1A10 !important; }
          .admin-dark .bg-gray-100 { background: #1A3D25 !important; }
          .admin-dark .bg-gray-200 { background: #1A3D25 !important; }
          .admin-dark .text-gray-900 { color: #f0fdf4 !important; }
          .admin-dark .text-gray-700 { color: #bbf7d0 !important; }
          .admin-dark .text-gray-600 { color: #86efac !important; }
          .admin-dark .text-gray-500 { color: #4ade80 !important; opacity: 0.7; }
          .admin-dark .text-gray-400 { color: rgba(255,255,255,0.35) !important; }
          .admin-dark h1, .admin-dark h2, .admin-dark h3 { color: #f0fdf4 !important; }
          .admin-dark input, .admin-dark textarea, .admin-dark select {
            background: #0F2419 !important; color: #f0fdf4 !important;
            border-color: rgba(35,156,85,0.25) !important;
          }
          .admin-dark input::placeholder, .admin-dark textarea::placeholder { color: rgba(255,255,255,0.25) !important; }
          .admin-dark .hover\\:bg-gray-50:hover { background: #1A3D25 !important; }
          .admin-dark .hover\\:bg-gray-100:hover { background: #1A3D25 !important; }
          .admin-dark .hover\\:text-gray-700:hover { color: #bbf7d0 !important; }
          .admin-dark .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
        `}</style>
      )}

      {/* Nav */}
      <header className={`sticky top-0 z-40 ad-header ${darkMode ? "border-b" : "bg-white border-b border-gray-200"}`}
        style={darkMode ? { background: "#0B1A10", borderColor: "rgba(35,156,85,0.2)" } : {}}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/yjeek-logo-transparent.png"
              alt="Yjeek"
              className="h-9 md:h-12 w-auto object-contain"
              style={{
                maxWidth: 160,
                marginLeft: 4,
                filter: darkMode
                  ? "brightness(0) invert(1)"
                  : "brightness(0) saturate(100%) invert(38%) sepia(73%) saturate(537%) hue-rotate(100deg) brightness(90%) contrast(95%)",
              }}
            />
            <span className={`font-semibold text-xs ${darkMode ? "text-[#239C55]/60" : "text-gray-400"}`}>Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm hidden sm:block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{email}</span>
            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`relative w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${darkMode ? "bg-[#4CAF50]" : "bg-gray-200"}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-6" : "translate-x-0"} flex items-center justify-center text-[10px]`}>
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
            <button onClick={() => logout().then(() => setLocation("/admin"))} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}>
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg font-medium text-sm max-w-sm ${notification.type === "success" ? "bg-[#4CAF50] text-white" : "bg-red-500 text-white"}`}>
            {notification.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.icon} {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#4CAF50]/10 text-[#388E3C]" : "bg-gray-200 text-gray-500"}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── LAUNCHES TAB ─────────────────────────────────────── */}
        {activeTab === "launches" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">Upcoming Launches</h1>
                <p className="text-gray-500 text-sm">Manage city launch countdowns on the landing page.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchLaunches} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">
                  <RefreshCw className={`w-4 h-4 ${fetchingLaunches ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold shadow-md">
                  <Plus className="w-4 h-4" /> Add Launch
                </button>
              </div>
            </div>

            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-black text-gray-900 text-lg">{editingId ? "Edit Launch" : "New Launch"}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
                  <Field label="City (English)"><Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required placeholder="Manama" /></Field>
                  <Field label="City (Arabic)"><Input value={form.cityAr} onChange={(e) => setForm((f) => ({ ...f, cityAr: e.target.value }))} placeholder="المنامة" /></Field>
                  <Field label="Country">
                    <div className="relative">
                      <select value={form.country} onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] appearance-none">
                        {COUNTRIES.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Launch Date & Time"><Input type="datetime-local" value={form.launchDate} onChange={(e) => setForm((f) => ({ ...f, launchDate: e.target.value }))} required /></Field>
                  <Field label="Description (English)" hint="optional"><Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description for subscribers…" /></Field>
                  <Field label="Description (Arabic)" hint="optional"><Input value={form.descriptionAr} onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))} placeholder="وصف مختصر…" /></Field>
                  <div className="md:col-span-2 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-11 h-6 rounded-full transition-all relative ${form.isActive ? "bg-[#4CAF50]" : "bg-gray-200"}`} onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isActive ? "right-0.5" : "left-0.5"}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Active (visible on landing page)</span>
                    </label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
                      <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold disabled:opacity-60">
                        {saving ? "Saving…" : editingId ? "Update" : "Create"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {fetchingLaunches ? (
              <div className="grid md:grid-cols-2 gap-4">{[1, 2].map((i) => <div key={i} className="h-56 bg-white rounded-2xl border border-gray-200 animate-pulse" />)}</div>
            ) : launches.length === 0 ? (
              <div className="text-center py-20 text-gray-400"><MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" /><p className="font-semibold text-lg">No launches yet</p></div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {launches.map((l) => {
                  const daysLeft = Math.ceil((new Date(l.launchDate).getTime() - Date.now()) / 86400000);
                  const isPast = daysLeft < 0;
                  return (
                    <motion.div key={l.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl border p-6 ${l.isActive ? "border-gray-200 hover:border-[#4CAF50]/40 hover:shadow-md" : "border-gray-100 opacity-60"}`}>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${l.isActive ? "bg-[#4CAF50]/10 text-[#388E3C]" : "bg-gray-100 text-gray-400"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${l.isActive ? "bg-[#4CAF50]" : "bg-gray-400"}`} />{l.isActive ? "Active" : "Inactive"}
                            </span>
                            {isPast && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Past due</span>}
                          </div>
                          <h3 className="text-xl font-black text-gray-900">{l.city}</h3>
                          <p className="text-gray-500 text-sm">{l.cityAr} · {l.country}</p>
                        </div>
                        <div className={`text-right shrink-0 px-4 py-2 rounded-xl ${isPast ? "bg-amber-50" : "bg-[#4CAF50]/8"}`}>
                          <p className={`text-3xl font-black ${isPast ? "text-amber-500" : "text-[#388E3C]"}`}>{isPast ? "—" : daysLeft}</p>
                          <p className="text-xs text-gray-400 font-medium">{isPast ? "Passed" : "days left"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(l.launchDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {l.description && <p className="text-gray-500 text-sm mb-5 line-clamp-2">{l.description}</p>}
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-4 flex-wrap">
                        <button onClick={() => openEdit(l)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleToggleActive(l)} className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl font-medium ${l.isActive ? "text-amber-600 hover:bg-amber-50" : "text-[#388E3C] hover:bg-[#4CAF50]/10"}`}>
                          {l.isActive ? <><XCircle className="w-3.5 h-3.5" /> Hide</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Activate</>}
                        </button>
                        <button onClick={() => { setNotifyLaunchId(l.id); setNotifyMsg(""); }} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-blue-500 hover:bg-blue-50 font-medium">
                          <Megaphone className="w-3.5 h-3.5" /> Notify
                        </button>
                        <button onClick={() => setDeleteConfirm(l.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-red-400 hover:bg-red-50 font-medium ml-auto">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      {deleteConfirm === l.id && (
                        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
                          <p className="text-sm text-red-600 font-medium">Remove this launch?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setDeleteConfirm(null)} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                            <button onClick={() => handleDeleteLaunch(l.id)} className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold">Confirm</button>
                          </div>
                        </div>
                      )}
                      {notifyLaunchId === l.id && (
                        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-700 font-semibold mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4" /> Notify {l.city} subscribers</p>
                          <textarea value={notifyMsg} onChange={(e) => setNotifyMsg(e.target.value)} rows={3}
                            placeholder={`Optional message — leave blank for default "Yjeek is live in ${l.city}" message.`}
                            className="w-full px-3 py-2.5 rounded-xl border border-blue-200 bg-white text-sm focus:outline-none focus:border-blue-400 resize-none mb-3" />
                          <div className="flex gap-2">
                            <button onClick={() => setNotifyLaunchId(null)} className="text-sm px-3 py-2 rounded-xl border border-gray-200 text-gray-600">Cancel</button>
                            <button onClick={() => handleNotify(l.id)} disabled={notifySending} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold disabled:opacity-60">
                              <Send className="w-3.5 h-3.5" />{notifySending ? "Sending…" : "Send Notification"}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── SUBSCRIBERS TAB ───────────────────────────────────── */}
        {activeTab === "subscribers" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div><h1 className="text-3xl font-black text-gray-900 mb-1">Waitlist Subscribers</h1><p className="text-gray-500 text-sm">People who signed up to be notified on launch day.</p></div>
              <div className="flex gap-3">
                <button onClick={() => fetchSubscribers(subPage, cityFilter)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">
                  <RefreshCw className={`w-4 h-4 ${fetchingSubs ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold shadow-md">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Users className="w-4 h-4" /> Total</div>
                <p className="text-3xl font-black text-gray-900">{totalSubs}</p>
              </div>
              {byCity.slice(0, 3).map((bc) => (
                <button key={bc.city ?? "unknown"} onClick={() => handleCityFilter(cityFilter === (bc.city ?? "") ? "" : (bc.city ?? ""))}
                  className={`bg-white rounded-2xl border p-5 text-left transition-all hover:border-[#4CAF50]/40 hover:shadow-sm ${cityFilter === bc.city ? "border-[#4CAF50] ring-1 ring-[#4CAF50]/20" : "border-gray-200"}`}>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><MapPin className="w-4 h-4" /><span className="truncate">{bc.city ?? "Unknown"}</span></div>
                  <p className="text-3xl font-black text-gray-900">{bc.count}</p>
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search email or city…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]" />
              </div>
              {cityFilter && (
                <button onClick={() => handleCityFilter("")} className="flex items-center gap-2 px-4 py-2.5 border border-[#4CAF50]/40 bg-[#4CAF50]/5 text-[#388E3C] rounded-xl text-sm font-medium hover:bg-[#4CAF50]/10">
                  <Filter className="w-3.5 h-3.5" />{cityFilter}<X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {fetchingSubs ? (
              <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-white rounded-xl border border-gray-200 animate-pulse" />)}</div>
            ) : filteredSubs.length === 0 ? (
              <div className="text-center py-20 text-gray-400"><Mail className="w-12 h-12 mx-auto mb-4 opacity-40" /><p className="font-semibold text-lg">No subscribers yet</p></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto_auto] text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-100">
                  <span>Email</span><span className="px-4 text-center hidden sm:block">City</span><span className="px-4 text-center hidden md:block">Signed Up</span><span />
                </div>
                {filteredSubs.map((s, idx) => (
                  <div key={s.id} className={`grid grid-cols-[1fr_auto_auto_auto] items-center px-5 py-3.5 hover:bg-gray-50 ${idx !== filteredSubs.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#4CAF50]/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#388E3C]">{s.email[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">{s.email}</span>
                    </div>
                    <span className="text-sm text-gray-500 px-4 hidden sm:block">{s.city ?? "—"}</span>
                    <span className="text-xs text-gray-400 px-4 hidden md:block">{new Date(s.createdAt).toLocaleDateString()}</span>
                    <div>
                      {deleteSubConfirm === s.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDeleteSubConfirm(null)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 text-gray-600">×</button>
                          <button onClick={() => handleDeleteSub(s.id)} disabled={deletingSubId === s.id} className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white font-bold">
                            {deletingSubId === s.id ? "…" : "✓"}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteSubConfirm(s.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {subPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => fetchSubscribers(subPage - 1, cityFilter)} disabled={subPage <= 1} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40">← Prev</button>
                <span className="text-sm text-gray-500">Page {subPage} of {subPages}</span>
                <button onClick={() => fetchSubscribers(subPage + 1, cityFilter)} disabled={subPage >= subPages} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}

        {/* ── REVIEWS TAB ───────────────────────────────────────── */}
        {activeTab === "testimonials" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">Customer Reviews</h1>
                <p className="text-gray-500 text-sm">Manage the testimonials shown on the landing page.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchTestimonials} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">
                  <RefreshCw className={`w-4 h-4 ${fetchingTestimonials ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={openCreateTestimonial} className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold shadow-md">
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>
            </div>

            {showTestimonialForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-black text-gray-900 text-lg">{editingTestimonialId ? "Edit Review" : "Add Review"}</h2>
                  <button onClick={() => setShowTestimonialForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSaveTestimonial} className="grid md:grid-cols-2 gap-4">
                  <Field label="Name (English)"><Input value={testimonialForm.name} onChange={(e) => setTestimonialForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Ahmed K." /></Field>
                  <Field label="Name (Arabic)" hint="optional"><Input value={testimonialForm.nameAr} onChange={(e) => setTestimonialForm((f) => ({ ...f, nameAr: e.target.value }))} placeholder="أحمد ك." /></Field>
                  <Field label="Role / Title" hint="optional"><Input value={testimonialForm.role} onChange={(e) => setTestimonialForm((f) => ({ ...f, role: e.target.value }))} placeholder="Restaurant Owner" /></Field>
                  <Field label="Role (Arabic)" hint="optional"><Input value={testimonialForm.roleAr} onChange={(e) => setTestimonialForm((f) => ({ ...f, roleAr: e.target.value }))} placeholder="صاحب مطعم" /></Field>
                  <Field label="City"><Input value={testimonialForm.city} onChange={(e) => setTestimonialForm((f) => ({ ...f, city: e.target.value }))} placeholder="Manama, Bahrain" /></Field>
                  <div className="flex gap-4">
                    <Field label="Rating">
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} type="button" onClick={() => setTestimonialForm((f) => ({ ...f, rating: s }))}
                            className={`w-9 h-9 rounded-lg text-lg transition-all ${testimonialForm.rating >= s ? "text-[#FFEB3B] bg-[#FFEB3B]/10" : "text-gray-300"}`}>
                            ★
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Sort Order" hint="lower = first"><Input type="number" value={testimonialForm.sortOrder} onChange={(e) => setTestimonialForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} className="w-24" /></Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Review Text (English)">
                      <textarea value={testimonialForm.text} onChange={(e) => setTestimonialForm((f) => ({ ...f, text: e.target.value }))} required rows={3}
                        placeholder="The delivery tracking is unreal…"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] resize-none text-gray-900" />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Review Text (Arabic)" hint="optional">
                      <textarea value={testimonialForm.textAr} onChange={(e) => setTestimonialForm((f) => ({ ...f, textAr: e.target.value }))} rows={3}
                        placeholder="نظام التتبع لا يُصدَّق…"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] resize-none text-gray-900" />
                    </Field>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-11 h-6 rounded-full transition-all relative ${testimonialForm.isActive ? "bg-[#4CAF50]" : "bg-gray-200"}`} onClick={() => setTestimonialForm((f) => ({ ...f, isActive: !f.isActive }))}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${testimonialForm.isActive ? "right-0.5" : "left-0.5"}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Show on landing page</span>
                    </label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowTestimonialForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
                      <button type="submit" disabled={savingTestimonial} className="px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold disabled:opacity-60">
                        {savingTestimonial ? "Saving…" : editingTestimonialId ? "Update" : "Add Review"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {fetchingTestimonials ? (
              <div className="grid md:grid-cols-2 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white rounded-2xl border border-gray-200 animate-pulse" />)}</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-semibold text-lg">No reviews yet</p>
                <p className="text-sm mt-1">Add reviews to show on the landing page. Until then, the default placeholder reviews are shown.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <motion.div key={t.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-2xl border p-6 ${t.isActive ? "border-gray-200 hover:border-[#4CAF50]/40 hover:shadow-md" : "border-gray-100 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${t.isActive ? "bg-[#4CAF50]/10 text-[#388E3C]" : "bg-gray-100 text-gray-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${t.isActive ? "bg-[#4CAF50]" : "bg-gray-400"}`} />{t.isActive ? "Visible" : "Hidden"}
                          </span>
                          <span className="flex text-[#FFEB3B] text-sm">{"★".repeat(t.rating)}</span>
                        </div>
                        <p className="font-black text-gray-900">{t.name}{t.nameAr && <span className="text-gray-400 font-normal ml-2 text-sm">{t.nameAr}</span>}</p>
                        <p className="text-sm text-gray-500">{t.role}{t.city ? ` • ${t.city}` : ""}</p>
                      </div>
                      <span className="text-xs text-gray-300 font-medium">#{t.sortOrder}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 italic mb-4">"{t.text}"</p>
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                      <button onClick={() => openEditTestimonial(t)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => setDeleteTestimonialConfirm(t.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl text-red-400 hover:bg-red-50 font-medium ml-auto">
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    {deleteTestimonialConfirm === t.id && (
                      <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
                        <p className="text-sm text-red-600 font-medium">Remove this review?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteTestimonialConfirm(null)} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold">Confirm</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SERVICES TAB ──────────────────────────────────────── */}
        {activeTab === "services" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">Services</h1>
                <p className="text-gray-500 text-sm">Manage the services shown on the landing page and services page.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchServices} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium">
                  <RefreshCw className={`w-4 h-4 ${fetchingServices ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={openCreateService} className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold shadow-md">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
            </div>

            {/* Service form modal */}
            <AnimatePresence>
              {showServiceForm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-xl font-black text-gray-900">{editingServiceId ? "Edit Service" : "Add Service"}</h2>
                      <button onClick={() => setShowServiceForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <form onSubmit={handleSaveService} className="p-6 space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Name (English)">
                          <input value={serviceForm.name} onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Groceries" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none" />
                        </Field>
                        <Field label="Name (Arabic)">
                          <input dir="rtl" value={serviceForm.nameAr} onChange={(e) => setServiceForm((f) => ({ ...f, nameAr: e.target.value }))} placeholder="البقالة" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none" />
                        </Field>
                      </div>
                      <Field label="Description (English)">
                        <textarea value={serviceForm.description} onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none resize-none" />
                      </Field>
                      <Field label="Description (Arabic)">
                        <textarea dir="rtl" value={serviceForm.descriptionAr} onChange={(e) => setServiceForm((f) => ({ ...f, descriptionAr: e.target.value }))} rows={2} placeholder="وصف قصير…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none resize-none" />
                      </Field>
                      <Field label="Icon">
                        <div className="grid grid-cols-5 gap-2">
                          {SERVICE_ICONS.map(({ key, label, Icon }) => (
                            <button key={key} type="button" onClick={() => setServiceForm((f) => ({ ...f, icon: key }))}
                              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${serviceForm.icon === key ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#388E3C]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                              <Icon className="w-5 h-5" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field label="Image" hint="(optional, max 2MB)">
                        <div className="flex items-center gap-3">
                          {serviceForm.imageUrl && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                              <img src={serviceForm.imageUrl} className="w-full h-full object-cover" alt="preview" />
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <input ref={serviceImageRef} type="file" accept="image/*" className="hidden" onChange={handleServiceImageUpload} />
                            <button type="button" onClick={() => serviceImageRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                              <Upload className="w-4 h-4" /> Upload image
                            </button>
                            {serviceForm.imageUrl && (
                              <button type="button" onClick={() => setServiceForm((f) => ({ ...f, imageUrl: "" }))} className="text-xs text-red-500 hover:underline text-left">Remove image</button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Or paste a URL:</p>
                        <input value={serviceForm.imageUrl.startsWith("data:") ? "" : serviceForm.imageUrl} onChange={(e) => setServiceForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none mt-1" />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Sort Order" hint="(lower = first)">
                          <input type="number" value={serviceForm.sortOrder} onChange={(e) => setServiceForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#4CAF50] focus:outline-none" />
                        </Field>
                        <Field label="Status">
                          <div className="flex items-center gap-3 mt-2">
                            <button type="button" onClick={() => setServiceForm((f) => ({ ...f, isActive: !f.isActive }))}
                              className={`relative w-12 h-6 rounded-full transition-colors ${serviceForm.isActive ? "bg-[#4CAF50]" : "bg-gray-300"}`}>
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${serviceForm.isActive ? "translate-x-6" : ""}`} />
                            </button>
                            <span className="text-sm text-gray-600">{serviceForm.isActive ? "Active" : "Hidden"}</span>
                          </div>
                        </Field>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowServiceForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={savingService} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold disabled:opacity-60">
                          <Save className="w-4 h-4" />{savingService ? "Saving…" : editingServiceId ? "Update Service" : "Add Service"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Services list */}
            {fetchingServices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-semibold text-lg">No services yet</p>
                <p className="text-sm mt-1">Add a service to display it on the website.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => {
                  const iconEntry = SERVICE_ICONS.find((x) => x.key === s.icon);
                  const IconComponent = iconEntry?.Icon ?? Box;
                  return (
                    <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 transition-all ${s.isActive ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.isActive ? "bg-[#4CAF50]/10" : "bg-gray-100"}`}>
                            {s.imageUrl ? <img src={s.imageUrl} className="w-8 h-8 object-cover rounded-lg" alt={s.name} /> : <IconComponent className={`w-5 h-5 ${s.isActive ? "text-[#388E3C]" : "text-gray-400"}`} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                            <p className="text-xs text-gray-400 font-medium" dir="rtl">{s.nameAr}</p>
                          </div>
                        </div>
                        <button onClick={() => handleToggleService(s)}
                          className={`relative w-10 h-5 rounded-full shrink-0 transition-colors mt-1 ${s.isActive ? "bg-[#4CAF50]" : "bg-gray-300"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.isActive ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                      {s.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{s.description}</p>}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-xs text-gray-400">Order: {s.sortOrder}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openEditService(s)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => setDeleteServiceConfirm(s.id === deleteServiceConfirm ? null : s.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                      {deleteServiceConfirm === s.id && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                          <p className="text-sm text-red-600 font-medium">Delete this service?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setDeleteServiceConfirm(null)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                            <button onClick={() => handleDeleteService(s.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold">Confirm</button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── SETTINGS TAB ──────────────────────────────────────── */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div><h1 className="text-3xl font-black text-gray-900 mb-1">Settings</h1><p className="text-gray-500 text-sm">Configure emails, statistics, and SMTP.</p></div>
              <button type="submit" disabled={savingSettings} className="flex items-center gap-2 px-6 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-60">
                <Save className="w-4 h-4" />{savingSettings ? "Saving…" : "Save All Settings"}
              </button>
            </div>

            <div className="space-y-6">
              {/* App Logo */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🖼️ App Logo</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Upload a custom logo to replace the default "Y" mark in the navbar and footer. PNG, JPG, SVG — max 1 MB.</p>
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Current logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-[#4CAF50] rounded-2xl">
                        <span className="text-white font-black text-3xl italic">Y</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <div className="flex gap-3 flex-wrap">
                      <button type="button" onClick={() => logoInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium">
                        <Upload className="w-4 h-4" /> Upload Image
                      </button>
                      {logoUrl && (
                        <button type="button" onClick={() => setLogoUrl("")}
                          className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 text-sm font-medium">
                          <X className="w-4 h-4" /> Remove Logo
                        </button>
                      )}
                    </div>
                    {logoUrl && (
                      <p className="text-xs text-[#388E3C] mt-2 font-medium">✓ Custom logo set — click Save All Settings to apply</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Recommended: square image, at least 80×80px. Transparent PNG works best.</p>
                  </div>
                </div>
              </div>

              {/* Browser Tab Favicon */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🌐 Browser Tab Icon (Favicon)</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Upload a custom icon that appears in the browser tab. PNG, JPG, SVG — max 512 KB. Recommended: square image, 32×32 or 64×64px.</p>
                <div className="flex items-start gap-6">
                  <div className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                    {faviconUrl ? (
                      <img src={faviconUrl} alt="Current favicon" className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-[#4CAF50] rounded-xl">
                        <span className="text-white font-black text-2xl italic">Y</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconUpload} />
                    <div className="flex gap-3 flex-wrap">
                      <button type="button" onClick={() => faviconInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium">
                        <Upload className="w-4 h-4" /> Upload Icon
                      </button>
                      {faviconUrl && (
                        <button type="button" onClick={() => setFaviconUrl("")}
                          className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 text-sm font-medium">
                          <X className="w-4 h-4" /> Remove Icon
                        </button>
                      )}
                    </div>
                    {faviconUrl && (
                      <p className="text-xs text-[#388E3C] mt-2 font-medium">✓ Custom favicon set — click Save All Settings to apply</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">If no custom icon is set, the default green "Y" icon is used.</p>
                  </div>
                </div>
              </div>

              {/* App Download Links */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>📲 App Download Links</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">These URLs are applied to every "Download on the App Store" and "Get it on Google Play" button across the entire site.</p>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="App Store URL">
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-10" type="url" value={appStoreUrl}
                        onChange={(e) => setAppStoreUrl(e.target.value)}
                        placeholder="https://apps.apple.com/app/yjeek/..." />
                    </div>
                  </Field>
                  <Field label="Google Play URL">
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-10" type="url" value={googlePlayUrl}
                        onChange={(e) => setGooglePlayUrl(e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=..." />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Category Badges */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🏷️ Category Badges</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">
                  Edit the badge text shown on each category card on the landing page. You can include an emoji at the start.
                </p>
                <div className="space-y-3">
                  {BADGE_CATEGORIES.map(({ key, name, icon }) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/70">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span className="text-sm font-semibold text-gray-700">{name}</span>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1 block">English</label>
                        <input
                          type="text"
                          value={categoryBadges[key]?.label ?? ""}
                          onChange={(e) => setCategoryBadges((prev) => ({ ...prev, [key]: { ...prev[key], label: e.target.value } }))}
                          placeholder="e.g. 🔥 Most Popular"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1 block">Arabic</label>
                        <input
                          dir="rtl"
                          type="text"
                          value={categoryBadges[key]?.labelAr ?? ""}
                          onChange={(e) => setCategoryBadges((prev) => ({ ...prev, [key]: { ...prev[key], labelAr: e.target.value } }))}
                          placeholder="🔥 الأكثر طلباً"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Changes are applied site-wide after clicking "Save All Settings".</p>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>📱 Social Media Links</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Enable the platforms you are active on and paste in the full profile URL. Only enabled platforms with a URL will appear in the footer.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {SOCIAL_PLATFORMS.map(({ key, label, Icon }) => {
                    const link = socialLinks[key] ?? { url: "", enabled: false };
                    return (
                      <div key={key} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${link.enabled ? "border-[#4CAF50]/40 bg-[#4CAF50]/3" : "border-gray-200"}`}>
                        <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${link.enabled ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-gray-800">{label}</span>
                            <button type="button"
                              onClick={() => setSocialLinks((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key]?.enabled } }))}
                              className={`relative w-10 h-5.5 rounded-full transition-all shrink-0 ${link.enabled ? "bg-[#4CAF50]" : "bg-gray-200"}`}
                              style={{ height: "22px", width: "40px" }}>
                              <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${link.enabled ? "right-0.5" : "left-0.5"}`}
                                style={{ width: "18px", height: "18px", top: "2px", left: link.enabled ? "auto" : "2px", right: link.enabled ? "2px" : "auto" }} />
                            </button>
                          </div>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => setSocialLinks((prev) => ({ ...prev, [key]: { ...prev[key], url: e.target.value } }))}
                            placeholder={`https://www.${key === "twitter" ? "x" : key}.com/yjeek`}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm text-gray-900 disabled:opacity-50"
                            disabled={!link.enabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Supported Countries */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🌍 Supported Countries</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Countries available for visitors to select in the navbar dropdown. Drag to reorder, click × to remove.</p>

                {/* Current list */}
                <div className="flex flex-wrap gap-2 mb-5 min-h-[2.5rem]">
                  {supportedCountries.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No countries added yet.</p>
                  )}
                  {supportedCountries.map((c) => (
                    <div key={c.code} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-[#4CAF50]/8 border border-[#4CAF50]/30 rounded-full text-sm font-semibold text-gray-800">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-xs text-gray-400 ml-0.5">({c.currency})</span>
                      <button type="button" onClick={() => removeSupportedCountry(c.code)}
                        className="ml-1 w-4 h-4 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add country */}
                <div className="relative">
                  <button type="button"
                    onClick={() => setShowCountryPicker((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-[#4CAF50] hover:text-[#388E3C] text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add Country
                  </button>
                  {showCountryPicker && (
                    <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl w-72 overflow-hidden">
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country…"
                            autoFocus
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#4CAF50]"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredAllCountries.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-5">No countries found</p>
                        ) : (
                          filteredAllCountries.slice(0, 50).map((c) => (
                            <button key={c.code} type="button"
                              onClick={() => addSupportedCountry(c)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm transition-colors">
                              <span className="text-lg">{c.flag}</span>
                              <span className="font-medium text-gray-900">{c.name}</span>
                              <span className="text-gray-400 text-xs ml-auto">{c.currency}</span>
                            </button>
                          ))
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <button type="button" onClick={() => setShowCountryPicker(false)}
                          className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">Close</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Emails */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>📬 Contact Emails</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Form submissions from the Partner and Drive pages go to these addresses.</p>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Partner With Us Enquiries">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-10" type="email" value={settings.partner_email}
                        onChange={(e) => setSettings((s) => ({ ...s, partner_email: e.target.value }))}
                        placeholder="sales@yjeektech.com" />
                    </div>
                  </Field>
                  <Field label="Drive with Yjeek Applications">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-10" type="email" value={settings.driver_email}
                        onChange={(e) => setSettings((s) => ({ ...s, driver_email: e.target.value }))}
                        placeholder="hr@yjeektech.com" />
                    </div>
                  </Field>
                </div>
              </div>

              {/* Footer & Content */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🌐 Footer & Corporate Links</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">These lists control the link columns shown in the footer and the Corporate nav section. One item per line.</p>
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <Field label="Contact Email (shown in footer)">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-10" type="email" value={footerLinks.contact_email}
                        onChange={(e) => setFooterLinks((f) => ({ ...f, contact_email: e.target.value }))}
                        placeholder="info@yjeektech.com" />
                    </div>
                  </Field>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Company Links" hint="one per line">
                    <textarea rows={7} value={footerLinks.company}
                      onChange={(e) => setFooterLinks((f) => ({ ...f, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-none text-sm text-gray-900 font-mono"
                      placeholder="About Us&#10;Careers&#10;Press" />
                  </Field>
                  <Field label="Partner Links" hint="one per line">
                    <textarea rows={7} value={footerLinks.partner}
                      onChange={(e) => setFooterLinks((f) => ({ ...f, partner: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-none text-sm text-gray-900 font-mono"
                      placeholder="Partner with us&#10;Drive with us&#10;Success Stories" />
                  </Field>
                  <Field label="Legal Links" hint="one per line">
                    <textarea rows={7} value={footerLinks.legal}
                      onChange={(e) => setFooterLinks((f) => ({ ...f, legal: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-none text-sm text-gray-900 font-mono"
                      placeholder="Terms &amp; Conditions&#10;Privacy Policy&#10;FAQ" />
                  </Field>
                </div>
              </div>

              {/* Country Data */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🗺️ Country Cities & Cuisines</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Popular cities and top cuisines shown in the footer for each country. One item per line. The footer auto-detects the visitor's country and shows the matching list.</p>
                <div className="space-y-3">
                  {supportedCountries.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Add supported countries first to configure their cities and cuisines.</p>
                  ) : (
                    supportedCountries.map((country) => (
                      <div key={country.code} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button type="button"
                          onClick={() => setExpandedCountry((prev) => prev === country.code ? "" : country.code)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                          <span className="font-bold text-gray-900">{country.flag} {country.name}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedCountry === country.code ? "rotate-180" : ""}`} />
                        </button>
                        {expandedCountry === country.code && (
                          <div className="px-5 pb-5 grid md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
                            <Field label="Popular Cities" hint="one per line">
                              <textarea rows={6} value={countryData[country.code]?.cities ?? ""}
                                onChange={(e) => setCountryData((d) => ({ ...d, [country.code]: { ...d[country.code], cities: e.target.value } }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-none text-sm text-gray-900 font-mono"
                                placeholder="City 1&#10;City 2&#10;City 3" />
                            </Field>
                            <Field label="Top Cuisines" hint="one per line">
                              <textarea rows={6} value={countryData[country.code]?.cuisines ?? ""}
                                onChange={(e) => setCountryData((d) => ({ ...d, [country.code]: { ...d[country.code], cuisines: e.target.value } }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-none text-sm text-gray-900 font-mono"
                                placeholder="Cuisine 1&#10;Cuisine 2&#10;Cuisine 3" />
                            </Field>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Legal Pages */}
              {/* About Us Page */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🏢 About Us Page</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">
                  Content for the About Us page at{" "}
                  <a href="/about" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[#4CAF50] hover:underline">/about ↗</a>.
                  Leave blank to show a "coming soon" placeholder.
                </p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">About Us</span>
                      {aboutContent ? (
                        <span className="text-xs bg-[#4CAF50]/10 text-[#388E3C] px-2 py-0.5 rounded-full font-semibold">Has content</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-semibold">Empty</span>
                      )}
                    </div>
                  </div>
                  <div className="px-5 pb-5 border-t border-gray-100 pt-5 grid md:grid-cols-2 gap-5">
                    <Field label="🇬🇧 English content" hint="plain text or basic HTML — line breaks are preserved">
                      <textarea
                        rows={14}
                        dir="ltr"
                        value={aboutContent}
                        onChange={(e) => setAboutContent(e.target.value)}
                        placeholder="Tell your story here — who you are, your mission, your values, your team…"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-y text-sm text-gray-900 leading-relaxed"
                      />
                    </Field>
                    <Field label="🇸🇦 المحتوى العربي" hint="نص عادي أو HTML بسيط — فواصل الأسطر محفوظة">
                      <textarea
                        rows={14}
                        dir="rtl"
                        value={aboutContentAr}
                        onChange={(e) => setAboutContentAr(e.target.value)}
                        placeholder="احكِ قصتكم هنا — من أنتم، مهمتكم، قيمكم، فريقكم…"
                        style={{ fontFamily: "Cairo, sans-serif" }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-y text-sm text-gray-900 leading-relaxed text-right"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>⚖️ Legal Pages Content</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">
                  Paste the content for each legal page. Leave blank to show a "coming soon" placeholder. Pages are live at <span className="font-mono bg-gray-100 px-1 rounded text-xs">/legal/terms</span>, <span className="font-mono bg-gray-100 px-1 rounded text-xs">/legal/privacy</span>, etc.
                </p>
                <div className="space-y-3">
                  {LEGAL_SLUGS.map(({ slug, label }) => (
                    <div key={slug} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button type="button"
                        onClick={() => setExpandedLegal((prev) => prev === slug ? "" : slug)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">{label}</span>
                          <a href={`/legal/${slug}`} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[#4CAF50] hover:underline font-mono">
                            /legal/{slug} ↗
                          </a>
                          {legalContent[slug] ? (
                            <span className="text-xs bg-[#4CAF50]/10 text-[#388E3C] px-2 py-0.5 rounded-full font-semibold">Has content</span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-semibold">Empty</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedLegal === slug ? "rotate-180" : ""}`} />
                      </button>
                      {expandedLegal === slug && (
                        <div className="px-5 pb-5 border-t border-gray-100 pt-5 grid md:grid-cols-2 gap-5">
                          <Field label="🇬🇧 English content" hint="plain text — line breaks are preserved">
                            <textarea
                              rows={14}
                              dir="ltr"
                              value={legalContent[slug] ?? ""}
                              onChange={(e) => setLegalContent((c) => ({ ...c, [slug]: e.target.value }))}
                              placeholder={`Paste your ${label} text here…`}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-y text-sm text-gray-900 leading-relaxed font-mono"
                            />
                          </Field>
                          <Field label="🇸🇦 المحتوى العربي" hint="نص عادي — فواصل الأسطر محفوظة">
                            <textarea
                              rows={14}
                              dir="rtl"
                              value={legalContentAr[slug] ?? ""}
                              onChange={(e) => setLegalContentAr((c) => ({ ...c, [slug]: e.target.value }))}
                              placeholder={`الصق نص ${label} هنا…`}
                              style={{ fontFamily: "Cairo, sans-serif" }}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 resize-y text-sm text-gray-900 leading-relaxed text-right"
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Statistics */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>📊 Site Statistics</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">These numbers appear in the "Get the App" section on the landing page. Use values like <code className="bg-gray-100 px-1 rounded">500+</code>, <code className="bg-gray-100 px-1 rounded">1M+</code>, <code className="bg-gray-100 px-1 rounded">4.9</code>.</p>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Partners / Restaurants">
                    <Input value={settings.stat_partners} onChange={(e) => setSettings((s) => ({ ...s, stat_partners: e.target.value }))} placeholder="500+" />
                  </Field>
                  <Field label="Total Deliveries">
                    <Input value={settings.stat_deliveries} onChange={(e) => setSettings((s) => ({ ...s, stat_deliveries: e.target.value }))} placeholder="1M+" />
                  </Field>
                  <Field label="Cities Covered">
                    <Input value={settings.stat_cities} onChange={(e) => setSettings((s) => ({ ...s, stat_cities: e.target.value }))} placeholder="200+" />
                  </Field>
                  <Field label="App Rating">
                    <Input value={settings.stat_rating} onChange={(e) => setSettings((s) => ({ ...s, stat_rating: e.target.value }))} placeholder="4.9" />
                  </Field>
                  <Field label="Rated by (users count)">
                    <Input value={settings.stat_rating_count} onChange={(e) => setSettings((s) => ({ ...s, stat_rating_count: e.target.value }))} placeholder="100,000" />
                  </Field>
                </div>
              </div>

              {/* SMTP Configuration */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>✉️ Email (SMTP) Configuration</SectionTitle>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="SMTP Host">
                    <Input value={settings.smtp_host} onChange={(e) => setSettings((s) => ({ ...s, smtp_host: e.target.value }))} placeholder="smtp.gmail.com" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Port">
                      <Input type="number" value={settings.smtp_port} onChange={(e) => setSettings((s) => ({ ...s, smtp_port: e.target.value }))} placeholder="587" />
                    </Field>
                    <Field label="Encryption">
                      <div className="relative">
                        <select value={settings.smtp_secure} onChange={(e) => setSettings((s) => ({ ...s, smtp_secure: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] appearance-none">
                          <option value="false">TLS (587)</option>
                          <option value="true">SSL (465)</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </Field>
                  </div>
                  <Field label="SMTP Username">
                    <Input value={settings.smtp_user} onChange={(e) => setSettings((s) => ({ ...s, smtp_user: e.target.value }))} placeholder="you@gmail.com" />
                  </Field>
                  <Field label="SMTP Password">
                    <div className="relative">
                      <Input type={showPass ? "text" : "password"} value={settings.smtp_pass}
                        onChange={(e) => setSettings((s) => ({ ...s, smtp_pass: e.target.value }))}
                        placeholder={settings.smtp_pass_is_set ? "••••••••" : "Enter password…"} className="pr-12" />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="From Email Address">
                    <Input type="email" value={settings.smtp_from} onChange={(e) => setSettings((s) => ({ ...s, smtp_from: e.target.value }))} placeholder="noreply@yjeektech.com" />
                  </Field>
                  <Field label="From Name">
                    <Input value={settings.smtp_from_name} onChange={(e) => setSettings((s) => ({ ...s, smtp_from_name: e.target.value }))} placeholder="Yjeek Technologies" />
                  </Field>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { label: "Gmail", host: "smtp.gmail.com", port: "587" },
                    { label: "Zoho", host: "smtp.zoho.com", port: "587" },
                    { label: "Outlook", host: "smtp-mail.outlook.com", port: "587" },
                    { label: "SendGrid", host: "smtp.sendgrid.net", port: "587" },
                  ].map((p) => (
                    <button key={p.label} type="button" onClick={() => setSettings((s) => ({ ...s, smtp_host: p.host, smtp_port: p.port, smtp_secure: "false" }))}
                      className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-[#4CAF50] hover:text-[#388E3C] transition-colors font-medium">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Email */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <SectionTitle>🧪 Test Your Email Setup</SectionTitle>
                <p className="text-sm text-gray-500 mb-5">Send a test email to verify your SMTP settings are working correctly.</p>
                <form onSubmit={handleTestEmail} className="flex gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input className="pl-10" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" required />
                  </div>
                  <button type="submit" disabled={testSending} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold disabled:opacity-60 whitespace-nowrap">
                    <Send className="w-4 h-4" />{testSending ? "Sending…" : "Send Test"}
                  </button>
                </form>
              </div>
            </div>
          </form>
        )}

        {/* ── CAROUSEL TAB ─────────────────────────────────────────── */}
        {activeTab === "carousel" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">Carousel Settings</h1>
                <p className="text-gray-500 text-sm">Control which slides appear on the homepage and how long each shows before auto-advancing.</p>
              </div>
              <button onClick={handleSaveCarousel} disabled={savingCarousel || !carouselLoaded}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold disabled:opacity-60 shadow-md whitespace-nowrap transition-colors">
                <Save className="w-4 h-4" />{savingCarousel ? "Saving…" : "Save Changes"}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>🎠 Homepage Slides</SectionTitle>
              <p className="text-sm text-gray-500 mb-6">Toggle slides on/off and set how many seconds each slide shows before auto-advancing. Changes take effect immediately after saving.</p>
              {carouselLoaded ? (
                <div className="space-y-3">
                  {carouselConfig.map((slide, i) => (
                    <div key={slide.id}
                      className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{slide.label}</p>
                        <p className="text-xs text-gray-400 font-mono">{slide.id}</p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xs text-gray-400 hidden sm:block">Duration</span>
                        <input
                          type="number" min={3} max={600} value={slide.durationSeconds}
                          onChange={(e) => updateCarouselSlide(i, { durationSeconds: Math.max(3, parseInt(e.target.value) || 10) })}
                          className="w-14 sm:w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 text-gray-900"
                        />
                        <span className="text-xs text-gray-400">sec</span>
                      </div>
                      <button
                        onClick={() => updateCarouselSlide(i, { visible: !slide.visible })}
                        className="flex items-center gap-2 shrink-0"
                      >
                        <div className={`relative w-10 rounded-full transition-colors shrink-0 ${slide.visible ? "bg-[#4CAF50]" : "bg-gray-200"}`} style={{ height: "22px" }}>
                          <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform ${slide.visible ? "translate-x-5" : "translate-x-[3px]"}`} />
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${slide.visible ? "text-[#388E3C]" : "text-gray-400"}`}>
                          {slide.visible ? "Visible" : "Hidden"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-6">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading carousel settings…
                </div>
              )}
              <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
                At least one slide must remain visible. Hidden slides are skipped in the rotation. The carousel auto-advances through visible slides and wraps back to the first after the last.
              </div>
            </div>
          </div>
        )}

        {/* ── CONTENT TAB ──────────────────────────────────────────── */}
        {activeTab === "content" && (
          <ContentEditor token={token!} onNotify={notify} />
        )}
      </main>
    </div>
  );
}
