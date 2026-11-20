import { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service";
import { sendSuccess, sendError } from "../utils/response";

export class ChatController {
  // ─── Public / Visitor ──────────────────────────────────────────────────────

  async initSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, visitorName, visitorEmail } = req.body;
      if (!sessionId) {
        return sendError(res, "sessionId wajib diisi", "VALIDATION_ERROR", 400);
      }
      const session = await chatService.initSession(sessionId, visitorName, visitorEmail);
      return sendSuccess(res, session, "Sesi chat berhasil diinisialisasi", 200);
    } catch (error) {
      next(error);
    }
  }

  async getVisitorMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.query;
      if (!sessionId || typeof sessionId !== "string") {
        return sendError(res, "sessionId wajib diisi", "VALIDATION_ERROR", 400);
      }
      const result = await chatService.getVisitorMessages(sessionId);
      if (!result) return sendError(res, "Sesi tidak ditemukan", "NOT_FOUND", 404);
      return sendSuccess(res, result, "Pesan berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async sendVisitorMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, message, visitorName } = req.body;
      if (!sessionId || !message) {
        return sendError(res, "sessionId dan message wajib diisi", "VALIDATION_ERROR", 400);
      }
      const data = await chatService.sendVisitorMessage(sessionId, message, visitorName);
      return sendSuccess(res, data, "Pesan berhasil dikirim", 201);
    } catch (error) {
      next(error);
    }
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  async getAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const data = await chatService.getAllSessions(status as string | undefined);
      return sendSuccess(res, data, "Daftar sesi chat berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await chatService.getSessionById(id);
      if (!data) return sendError(res, "Sesi tidak ditemukan", "NOT_FOUND", 404);
      return sendSuccess(res, data, "Sesi chat berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async sendAdminReply(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const { message } = req.body;
      if (!message) {
        return sendError(res, "Pesan balasan wajib diisi", "VALIDATION_ERROR", 400);
      }
      const data = await chatService.sendAdminReply(id, message);
      return sendSuccess(res, data, "Balasan berhasil dikirim", 201);
    } catch (error) {
      next(error);
    }
  }

  async closeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await chatService.closeSession(id);
      return sendSuccess(res, data, "Sesi chat berhasil ditutup");
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await chatService.deleteSession(id);
      return sendSuccess(res, null, "Sesi chat berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await chatService.getTotalUnreadCount();
      return sendSuccess(res, { unreadCount: count }, "Jumlah chat belum dibaca berhasil diambil");
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
