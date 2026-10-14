import { Router } from "express";
import { partnersController } from "../controllers/partners.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicPartnersRouter = Router();
publicPartnersRouter.get("/", partnersController.getAllPublic.bind(partnersController));

export const adminPartnersRouter = Router();
adminPartnersRouter.use(requireAuth);

adminPartnersRouter.get("/", partnersController.getAllAdmin.bind(partnersController));
adminPartnersRouter.post("/", partnersController.create.bind(partnersController));
adminPartnersRouter.put("/:id", partnersController.update.bind(partnersController));
adminPartnersRouter.delete("/:id", partnersController.delete.bind(partnersController));
