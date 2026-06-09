import React, { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { useLang } from "@/context/LanguageContext";
import { ChevronRight } from "lucide-react";

const LEGAL_META: Record<string, { title: string; titleAr: string }> = {
  terms:    { title: "Terms & Conditions",  titleAr: "الشروط والأحكام" },
  privacy:  { title: "Privacy Policy",      titleAr: "سياسة الخصوصية" },
  cookies:  { title: "Cookie Policy",       titleAr: "سياسة الكوكيز" },
  security: { title: "Security",            titleAr: "الأمان" },
  faq:      { title: "FAQ",                 titleAr: "الأسئلة الشائعة" },
};

export default function LegalPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "terms";
  const { lang, isRTL } = useLang();
  const meta = LEGAL_META[slug];
  const [content, setContent] = useState<string | null>(null);
  const [contentAr, setContentAr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setContent(null);
    setContentAr(null);
    fetch(`/api/legal/${slug}`)
      .then((r) => r.json())
      .then((d: { content?: string; contentAr?: string }) => {
        setContent(d.content ?? "");
        setContentAr(d.contentAr ?? "");
      })
      .catch(() => { setContent(""); setContentAr(""); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg,#0B1F10,#0D1A11)" }}>
        <h1 className="text-2xl font-black text-white mb-4">Page not found</h1>
        <Link href="/" className="text-[#239C55] font-semibold hover:underline">← Back to home</Link>
      </div>
    );
  }

  const title = lang === "ar" ? meta.titleAr : meta.title;

  return (
    <div className={`fixed inset-0 flex flex-col ${isRTL ? "rtl" : "ltr"}`} style={{ background: "linear-gradient(170deg,#0B1F10 0%,#0D1A11 60%,#081208 100%)" }}>
      <Navbar />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

      {/* Header */}
      <div className="pt-10 pb-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F2D1C 0%,#1B4332 50%,#1a3a2a 100%)" }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle,rgba(35,156,85,0.15),transparent 70%)" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className={`flex items-center gap-2 text-white/40 text-sm mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span className="text-white/80">{title}</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">{title}</h1>
          <p className="text-white/40 text-sm">
            {lang === "ar" ? "آخر تحديث" : "Last updated"}:{" "}
            {new Date().toLocaleDateString(lang === "ar" ? "ar-BH" : "en-GB", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          {/* Quick nav between legal pages */}
          <div className={`flex flex-wrap gap-2 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            {Object.entries(LEGAL_META).map(([s, m]) => (
              <Link key={s} href={`/legal/${s}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${s === slug ? "text-white border-[#239C55]" : "text-white/40 border-white/10 hover:border-white/20 hover:text-white/60"}`}
                style={s === slug ? { background: "rgba(35,156,85,0.2)" } : { background: "rgba(255,255,255,0.03)" }}>
                {lang === "ar" ? m.titleAr : m.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: "linear-gradient(to right,transparent,rgba(35,156,85,0.3),transparent)" }} />

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-4 rounded animate-pulse ${i === 3 ? "w-3/4" : "w-full"}`} style={{ background: "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        ) : ((lang === "ar" ? contentAr : content) ?? "") !== "" ? (
          <div
            className={`max-w-none leading-relaxed whitespace-pre-wrap text-white/70 ${isRTL ? "text-right" : "text-left"}`}
            style={{ fontFamily: "inherit", fontSize: "1rem", lineHeight: "1.8" }}
          >
            {lang === "ar" ? (contentAr || content) : content}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="text-3xl">📄</span>
            </div>
            <h2 className="text-xl font-black text-white/60 mb-2">
              {lang === "ar" ? "المحتوى قادم قريباً" : "Content coming soon"}
            </h2>
            <p className="text-sm text-white/30">
              {lang === "ar" ? "هذه الصفحة قيد الإعداد." : "This page is being prepared. Check back soon."}
            </p>
          </div>
        )}
      </div>

      </div>{/* end scrollable body */}
      <CorpStrip />
    </div>
  );
}
