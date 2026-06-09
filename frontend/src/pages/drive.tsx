import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { CorpStrip } from "@/components/corp-strip";
import {
  Bike, Car, Truck, CheckCircle2, ArrowRight, ArrowLeft,
  Phone, Mail, MapPin, ChevronDown,
  Clock, ShieldCheck, Banknote, Star, Navigation
} from "lucide-react";

const VEHICLES = [
  { icon: Bike, label: "Bicycle", value: "Bicycle" },
  { icon: Bike, label: "Motorbike", value: "Motorbike" },
  { icon: Car, label: "Car", value: "Car" },
  { icon: Truck, label: "Van / Pickup", value: "Van / Pickup" },
];

const EXPERIENCE_OPTIONS = [
  "Less than 6 months", "6 months – 1 year", "1–2 years", "2–5 years", "5+ years",
];

const PERKS = [
  { icon: Banknote, title: "Competitive Earnings", desc: "Earn per delivery + tips. Payments processed 2–3 times per month directly to your account." },
  { icon: Clock, title: "Flexible Hours", desc: "Work when you want. No minimum hours or shifts required." },
  { icon: ShieldCheck, title: "Dedicated Driver Support", desc: "Reach our driver support team anytime directly from the Yjeek driver app — we're always on standby." },
  { icon: Star, title: "Performance Rewards", desc: "Top drivers earn extra bonuses, priority dispatches, and monthly prizes." },
];

const CITIES = ["Manama", "Juffair", "Seef", "Riffa", "Muharraq", "Hamad Town", "Isa Town", "Sitra", "Dubai", "Abu Dhabi", "Riyadh", "Jeddah", "Kuwait City", "Doha", "Other"];

function DriverScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#F7F9F7" }}>
      <div className="px-4 pt-8 pb-2 border-b border-black/6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "#888" }}>Driver App</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#239C55] animate-pulse" />
            <span className="text-[9px] font-bold" style={{ color: "#239C55" }}>Online</span>
          </div>
        </div>
        <p className="font-bold text-sm" style={{ color: "#111" }}>Hey, Ahmed 👋</p>
        <p className="text-[9px]" style={{ color: "#888" }}>Manama · Active shift</p>
      </div>

      <div className="relative h-[140px] mx-3 mt-3 rounded-2xl overflow-hidden border border-black/6" style={{ background: "#E8F5EE" }}>
        <div className="absolute inset-0 opacity-30">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-sm"
              style={{ top: `${15 + i * 18}%`, left: `${5 + i * 12}%`, width: `${20 + i * 5}%`, height: "1px", background: "#239C55", transform: `rotate(${-10 + i * 5}deg)`, opacity: 0.4 }} />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ background: "#239C55" }}>
              <Navigation className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-[#239C55]/40 animate-ping" />
          </div>
        </div>
        <div className="absolute bottom-2 left-3 right-3">
          <div className="rounded-xl p-2 border border-black/8 flex items-center gap-2 bg-white shadow-sm">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.15)" }}>
              <MapPin className="w-3 h-3" style={{ color: "#C9A84C" }} />
            </div>
            <div>
              <p className="text-[9px] font-semibold" style={{ color: "#222" }}>Al Reef Restaurant → Block 338</p>
              <p className="text-[8px]" style={{ color: "#999" }}>2.4 km · Est. 8 min</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-3">
        {[
          { value: "12", sub: "deliveries", color: "#C9A84C" },
          { value: "BHD 38", sub: "today", color: "#239C55" },
          { value: "4.92", sub: "★ all-time", color: "#C9A84C" },
        ].map((s) => (
          <div key={s.sub} className="bg-white rounded-xl p-2 border border-black/6 text-center shadow-sm">
            <p className="font-black text-[11px]" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[7px] leading-tight mt-0.5" style={{ color: "#999" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mx-3 rounded-xl p-2.5 border flex items-center gap-2 bg-white shadow-sm" style={{ borderColor: "rgba(35,156,85,0.25)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>
          <Star className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} fill="currentColor" />
        </div>
        <div>
          <p className="text-[9px] font-bold" style={{ color: "#111" }}>Top Driver Bonus Active</p>
          <p className="text-[8px]" style={{ color: "#888" }}>+20% on next 5 deliveries</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10" style={{ background: "linear-gradient(to top, #F7F9F7, transparent)" }} />
    </div>
  );
}

function PhoneMockup3D() {
  return (
    <div style={{ perspective: "1200px" }} className="flex justify-center items-center">
      <motion.div
        animate={{ rotateY: [6, -6, 6], rotateX: [-3, 3, -3], y: [6, -8, 6] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="absolute -inset-6 rounded-full blur-3xl" style={{ background: "radial-gradient(ellipse,rgba(201,168,76,0.15),rgba(35,156,85,0.12),transparent 70%)" }} />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-5 bg-black/50 blur-2xl rounded-full" />
        <div className="relative w-[240px] h-[490px] rounded-[44px] overflow-hidden border-2 border-white/15 shadow-[0_40px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)]" style={{ background: "#1A2E1F" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />
          <DriverScreen />
          <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent pointer-events-none rounded-[42px]" />
        </div>
      </motion.div>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#239C55] focus:ring-2 focus:ring-[#239C55]/20 transition-all";
const labelCls = "block text-sm font-semibold text-white/60 mb-1.5";

export default function DrivePage() {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", city: "", experience: "", message: "",
  });
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vehicle: selectedVehicle }),
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
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] rounded-full blur-[140px]" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.10),transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 mb-6">
                <Car className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-sm font-bold text-[#C9A84C] uppercase tracking-wider">Drive with Yjeek</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                Deliver on your<br />
                <span className="text-[#C9A84C]">own schedule.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Join Yjeek's growing fleet of delivery partners and earn great money — on your own time, with your own vehicle.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { value: "BHD 5–15", label: "per hour avg." },
                  { value: "7 days", label: "a week, your call" },
                  { value: "< 24h", label: "onboarding time" },
                  { value: "2–3×", label: "monthly payouts" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-4 backdrop-blur border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <p className="text-2xl font-black text-[#C9A84C] mb-0.5">{s.value}</p>
                    <p className="text-white/50 text-xs font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {PERKS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="flex items-start gap-4 rounded-2xl p-4 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(35,156,85,0.2)" }}>
                        <Icon className="w-4 h-4 text-[#239C55]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm mb-0.5">{p.title}</p>
                        <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <PhoneMockup3D />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="h-1" style={{ background: "linear-gradient(to right,#239C55,#C9A84C,#239C55)" }} />

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(35,156,85,0.15)" }}>
              <CheckCircle2 className="w-10 h-10 text-[#239C55]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Application Submitted!</h2>
            <p className="text-white/50 text-lg max-w-md mx-auto mb-8">
              Our team will review your application and reach out within <strong className="text-white">48 hours</strong> to get you started.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all" style={{ background: "#239C55" }}>
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-3">Apply to drive with us</h2>
              <p className="text-white/40">Complete the form and we'll be in touch to get you started.</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-white/60 mb-3">Vehicle Type <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VEHICLES.map((v) => {
                    const Icon = v.icon;
                    const active = selectedVehicle === v.value;
                    return (
                      <button key={v.value} type="button" onClick={() => setSelectedVehicle(v.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${active ? "border-[#239C55]" : "border-white/10 hover:border-white/20"}`}
                        style={active ? { background: "rgba(35,156,85,0.12)" } : { background: "rgba(255,255,255,0.03)" }}>
                        <Icon className={`w-7 h-7 ${active ? "text-[#239C55]" : "text-white/30"}`} />
                        <span className={`text-sm font-semibold ${active ? "text-white" : "text-white/40"}`}>{v.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/8 mb-8" />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required
                    placeholder="Enter your full name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required
                      placeholder="you@email.com" className={`${inputCls} pl-10`} />
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
                <div className="md:col-span-2">
                  <label className={labelCls}>Delivery Experience <span className="text-white/30 font-normal">optional</span></label>
                  <div className="relative">
                    <select value={form.experience} onChange={(e) => set("experience", e.target.value)}
                      className={`${inputCls} pr-10 appearance-none`} style={{ background: "rgba(255,255,255,0.05)", colorScheme: "dark" }}>
                      <option value="" className="bg-[#0D1F12]">Select experience…</option>
                      {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o} className="bg-[#0D1F12]">{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <label className={labelCls}>Anything else we should know? <span className="text-white/30 font-normal">optional</span></label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={3}
                  placeholder="e.g. preferred working hours, areas you cover…"
                  className={`${inputCls} resize-none`} />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>
              )}

              <button type="submit" disabled={submitting || !selectedVehicle}
                className="mt-6 w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 text-base"
                style={{ background: submitting || !selectedVehicle ? "rgba(35,156,85,0.5)" : "#239C55" }}>
                {submitting ? "Submitting…" : "Apply to Drive with Yjeek"}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
              <p className="text-center text-white/25 text-xs mt-4">Our HR team will contact you at <strong className="text-white/40">{form.email || "your email"}</strong> within 48 hours.</p>
            </form>

            <p className="text-center text-white/25 text-xs mt-6">Our team will review your application and get back to you within 48 hours.</p>
          </>
        )}
      </div>

      </div>{/* end scrollable body */}
      <CorpStrip />
    </div>
  );
}
