import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicAnalyticsRouter = Router();
publicAnalyticsRouter.post("/track", analyticsController.track.bind(analyticsController));

export const adminAnalyticsRouter = Router();
adminAnalyticsRouter.use(requireAuth);
adminAnalyticsRouter.get("/stats", analyticsController.getStats.bind(analyticsController));
