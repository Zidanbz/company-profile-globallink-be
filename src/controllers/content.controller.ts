import { Request, Response, NextFunction } from "express";
import { contentService } from "../services/content.service";
import { sendSuccess } from "../utils/response";

export class ContentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await contentService.getAllContents();
      return sendSuccess(res, data, "Data konten berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async getByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { group } = req.params;
      const data = await contentService.getContentsByGroup(group);
      return sendSuccess(res, data, `Data konten grup ${group} berhasil diambil`);
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: "Field 'items' harus berupa array [{ key, value, group }]",
        });
      }
      const updated = await contentService.bulkUpdateContents(items);
      return sendSuccess(res, updated, "Konten berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  }
}

export const contentController = new ContentController();
