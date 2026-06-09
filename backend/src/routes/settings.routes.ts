import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminSession } from "../middleware/requireAdminSession.js";
import {
  readAdminSettings,
  writeAdminSettings,
  testEmail,
  getSiteContent,
  saveSiteContent,
  getCarouselConfig,
  saveCarouselConfig,
  getSiteStats,
  getSiteConfig,
  getLegalPage,
  getAboutPage,
  getFooterConfig,
} from "../controllers/settings.controller.js";

const router = Router();

// Admin
router.get("/admin/settings", requireAdminSession, asyncHandler(readAdminSettings));
router.put("/admin/settings", requireAdminSession, asyncHandler(writeAdminSettings));
router.post("/admin/settings/test-email", requireAdminSession, asyncHandler(testEmail));
router.get("/admin/site-content", requireAdminSession, asyncHandler(getSiteContent));
router.put("/admin/site-content", requireAdminSession, asyncHandler(saveSiteContent));
router.get("/admin/carousel-config", requireAdminSession, asyncHandler(getCarouselConfig));
router.put("/admin/carousel-config", requireAdminSession, asyncHandler(saveCarouselConfig));

// Public
router.get("/site-stats", asyncHandler(getSiteStats));
router.get("/site-config", asyncHandler(getSiteConfig));
router.get("/legal/:slug", asyncHandler(getLegalPage));
router.get("/about", asyncHandler(getAboutPage));
router.get("/footer-config", asyncHandler(getFooterConfig));
router.get("/site-content", asyncHandler(getSiteContent));
router.get("/carousel-config", asyncHandler(getCarouselConfig));

export default router;
