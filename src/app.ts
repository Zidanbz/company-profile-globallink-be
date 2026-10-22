import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import apiV1Router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rate-limit.middleware";
import { sendError } from "./utils/response";

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!requestOrigin) return callback(null, true);
        if (allowedOrigins.includes("*") || allowedOrigins.includes(requestOrigin)) {
          return callback(null, true);
        }
        // Allow any subdomain of globallink.net.id
        if (/^https?:\/\/([a-zA-Z0-9-]+\.)*globallink\.net\.id$/.test(requestOrigin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Static files for uploaded images
  const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
  app.use("/uploads", express.static(uploadDir));

  // Rate Limiting
  app.use("/api", apiLimiter);

  // Healthcheck endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API v1 Routes
  app.use("/api/v1", apiV1Router);

  // 404 Route Handler
  app.use((_req: Request, res: Response) => {
    sendError(res, "Endpoint tidak ditemukan", "NOT_FOUND", 404);
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
