import { Request, Response, NextFunction } from "express";
import { contactMessagesService } from "../services/contact-messages.service";
import { sendSuccess } from "../utils/response";

export class ContactMessagesController {
  async submitMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan pesan wajib diisi",
        });
      }
      const data = await contactMessagesService.create({
        name,
        email,
        phone,
        subject,
        message,
      });
      return sendSuccess(res, data, "Pesan Anda berhasil dikirimkan", 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const isReadParam = req.query.isRead;
      let isRead: boolean | undefined = undefined;
      if (isReadParam === "true") isRead = true;
      if (isReadParam === "false") isRead = false;

      const data = await contactMessagesService.getAllAdmin(page, limit, isRead);
      return sendSuccess(res, data, "Daftar pesan berhasil diambil");
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const isRead = req.body.isRead !== undefined ? req.body.isRead : true;
      const data = await contactMessagesService.markAsRead(id, isRead);
      return sendSuccess(res, data, "Status pesan berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      await contactMessagesService.delete(id);
      return sendSuccess(res, null, "Pesan berhasil dihapus");
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await contactMessagesService.getUnreadCount();
      return sendSuccess(res, { unreadCount: count }, "Jumlah pesan belum dibaca berhasil diambil");
    } catch (error) {
      next(error);
    }
  }
}

export const contactMessagesController = new ContactMessagesController();
