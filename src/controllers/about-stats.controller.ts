import { Request, Response, NextFunction } from "express";
import { aboutStatsService } from "../services/about-stats.service";
import { sendSuccess } from "../utils/response";

export class AboutStatsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await aboutStatsService.getAll();
      return sendSuccess(res, data, "Data statistik berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async bulkSave(req: Request, res: Response, next: NextFunction) {
    try {
      const { stats } = req.body;
      if (!Array.isArray(stats)) {
        return res.status(400).json({
          success: false,
          message: "Field 'stats' harus berupa array",
        });
      }
      const data = await aboutStatsService.bulkSave(stats);
      return sendSuccess(res, data, "Data statistik berhasil disimpan");
    } catch (error) {
      next(error);
    }
  }
}

export const aboutStatsController = new AboutStatsController();
