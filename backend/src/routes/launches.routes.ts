import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminSession } from "../middleware/requireAdminSession.js";
import {
  listActiveLaunches,
  getNextLaunch,
  listAllLaunches,
  createLaunch,
  updateLaunch,
  deleteLaunch,
  notifyLaunch,
} from "../controllers/launches.controller.js";

const router = Router();

// Public
router.get("/launches", asyncHandler(listActiveLaunches));
router.get("/launches/next", asyncHandler(getNextLaunch));

// Admin
router.get("/admin/launches", requireAdminSession, asyncHandler(listAllLaunches));
router.post("/admin/launches", requireAdminSession, asyncHandler(createLaunch));
router.patch("/admin/launches/:id", requireAdminSession, asyncHandler(updateLaunch));
router.delete("/admin/launches/:id", requireAdminSession, asyncHandler(deleteLaunch));
router.post("/admin/launches/:id/notify", requireAdminSession, asyncHandler(notifyLaunch));

export default router;
