import { Router } from "express";
import { contentController } from "../controllers/content.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicContentRouter = Router();
publicContentRouter.get("/", contentController.getAll.bind(contentController));
publicContentRouter.get("/group/:group", contentController.getByGroup.bind(contentController));

export const adminContentRouter = Router();
adminContentRouter.use(requireAuth);

adminContentRouter.get("/", contentController.getAll.bind(contentController));
adminContentRouter.put("/bulk", contentController.bulkUpdate.bind(contentController));
