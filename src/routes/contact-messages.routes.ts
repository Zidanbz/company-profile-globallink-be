import { Router } from "express";
import { contactMessagesController } from "../controllers/contact-messages.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const publicContactRouter = Router();
publicContactRouter.post("/", contactMessagesController.submitMessage.bind(contactMessagesController));

export const adminContactRouter = Router();
adminContactRouter.use(requireAuth);

adminContactRouter.get("/", contactMessagesController.getAllAdmin.bind(contactMessagesController));
adminContactRouter.get("/unread-count", contactMessagesController.getUnreadCount.bind(contactMessagesController));
adminContactRouter.patch("/:id/read", contactMessagesController.markAsRead.bind(contactMessagesController));
adminContactRouter.delete("/:id", contactMessagesController.delete.bind(contactMessagesController));
