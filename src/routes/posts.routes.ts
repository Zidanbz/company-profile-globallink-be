import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  createPostSchema,
  getPostQuerySchema,
  updatePostSchema,
} from "../validators/post.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

export const publicPostsRouter = Router();
publicPostsRouter.get("/", validateRequest(getPostQuerySchema), postsController.getPublicPosts);
publicPostsRouter.get("/:slug", postsController.getPublicPostBySlug);

export const adminPostsRouter = Router();
adminPostsRouter.use(requireAuth, requireRole(["ADMIN"]));
adminPostsRouter.get("/stats", postsController.getStats);
adminPostsRouter.get("/", validateRequest(getPostQuerySchema), postsController.getAdminPosts);
adminPostsRouter.post("/", validateRequest(createPostSchema), postsController.createPost);
adminPostsRouter.get("/:id", postsController.getAdminPostById);
adminPostsRouter.put("/:id", validateRequest(updatePostSchema), postsController.updatePost);
adminPostsRouter.delete("/:id", postsController.deletePost);
