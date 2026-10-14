import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("mysql://root:password@localhost:3306/globallink_db"),
  JWT_SECRET: z.string().default("globallink_secret_jwt_key_default_32_characters"),
  JWT_EXPIRES_IN: z.string().default("24h"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  UPLOAD_PROVIDER: z.enum(["local", "cloudinary"]).default("local"),
  UPLOAD_DIR: z.string().default("uploads"),
  UPLOAD_API_KEY: z.string().optional(),
  UPLOAD_API_SECRET: z.string().optional(),
  UPLOAD_CLOUD_NAME: z.string().optional(),
});

export const env = envSchema.parse(process.env);
