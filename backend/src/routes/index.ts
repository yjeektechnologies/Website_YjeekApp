import { Router } from "express";
import healthRouter from "./health.routes.js";
import launchesRouter from "./launches.routes.js";
import servicesRouter from "./services.routes.js";
import testimonialsRouter from "./testimonials.routes.js";
import subscribersRouter from "./subscribers.routes.js";
import contactRouter from "./contact.routes.js";
import adminAuthRouter from "./adminAuth.routes.js";
import settingsRouter from "./settings.routes.js";

const router = Router();

router.use(healthRouter);
router.use(launchesRouter);
router.use(servicesRouter);
router.use(testimonialsRouter);
router.use(subscribersRouter);
router.use(contactRouter);
router.use(adminAuthRouter);
router.use(settingsRouter);

export default router;
