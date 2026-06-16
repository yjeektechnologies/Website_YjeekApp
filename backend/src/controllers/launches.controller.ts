import type { Request, Response } from "express";
import { Launch } from "../models/launch.model.js";
import { Subscriber } from "../models/subscriber.model.js";
import { CreateLaunchSchema, UpdateLaunchSchema } from "../validation/schemas.js";
import { ValidationError, NotFoundError, BusinessRuleError } from "../utils/errors.js";
import { stripUndefined } from "../utils/stripUndefined.js";
import {
  isSmtpConfigured,
  getConfiguration,
  sendBulk,
} from "../services/mailer.service.js";
import { buildLaunchNotificationEmailHtml } from "../services/emailTemplates.js";

// ── Public ───────────────────────────────────────────────────────────────────

/** GET /api/launches — all active launches, nearest first. */
export async function listActiveLaunches(_req: Request, res: Response): Promise<void> {
  const launches = await Launch.find({ isActive: true }).sort({ launchDate: 1 });
  res.json({ launches });
}

/** GET /api/launches/next — the single nearest upcoming active launch. */
export async function getNextLaunch(_req: Request, res: Response): Promise<void> {
  const launch = await Launch.findOne({ isActive: true }).sort({ launchDate: 1 });
  if (!launch) {
    res.status(404).json({ launch: null });
    return;
  }
  res.json({ launch });
}

// ── Admin ────────────────────────────────────────────────────────────────────

/** GET /api/admin/launches — all launches including inactive. */
export async function listAllLaunches(_req: Request, res: Response): Promise<void> {
  const launches = await Launch.find().sort({ launchDate: 1 });
  res.json({ launches });
}

/** POST /api/admin/launches */
export async function createLaunch(req: Request, res: Response): Promise<void> {
  const parsed = CreateLaunchSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const launch = await Launch.create(parsed.data);
  req.log.info({ id: launch.id, city: launch.city }, "Launch created");
  res.status(201).json({ launch });
}

/** PATCH /api/admin/launches/:id */
export async function updateLaunch(req: Request, res: Response): Promise<void> {
  const launchId = Number(req.params.id);
  if (Number.isNaN(launchId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const parsed = UpdateLaunchSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const launch = await Launch.findOneAndUpdate(
    { id: launchId },
    { $set: stripUndefined(parsed.data) },
    { new: true },
  );
  if (!launch) throw new NotFoundError("Launch", launchId);

  req.log.info({ id: launchId }, "Launch updated");
  res.json({ launch });
}

/** DELETE /api/admin/launches/:id — permanently delete a launch. */
export async function deleteLaunch(req: Request, res: Response): Promise<void> {
  const launchId = Number(req.params.id);
  if (Number.isNaN(launchId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const launch = await Launch.findOneAndDelete({ id: launchId });
  if (!launch) throw new NotFoundError("Launch", launchId);

  req.log.info({ id: launchId }, "Launch deleted");
  res.json({ message: "Launch deleted" });
}

/** DELETE /api/admin/launches/:id — soft-delete (isActive = false). */
export async function deactivateLaunch(req: Request, res: Response): Promise<void> {
  const launchId = Number(req.params.id);
  if (Number.isNaN(launchId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const launch = await Launch.findOneAndUpdate(
    { id: launchId },
    { $set: { isActive: false } },
    { new: true },
  );
  if (!launch) throw new NotFoundError("Launch", launchId);

  req.log.info({ id: launchId }, "Launch deactivated");
  res.json({ message: "Launch deactivated", launch });
}

/** POST /api/admin/launches/:id/notify — send a launch-day blast to city subscribers. */
export async function notifyLaunch(req: Request, res: Response): Promise<void> {
  const launchId = Number(req.params.id);
  if (Number.isNaN(launchId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const { customMessage } = req.body as { customMessage?: string };

  // Rule 1: SMTP must be configured
  if (!(await isSmtpConfigured())) {
    throw new BusinessRuleError(
      "SMTP is not configured. Set up your email settings in the admin Settings tab first.",
    );
  }

  // Rule 2: launch must exist
  const launch = await Launch.findOne({ id: launchId });
  if (!launch) throw new NotFoundError("Launch", launchId);

  // Rule 3: no subscribers → no send
  const citySubscribers = await Subscriber.find({ city: launch.city });
  if (citySubscribers.length === 0) {
    res.json({ message: "No subscribers for this city yet.", sent: 0 });
    return;
  }

  const config = await getConfiguration();
  const fromHeader = `"${config.smtpFromName}" <${config.smtpFrom}>`;

  const { sentCount } = await sendBulk({
    from: fromHeader,
    toSelf: config.smtpFrom,
    recipients: citySubscribers.map((s) => s.email),
    subject: `🎉 Yjeek is now live in ${launch.city}, ${launch.country}!`,
    html: buildLaunchNotificationEmailHtml({
      city: launch.city,
      country: launch.country,
      fromName: config.smtpFromName,
      customMessage,
    }),
  });

  req.log.info({ launchId, sentCount }, "Launch notification blast complete");
  res.json({
    message: `Notification sent to ${sentCount} subscriber${sentCount !== 1 ? "s" : ""}.`,
    sent: sentCount,
  });
}
