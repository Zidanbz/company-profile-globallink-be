import { Request, Response, NextFunction } from "express";
import { authService, AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";

export class AuthController {
  constructor(private service: AuthService = authService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.login(req.body);
      sendSuccess(res, result, "Login berhasil", 200);
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const user = await this.service.getCurrentUser(userId);
      sendSuccess(res, user, "Berhasil mendapatkan profil user", 200);
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    sendSuccess(res, { loggedOut: true }, "Logout berhasil", 200);
  };
}

export const authController = new AuthController();
