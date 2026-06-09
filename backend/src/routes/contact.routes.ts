import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { submitPartnerEnquiry, submitDriverApplication } from "../controllers/contact.controller.js";

const router = Router();

router.post("/contact/partner", asyncHandler(submitPartnerEnquiry));
router.post("/contact/driver", asyncHandler(submitDriverApplication));

export default router;
