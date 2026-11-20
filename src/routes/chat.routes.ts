import { Router } from "express";
import { chatController } from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth.middleware";

// Public routes (visitor)
export const publicChatRouter = Router();
publicChatRouter.post("/init", chatController.initSession.bind(chatController));
publicChatRouter.get("/messages", chatController.getVisitorMessages.bind(chatController));
publicChatRouter.post("/messages", chatController.sendVisitorMessage.bind(chatController));

// Admin protected routes
export const adminChatRouter = Router();
adminChatRouter.use(requireAuth);

adminChatRouter.get("/sessions", chatController.getAllSessions.bind(chatController));
adminChatRouter.get("/unread-count", chatController.getUnreadCount.bind(chatController));
adminChatRouter.get("/sessions/:id", chatController.getSessionById.bind(chatController));
adminChatRouter.post("/sessions/:id/messages", chatController.sendAdminReply.bind(chatController));
adminChatRouter.patch("/sessions/:id/close", chatController.closeSession.bind(chatController));
adminChatRouter.delete("/sessions/:id", chatController.deleteSession.bind(chatController));
