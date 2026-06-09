import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminSession } from "../middleware/requireAdminSession.js";
import {
  listPublicTestimonials,
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonials.controller.js";

const router = Router();

router.get("/testimonials", asyncHandler(listPublicTestimonials));

router.get("/admin/testimonials", requireAdminSession, asyncHandler(listAllTestimonials));
router.post("/admin/testimonials", requireAdminSession, asyncHandler(createTestimonial));
router.patch("/admin/testimonials/:id", requireAdminSession, asyncHandler(updateTestimonial));
router.delete("/admin/testimonials/:id", requireAdminSession, asyncHandler(deleteTestimonial));

export default router;
