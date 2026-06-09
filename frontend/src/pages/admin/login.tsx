import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

type Mode = "login" | "forgot" | "otp";

export default function AdminLogin() {
  const { login, token } = useAdminAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");

  // Login form
  const [email, setEmail] = useState("admin@yjeektech.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP form
  const [otpEmail, setOtpEmail] = useState("admin@yjeektech.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpSuccess, setOtpSuccess] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (token) setLocation("/admin/dashboard");
  }, [token]);

  useEffect(() => {
    if (!otpExpiry) return;
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((otpExpiry - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0 && timerRef.current) clearInterval(timerRef.current);
    }, 200);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [otpExpiry]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setLocation("/admin/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      setOtpExpiry(Date.now() + 30000);
      setTimeLeft(30);
      setMode("otp");
    } catch (err: any) {
      setError(err.message ?? "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (timeLeft === 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSuccess("Password reset! Update the ADMIN_PASSWORD_HASH secret in your environment settings, then log in.");
    } catch (err: any) {
      setError(err.message ?? "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #1a3a2a 100%)" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#4CAF50]/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-2">
          <img
            src="/yjeek-logo-transparent.png"
            alt="Yjeek"
            className="h-14 w-auto object-contain"
            style={{ maxWidth: 200, filter: "brightness(0) invert(1)" }}
          />
          <span className="text-white/40 text-sm font-medium tracking-widest uppercase">Admin Portal</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
                <p className="text-gray-500 text-sm">Sign in to manage your launches</p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <button
                onClick={() => { setMode("forgot"); setError(""); }}
                className="w-full mt-5 text-sm text-[#4CAF50] hover:text-[#388E3C] font-medium text-center"
              >
                Forgot password? Reset via OTP
              </button>
            </>
          )}

          {/* ── FORGOT (request OTP) ── */}
          {mode === "forgot" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-1">Reset Password</h1>
                <p className="text-gray-500 text-sm">A 6-digit code will be sent to your admin email. It expires in <strong>30 seconds</strong>.</p>
              </div>

              <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Admin email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send OTP"}
                </button>
              </form>

              <button
                onClick={() => { setMode("login"); setError(""); }}
                className="w-full mt-5 text-sm text-gray-400 hover:text-gray-600 font-medium text-center"
              >
                ← Back to login
              </button>
            </>
          )}

          {/* ── OTP VERIFY ── */}
          {mode === "otp" && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <h1 className="text-2xl font-black text-gray-900">Enter OTP</h1>
                </div>
                <p className="text-gray-500 text-sm">Check <strong>{otpEmail}</strong> for your 6-digit code.</p>
              </div>

              {/* Countdown ring */}
              <div className="flex justify-center mb-6">
                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 font-black text-2xl transition-colors ${
                  timeLeft > 10 ? "border-[#4CAF50] text-[#4CAF50]" : timeLeft > 0 ? "border-amber-400 text-amber-500" : "border-red-300 text-red-400"
                }`}>
                  {timeLeft}
                  <span className="text-xs font-medium opacity-60">sec</span>
                </div>
              </div>

              {timeLeft === 0 ? (
                <div className="text-center">
                  <p className="text-red-500 text-sm mb-4 font-medium">OTP expired.</p>
                  <button
                    onClick={() => { setMode("forgot"); setOtpSent(false); setOtp(""); setError(""); }}
                    className="flex items-center gap-2 mx-auto text-[#4CAF50] font-semibold text-sm hover:text-[#388E3C]"
                  >
                    <RefreshCw className="w-4 h-4" /> Request new OTP
                  </button>
                </div>
              ) : otpSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-4 text-sm leading-relaxed">
                  ✅ {otpSuccess}
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">6-digit OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center text-3xl font-black tracking-[1rem] py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900"
                      placeholder="------"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 transition-all text-gray-900"
                        required
                        minLength={8}
                      />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {loading ? "Verifying…" : "Reset Password"}
                    {!loading && <ShieldCheck className="w-4 h-4" />}
                  </button>
                </form>
              )}

              {!otpSuccess && (
                <button
                  onClick={() => { setMode("login"); setError(""); setOtp(""); setOtpSent(false); }}
                  className="w-full mt-5 text-sm text-gray-400 hover:text-gray-600 font-medium text-center"
                >
                  ← Back to login
                </button>
              )}
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Yjeek Technologies · Admin Portal · yjeektech.com
        </p>
      </div>
    </div>
  );
}
