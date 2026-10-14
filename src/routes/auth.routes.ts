import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import { loginSchema } from "../validators/auth.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/rate-limit.middleware";

const router = Router();

router.post("/login", authLimiter, validateRequest(loginSchema), authController.login);
router.get("/me", requireAuth, authController.getCurrentUser);
router.post("/logout", authController.logout);

export default router;
