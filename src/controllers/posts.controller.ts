import { Request, Response, NextFunction } from "express";
import { postsService, PostsService } from "../services/posts.service";
import { sendSuccess } from "../utils/response";

export class PostsController {
  constructor(private service: PostsService = postsService) {}

  getPublicPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getPublicPosts(req.query as any);
      sendSuccess(res, data, "Daftar artikel berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getPublicPostBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.getPublicPostBySlug(req.params.slug);
      sendSuccess(res, post, "Detail artikel berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getAdminPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAdminPosts(req.query as any);
      sendSuccess(res, data, "Daftar artikel admin berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getAdminPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.service.getAdminPostById(id);
      sendSuccess(res, post, "Detail artikel admin berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.createPost(req.body);
      sendSuccess(res, post, "Artikel berhasil dibuat", 201);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.service.updatePost(id, req.body);
      sendSuccess(res, post, "Artikel berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.service.deletePost(id);
      sendSuccess(res, { id }, "Artikel berhasil dihapus");
    } catch (error) {
      next(error);
    }
  };

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.service.getDashboardStats();
      sendSuccess(res, stats, "Statistik artikel berhasil diambil");
    } catch (error) {
      next(error);
    }
  };
}

export const postsController = new PostsController();
