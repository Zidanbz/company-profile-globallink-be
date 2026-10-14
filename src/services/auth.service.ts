import { userRepository, UserRepository } from "../repositories/user.repository";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { LoginInput } from "../validators/auth.validator";

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async login(input: LoginInput) {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      const error: any = new Error("Kredensial login tidak valid");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      const error: any = new Error("Kredensial login tidak valid");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      const error: any = new Error("User tidak ditemukan");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
