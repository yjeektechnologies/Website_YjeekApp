import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { useLang } from "@/context/LanguageContext";
import { ChevronRight } from "lucide-react";

export default function AboutPage() {
  const { lang, isRTL } = useLang();
  const [content, setContent] = useState<string | null>(null);
  const [contentAr, setContentAr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const title = lang === "ar" ? "من نحن" : "About Us";

  useEffect(() => {
    setLoading(true);
    fetch("/api/about")
      .then((r) => r.json())
      .then((d: { content?: string; contentAr?: string }) => {
        setContent(d.content ?? "");
        setContentAr(d.contentAr ?? "");
      })
      .catch(() => { setContent(""); setContentAr(""); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col ${isRTL ? "rtl" : "ltr"}`}
      style={{ background: "linear-gradient(170deg,#0B1F10 0%,#0D1A11 60%,#081208 100%)" }}
    >
      <Navbar />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

      {/* Header */}
      <div
        className="pt-10 pb-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0F2D1C 0%,#1B4332 50%,#1a3a2a 100%)" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle,rgba(35,156,85,0.15),transparent 70%)" }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className={`flex items-center gap-2 text-white/40 text-sm mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-white transition-colors">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span className="text-white/80">{title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{title}</h1>
          <p className="text-white/40 text-sm">
            {lang === "ar" ? "تعرّف أكثر على يجيك" : "Get to know Yjeek"}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-3xl">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 rounded-full bg-white/8" style={{ width: `${75 + (i % 3) * 10}%` }} />
            ))}
          </div>
        ) : ((lang === "ar" ? contentAr : content) ?? "") !== "" ? (
          <div
            className="prose prose-invert prose-lg max-w-none text-white/75 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: (lang === "ar" ? (contentAr || content) : content) ?? "" }}
          />
        ) : (
          <div className="text-center py-20">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ background: "rgba(35,156,85,0.12)", border: "1px solid rgba(35,156,85,0.2)" }}
            >
              <span className="text-3xl">🏢</span>
            </div>
            <p className="text-white/30 text-lg">
              {lang === "ar" ? "المحتوى قيد الإعداد" : "Content coming soon — check back shortly."}
            </p>
          </div>
        )}

      </main>

      </div>{/* end scrollable body */}
      <CorpStrip />
    </div>
  );
}
