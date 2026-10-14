import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";

const app = createApp();

const startServer = async () => {
  try {
    // Attempt database connection check
    await prisma.$connect();
    console.log("✔ Connected to database successfully.");
  } catch (error) {
    console.warn("⚠ Warning: Database connection not ready yet. Please ensure MySQL is running with credentials from .env.");
  }

  const port = parseInt(env.PORT, 10) || 5001;
  app.listen(port, () => {
    console.log(`🚀 Globallink Backend API running on http://localhost:${port}/api/v1`);
  });
};

startServer();
