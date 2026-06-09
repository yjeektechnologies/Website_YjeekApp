import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, ShoppingCart, User, Home as HomeIcon,
  Star, Clock, ChevronLeft, ChevronRight, Package,
  Phone as PhoneIcon, MessageCircle,
} from "lucide-react";

interface AppCopy {
  appLabel:          string;
  location:          string;
  searchPlaceholder: string;
  categories:        string[];
  sectionTitle:      string;
  stores: Array<{ name: string; rating: string; time: string; min: string }>;
  navHome: string; navSearch: string; navOrders: string; navProfile: string;
  backLabel:   string;
  cartItems:   string;
  storeName:   string;
  storeRating: string;
  storeTime:   string;
  storeMin:    string;
  popular:     string;
  items: Array<{ emoji: string; name: string; price: string; desc: string }>;
  cartBar:      string;
  ordersLabel:  string;
  orderNo:      string;
  steps:        string[];
  driverName:   string;
  driverStatus: string;
  eta:          string;
  callBtn:      string;
  chatBtn:      string;
}

const COPY: Record<"en" | "ar", AppCopy> = {
  en: {
    appLabel:          "Customer App",
    location:          "Manama, BH",
    searchPlaceholder: "Search food, groceries…",
    categories:        ["🍔 Food", "💊 Pharmacy", "🛒 Groceries", "☕ Coffee"],
    sectionTitle:      "Popular near you",
    stores: [
      { name: "Burger Palace",      rating: "4.8", time: "15 min", min: "Min 1.5 BHD" },
      { name: "Fresh Green Market", rating: "4.7", time: "12 min", min: "Min 0.5 BHD" },
    ],
    navHome: "Home", navSearch: "Search", navOrders: "Orders", navProfile: "Profile",
    backLabel:   "Back",
    cartItems:   "2",
    storeName:   "Burger Palace",
    storeRating: "4.8",
    storeTime:   "15–20 min",
    storeMin:    "Min order: 1.5 BHD",
    popular:     "Popular",
    items: [
      { emoji: "🍔", name: "Classic Burger", price: "3.500 BHD", desc: "Juicy beef, fresh salad" },
      { emoji: "🌮", name: "Chicken Wrap",   price: "3.750 BHD", desc: "Grilled chicken, garlic" },
      { emoji: "🍟", name: "Loaded Fries",   price: "1.500 BHD", desc: "Crispy, seasoned fries" },
    ],
    cartBar:      "2 items · 7.500 BHD",
    ordersLabel:  "Orders",
    orderNo:      "Order #YJ-4827",
    steps:        ["Placed", "Preparing", "On the way", "Arrived"],
    driverName:   "Ahmed M.",
    driverStatus: "On his way to you",
    eta:          "Arriving in 8 min",
    callBtn:      "Call",
    chatBtn:      "Chat",
  },
  ar: {
    appLabel:          "تطبيق العملاء",
    location:          "المنامة، البحرين",
    searchPlaceholder: "ابحث عن طعام أو بقالة…",
    categories:        ["🍔 طعام", "💊 صيدلية", "🛒 بقالة", "☕ قهوة"],
    sectionTitle:      "الأشهر بالقرب منك",
    stores: [
      { name: "برغر بالاس",       rating: "4.8", time: "١٥ د", min: "الحد الأدنى ١٫٥ د.ب" },
      { name: "فريش جرين ماركت", rating: "4.7", time: "١٢ د", min: "الحد الأدنى ٠٫٥ د.ب" },
    ],
    navHome: "الرئيسية", navSearch: "بحث", navOrders: "طلباتي", navProfile: "حسابي",
    backLabel:   "رجوع",
    cartItems:   "٢",
    storeName:   "برغر بالاس",
    storeRating: "4.8",
    storeTime:   "١٥–٢٠ د",
    storeMin:    "الحد الأدنى: ١٫٥ د.ب",
    popular:     "الأكثر طلباً",
    items: [
      { emoji: "🍔", name: "برغر كلاسيك",  price: "٣٫٥٠٠ د.ب", desc: "لحم بقري طازج وسلطة" },
      { emoji: "🌮", name: "راب دجاج",      price: "٣٫٧٥٠ د.ب", desc: "دجاج مشوي وصلصة ثوم" },
      { emoji: "🍟", name: "بطاطس محمّصة", price: "١٫٥٠٠ د.ب", desc: "مقرمشة ومتبّلة" },
    ],
    cartBar:      "٢ عناصر · ٧٫٥٠٠ د.ب",
    ordersLabel:  "طلباتي",
    orderNo:      "طلب رقم YJ-4827",
    steps:        ["تم الطلب", "يُحضَّر", "في الطريق", "وصل"],
    driverName:   "أحمد م.",
    driverStatus: "في طريقه إليك",
    eta:          "يصل خلال ٨ دقائق",
    callBtn:      "اتصال",
    chatBtn:      "دردشة",
  },
};

const screenVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1, transition: { duration: 0.42, ease: [0.34, 1.1, 0.64, 1] as [number, number, number, number] } },
  exit:   (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%", opacity: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

function HomeScreen({ c, isRTL }: { c: AppCopy; isRTL: boolean }) {
  return (
    <div className="h-full flex flex-col" style={{ background: "#F7F9F7" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Status bar area */}
      <div style={{ paddingTop: 28 }} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div>
          <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wider">{c.appLabel}</p>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#239C55]" />
            <span className="text-[10px] font-bold text-gray-800">{c.location}</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#239C55]/15 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-[#239C55]" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <Search className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-gray-400 text-[10px] truncate">{c.searchPlaceholder}</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 pb-3 flex gap-1.5 overflow-hidden">
        {c.categories.map((cat, i) => (
          <div
            key={i}
            className="shrink-0 px-2.5 py-1 rounded-full text-[8.5px] font-semibold whitespace-nowrap"
            style={i === 0
              ? { background: "#239C55", color: "#fff" }
              : { background: "#fff", color: "#555", border: "1px solid #e5e7eb" }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="text-gray-800 text-[10px] font-bold">{c.sectionTitle}</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
      </div>

      {/* Store cards */}
      <div className="px-4 flex flex-col gap-2 flex-1 overflow-hidden">
        {c.stores.map((store, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
            <div
              className="h-14 flex items-center px-3 gap-2.5"
              style={{ background: i === 0
                ? "linear-gradient(135deg,#1E5C30,#2E8B57)"
                : "linear-gradient(135deg,#134E3A,#1B7A5A)" }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/20">
                {i === 0 ? "🍔" : "🛒"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-bold leading-none truncate">{store.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 text-[#FBBF24] fill-[#FBBF24]" />
                  <span className="text-white/80 text-[8px]">{store.rating} · {store.time} · {store.min}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="grid grid-cols-4 px-2 pb-3 pt-2 border-t border-gray-100 bg-white">
        {[
          { Icon: HomeIcon, label: c.navHome,    active: true  },
          { Icon: Search,   label: c.navSearch,  active: false },
          { Icon: Package,  label: c.navOrders,  active: false },
          { Icon: User,     label: c.navProfile, active: false },
        ].map(({ Icon, label, active }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <Icon className="w-3.5 h-3.5" style={{ color: active ? "#239C55" : "#9ca3af" }} />
            <span className="text-[7.5px]" style={{ color: active ? "#239C55" : "#9ca3af", fontWeight: active ? 700 : 400 }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreScreen({ c, isRTL }: { c: AppCopy; isRTL: boolean }) {
  return (
    <div className="h-full flex flex-col" style={{ background: "#F7F9F7" }} dir={isRTL ? "rtl" : "ltr"}>
      <div style={{ paddingTop: 28 }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
          <span className="text-gray-800 text-[11px] font-bold">{c.storeName}</span>
        </div>
        <div className="relative">
          <ShoppingCart className="w-4 h-4 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-[#239C55]">
            <span className="text-white text-[7px] font-bold">{c.cartItems}</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="mx-3 mb-2 h-[64px] rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg,#1E5C30,#2E8B57)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🍔</div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 text-[8.5px]">
            <Star className="w-2 h-2 text-[#FBBF24] fill-[#FBBF24]" />
            <span className="text-white font-bold">{c.storeRating}</span>
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 text-[8.5px]">
            <Clock className="w-2 h-2 text-white/80" />
            <span className="text-white">{c.storeTime}</span>
          </span>
        </div>
      </div>

      {/* Min order */}
      <div className="px-4 pb-1.5">
        <span className="text-[9px] text-gray-400">{c.storeMin}</span>
      </div>

      {/* Section label */}
      <div className="px-4 pb-1.5">
        <span className="text-gray-800 text-[10px] font-bold">{c.popular}</span>
      </div>

      {/* Item list */}
      <div className="px-3 flex flex-col gap-1.5 flex-1 overflow-hidden">
        {c.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
            <span className="text-xl shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-[10px] font-semibold truncate">{item.name}</p>
              <p className="text-[8px] truncate text-gray-400">{item.desc}</p>
            </div>
            <div className="flex flex-col items-end shrink-0 gap-1">
              <span className="text-[#239C55] text-[9px] font-bold whitespace-nowrap">{item.price}</span>
              <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#239C55]">
                <span className="text-white text-[12px] font-bold leading-none">+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart bar */}
      <div className="mx-3 mb-4 mt-2 px-3 py-2.5 rounded-2xl flex items-center justify-between bg-[#239C55]" style={{ boxShadow: "0 4px 16px rgba(35,156,85,0.35)" }}>
        <ShoppingCart className="w-3.5 h-3.5 text-white" />
        <span className="text-white text-[10px] font-bold">{c.cartBar}</span>
        <ChevronRight className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  );
}

function TrackingScreen({ c, isRTL }: { c: AppCopy; isRTL: boolean }) {
  const activeStep = 2;

  return (
    <div className="h-full flex flex-col" style={{ background: "#F7F9F7" }} dir={isRTL ? "rtl" : "ltr"}>
      <div style={{ paddingTop: 28 }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 pb-2">
        <ChevronLeft className="w-4 h-4 text-gray-500" />
        <div>
          <p className="text-[9px] text-gray-400">{c.ordersLabel}</p>
          <p className="text-gray-800 text-[11px] font-bold leading-none">{c.orderNo}</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="px-5 pb-4">
        <div className="relative flex items-start justify-between">
          <div className="absolute left-2.5 right-2.5 top-2.5 h-0.5 bg-gray-200" />
          <div
            className="absolute left-2.5 top-2.5 h-0.5 transition-all"
            style={{
              background: "#239C55",
              width: `${(activeStep / (c.steps.length - 1)) * (100 - 5)}%`,
            }}
          />
          {c.steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1 z-10" style={{ minWidth: 0 }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background:   i <= activeStep ? "#239C55" : "#fff",
                  border:       `2px solid ${i <= activeStep ? "#239C55" : "#d1d5db"}`,
                }}
              >
                {i < activeStep && <span className="text-white text-[8px]">✓</span>}
                {i === activeStep && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
              </div>
              <span
                className="text-[7.5px] text-center leading-tight"
                style={{ maxWidth: 36, color: i <= activeStep ? "#239C55" : "#9ca3af", fontWeight: i <= activeStep ? 600 : 400 }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver card */}
      <div className="mx-3 p-2.5 rounded-xl mb-2.5 flex items-center gap-3 bg-white border border-gray-100 shadow-sm">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xl bg-[#239C55]/10">
          🧑‍💼
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-[10px] font-bold">{c.driverName}</p>
          <p className="text-[8px] text-gray-400">{c.driverStatus}</p>
        </div>
        <span className="text-xl">🛵</span>
      </div>

      {/* Map visualisation */}
      <div className="mx-3 mb-2.5 rounded-xl overflow-hidden flex-1 relative bg-[#E8F5E9]" style={{ minHeight: 64 }}>
        <div className="absolute inset-0 opacity-30">
          {[1, 2, 3].map((n) => (
            <div key={n} className="absolute w-full border-t border-[#239C55]/40" style={{ top: `${n * 25}%` }} />
          ))}
          {[1, 2, 3].map((n) => (
            <div key={n} className="absolute h-full border-l border-[#239C55]/40" style={{ left: `${n * 25}%` }} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#C9A84C] shadow-sm" />
            {[0, 1, 2, 3].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#239C55]/60" />)}
            <span className="text-xl">🛵</span>
            {[0, 1].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#239C55]/30" />)}
            <div className="w-3 h-3 rounded-full bg-[#239C55] shadow-sm" />
          </div>
        </div>
      </div>

      {/* ETA + actions */}
      <div className="px-3 pb-4">
        <p className="text-gray-800 font-bold text-[11px] mb-2">⏱ {c.eta}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-gray-200">
            <PhoneIcon className="w-3 h-3 text-[#239C55]" />
            <span className="text-gray-700 text-[9px] font-semibold">{c.callBtn}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#239C55]/10 border border-[#239C55]/20">
            <MessageCircle className="w-3 h-3 text-[#239C55]" />
            <span className="text-[#239C55] text-[9px] font-semibold">{c.chatBtn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface PhoneAppMockupProps {
  size?:       "sm" | "lg";
  isRTL?:      boolean;
  lang?:       "en" | "ar";
  intervalMs?: number;
}

const SCREENS = [HomeScreen, StoreScreen, TrackingScreen];
const SCREEN_COUNT = SCREENS.length;

export function PhoneAppMockup({
  size       = "sm",
  isRTL      = false,
  lang       = "en",
  intervalMs = 3500,
}: PhoneAppMockupProps) {
  const [current,  setCurrent]  = useState(0);
  const [dir,      setDir]      = useState(1);
  const [animated, setAnimated] = useState(false);

  const c = COPY[lang];
  const width = size === "lg" ? 320 : 260;

  // After first paint, enable slide-in animations for subsequent screens
  useEffect(() => { setAnimated(true); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setCurrent((prev) => (prev + 1) % SCREEN_COUNT);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  function goTo(index: number) {
    setDir(index > current ? 1 : -1);
    setCurrent(index);
  }

  const Screen = SCREENS[current];

  return (
    <div style={{ width, aspectRatio: "9/16", position: "relative", flexShrink: 0 }}>
      {/* Outer glow ring */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: -4,
          borderRadius: "2.8rem",
          background: "radial-gradient(ellipse at center, rgba(35,156,85,0.4) 0%, rgba(35,156,85,0.15) 50%, transparent 75%)",
          zIndex: 0,
        }}
      />

      {/* Phone frame */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: "2.6rem",
          border: "2px solid rgba(255,255,255,0.25)",
          background: "#1A2E1F",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(35,156,85,0.2)",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30"
          style={{ width: 88, height: 22, background: "#000", borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}
        />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "2.6rem" }}>
          <AnimatePresence custom={dir} initial={false} mode="popLayout">
            <motion.div
              key={current}
              custom={dir}
              variants={screenVariants}
              initial={animated ? "enter" : false}
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Screen c={c} isRTL={isRTL} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
          {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? 18 : 6,
                height: 6,
                background: i === current ? "#239C55" : "rgba(0,0,0,0.2)",
              }}
              aria-label={`Screen ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
