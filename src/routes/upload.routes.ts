import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";
import { uploadMiddleware } from "../services/upload.service";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  uploadMiddleware.single("image"),
  uploadController.uploadImage
);

export default router;
