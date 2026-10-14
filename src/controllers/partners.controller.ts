import { Request, Response, NextFunction } from "express";
import { partnersService } from "../services/partners.service";
import { sendSuccess } from "../utils/response";

export class PartnersController {
  async getAllPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const data = await partnersService.getAllPublic(category);
      return sendSuccess(res, data, "Data logo partner/klien berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const data = await partnersService.getAllAdmin(category);
      return sendSuccess(res, data, "Data logo partner/klien admin berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await partnersService.create(req.body);
      return sendSuccess(res, data, "Logo partner berhasil ditambahkan", 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await partnersService.update(id, req.body);
      return sendSuccess(res, data, "Logo partner berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await partnersService.delete(id);
      return sendSuccess(res, null, "Logo partner berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}

export const partnersController = new PartnersController();
