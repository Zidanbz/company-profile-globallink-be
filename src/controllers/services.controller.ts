import { Request, Response, NextFunction } from "express";
import { servicesService } from "../services/services.service";
import { sendSuccess } from "../utils/response";

export class ServicesController {
  async getAllPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await servicesService.getAllPublic();
      return sendSuccess(res, data, "Data layanan berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const data = await servicesService.getBySlug(slug);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Layanan dengan slug '${slug}' tidak ditemukan`,
        });
      }
      return sendSuccess(res, data, "Detail layanan berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await servicesService.getAllAdmin();
      return sendSuccess(res, data, "Data layanan admin berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await servicesService.create(req.body);
      return sendSuccess(res, data, "Layanan baru berhasil ditambahkan", 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await servicesService.update(id, req.body);
      return sendSuccess(res, data, "Layanan berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await servicesService.delete(id);
      return sendSuccess(res, null, "Layanan berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }
}

export const servicesController = new ServicesController();
