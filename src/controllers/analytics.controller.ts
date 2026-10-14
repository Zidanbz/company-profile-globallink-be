import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";
import { sendSuccess } from "../utils/response";

export class AnalyticsController {
  async track(req: Request, res: Response, next: NextFunction) {
    try {
      const { path, visitorId, referrer, duration } = req.body;
      const userAgent = req.headers["user-agent"] || "";
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "";

      const visit = await analyticsService.recordVisit({
        path,
        visitorId,
        referrer,
        duration,
        userAgent,
        ip,
      });

      return sendSuccess(res, { tracked: Boolean(visit) }, "Kunjungan berhasil dicatat");
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as "today" | "7d" | "30d") || "7d";
      const data = await analyticsService.getAnalytics(period);
      return sendSuccess(res, data, "Data analitik pengunjung berhasil dimuat");
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
