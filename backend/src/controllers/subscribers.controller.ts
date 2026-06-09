import type { Request, Response } from "express";
import { Subscriber } from "../models/subscriber.model.js";
import { RegisterSubscriberSchema } from "../validation/schemas.js";
import { ValidationError } from "../utils/errors.js";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

/** POST /api/subscribers — public; register an email for launch-day notification. */
export async function registerSubscriber(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSubscriberSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const data = parsed.data;
  const email = data.email.toLowerCase().trim();

  // Idempotent: duplicate emails are silently accepted (no error to the user).
  const existing = await Subscriber.findOne({ email });
  if (!existing) {
    await Subscriber.create({
      email,
      launchId: data.launchId ?? null,
      city: data.city ?? null,
      country: data.country ?? null,
    });
  }

  req.log.info({ email }, "New subscriber registered");
  res.status(201).json({ message: "Subscribed! You'll hear from us on launch day." });
}

/** GET /api/admin/subscribers — paginated list with city aggregates. */
export async function listSubscribers(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(req.query.limit) || DEFAULT_PAGE_SIZE));
  const cityFilter = req.query.city as string | undefined;

  const filter = cityFilter ? { city: cityFilter } : {};
  const offset = (page - 1) * limit;

  const [subscribers, total, byCityRows] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit),
    Subscriber.countDocuments(filter),
    Subscriber.aggregate([
      { $group: { _id: { city: "$city", country: "$country" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    subscribers,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    byCity: byCityRows.map((row) => ({
      city: row._id.city ?? null,
      country: row._id.country ?? null,
      count: Number(row.count),
    })),
  });
}

/** GET /api/admin/subscribers/export — streams a CSV download. */
export async function exportSubscribers(req: Request, res: Response): Promise<void> {
  const cityFilter = req.query.city as string | undefined;
  const filter = cityFilter ? { city: cityFilter } : {};

  const rows = await Subscriber.find(filter).sort({ createdAt: -1 });

  const header = "id,email,city,country,signed_up_at";
  const dataRows = rows.map((row) =>
    [
      row.id,
      `"${row.email}"`,
      `"${row.city ?? ""}"`,
      `"${row.country ?? ""}"`,
      new Date(row.createdAt as Date).toISOString(),
    ].join(","),
  );
  const csv = [header, ...dataRows].join("\n");

  const filename = cityFilter
    ? `yjeek-subscribers-${cityFilter.toLowerCase()}.csv`
    : "yjeek-subscribers-all.csv";

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);

  req.log.info({ count: rows.length, cityFilter }, "Subscribers exported");
}

/** DELETE /api/admin/subscribers/:id */
export async function deleteSubscriber(req: Request, res: Response): Promise<void> {
  const subscriberId = Number(req.params.id);
  if (Number.isNaN(subscriberId)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  await Subscriber.deleteOne({ id: subscriberId });
  req.log.info({ id: subscriberId }, "Subscriber deleted");
  res.json({ message: "Subscriber removed" });
}
