import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  loginAdmin,
  logoutAdmin,
  requestOtp,
  verifyOtp,
  getAdminMe,
} from "../controllers/adminAuth.controller.js";

const router = Router();

router.post("/admin/login", asyncHandler(loginAdmin));
router.post("/admin/logout", asyncHandler(logoutAdmin));
router.post("/admin/otp/request", asyncHandler(requestOtp));
router.post("/admin/otp/verify", asyncHandler(verifyOtp));
router.get("/admin/me", getAdminMe);

export default router;
