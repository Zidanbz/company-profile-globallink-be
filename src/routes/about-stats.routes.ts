import { Router } from "express";
import { aboutStatsController } from "../controllers/about-stats.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicAboutStatsRouter = Router();
publicAboutStatsRouter.get("/", aboutStatsController.getAll.bind(aboutStatsController));

export const adminAboutStatsRouter = Router();
adminAboutStatsRouter.use(requireAuth);

adminAboutStatsRouter.get("/", aboutStatsController.getAll.bind(aboutStatsController));
adminAboutStatsRouter.put("/", aboutStatsController.bulkSave.bind(aboutStatsController));
