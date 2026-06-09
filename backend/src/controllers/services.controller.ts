import type { Request, Response } from "express";
import { Service } from "../models/service.model.js";
import { ServiceSchema } from "../validation/schemas.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { stripUndefined } from "../utils/stripUndefined.js";

/** GET /api/services — active services for the public page. */
export async function listPublicServices(_req: Request, res: Response): Promise<void> {
  const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
  res.json({ services });
}

/** GET /api/admin/services — all services including inactive. */
export async function listAllServices(_req: Request, res: Response): Promise<void> {
  const services = await Service.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({ services });
}

/** POST /api/admin/services */
export async function createService(req: Request, res: Response): Promise<void> {
  const parsed = ServiceSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const service = await Service.create(parsed.data);
  req.log.info({ id: service.id }, "Service created");
  res.status(201).json({ service });
}

/** PATCH /api/admin/services/:id */
export async function updateService(req: Request, res: Response): Promise<void> {
  const serviceId = parseInt(req.params.id, 10);
  if (Number.isNaN(serviceId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = ServiceSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const service = await Service.findOneAndUpdate(
    { id: serviceId },
    { $set: stripUndefined(parsed.data) },
    { new: true },
  );
  if (!service) throw new NotFoundError("Service", serviceId);

  res.json({ service });
}

/** DELETE /api/admin/services/:id */
export async function deleteService(req: Request, res: Response): Promise<void> {
  const serviceId = parseInt(req.params.id, 10);
  if (Number.isNaN(serviceId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await Service.deleteOne({ id: serviceId });
  res.json({ message: "Deleted" });
}
