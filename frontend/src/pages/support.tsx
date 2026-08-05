import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import { useLang } from "@/context/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";

const CARDS = [
  {
    k: { en: "Fastest", ar: "الأسرع" },
    title: { en: "In-app chat", ar: "المحادثة داخل التطبيق" },
    desc: {
      en: "Open Yjeek and tap Support. Best for anything about an order in progress.",
      ar: "افتح يجيك واضغط الدعم. الأنسب لأي أمر يخص طلباً جارياً.",
    },
    sla: { en: "≤ 60 seconds", ar: "خلال 60 ثانية" },
  },
  {
    k: { en: "Email", ar: "البريد" },
    title: { en: "General support", ar: "الدعم العام" },
    desc: {
      en: "For account questions, refunds and anything you want in writing.",
      ar: "لأسئلة الحساب والاسترداد وأي أمر تريده كتابةً.",
    },
    email: "info@yjeektech.com",
    sla: { en: "Within 24 hours", ar: "خلال 24 ساعة" },
  },
  {
    k: { en: "Privacy", ar: "الخصوصية" },
    title: { en: "Data requests", ar: "طلبات البيانات" },
    desc: {
      en: "Access, correct or delete your personal data.",
      ar: "الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها.",
    },
    email: "privacy@yjeektech.com",
    sla: { en: "Within 30 days", ar: "خلال 30 يوماً" },
  },
  {
    k: { en: "Partners", ar: "الشركاء" },
    title: { en: "List your business", ar: "سجّل نشاطك التجاري" },
    desc: {
      en: "29 categories open. Onboarding takes 7 working days.",
      ar: "29 فئة متاحة. التسجيل يستغرق 7 أيام عمل.",
    },
    email: "vendors@yjeektech.com",
    sla: { en: "2 working days", ar: "يوما عمل" },
  },
] as const;

const CHANNELS = [
  {
    channel: { en: "In-app chat", ar: "محادثة التطبيق" },
    contact: { en: "Tap Support in the app", ar: "اضغط الدعم داخل التطبيق" },
    response: { en: "≤ 60 seconds", ar: "خلال 60 ثانية" },
  },
  {
    channel: { en: "General support", ar: "الدعم العام" },
    email: "info@yjeektech.com",
    response: { en: "Within 24 hours", ar: "خلال 24 ساعة" },
  },
  {
    channel: { en: "Vendor enquiries", ar: "استفسارات البائعين" },
    email: "vendors@yjeektech.com",
    response: { en: "2 working days", ar: "يوما عمل" },
  },
  {
    channel: { en: "Partner enquiries", ar: "استفسارات الشركاء" },
    email: "riders@yjeektech.com",
    response: { en: "2 working days", ar: "يوما عمل" },
  },
  {
    channel: { en: "Privacy & data", ar: "الخصوصية والبيانات" },
    email: "privacy@yjeektech.com",
    response: { en: "Within 30 days", ar: "خلال 30 يوماً" },
  },
] as const;

type FaqItem = {
  id: string;
  q: { en: string; ar: string };
  a: { en: React.ReactNode; ar: React.ReactNode };
};

export default function SupportPage() {
  const { lang, isRTL } = useLang();
  const ar = lang === "ar";
  const title = ar ? "الدعم" : "Support";

  const faqs: FaqItem[] = [
    {
      id: "late",
      q: { en: "My order is late. What happens?", ar: "طلبي تأخر. ماذا يحدث؟" },
      a: {
        en: "If your order arrives more than 15 minutes past its target time, Yjeek adds a goodwill credit to your Wallet automatically. You don't need to ask.",
        ar: "إذا وصل طلبك بعد أكثر من 15 دقيقة من الوقت المستهدف، يضيف يجيك رصيداً تعويضياً إلى محفظتك تلقائياً دون الحاجة لطلبه.",
      },
    },
    {
      id: "refund",
      q: { en: "How do I request a refund?", ar: "كيف أطلب استرداداً؟" },
      a: {
        en: (
          <>
            Tap <strong>Report an Issue</strong> in the app — that's the fastest route. For urgent
            matters use in-app chat. For detailed complaints, email{" "}
            <a href="mailto:info@yjeektech.com" className="text-[#239C55] hover:underline">
              info@yjeektech.com
            </a>
            .
          </>
        ),
        ar: (
          <>
            اضغط <strong>الإبلاغ عن مشكلة</strong> داخل التطبيق — وهي الطريقة الأسرع. للأمور
            العاجلة استخدم المحادثة داخل التطبيق. وللشكاوى المفصّلة راسلنا على{" "}
            <a href="mailto:info@yjeektech.com" className="text-[#239C55] hover:underline">
              info@yjeektech.com
            </a>
            .
          </>
        ),
      },
    },
    {
      id: "wallet",
      q: { en: "How does the Yjeek Wallet work?", ar: "كيف تعمل محفظة يجيك؟" },
      a: {
        en: "You earn credit on qualifying orders. Credit is spend-only — it can't be withdrawn as cash. Each earning expires 6 months from the date it was credited, and there's no minimum to redeem.",
        ar: "تكسب رصيداً على الطلبات المؤهلة. الرصيد للإنفاق فقط ولا يُسحب نقداً. تنتهي صلاحية كل رصيد بعد 6 أشهر من تاريخ إضافته، ولا يوجد حد أدنى للاستخدام.",
      },
    },
    {
      id: "delete",
      q: { en: "How do I delete my account?", ar: "كيف أحذف حسابي؟" },
      a: {
        en: (
          <>
            Request deletion from within the app, or email{" "}
            <a href="mailto:privacy@yjeektech.com" className="text-[#239C55] hover:underline">
              privacy@yjeektech.com
            </a>
            . We respond within 30 days. Transaction records are kept for 5 years as Bahraini
            commercial law requires. See the full guide on our{" "}
            <Link href="/account-deletion" className="text-[#239C55] hover:underline font-semibold">
              account deletion
            </Link>{" "}
            page.
          </>
        ),
        ar: (
          <>
            اطلب الحذف من داخل التطبيق أو راسل{" "}
            <a href="mailto:privacy@yjeektech.com" className="text-[#239C55] hover:underline">
              privacy@yjeektech.com
            </a>
            . نرد خلال 30 يوماً. تُحفظ سجلات المعاملات 5 سنوات وفق القانون التجاري البحريني.
            راجع الدليل الكامل في صفحة{" "}
            <Link href="/account-deletion" className="text-[#239C55] hover:underline font-semibold">
              حذف الحساب
            </Link>
            .
          </>
        ),
      },
    },
    {
      id: "partner",
      q: { en: "How do I join as a partner?", ar: "كيف أنضم كشريك؟" },
      a: {
        en: (
          <>
            Email{" "}
            <a href="mailto:riders@yjeektech.com" className="text-[#239C55] hover:underline">
              riders@yjeektech.com
            </a>
            . You'll need a valid ID, driving licence, vehicle registration, insurance, a
            smartphone, and an LMRA permit if you're not Bahraini.
          </>
        ),
        ar: (
          <>
            راسل{" "}
            <a href="mailto:riders@yjeektech.com" className="text-[#239C55] hover:underline">
              riders@yjeektech.com
            </a>
            . ستحتاج هوية سارية، رخصة قيادة، استمارة مركبة، تأمين، هاتف ذكي، وتصريح هيئة تنظيم
            سوق العمل لغير البحرينيين.
          </>
        ),
      },
    },
  ];

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
          <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
            <div
              className={`flex items-center gap-2 text-white/40 text-sm mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Link href="/" className="hover:text-white transition-colors">
                {ar ? "الرئيسية" : "Home"}
              </Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <span className="text-white/80">{title}</span>
            </div>
            <p
              className="text-[#239C55] text-xs font-semibold tracking-[0.14em] uppercase mb-3"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {title}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {ar ? "تحتاج مساعدة؟" : "Need a hand?"}
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl leading-relaxed">
              {ar
                ? "تواصل معنا بالطريقة التي تناسبك. كل قناة أدناه مُتابَعة، مع زمن الاستجابة الذي نلتزم به."
                : "Reach us the way that suits you. Every channel below is monitored, with the response time we hold ourselves to."}
            </p>
          </div>
        </div>

        <div className="h-px" style={{ background: "linear-gradient(to right,transparent,rgba(35,156,85,0.3),transparent)" }} />

        <main className="container mx-auto px-4 md:px-6 py-12 max-w-4xl space-y-14">
          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CARDS.map((card) => (
              <div
                key={card.k.en}
                className="rounded-xl p-5 transition-colors hover:border-[#239C55]/50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-[#239C55] text-[10px] font-medium tracking-[0.11em] uppercase mb-2.5"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {ar ? card.k.ar : card.k.en}
                </div>
                <h3 className="text-white font-semibold text-base mb-1.5">
                  {ar ? card.title.ar : card.title.en}
                </h3>
                <p className="text-white/45 text-sm mb-3 leading-relaxed">
                  {ar ? card.desc.ar : card.desc.en}
                </p>
                {"email" in card && card.email && (
                  <a
                    href={`mailto:${card.email}`}
                    className="text-[#239C55] text-sm font-semibold hover:underline break-all"
                  >
                    {card.email}
                  </a>
                )}
                <div
                  className="inline-block mt-3 text-[10px] tracking-wide text-white/55 px-2.5 py-1 rounded"
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    background: "rgba(35,156,85,0.12)",
                  }}
                >
                  {ar ? card.sla.ar : card.sla.en}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <section>
            <h2 className="text-white font-bold text-sm mb-4 pb-2.5 border-b-2 border-[#239C55] inline-block">
              {ar ? "الأسئلة الشائعة" : "Common questions"}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border rounded-lg px-4 border-white/10 data-[state=open]:border-[#239C55]/30"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <AccordionTrigger className="text-white font-semibold text-[15px] hover:no-underline hover:text-white/90 py-4">
                    {ar ? faq.q.ar : faq.q.en}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 text-[15px] leading-relaxed pb-4">
                    {ar ? faq.a.ar : faq.a.en}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Channels table */}
          <section>
            <h2 className="text-white font-bold text-sm mb-4 pb-2.5 border-b-2 border-[#239C55] inline-block">
              {ar ? "جميع القنوات" : "All channels"}
            </h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr style={{ background: "rgba(35,156,85,0.1)" }}>
                    <th
                      className={`px-3.5 py-2.5 text-white/45 font-medium text-[10px] tracking-wider uppercase whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}
                      style={{ fontFamily: "ui-monospace, monospace" }}
                    >
                      {ar ? "القناة" : "Channel"}
                    </th>
                    <th
                      className={`px-3.5 py-2.5 text-white/45 font-medium text-[10px] tracking-wider uppercase whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}
                      style={{ fontFamily: "ui-monospace, monospace" }}
                    >
                      {ar ? "جهة الاتصال" : "Contact"}
                    </th>
                    <th
                      className={`px-3.5 py-2.5 text-white/45 font-medium text-[10px] tracking-wider uppercase whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}
                      style={{ fontFamily: "ui-monospace, monospace" }}
                    >
                      {ar ? "زمن الاستجابة" : "Response time"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNELS.map((row) => (
                    <tr key={row.channel.en} className="border-t border-white/8">
                      <td className="px-3.5 py-3 text-white font-semibold align-top">
                        {ar ? row.channel.ar : row.channel.en}
                      </td>
                      <td className="px-3.5 py-3 text-white/55 align-top">
                        {"email" in row && row.email ? (
                          <a
                            href={`mailto:${row.email}`}
                            className="text-[#239C55] hover:underline break-all"
                          >
                            {row.email}
                          </a>
                        ) : (
                          ar ? row.contact!.ar : row.contact!.en
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-white/55 align-top">
                        {ar ? row.response.ar : row.response.en}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Escalation */}
          <section>
            <h2 className="text-white font-bold text-sm mb-4 pb-2.5 border-b-2 border-[#239C55] inline-block">
              {ar ? "إذا لم نحل المشكلة" : "If we don't resolve it"}
            </h2>
            <div
              className="rounded-lg p-5 md:px-6"
              style={{
                background: "rgba(35,156,85,0.08)",
                borderInlineStart: "3px solid #239C55",
              }}
            >
              <p className="text-white/65 text-[15px] leading-relaxed mb-3">
                {ar
                  ? "كل شكوى تُعالَج. وإذا لم تكن راضياً عن الحل، يمكنك التصعيد إلى إدارة حماية المستهلك بوزارة الصناعة والتجارة."
                  : "Every complaint is processed. If you're not satisfied with our resolution, you can escalate to the Consumer Protection Directorate at the Ministry of Industry and Commerce."}
              </p>
              <p className="text-white/65 text-[15px] leading-relaxed">
                <strong className="text-white/80">
                  {ar ? "وزارة الصناعة والتجارة:" : "MOIC:"}
                </strong>{" "}
                +973 17111 ·{" "}
                <a
                  href="https://www.moic.gov.bh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#239C55] hover:underline"
                >
                  www.moic.gov.bh
                </a>
              </p>
            </div>
          </section>

          {/* Company line + legal links */}
          <div className="pt-2 pb-6 border-t border-white/8 text-white/35 text-[13px] space-y-1.5">
            <p>
              {ar
                ? "Yjeek Technologies W.L.L (سجل تجاري 110111-3) · مبنى 2732، طريق 3649، مجمع 436، السيف، مملكة البحرين"
                : "Yjeek Technologies W.L.L (CR No. 110111-3) · Building 2732, Road 3649, Block 436, Al Seef, Kingdom of Bahrain"}
            </p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <a
                href="https://www.yjeektech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#239C55] hover:underline"
              >
                www.yjeektech.com
              </a>
              <span>·</span>
              <Link href="/legal/privacy" className="text-[#239C55] hover:underline">
                {ar ? "الخصوصية" : "Privacy"}
              </Link>
              <span>·</span>
              <Link href="/legal/terms" className="text-[#239C55] hover:underline">
                {ar ? "الشروط" : "Terms"}
              </Link>
            </p>
          </div>
        </main>
      </div>

      <CorpStrip />
    </div>
  );
}
