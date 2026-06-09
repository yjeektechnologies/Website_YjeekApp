import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { AdminSession } from "../models/adminSession.model.js";
import { OtpCode } from "../models/otpCode.model.js";
import { LoginAdminSchema, VerifyOtpSchema } from "../validation/schemas.js";
import { ValidationError, AuthenticationError, BusinessRuleError } from "../utils/errors.js";
import { sendOtpEmail } from "../services/mailer.service.js";

const SESSION_TTL_MILLISECONDS = 24 * 60 * 60 * 1000; // 24 hours
const OTP_TTL_MILLISECONDS = 30 * 1000; // 30 seconds
const OTP_EXPIRY_SECONDS = 30;

const ADMIN_EMAIL = env.adminEmail;
const ADMIN_PASSWORD_HASH = env.adminPasswordHash;

/** POST /api/admin/login */
export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const parsed = LoginAdminSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const { email, password } = parsed.data;
  const isEmailMatch = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Always run bcrypt (even on email mismatch) for a constant-time response that
  // does not leak whether the email is valid.
  const hashToCompare = ADMIN_PASSWORD_HASH || (await bcrypt.hash("__unreachable_placeholder__", 10));
  const isPasswordCorrect = await bcrypt.compare(password, hashToCompare);

  if (!isEmailMatch || !isPasswordCorrect) {
    throw new AuthenticationError("Invalid credentials");
  }

  const sessionToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MILLISECONDS);
  await AdminSession.create({ token: sessionToken, expiresAt });

  req.log.info({ email }, "Admin login successful");
  res.json({ token: sessionToken, expiresAt });
}

/** POST /api/admin/logout */
export async function logoutAdmin(req: Request, res: Response): Promise<void> {
  const sessionToken = req.headers["x-admin-token"] as string | undefined;
  if (sessionToken) {
    await AdminSession.deleteOne({ token: sessionToken });
  }
  res.json({ message: "Logged out" });
}

/**
 * POST /api/admin/otp/request
 * Always returns the same body whether or not the email matches, to prevent
 * email enumeration.
 */
export async function requestOtp(req: Request, res: Response): Promise<void> {
  const requestedEmail = (req.body as { email?: string }).email ?? "";
  const normalizedRequested = requestedEmail.toLowerCase().trim();
  const normalizedAdmin = ADMIN_EMAIL.toLowerCase();

  if (normalizedRequested === normalizedAdmin) {
    // Invalidate all prior codes so only the new one verifies.
    await OtpCode.updateMany({ email: normalizedAdmin }, { $set: { used: true } });

    const sixDigitOtpCode = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(sixDigitOtpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MILLISECONDS);

    await OtpCode.create({ email: normalizedAdmin, codeHash, expiresAt, used: false });
    await sendOtpEmail(normalizedAdmin, sixDigitOtpCode);
  }

  req.log.info({ email: requestedEmail }, "Admin OTP requested");
  res.json({
    message: "If that email exists, an OTP has been sent.",
    expiresIn: OTP_EXPIRY_SECONDS,
  });
}

/** POST /api/admin/otp/verify */
export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const parsed = VerifyOtpSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const { email, otp, newPassword } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const otpRecord = await OtpCode.findOne({
    email: normalizedEmail,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: 1 });

  if (!otpRecord) {
    throw new BusinessRuleError("OTP is invalid or has expired. Please request a new one.");
  }

  const isCorrect = await bcrypt.compare(otp, otpRecord.codeHash);
  if (!isCorrect) {
    throw new BusinessRuleError("Incorrect OTP code.");
  }

  otpRecord.used = true;
  await otpRecord.save();

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  req.log.info({ email }, "Admin OTP verified — password reset initiated");
  res.json({
    message: "OTP verified. Update your ADMIN_PASSWORD_HASH environment variable with the value below.",
    newPasswordHash,
  });
}

/** GET /api/admin/me — returns the configured admin email (not secret). */
export function getAdminMe(_req: Request, res: Response): void {
  res.json({ email: ADMIN_EMAIL });
}
