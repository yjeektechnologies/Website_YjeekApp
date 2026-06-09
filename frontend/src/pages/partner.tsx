import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import {
  Store, Pill, Flower2, ShoppingCart, Zap, Package,
  CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, MapPin,
  ChevronDown, Building2, Star, TrendingUp
} from "lucide-react";

const BUSINESS_TYPES = [
  { icon: Store, label: "Restaurant / Café", value: "Restaurant / Café" },
  { icon: ShoppingCart, label: "Grocery Store", value: "Grocery Store" },
  { icon: Pill, label: "Pharmacy", value: "Pharmacy" },
  { icon: Flower2, label: "Flowers & Gifts", value: "Flowers & Gifts" },
  { icon: Zap, label: "Electronics", value: "Electronics" },
  { icon: Package, label: "Other Retail", value: "Other Retail" },
];

const BENEFITS = [
  { title: "Reach more customers", desc: "Tap into thousands of active Yjeek users in your city from day one." },
  { title: "Zero delivery headache", desc: "We handle the fleet, routing, and last-mile delivery — you focus on your products." },
  { title: "Real-time dashboard", desc: "Track every order, revenue, and customer rating from a single screen." },
  { title: "Dedicated account manager", desc: "A Yjeek partner success manager is always one call away." },
];

const CITIES = ["Manama", "Juffair", "Seef", "Riffa", "Muharraq", "Hamad Town", "Isa Town", "Sitra", "Dubai", "Abu Dhabi", "Riyadh", "Jeddah", "Kuwait City", "Doha", "Other"];

function MerchantScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#F7F9F7" }}>
      <div className="px-4 pt-8 pb-3 border-b border-black/6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#888" }}>Merchant App</span>
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#239C55" }}>
            <span className="text-white text-[8px] font-black">Y</span>
          </div>
        </div>
        <p className="font-bold text-sm leading-tight" style={{ color: "#111" }}>Good morning 👋</p>
        <p className="text-[9px]" style={{ color: "#888" }}>Al Reef Restaurant</p>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {[
          { label: "Today's Orders", value: "24", sub: "+18% vs yesterday", color: "#239C55" },
          { label: "Revenue", value: "BHD 142", sub: "3 pending payouts", color: "#C9A84C" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-2.5 border border-black/6 shadow-sm">
            <p className="text-[8px] mb-0.5" style={{ color: "#999" }}>{s.label}</p>
            <p className="font-black text-[13px]" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[7px] mt-0.5" style={{ color: "#aaa" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="px-3 mb-2">
        <p className="text-[8px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: "#aaa" }}>Live Orders</p>
        {[
          { id: "#2041", item: "2× Machboos Laham", status: "Ready", color: "#239C55" },
          { id: "#2040", item: "Chicken Burger Meal", status: "Pickup", color: "#C9A84C" },
          { id: "#2039", item: "Mixed Grill Special", status: "Delivered", color: "#4ade80" },
        ].map((o) => (
          <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-black/5">
            <div>
              <p className="text-[9px] font-semibold" style={{ color: "#222" }}>{o.id}</p>
              <p className="text-[8px]" style={{ color: "#999" }}>{o.item}</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: o.color }} />
              <span className="text-[8px] font-semibold" style={{ color: o.color }}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-3 rounded-xl p-2 flex items-center gap-2 bg-white shadow-sm border" style={{ borderColor: "rgba(35,156,85,0.2)" }}>
        <Star className="w-3 h-3" style={{ color: "#C9A84C" }} fill="currentColor" />
        <span className="font-black text-[11px]" style={{ color: "#C9A84C" }}>4.9</span>
        <span className="text-[8px]" style={{ color: "#999" }}>· 318 reviews this month</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10" style={{ background: "linear-gradient(to top, #F7F9F7, transparent)" }} />
    </div>
  );
}

function PhoneMockup3D() {
  return (
    <div style={{ perspective: "1200px" }} className="flex justify-center items-center">
      <motion.div
        animate={{ rotateY: [-6, 6, -6], rotateX: [3, -3, 3], y: [-8, 6, -8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="absolute -inset-6 rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse,rgba(35,156,85,0.25),transparent 70%)" }} />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-5 bg-black/50 blur-2xl rounded-full" />

        <div className="relative w-[240px] h-[490px] rounded-[44px] overflow-hidden border-2 border-white/15 shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)]" style={{ background: "#1A2E1F" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />
          <MerchantScreen />
          <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none rounded-[42px]" />
        </div>
      </motion.div>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#239C55] focus:ring-2 focus:ring-[#239C55]/20 transition-all";
const labelCls = "block text-sm font-semibold text-white/60 mb-1.5";

export default function PartnerPage() {
  const [form, setForm] = useState({
    businessName: "", contactName: "", email: "", phone: "",
    businessType: "", branches: "", city: "", message: "",
  });
  const [selectedType, setSelectedType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, businessType: selectedType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(170deg,#0B1F10 0%,#0D1A11 50%,#081208 100%)" }}>
      <Navbar />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0F2D1C 0%,#1B4332 40%,#2D6A4F 70%,#1a3a2a 100%)" }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(35,156,85,0.18),transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 mb-6">
                <Building2 className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-sm font-bold text-[#C9A84C] uppercase tracking-wider">Partner With Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Grow your business<br />
                <span className="text-[#C9A84C]">with Yjeek.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Join hundreds of merchants across Bahrain and the GCC who trust Yjeek to connect them with customers — faster than ever before.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { value: "500+", label: "Active Partners", sub: "across GCC" },
                  { value: "4 min", label: "Avg. Pickup", sub: "by our drivers" },
                  { value: "98%", label: "On-time Rate", sub: "last 30 days" },
                  { value: "24h", label: "Onboarding", sub: "from sign-up" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-4 backdrop-blur border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <p className="text-2xl font-black text-[#C9A84C] mb-0.5">{s.value}</p>
                    <p className="text-white font-semibold text-xs">{s.label}</p>
                    <p className="text-white/35 text-[11px]">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#239C55" }}>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm">{b.title}</span>
                      <span className="text-white/40 text-sm"> — {b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <PhoneMockup3D />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="h-1" style={{ background: "linear-gradient(to right,#239C55,#C9A84C,#239C55)" }} />

      {/* Form section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(35,156,85,0.15)" }}>
              <CheckCircle2 className="w-10 h-10 text-[#239C55]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Application Received!</h2>
            <p className="text-white/50 text-lg max-w-md mx-auto mb-8">
              Our sales team will review your enquiry and get back to you within <strong className="text-white">24 hours</strong>.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all" style={{ background: "#239C55" }}>
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-3">Tell us about your business</h2>
              <p className="text-white/40">Fill in the form below and our sales team will reach out to get you onboarded.</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-white/60 mb-3">Business Type <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUSINESS_TYPES.map((bt) => {
                    const Icon = bt.icon;
                    const active = selectedType === bt.value;
                    return (
                      <button key={bt.value} type="button" onClick={() => setSelectedType(bt.value)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${active ? "border-[#239C55] text-white" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        style={active ? { background: "rgba(35,156,85,0.12)" } : { background: "rgba(255,255,255,0.03)" }}>
                        <Icon className={`w-5 h-5 shrink-0 ${active ? "text-[#239C55]" : "text-white/30"}`} />
                        <span className="text-sm font-semibold leading-tight">{bt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/8 mb-8" />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Business Name <span className="text-red-400">*</span></label>
                  <input value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required
                    placeholder="Your business name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Contact Person <span className="text-red-400">*</span></label>
                  <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required
                    placeholder="Contact person's name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
                      placeholder="you@business.com" className={`${inputCls} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} required
                      placeholder="+973 3XXX XXXX" className={`${inputCls} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>City / Area <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <select value={form.city} onChange={(e) => set("city", e.target.value)} required
                      className={`${inputCls} pl-10 pr-10 appearance-none`} style={{ background: "rgba(255,255,255,0.05)", colorScheme: "dark" }}>
                      <option value="" className="bg-[#0D1F12]">Select city…</option>
                      {CITIES.map((c) => <option key={c} value={c} className="bg-[#0D1F12]">{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Number of Branches <span className="text-white/30 font-normal">optional</span></label>
                  <input value={form.branches} onChange={(e) => set("branches", e.target.value)}
                    placeholder="e.g. 3" className={inputCls} />
                </div>
              </div>

              <div className="mt-5">
                <label className={labelCls}>Additional Message <span className="text-white/30 font-normal">optional</span></label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4}
                  placeholder="Tell us more about your business, opening hours, or any questions you have…"
                  className={`${inputCls} resize-none`} />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>
              )}

              <button type="submit" disabled={submitting || !selectedType}
                className="mt-6 w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 text-base"
                style={{ background: submitting || !selectedType ? "rgba(35,156,85,0.5)" : "#239C55" }}>
                {submitting ? "Sending…" : "Submit Partner Application"}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-center text-white/25 text-xs mt-4">Our sales team will contact you at <strong className="text-white/40">{form.email || "your email"}</strong> within 24 hours.</p>
            </form>

            <p className="text-center text-white/25 text-xs mt-6">Our sales team is available 9am–6pm, Sunday–Thursday. We'll review and respond within 24 hours.</p>
          </>
        )}
      </div>

      </div>{/* end scrollable body */}
      <CorpStrip />
    </div>
  );
}
