/**
 * Email HTML builders. Pure functions — no transport, no DB — so they are trivial
 * to unit-test and edit. Ported verbatim from the original api-server templates.
 */

export interface PartnerEnquiry {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  branches?: string;
  city: string;
  message?: string;
}

export interface DriverApplication {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
  experience?: string;
  message?: string;
}

export function buildDriverApplicationEmailHtml(application: DriverApplication): string {
  const fieldRows = [
    ["Full Name", application.fullName],
    ["Email", application.email],
    ["Phone", application.phone],
    ["City / Area", application.city],
    ["Vehicle Type", application.vehicle],
    ["Experience", application.experience ?? "—"],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;width:40%;">
          <span style="font-size:13px;font-weight:600;color:#6b7280;">${label}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:14px;font-weight:700;color:#111827;">${value}</span>
        </td>
      </tr>`,
    )
    .join("");

  const noteBlock = application.message
    ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:12px;border-left:4px solid #FFEB3B;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Note</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${application.message}</p>
      </div>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:540px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%);padding:32px 40px;">
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">New Driver Application</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">Submitted via yjeektech.com</p>
  </td></tr>
  <tr><td style="height:5px;background:#FFEB3B;"></td></tr>
  <tr><td style="padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">${fieldRows}</table>
    ${noteBlock}
    <div style="margin-top:28px;padding:16px 20px;background:#4CAF50;border-radius:12px;text-align:center;">
      <p style="margin:0;color:#fff;font-size:14px;font-weight:700;">Reply directly to this email to contact the applicant.</p>
    </div>
  </td></tr>
  <tr><td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="margin:0;color:#9ca3af;font-size:12px;">Yjeek Technologies · Seef District, Manama, Bahrain</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`.trim();
}

export function buildPartnerEnquiryEmailHtml(enquiry: PartnerEnquiry): string {
  const fieldRows = [
    ["Business Name", enquiry.businessName],
    ["Contact Person", enquiry.contactName],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["Business Type", enquiry.businessType],
    ["No. of Branches", enquiry.branches ?? "—"],
    ["City / Area", enquiry.city],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;width:40%;">
          <span style="font-size:13px;font-weight:600;color:#6b7280;">${label}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:14px;font-weight:700;color:#111827;">${value}</span>
        </td>
      </tr>`,
    )
    .join("");

  const messageBlock = enquiry.message
    ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:12px;border-left:4px solid #4CAF50;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${enquiry.message}</p>
      </div>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:540px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 100%);padding:32px 40px;">
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">New Partner Enquiry</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">Submitted via yjeektech.com</p>
  </td></tr>
  <tr><td style="height:5px;background:#FFEB3B;"></td></tr>
  <tr><td style="padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">${fieldRows}</table>
    ${messageBlock}
    <div style="margin-top:28px;padding:16px 20px;background:#4CAF50;border-radius:12px;text-align:center;">
      <p style="margin:0;color:#fff;font-size:14px;font-weight:700;">Reply directly to this email to contact the partner.</p>
    </div>
  </td></tr>
  <tr><td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
    <p style="margin:0;color:#9ca3af;font-size:12px;">Yjeek Technologies · Seef District, Manama, Bahrain</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`.trim();
}

export function buildLaunchNotificationEmailHtml(options: {
  city: string;
  country: string;
  fromName: string;
  customMessage?: string;
}): string {
  const { city, country, fromName, customMessage } = options;

  const bodyText = customMessage
    ? customMessage
    : `The wait is over! Yjeek is now live in <strong>${city}, ${country}</strong>. Ultra-fast delivery of food, groceries, pharmacy, flowers, and more — right to your door.`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1B4332 0%,#2D6A4F 60%,#1a3a2a 100%);padding:40px 40px 48px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;letter-spacing:-0.5px;">We're Live in ${city}!</h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.7);font-size:16px;">${country}</p>
          </td>
        </tr>
        <tr><td style="height:6px;background:#FFEB3B;"></td></tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">${bodyText}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
              <tr><td align="center" style="padding-bottom:12px;">
                <a href="https://apps.apple.com" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:16px 32px;border-radius:14px;font-weight:700;font-size:15px;">📱 Download on App Store</a>
              </td></tr>
              <tr><td align="center">
                <a href="https://play.google.com" style="display:inline-block;background:#4CAF50;color:#fff;text-decoration:none;padding:16px 32px;border-radius:14px;font-weight:700;font-size:15px;">🤖 Get it on Google Play</a>
              </td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #f3f4f6;margin:32px 0;"/>
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
              You're receiving this because you signed up for launch notifications on
              <a href="https://yjeektech.com" style="color:#4CAF50;text-decoration:none;">yjeektech.com</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #f3f4f6;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              © ${new Date().getFullYear()} ${fromName} · Seef District, Manama, Bahrain<br/>
              <a href="mailto:info@yjeektech.com" style="color:#4CAF50;text-decoration:none;">info@yjeektech.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export function buildOtpEmailHtml(sixDigitOtpCode: string): string {
  return `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px;">
          <h2 style="color:#1B4332;margin:0 0 8px;">Password Reset OTP</h2>
          <p style="color:#6b7280;margin:0 0 24px;">Use this code to reset your Yjeek admin password. It expires in <strong>30 seconds</strong>.</p>
          <div style="background:#4CAF50;color:#fff;font-size:40px;font-weight:900;letter-spacing:12px;text-align:center;padding:24px 32px;border-radius:12px;margin-bottom:24px;">${sixDigitOtpCode}</div>
          <p style="color:#9ca3af;font-size:13px;margin:0;">If you did not request this, ignore this email.</p>
        </div>
      `;
}

export function buildTestEmailHtml(smtpFrom: string): string {
  return `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px;">
        <h2 style="color:#1B4332;margin:0 0 8px;">SMTP is working! 🎉</h2>
        <p style="color:#6b7280;margin:0 0 24px;">Your Yjeek admin email configuration is set up correctly.</p>
        <div style="background:#4CAF50;color:#fff;padding:16px 24px;border-radius:12px;font-weight:600;text-align:center;">Sender: ${smtpFrom}</div>
        <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">Yjeek Technologies · Admin Portal</p>
      </div>
    `;
}
