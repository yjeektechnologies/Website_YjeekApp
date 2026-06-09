import type { Request, Response } from "express";
import { PartnerEnquirySchema, DriverApplicationSchema } from "../validation/schemas.js";
import { ValidationError } from "../utils/errors.js";
import { getSettingsMap } from "../services/settings.service.js";
import { notifyPartnerEnquiry, notifyDriverApplication } from "../services/mailer.service.js";

/** POST /api/contact/partner */
export async function submitPartnerEnquiry(req: Request, res: Response): Promise<void> {
  const parsed = PartnerEnquirySchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const settings = await getSettingsMap(["partner_email"]);
  const recipient = settings["partner_email"] ?? "sales@yjeektech.com";

  await notifyPartnerEnquiry(parsed.data, recipient);
  res.status(201).json({ message: "Thank you! Our sales team will be in touch within 24 hours." });
}

/** POST /api/contact/driver */
export async function submitDriverApplication(req: Request, res: Response): Promise<void> {
  const parsed = DriverApplicationSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const settings = await getSettingsMap(["driver_email"]);
  const recipient = settings["driver_email"] ?? "hr@yjeektech.com";

  await notifyDriverApplication(parsed.data, recipient);
  res.status(201).json({ message: "Application received! Our team will review and be in touch shortly." });
}
