import { Router } from "express";
import { mapController } from "../controllers/map.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  createMapLocationSchema,
  getMapQuerySchema,
  updateMapLocationSchema,
} from "../validators/map.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

export const publicMapRouter = Router();
publicMapRouter.get("/", validateRequest(getMapQuerySchema), mapController.getPublicLocations);
publicMapRouter.get("/:id", mapController.getLocationById);

export const adminMapRouter = Router();
adminMapRouter.use(requireAuth, requireRole(["ADMIN"]));
adminMapRouter.get("/count", mapController.getTotalCount);
adminMapRouter.get("/", validateRequest(getMapQuerySchema), mapController.getAdminLocations);
adminMapRouter.post("/", validateRequest(createMapLocationSchema), mapController.createLocation);
adminMapRouter.get("/:id", mapController.getLocationById);
adminMapRouter.put("/:id", validateRequest(updateMapLocationSchema), mapController.updateLocation);
adminMapRouter.delete("/:id", mapController.deleteLocation);
