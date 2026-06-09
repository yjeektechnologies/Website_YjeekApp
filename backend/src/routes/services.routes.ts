import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdminSession } from "../middleware/requireAdminSession.js";
import {
  listPublicServices,
  listAllServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";

const router = Router();

router.get("/services", asyncHandler(listPublicServices));

router.get("/admin/services", requireAdminSession, asyncHandler(listAllServices));
router.post("/admin/services", requireAdminSession, asyncHandler(createService));
router.patch("/admin/services/:id", requireAdminSession, asyncHandler(updateService));
router.delete("/admin/services/:id", requireAdminSession, asyncHandler(deleteService));

export default router;
