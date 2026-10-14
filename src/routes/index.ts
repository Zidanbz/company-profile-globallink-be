import { Router } from "express";
import authRoutes from "./auth.routes";
import { publicPostsRouter, adminPostsRouter } from "./posts.routes";
import { publicMapRouter, adminMapRouter } from "./map.routes";
import { publicContentRouter, adminContentRouter } from "./content.routes";
import { publicServicesRouter, adminServicesRouter } from "./services.routes";
import { publicAboutStatsRouter, adminAboutStatsRouter } from "./about-stats.routes";
import { publicContactRouter, adminContactRouter } from "./contact-messages.routes";
import { publicPartnersRouter, adminPartnersRouter } from "./partners.routes";
import { publicAnalyticsRouter, adminAnalyticsRouter } from "./analytics.routes";
import uploadRoutes from "./upload.routes";

const apiV1Router = Router();

// Public Routes
apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/posts", publicPostsRouter);
apiV1Router.use("/map-locations", publicMapRouter);
apiV1Router.use("/content", publicContentRouter);
apiV1Router.use("/services", publicServicesRouter);
apiV1Router.use("/about-stats", publicAboutStatsRouter);
apiV1Router.use("/contact-messages", publicContactRouter);
apiV1Router.use("/partners", publicPartnersRouter);
apiV1Router.use("/analytics", publicAnalyticsRouter);

// Admin Protected Routes
apiV1Router.use("/admin/posts", adminPostsRouter);
apiV1Router.use("/admin/map-locations", adminMapRouter);
apiV1Router.use("/admin/content", adminContentRouter);
apiV1Router.use("/admin/services", adminServicesRouter);
apiV1Router.use("/admin/about-stats", adminAboutStatsRouter);
apiV1Router.use("/admin/contact-messages", adminContactRouter);
apiV1Router.use("/admin/partners", adminPartnersRouter);
apiV1Router.use("/admin/analytics", adminAnalyticsRouter);
apiV1Router.use("/admin/upload", uploadRoutes);

export default apiV1Router;

