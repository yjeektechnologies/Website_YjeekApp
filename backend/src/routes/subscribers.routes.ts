import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminSession } from "../middleware/requireAdminSession.js";
import {
  registerSubscriber,
  listSubscribers,
  exportSubscribers,
  deleteSubscriber,
} from "../controllers/subscribers.controller.js";

const router = Router();

// Public
router.post("/subscribers", asyncHandler(registerSubscriber));

// Admin
router.get("/admin/subscribers", requireAdminSession, asyncHandler(listSubscribers));
router.get("/admin/subscribers/export", requireAdminSession, asyncHandler(exportSubscribers));
router.delete("/admin/subscribers/:id", requireAdminSession, asyncHandler(deleteSubscriber));

export default router;
