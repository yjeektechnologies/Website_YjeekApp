import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { useLang } from "@/context/LanguageContext";
import { ChevronRight, Mail, Smartphone, Clock, FileText } from "lucide-react";

const STEPS = [
  {
    icon: Smartphone,
    title: { en: "Request in the app", ar: "اطلب من التطبيق" },
    desc: {
      en: "Open Yjeek, go to Support or account settings, and submit an account deletion request. This is the fastest path.",
      ar: "افتح يجيك، انتقل إلى الدعم أو إعدادات الحساب، وأرسل طلب حذف الحساب. هذه هي الطريقة الأسرع.",
    },
  },
  {
    icon: Mail,
    title: { en: "Or email us", ar: "أو راسلنا" },
    desc: {
      en: "Send your deletion request to privacy@yjeektech.com from the email linked to your account.",
      ar: "أرسل طلب الحذف إلى privacy@yjeektech.com من البريد المرتبط بحسابك.",
    },
  },
  {
    icon: Clock,
    title: { en: "We respond within 30 days", ar: "نرد خلال 30 يوماً" },
    desc: {
      en: "Every data and deletion request is processed within 30 days of receipt.",
      ar: "يُعالَج كل طلب بيانات أو حذف خلال 30 يوماً من استلامه.",
    },
  },
  {
    icon: FileText,
    title: { en: "What we retain", ar: "ما نحتفظ به" },
    desc: {
      en: "Transaction records are kept for 5 years as Bahraini commercial law requires. Personal profile data is deleted once processing is complete.",
      ar: "تُحفظ سجلات المعاملات 5 سنوات وفق القانون التجاري البحريني. تُحذف بيانات الملف الشخصي بعد اكتمال المعالجة.",
    },
  },
] as const;

export default function AccountDeletionPage() {
  const { lang, isRTL } = useLang();
  const ar = lang === "ar";
  const title = ar ? "حذف الحساب" : "Account deletion";

  return (
    <div
      className={`fixed inset-0 flex flex-col ${isRTL ? "rtl" : "ltr"}`}
      style={{ background: "linear-gradient(170deg,#0B1F10 0%,#0D1A11 60%,#081208 100%)" }}
    >
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div
          className="pt-10 pb-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0F2D1C 0%,#1B4332 50%,#1a3a2a 100%)" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle,rgba(35,156,85,0.15),transparent 70%)" }}
          />
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
            <div
              className={`flex items-center gap-2 text-white/40 text-sm mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Link href="/" className="hover:text-white transition-colors">
                {ar ? "الرئيسية" : "Home"}
              </Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <Link href="/support" className="hover:text-white transition-colors">
                {ar ? "الدعم" : "Support"}
              </Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <span className="text-white/80">{title}</span>
            </div>
            <p
              className="text-[#239C55] text-xs font-semibold tracking-[0.14em] uppercase mb-3"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {ar ? "الخصوصية" : "Privacy"}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{title}</h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
              {ar
                ? "اطلب حذف حساب يجيك من داخل التطبيق أو عبر البريد. نوضح أدناه الخطوات وما يحدث لبياناتك."
                : "Request deletion of your Yjeek account from the app or by email. Below is how it works and what happens to your data."}
            </p>
          </div>
        </div>

        <div className="h-px" style={{ background: "linear-gradient(to right,transparent,rgba(35,156,85,0.3),transparent)" }} />

        <main className="container mx-auto px-4 md:px-6 py-12 max-w-3xl space-y-10">
          <div className="space-y-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title.en}
                  className={`flex gap-4 rounded-xl p-5 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(35,156,85,0.12)",
                      border: "1px solid rgba(35,156,85,0.25)",
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#239C55]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      {ar ? step.title.ar : step.title.en}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {ar ? step.desc.ar : step.desc.en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-xl p-6 text-center"
            style={{
              background: "rgba(35,156,85,0.1)",
              border: "1px solid rgba(35,156,85,0.25)",
            }}
          >
            <p className="text-white/70 text-sm mb-4">
              {ar
                ? "جاهز لطلب حذف حسابك؟ راسل فريق الخصوصية:"
                : "Ready to request deletion? Email our privacy team:"}
            </p>
            <a
              href="mailto:privacy@yjeektech.com?subject=Account%20deletion%20request"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: "#239C55" }}
            >
              <Mail className="w-4 h-4" />
              privacy@yjeektech.com
            </a>
          </div>

          <p className="text-white/40 text-sm leading-relaxed">
            {ar ? (
              <>
                لمزيد من التفاصيل حول بياناتك، راجع{" "}
                <Link href="/legal/privacy" className="text-[#239C55] hover:underline">
                  سياسة الخصوصية
                </Link>
                . للمساعدة العامة، زر صفحة{" "}
                <Link href="/support" className="text-[#239C55] hover:underline">
                  الدعم
                </Link>
                .
              </>
            ) : (
              <>
                For more on how we handle your data, see our{" "}
                <Link href="/legal/privacy" className="text-[#239C55] hover:underline">
                  Privacy Policy
                </Link>
                . For general help, visit{" "}
                <Link href="/support" className="text-[#239C55] hover:underline">
                  Support
                </Link>
                .
              </>
            )}
          </p>
        </main>
      </div>

      <CorpStrip />
    </div>
  );
}
