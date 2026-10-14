import { Request, Response, NextFunction } from "express";
import { uploadService, UploadService } from "../services/upload.service";
import { sendError, sendSuccess } from "../utils/response";

export class UploadController {
  constructor(private service: UploadService = uploadService) {}

  uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        sendError(res, "File gambar tidak ditemukan", "BAD_REQUEST", 400);
        return;
      }

      const protocol = req.protocol;
      const host = req.get("host") || "localhost:5001";
      const baseUrl = `${protocol}://${host}`;

      const url = await this.service.processUploadedFile(req.file, baseUrl);
      sendSuccess(res, { url }, "Gambar berhasil diunggah", 201);
    } catch (error) {
      next(error);
    }
  };
}

export const uploadController = new UploadController();
