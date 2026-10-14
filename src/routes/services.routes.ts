import { Router } from "express";
import { servicesController } from "../controllers/services.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicServicesRouter = Router();
publicServicesRouter.get("/", servicesController.getAllPublic.bind(servicesController));
publicServicesRouter.get("/:slug", servicesController.getBySlug.bind(servicesController));

export const adminServicesRouter = Router();
adminServicesRouter.use(requireAuth);

adminServicesRouter.get("/", servicesController.getAllAdmin.bind(servicesController));
adminServicesRouter.post("/", servicesController.create.bind(servicesController));
adminServicesRouter.put("/:id", servicesController.update.bind(servicesController));
adminServicesRouter.delete("/:id", servicesController.delete.bind(servicesController));
