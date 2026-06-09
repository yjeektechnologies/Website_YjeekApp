import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { invalidateSiteContent } from "@/hooks/useSiteContent";

type StepItem = { title: string; desc: string; aside: string };
type FeatureItem = { title: string; tag: string; desc: string };
type CategoryItem = { title: string; desc: string };
type PartnerSide = { title: string; desc: string; perks: string[]; cta: string };

interface ContentData {
  en: {
    nav: { howItWorks: string; partnerWithUs: string; becomeDriver: string; getTheApp: string };
    hero: { badge: string; headline1: string; headline2: string; subtext: string; cta: string; socialProof: string; driverBadge: string; driverMins: string; orderStatus: string; onTheWay: string };
    categories: { heading1: string; heading2: string; subtext: string; viewAll: string; getTheApp: string; items: Record<string, CategoryItem> };
    howItWorks: { badge: string; heading: string; subtext: string; step: string; steps: StepItem[] };
    features: { heading1: string; heading2: string; subtext: string; items: FeatureItem[] };
    appDownload: { heading1: string; heading2: string; subtext: string; stats: { restaurants: string; orders: string; cities: string } };
    partners: { heading: string; subtext: string; vendor: PartnerSide; driver: PartnerSide };
    testimonials: { heading: string; subtext: string };
    footer: { tagline: string; address: string; copyright: string };
  };
  ar: {
    nav: { howItWorks: string; partnerWithUs: string; becomeDriver: string; getTheApp: string };
    hero: { badge: string; headline1: string; headline2: string; subtext: string; cta: string; socialProof: string; driverBadge: string; driverMins: string; orderStatus: string; onTheWay: string };
    categories: { heading1: string; heading2: string; subtext: string; viewAll: string; getTheApp: string; items: Record<string, CategoryItem> };
    howItWorks: { badge: string; heading: string; subtext: string; step: string; steps: StepItem[] };
    features: { heading1: string; heading2: string; subtext: string; items: FeatureItem[] };
    appDownload: { heading1: string; heading2: string; subtext: string; stats: { restaurants: string; orders: string; cities: string } };
    partners: { heading: string; subtext: string; vendor: PartnerSide; driver: PartnerSide };
    testimonials: { heading: string; subtext: string };
    footer: { tagline: string; address: string; copyright: string };
  };
}

const DEFAULT: ContentData = {
  en: {
    nav: { howItWorks: "How it Works", partnerWithUs: "Partner With Us", becomeDriver: "Become a Driver", getTheApp: "Get the App" },
    hero: { badge: "Live right now in", headline1: "Your City.", headline2: "Delivered in Minutes.", subtext: "Hungry? Running low on groceries? Need flowers and forgot it was an anniversary? Whatever — we'll get it to your door, fast. Even at midnight. Now in {country}.", cta: "it's free. no catch. just download.", socialProof: "4.9★ · 100K+ people who didn't regret it", driverBadge: "Your driver is", driverMins: "4 mins away", orderStatus: "Your order", onTheWay: "On its way! 🎉" },
    categories: { heading1: "Name it.", heading2: "We deliver it.", subtext: "Food, groceries, flowers, gadgets, pet food, and honestly a lot more. If you can think of it at 11pm, we probably have it.", viewAll: "See everything we deliver", getTheApp: "Get the App", items: { food: { title: "Order Food", desc: "Your favourites, from round the corner or across town." }, groceries: { title: "Groceries", desc: "Fresh groceries in 15 minutes. No, really." }, flowers: { title: "Flowers", desc: "For someone special. Or yourself — we don't judge." }, electronics: { title: "Electronics", desc: "Tech that shows up when you actually need it." }, accessories: { title: "Accessories", desc: "Style delivered. Literally." }, pets: { title: "Pet Supplies", desc: "They didn't ask to be here. Treat them well." } } },
    howItWorks: { badge: "no, seriously. it's this easy.", heading: "ok, here's how it works", subtext: "You do three things. We handle everything else. Deal.", step: "Step", steps: [{ title: "Tell us where you are", desc: "Drop a pin. That's literally it. We'll figure out the fastest route, nearest store, and all the boring logistics.", aside: "(takes about 5 seconds)" }, { title: "Pick something (anything)", desc: "Hundreds of restaurants, groceries and shops. Scroll for 30 seconds. You'll want everything. Just pick something.", aside: "(warning: you will get hungry scrolling)" }, { title: "Watch it show up", desc: "Track your order on the map as it makes its way to you. It's oddly satisfying. Don't fight it.", aside: "(way faster than you expect)" }] },
    features: { heading1: "Sounds too good?", heading2: "It really is.", subtext: "We've quietly fixed all the annoying delivery problems — slow drivers, hidden fees, 'restaurant closed' at 9pm. You're welcome.", items: [{ title: "No more 'driver not found'", tag: "instant matching", desc: "We pair you with the nearest driver before you put your phone down. No queue, no retry, no frustration." }, { title: "Stalker mode (for your food)", tag: "live tracking", desc: "Watch your order move on the map, turn by turn. Yes, it's kind of addictive. No, we're not going to stop you." }, { title: "30 seconds to a driver", tag: "maybe 25", desc: "Actually less sometimes. The nearest driver gets your order the moment you tap confirm. You'll forget you were waiting." }, { title: "Sushi + Panadol in one order", tag: "one cart, one fee", desc: "Food, groceries, pharmacy — all in one cart, one delivery fee, one door. This used to require three separate apps." }, { title: "Your card info is safe with us", tag: "we're annoyingly serious about this", desc: "Payment data is encrypted end-to-end. We take security so seriously that talking about it is almost boring. Almost." }, { title: "2am and hungry? Same.", tag: "cloud kitchens, all night", desc: "We run kitchens specifically for people who get hungry at weird hours. You're not the only one. You're actually the target audience." }] },
    appDownload: { heading1: "Download once.", heading2: "Order forever.", subtext: "First order takes 2 minutes to set up. After that, your usual is literally one tap away. That's the whole pitch. We're done.", stats: { restaurants: "partner businesses", orders: "happy deliveries", cities: "cities & counting" } },
    partners: { heading: "Let's do this together —", subtext: "Got a restaurant? We bring you orders. Got a vehicle? We pay you to drive. Both are a pretty good deal, honestly.", vendor: { title: "Got a restaurant? Join us.", desc: "Stop giving 30% commission to the other guys. We're fair, we're growing fast, and we actually care if your business does well.", perks: ["Free to get started", "Real-time sales dashboard", "A support team that picks up"], cta: "Get listed today" }, driver: { title: "Drive with us. Earn more.", desc: "Set your own hours, pick your zone, and get paid well. Smart routing means more trips, less time driving in circles going nowhere.", perks: ["Competitive pay + tips on every order", "Paid 2–3 times a month, reliably", "In-app support that actually responds"], cta: "Start earning" } },
    testimonials: { heading: "Don't just take our word for it", subtext: "Rated 4.9★ by 100,000+ users. We're honestly a bit proud of that." },
    footer: { tagline: "Fast delivery, real people, zero drama. Born in Bahrain 🇧🇭, heading everywhere.", address: "Seef District,\nManama, Bahrain", copyright: "© {year} Yjeek Technologies. All rights reserved. · yjeektech.com" },
  },
  ar: {
    nav: { howItWorks: "كيف يعمل يجيك", partnerWithUs: "شراكة معنا", becomeDriver: "انضم كسائق", getTheApp: "حمّل التطبيق" },
    hero: { badge: "متاح الآن في", headline1: "مدينتك.", headline2: "توصيل خلال دقائق.", subtext: "جائع؟ محتاج بقالة؟ نسيت مناسبة وتحتاج زهور؟ مهما كان — نوصّله على بابك بسرعة. حتى نص الليل. نخدم {country} الآن.", cta: "مجاني. بدون أي شرط. بس حمّل.", socialProof: "٤.٩★ · أكثر من ١٠٠ ألف شخص ما ندموا", driverBadge: "السائق على بُعد", driverMins: "٤ دقائق", orderStatus: "طلبك", onTheWay: "في الطريق! 🎉" },
    categories: { heading1: "قوله.", heading2: "بنوصّله.", subtext: "طعام، بقالة، زهور، إلكترونيات، مستلزمات حيوانات، والكثير غيرها. لو خطر ببالك الساعة ١١ ليل، على الأرجح عندنا.", viewAll: "شوف كل خدماتنا", getTheApp: "حمّل التطبيق", items: { food: { title: "اطلب الطعام", desc: "من مطبخك المفضّل، قريب أو بعيد." }, groceries: { title: "البقالة", desc: "منتجات طازجة في ١٥ دقيقة. جدياً." }, flowers: { title: "الزهور", desc: "لشخص مميّز. أو لنفسك — ما في حكم." }, electronics: { title: "الإلكترونيات", desc: "تقنية تجيك لما تحتاجها بالضبط." }, accessories: { title: "الإكسسوارات", desc: "الأناقة توصل على بابك، حرفياً." }, pets: { title: "مستلزمات الحيوانات", desc: "ما اختاروا يجوا — دلّلهم." } } },
    howItWorks: { badge: "بصراحة، أسهل مما تتخيّل.", heading: "ثلاث خطوات، بس.", subtext: "أنت تسوّي ثلاثة أشياء. احنا نتكفّل بالباقي.", step: "الخطوة", steps: [{ title: "قولنا وين أنت", desc: "حدّد الموقع. بس هذا. احنا نحسب أسرع طريق، أقرب محل، وكل التفاصيل الثانية.", aside: "(يأخذ حوالي ٥ ثوانٍ)" }, { title: "اختار اللي تبيه", desc: "مئات المطاعم والمحلات. تصفّح ٣٠ ثانية. بتحب كل شيء. بس اختار شيء.", aside: "(تحذير: بتجوع وأنت تتصفّح)" }, { title: "شاهده يوصل", desc: "تابع طلبك على الخريطة وهو في طريقه إليك. ممتع بشكل غريب. ما تقاومه.", aside: "(أسرع مما تتوقع دائماً)" }] },
    features: { heading1: "يبدو جيداً جداً؟", heading2: "هو كذلك فعلاً.", subtext: "حلّينا كل مشاكل التوصيل المزعجة — سائقين بطيئين، رسوم مخفية، مطاعم 'مغلقة' في التاسعة مساءً. عفواً على الانتظار.", items: [{ title: "لا مزيد من 'ما في سائق'", tag: "مطابقة فورية", desc: "نربطك بأقرب سائق قبل ما تحط هاتفك. بدون طابور، بدون إعادة محاولة، بدون إزعاج." }, { title: "وضع التتبّع (لطلبك)", tag: "تتبّع مباشر", desc: "شوف طلبك يتحرك على الخريطة منعطف بمنعطف. آه، إنه مسلٍّ. لا تحاول تقاومه." }, { title: "سائق خلال ٣٠ ثانية", tag: "أحياناً أقل", desc: "أقرب سائق يستلم طلبك فور ما تضغط تأكيد. مش هتحس إنك انتظرت." }, { title: "سوشي + دواء في طلب واحد", tag: "سلة واحدة، رسوم واحدة", desc: "طعام، بقالة، صيدلية — في سلة واحدة، رسوم توصيل واحدة، باب واحد. قبل كان يحتاج ثلاث تطبيقات." }, { title: "بياناتك الآمنة، مضمونة", tag: "نأخذها بجدية مزعجة", desc: "معلومات الدفع مشفّرة من الطرفين. اهتمامنا بالأمان أصبح شبه ممل من كثرته. تقريباً." }, { title: "جوعان نص الليل؟ احنا كذلك.", tag: "مطابخ سحابية، طوال الليل", desc: "عندنا مطابخ تشتغل طول الليل لهالأشخاص بالضبط. أنت مش الوحيد. أنت في الواقع عميلنا المثالي." }] },
    appDownload: { heading1: "حمّل مرة.", heading2: "اطلب دايماً.", subtext: "الطلب الأول يأخذ دقيقتين للإعداد. بعدها، طلبك المعتاد بلمسة واحدة. هذا كل شيء. ما عندنا أكثر.", stats: { restaurants: "شريك تجاري", orders: "توصيلة ناجحة", cities: "مدينة وبنكمّل" } },
    partners: { heading: "نكبر سوا —", subtext: "عندك مطعم؟ نجيبلك طلبات. عندك سيارة؟ ندفع لك عليها. الاثنتين صفقة جيدة، صراحةً.", vendor: { title: "عندك مطعم؟ انضم.", desc: "بطّل تدفع عمولة ٣٠٪ للتطبيقات الثانية. نحن عادلين، نكبر بسرعة، ويهمنا فعلاً إن مشروعك ينجح.", perks: ["مجاناً للبداية", "لوحة مبيعات مباشرة", "فريق دعم يرد فعلاً"], cta: "انضم اليوم" }, driver: { title: "اشتغل معنا. اكسب أكثر.", desc: "اختار وقتك، اختار منطقتك، وادفع بشكل جيد. التوجيه الذكي يعني رحلات أكثر ووقت ضائع أقل.", perks: ["أجر تنافسي + إكراميات على كل طلب", "دفعات ٢–٣ مرات شهرياً بانتظام", "دعم داخل التطبيق يستجيب فعلاً"], cta: "ابدأ الكسب" } },
    testimonials: { heading: "لا تأخذ كلامنا فقط", subtext: "تقييم ٤.٩★ من أكثر من ١٠٠,٠٠٠ مستخدم. فخورون بهذا بصدق." },
    footer: { tagline: "توصيل سريع، أناس حقيقيون، بلا تعقيدات. من البحرين 🇧🇭، في طريقنا لكل مكان.", address: "منطقة سيف،\nالمنامة، البحرين", copyright: "© {year} يجيك تكنولوجيز. جميع الحقوق محفوظة. · yjeektech.com" },
  },
};

function deepMergeContent(base: ContentData, override: Partial<ContentData>): ContentData {
  return JSON.parse(JSON.stringify({ ...base, en: { ...base.en, ...override.en }, ar: { ...base.ar, ...override.ar } }));
}

const INPUT = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 text-sm text-gray-900 bg-white transition-all";
const TEXTAREA = `${INPUT} resize-y min-h-[72px]`;

function Row({ label, hint, enVal, arVal, onEn, onAr, multiline = false }: {
  label: string; hint?: string;
  enVal: string; arVal: string;
  onEn: (v: string) => void; onAr: (v: string) => void;
  multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-[160px_1fr_1fr] gap-3 items-start py-3 border-b border-gray-50 last:border-0">
      <div className="pt-2">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</p>
        {hint && <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{hint}</p>}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><span>🇬🇧</span> English</p>
        <Tag
          value={enVal} onChange={e => onEn(e.currentTarget.value)}
          className={multiline ? TEXTAREA : INPUT}
          {...(!multiline ? { type: "text" } : {})}
        />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><span>🇧🇭</span> عربي</p>
        <Tag
          value={arVal} onChange={e => onAr(e.currentTarget.value)}
          dir="rtl" className={`${multiline ? TEXTAREA : INPUT} text-right`}
          {...(!multiline ? { type: "text" } : {})}
        />
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 mt-6 first:mt-0">{children}</h3>;
}

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl mb-2 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pt-1 pb-3">{children}</div>}
    </div>
  );
}

const CAT_LABELS: Record<string, string> = { food: "Food", groceries: "Groceries", flowers: "Flowers", electronics: "Electronics", accessories: "Accessories", pets: "Pet Supplies" };

const SECTIONS = [
  { id: "hero",         icon: "🏠", label: "Hero" },
  { id: "categories",  icon: "📦", label: "Categories" },
  { id: "howItWorks",  icon: "👣", label: "How It Works" },
  { id: "features",    icon: "⚡", label: "Features" },
  { id: "appDownload", icon: "📱", label: "App Download" },
  { id: "partners",    icon: "🤝", label: "Partners" },
  { id: "testimonials",icon: "⭐", label: "Reviews" },
  { id: "nav",         icon: "🔗", label: "Navigation" },
  { id: "footer",      icon: "📄", label: "Footer" },
];

export function ContentEditor({ token, onNotify }: { token: string; onNotify: (t: "success" | "error", m: string) => void }) {
  const [content, setContent] = useState<ContentData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    fetch("/api/admin/site-content", { headers: { "x-admin-token": token } })
      .then(r => r.json())
      .then(d => { if (d.content) setContent(deepMergeContent(DEFAULT, d.content)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "x-admin-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("save failed");
      onNotify("success", "Content saved! Changes are live.");
      invalidateSiteContent();
    } catch {
      onNotify("error", "Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  function setStr(lang: "en" | "ar", ...path: string[]) {
    return (value: string) =>
      setContent(prev => {
        const next: ContentData = JSON.parse(JSON.stringify(prev));
        let obj: Record<string, unknown> = next[lang] as never;
        for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]] as never;
        obj[path[path.length - 1]] = value;
        return next;
      });
  }

  function setArrItem(lang: "en" | "ar", section: string, arrKey: string, idx: number, field: string) {
    return (value: string) =>
      setContent(prev => {
        const next: ContentData = JSON.parse(JSON.stringify(prev));
        const arr = ((next[lang] as never as Record<string, Record<string, unknown[]>>)[section][arrKey]);
        (arr[idx] as Record<string, string>)[field] = value;
        return next;
      });
  }

  function setPerks(lang: "en" | "ar", side: "vendor" | "driver") {
    return (value: string) =>
      setContent(prev => {
        const next: ContentData = JSON.parse(JSON.stringify(prev));
        next[lang].partners[side].perks = value.split("\n").map(s => s.trim()).filter(Boolean);
        return next;
      });
  }

  const en = content.en;
  const ar = content.ar;

  function row(label: string, enVal: string, arVal: string, onEn: (v: string) => void, onAr: (v: string) => void, hint?: string, multi?: boolean) {
    return <Row key={label} label={label} hint={hint} enVal={enVal} arVal={arVal} onEn={onEn} onAr={onAr} multiline={multi} />;
  }

  const sections: Record<string, React.ReactNode> = {
    hero: (<>
      <SectionHeader>Hero Slide</SectionHeader>
      {row("Badge", en.hero.badge, ar.hero.badge, setStr("en","hero","badge"), setStr("ar","hero","badge"))}
      {row("Headline 1", en.hero.headline1, ar.hero.headline1, setStr("en","hero","headline1"), setStr("ar","hero","headline1"))}
      {row("Headline 2", en.hero.headline2, ar.hero.headline2, setStr("en","hero","headline2"), setStr("ar","hero","headline2"))}
      {row("Subtext", en.hero.subtext, ar.hero.subtext, setStr("en","hero","subtext"), setStr("ar","hero","subtext"), "Use {country} as placeholder for the country name", true)}
      {row("CTA label", en.hero.cta, ar.hero.cta, setStr("en","hero","cta"), setStr("ar","hero","cta"))}
      {row("Social proof", en.hero.socialProof, ar.hero.socialProof, setStr("en","hero","socialProof"), setStr("ar","hero","socialProof"))}
      <SectionHeader>Driver Badge</SectionHeader>
      {row("Badge prefix", en.hero.driverBadge, ar.hero.driverBadge, setStr("en","hero","driverBadge"), setStr("ar","hero","driverBadge"))}
      {row("ETA text", en.hero.driverMins, ar.hero.driverMins, setStr("en","hero","driverMins"), setStr("ar","hero","driverMins"))}
      {row("Order label", en.hero.orderStatus, ar.hero.orderStatus, setStr("en","hero","orderStatus"), setStr("ar","hero","orderStatus"))}
      {row("On the way", en.hero.onTheWay, ar.hero.onTheWay, setStr("en","hero","onTheWay"), setStr("ar","hero","onTheWay"))}
    </>),

    categories: (<>
      <SectionHeader>Section Header</SectionHeader>
      {row("Heading 1", en.categories.heading1, ar.categories.heading1, setStr("en","categories","heading1"), setStr("ar","categories","heading1"))}
      {row("Heading 2", en.categories.heading2, ar.categories.heading2, setStr("en","categories","heading2"), setStr("ar","categories","heading2"))}
      {row("Subtext", en.categories.subtext, ar.categories.subtext, setStr("en","categories","subtext"), setStr("ar","categories","subtext"), undefined, true)}
      {row("View All btn", en.categories.viewAll, ar.categories.viewAll, setStr("en","categories","viewAll"), setStr("ar","categories","viewAll"))}
      {row("Get App btn", en.categories.getTheApp, ar.categories.getTheApp, setStr("en","categories","getTheApp"), setStr("ar","categories","getTheApp"))}
      <SectionHeader>Category Items</SectionHeader>
      {Object.entries(CAT_LABELS).map(([key, label]) => (
        <Collapsible key={key} title={`${label}`}>
          {row("Title", en.categories.items[key]?.title ?? "", ar.categories.items[key]?.title ?? "", setStr("en","categories","items",key,"title"), setStr("ar","categories","items",key,"title"))}
          {row("Description", en.categories.items[key]?.desc ?? "", ar.categories.items[key]?.desc ?? "", setStr("en","categories","items",key,"desc"), setStr("ar","categories","items",key,"desc"), undefined, true)}
        </Collapsible>
      ))}
    </>),

    howItWorks: (<>
      <SectionHeader>Section Header</SectionHeader>
      {row("Badge", en.howItWorks.badge, ar.howItWorks.badge, setStr("en","howItWorks","badge"), setStr("ar","howItWorks","badge"))}
      {row("Heading", en.howItWorks.heading, ar.howItWorks.heading, setStr("en","howItWorks","heading"), setStr("ar","howItWorks","heading"))}
      {row("Subtext", en.howItWorks.subtext, ar.howItWorks.subtext, setStr("en","howItWorks","subtext"), setStr("ar","howItWorks","subtext"), undefined, true)}
      {row("Step label", en.howItWorks.step, ar.howItWorks.step, setStr("en","howItWorks","step"), setStr("ar","howItWorks","step"))}
      <SectionHeader>Steps</SectionHeader>
      {en.howItWorks.steps.map((_, i) => (
        <Collapsible key={i} title={`Step ${i + 1}`}>
          {row("Title", en.howItWorks.steps[i].title, ar.howItWorks.steps[i].title, setArrItem("en","howItWorks","steps",i,"title"), setArrItem("ar","howItWorks","steps",i,"title"))}
          {row("Description", en.howItWorks.steps[i].desc, ar.howItWorks.steps[i].desc, setArrItem("en","howItWorks","steps",i,"desc"), setArrItem("ar","howItWorks","steps",i,"desc"), undefined, true)}
          {row("Aside note", en.howItWorks.steps[i].aside, ar.howItWorks.steps[i].aside, setArrItem("en","howItWorks","steps",i,"aside"), setArrItem("ar","howItWorks","steps",i,"aside"))}
        </Collapsible>
      ))}
    </>),

    features: (<>
      <SectionHeader>Section Header</SectionHeader>
      {row("Heading 1", en.features.heading1, ar.features.heading1, setStr("en","features","heading1"), setStr("ar","features","heading1"))}
      {row("Heading 2", en.features.heading2, ar.features.heading2, setStr("en","features","heading2"), setStr("ar","features","heading2"))}
      {row("Subtext", en.features.subtext, ar.features.subtext, setStr("en","features","subtext"), setStr("ar","features","subtext"), undefined, true)}
      <SectionHeader>Feature Cards</SectionHeader>
      {en.features.items.map((_, i) => (
        <Collapsible key={i} title={`Feature ${i + 1}: ${en.features.items[i].title}`}>
          {row("Title", en.features.items[i].title, ar.features.items[i].title, setArrItem("en","features","items",i,"title"), setArrItem("ar","features","items",i,"title"))}
          {row("Tag/badge", en.features.items[i].tag, ar.features.items[i].tag, setArrItem("en","features","items",i,"tag"), setArrItem("ar","features","items",i,"tag"))}
          {row("Description", en.features.items[i].desc, ar.features.items[i].desc, setArrItem("en","features","items",i,"desc"), setArrItem("ar","features","items",i,"desc"), undefined, true)}
        </Collapsible>
      ))}
    </>),

    appDownload: (<>
      <SectionHeader>Section Header</SectionHeader>
      {row("Heading 1", en.appDownload.heading1, ar.appDownload.heading1, setStr("en","appDownload","heading1"), setStr("ar","appDownload","heading1"))}
      {row("Heading 2", en.appDownload.heading2, ar.appDownload.heading2, setStr("en","appDownload","heading2"), setStr("ar","appDownload","heading2"))}
      {row("Subtext", en.appDownload.subtext, ar.appDownload.subtext, setStr("en","appDownload","subtext"), setStr("ar","appDownload","subtext"), undefined, true)}
      <SectionHeader>Stats Labels</SectionHeader>
      {row("Partners label", en.appDownload.stats.restaurants, ar.appDownload.stats.restaurants, setStr("en","appDownload","stats","restaurants"), setStr("ar","appDownload","stats","restaurants"))}
      {row("Deliveries label", en.appDownload.stats.orders, ar.appDownload.stats.orders, setStr("en","appDownload","stats","orders"), setStr("ar","appDownload","stats","orders"))}
      {row("Cities label", en.appDownload.stats.cities, ar.appDownload.stats.cities, setStr("en","appDownload","stats","cities"), setStr("ar","appDownload","stats","cities"))}
    </>),

    partners: (<>
      <SectionHeader>Section Header</SectionHeader>
      {row("Heading", en.partners.heading, ar.partners.heading, setStr("en","partners","heading"), setStr("ar","partners","heading"))}
      {row("Subtext", en.partners.subtext, ar.partners.subtext, setStr("en","partners","subtext"), setStr("ar","partners","subtext"), undefined, true)}
      <SectionHeader>Restaurant Partner Card</SectionHeader>
      {row("Title", en.partners.vendor.title, ar.partners.vendor.title, setStr("en","partners","vendor","title"), setStr("ar","partners","vendor","title"))}
      {row("Description", en.partners.vendor.desc, ar.partners.vendor.desc, setStr("en","partners","vendor","desc"), setStr("ar","partners","vendor","desc"), undefined, true)}
      <Row label="Perks" hint="One per line" enVal={en.partners.vendor.perks.join("\n")} arVal={ar.partners.vendor.perks.join("\n")} onEn={setPerks("en","vendor")} onAr={setPerks("ar","vendor")} multiline />
      {row("CTA button", en.partners.vendor.cta, ar.partners.vendor.cta, setStr("en","partners","vendor","cta"), setStr("ar","partners","vendor","cta"))}
      <SectionHeader>Driver Partner Card</SectionHeader>
      {row("Title", en.partners.driver.title, ar.partners.driver.title, setStr("en","partners","driver","title"), setStr("ar","partners","driver","title"))}
      {row("Description", en.partners.driver.desc, ar.partners.driver.desc, setStr("en","partners","driver","desc"), setStr("ar","partners","driver","desc"), undefined, true)}
      <Row label="Perks" hint="One per line" enVal={en.partners.driver.perks.join("\n")} arVal={ar.partners.driver.perks.join("\n")} onEn={setPerks("en","driver")} onAr={setPerks("ar","driver")} multiline />
      {row("CTA button", en.partners.driver.cta, ar.partners.driver.cta, setStr("en","partners","driver","cta"), setStr("ar","partners","driver","cta"))}
    </>),

    testimonials: (<>
      <SectionHeader>Section Header</SectionHeader>
      <p className="text-sm text-gray-500 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">Individual reviews are managed in the <strong>Reviews</strong> tab. Only the section headings are edited here.</p>
      {row("Heading", en.testimonials.heading, ar.testimonials.heading, setStr("en","testimonials","heading"), setStr("ar","testimonials","heading"))}
      {row("Subtext", en.testimonials.subtext, ar.testimonials.subtext, setStr("en","testimonials","subtext"), setStr("ar","testimonials","subtext"), undefined, true)}
    </>),

    nav: (<>
      <SectionHeader>Navigation Labels</SectionHeader>
      {row("How it Works", en.nav.howItWorks, ar.nav.howItWorks, setStr("en","nav","howItWorks"), setStr("ar","nav","howItWorks"))}
      {row("Partner With Us", en.nav.partnerWithUs, ar.nav.partnerWithUs, setStr("en","nav","partnerWithUs"), setStr("ar","nav","partnerWithUs"))}
      {row("Become a Driver", en.nav.becomeDriver, ar.nav.becomeDriver, setStr("en","nav","becomeDriver"), setStr("ar","nav","becomeDriver"))}
      {row("Get the App btn", en.nav.getTheApp, ar.nav.getTheApp, setStr("en","nav","getTheApp"), setStr("ar","nav","getTheApp"))}
    </>),

    footer: (<>
      <SectionHeader>Footer Content</SectionHeader>
      {row("Tagline", en.footer.tagline, ar.footer.tagline, setStr("en","footer","tagline"), setStr("ar","footer","tagline"), undefined, true)}
      {row("Address", en.footer.address, ar.footer.address, setStr("en","footer","address"), setStr("ar","footer","address"), undefined, true)}
      {row("Copyright", en.footer.copyright, ar.footer.copyright, setStr("en","footer","copyright"), setStr("ar","footer","copyright"), "Use {year} as placeholder for the current year")}
    </>),
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Content Editor</h1>
          <p className="text-gray-500 text-sm">Edit all website text in English and Arabic side by side.</p>
        </div>
        <button onClick={handleSave} disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-sm font-bold disabled:opacity-60 shadow-md whitespace-nowrap transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>
      ) : (
        <div className="flex gap-6">
          <nav className="hidden lg:flex flex-col gap-1 shrink-0 w-44">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${activeSection === s.id ? "bg-[#4CAF50]/10 text-[#388E3C]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </nav>

          <select className="lg:hidden mb-4 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#4CAF50]" value={activeSection} onChange={e => setActiveSection(e.target.value)}>
            {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          </select>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-[160px_1fr_1fr] gap-3 mb-3 pb-2 border-b border-gray-100">
                <div />
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <Globe className="w-3.5 h-3.5" /> English
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <Globe className="w-3.5 h-3.5" /> العربية
                </div>
              </div>
              {sections[activeSection]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
