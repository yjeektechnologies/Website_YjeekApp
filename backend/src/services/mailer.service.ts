import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { getSettingsMap } from "./settings.service.js";
import {
  buildDriverApplicationEmailHtml,
  buildPartnerEnquiryEmailHtml,
  buildOtpEmailHtml,
  type DriverApplication,
  type PartnerEnquiry,
} from "./emailTemplates.js";

const SMTP_SETTING_KEYS = [
  "smtp_host", "smtp_port", "smtp_secure",
  "smtp_user", "smtp_pass", "smtp_from", "smtp_from_name",
] as const;

export interface SmtpConfiguration {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  smtpFromName: string;
}

export interface TransactionalMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface BulkMailOptions {
  from: string;
  toSelf: string;
  recipients: string[];
  subject: string;
  html: string;
}

/**
 * Resolve the active SMTP configuration.
 * Priority: DB settings row → environment variable → hard-coded default. This lets
 * the admin update SMTP credentials from the panel without restarting the server.
 */
export async function getConfiguration(): Promise<SmtpConfiguration> {
  const db = await getSettingsMap(SMTP_SETTING_KEYS);

  return {
    smtpHost: db["smtp_host"] ?? env.smtp.host ?? "",
    smtpPort: Number(db["smtp_port"] ?? env.smtp.port ?? 587),
    smtpSecure: (db["smtp_secure"] ?? String(env.smtp.secure) ?? "false") === "true",
    smtpUser: db["smtp_user"] ?? env.smtp.user ?? "",
    smtpPass: db["smtp_pass"] ?? env.smtp.pass ?? "",
    smtpFrom: db["smtp_from"] ?? env.smtp.from ?? "noreply@yjeektech.com",
    smtpFromName: db["smtp_from_name"] ?? "Yjeek Technologies",
  };
}

export async function isSmtpConfigured(): Promise<boolean> {
  const config = await getConfiguration();
  return !!config.smtpHost;
}

/** Build a transporter from the DB/env-resolved config. Falls back to a stdout logger. */
async function buildTransporter(): Promise<nodemailer.Transporter> {
  const config = await getConfiguration();

  if (!config.smtpHost) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: { user: config.smtpUser, pass: config.smtpPass },
  });
}

/** Send a single transactional email using the DB/env-resolved SMTP config. */
export async function sendMail(options: TransactionalMailOptions): Promise<void> {
  const config = await getConfiguration();
  const transporter = await buildTransporter();
  const fromHeader = `"${config.smtpFromName}" <${config.smtpFrom}>`;

  const info = await transporter.sendMail({ from: fromHeader, ...options });

  if (!config.smtpHost) {
    logger.info(
      { preview: String((info as { message?: unknown }).message ?? "").slice(0, 200), to: options.to },
      "DEV: email not sent — no SMTP host configured",
    );
  }
}

/** Send a bulk notification blast in BCC batches. Returns total recipients reached. */
export async function sendBulk(
  options: BulkMailOptions,
  batchSize = 50,
): Promise<{ sentCount: number }> {
  const transporter = await buildTransporter();
  const { recipients, from, toSelf, subject, html } = options;

  let totalSentCount = 0;
  for (let startIndex = 0; startIndex < recipients.length; startIndex += batchSize) {
    const batch = recipients.slice(startIndex, startIndex + batchSize);
    await transporter.sendMail({ from, to: toSelf, bcc: batch, subject, html });
    totalSentCount += batch.length;
  }

  return { sentCount: totalSentCount };
}

// ── Env-var-only senders (OTP + contact forms) ───────────────────────────────
// These intentionally use env SMTP credentials (not the DB-stored settings) so
// the OTP password-reset flow works even before the admin configures the panel.

function buildEnvTransport(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export async function sendOtpEmail(recipientEmail: string, sixDigitOtpCode: string): Promise<void> {
  if (!env.smtp.host) {
    logger.info(
      { otp: sixDigitOtpCode, to: recipientEmail },
      "DEV: OTP email not sent — no SMTP_HOST env var configured",
    );
    return;
  }

  await buildEnvTransport().sendMail({
    from: env.smtp.from,
    to: recipientEmail,
    subject: "Yjeek Admin — Your OTP Code",
    html: buildOtpEmailHtml(sixDigitOtpCode),
  });

  logger.info({ to: recipientEmail }, "OTP email sent");
}

export async function notifyDriverApplication(
  application: DriverApplication,
  recipientEmail: string,
): Promise<void> {
  if (!env.smtp.host) {
    logger.info({ application, recipientEmail }, "DEV: driver application not emailed — no SMTP configured");
    return;
  }

  await buildEnvTransport().sendMail({
    from: env.smtp.from,
    to: recipientEmail,
    subject: `🚗 New Driver Application — ${application.fullName} (${application.vehicle})`,
    html: buildDriverApplicationEmailHtml(application),
  });
}

export async function notifyPartnerEnquiry(
  enquiry: PartnerEnquiry,
  recipientEmail: string,
): Promise<void> {
  if (!env.smtp.host) {
    logger.info({ enquiry, recipientEmail }, "DEV: partner enquiry not emailed — no SMTP configured");
    return;
  }

  await buildEnvTransport().sendMail({
    from: env.smtp.from,
    to: recipientEmail,
    subject: `🤝 New Partner Enquiry — ${enquiry.businessName} (${enquiry.businessType})`,
    html: buildPartnerEnquiryEmailHtml(enquiry),
  });
}
