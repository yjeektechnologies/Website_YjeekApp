import type { Request, Response } from "express";
import { Testimonial } from "../models/testimonial.model.js";
import { TestimonialSchema } from "../validation/schemas.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { stripUndefined } from "../utils/stripUndefined.js";

/** GET /api/testimonials — active testimonials for the public page. */
export async function listPublicTestimonials(_req: Request, res: Response): Promise<void> {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ testimonials });
}

/** GET /api/admin/testimonials — all testimonials including inactive. */
export async function listAllTestimonials(_req: Request, res: Response): Promise<void> {
  const testimonials = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ testimonials });
}

/** POST /api/admin/testimonials */
export async function createTestimonial(req: Request, res: Response): Promise<void> {
  const parsed = TestimonialSchema.safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const testimonial = await Testimonial.create(parsed.data);
  req.log.info({ id: testimonial.id }, "Testimonial created");
  res.status(201).json({ testimonial });
}

/** PATCH /api/admin/testimonials/:id */
export async function updateTestimonial(req: Request, res: Response): Promise<void> {
  const testimonialId = parseInt(req.params.id, 10);
  if (Number.isNaN(testimonialId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = TestimonialSchema.partial().safeParse(req.body);
  if (!parsed.success) throw new ValidationError(parsed.error.issues);

  const testimonial = await Testimonial.findOneAndUpdate(
    { id: testimonialId },
    { $set: stripUndefined(parsed.data) },
    { new: true },
  );
  if (!testimonial) throw new NotFoundError("Testimonial", testimonialId);

  res.json({ testimonial });
}

/** DELETE /api/admin/testimonials/:id */
export async function deleteTestimonial(req: Request, res: Response): Promise<void> {
  const testimonialId = parseInt(req.params.id, 10);
  if (Number.isNaN(testimonialId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await Testimonial.deleteOne({ id: testimonialId });
  res.json({ message: "Deleted" });
}
