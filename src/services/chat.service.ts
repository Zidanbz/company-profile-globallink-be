import { prisma } from "../config/database";

export class ChatService {
  // ─── Public / Visitor ──────────────────────────────────────────────────────

  async initSession(sessionId: string, visitorName?: string, visitorEmail?: string) {
    return prisma.chatSession.upsert({
      where: { sessionId },
      update: { status: "ACTIVE" },
      create: {
        sessionId,
        visitorName: visitorName || "Pengunjung",
        visitorEmail: visitorEmail || null,
        status: "ACTIVE",
      },
    });
  }

  async getVisitorMessages(sessionId: string) {
    const session = await prisma.chatSession.findUnique({ where: { sessionId } });
    if (!session) return null;

    // Mark all ADMIN messages as read (visitor is now viewing)
    await prisma.chatMessage.updateMany({
      where: { sessionId: session.id, senderType: "ADMIN", isRead: false },
      data: { isRead: true },
    });
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { unreadVisitor: 0 },
    });

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
    });
    return { session, messages };
  }

  async sendVisitorMessage(sessionId: string, message: string, visitorName?: string) {
    const session = await prisma.chatSession.upsert({
      where: { sessionId },
      update: {
        lastMessageAt: new Date(),
        unreadAdmin: { increment: 1 },
        ...(visitorName ? { visitorName } : {}),
      },
      create: {
        sessionId,
        visitorName: visitorName || "Pengunjung",
        status: "ACTIVE",
        unreadAdmin: 1,
        lastMessageAt: new Date(),
      },
    });

    return prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        senderType: "VISITOR",
        senderName: session.visitorName,
        message,
        isRead: false,
      },
    });
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  async getAllSessions(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return prisma.chatSession.findMany({
      where,
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  async getSessionById(id: number) {
    const session = await prisma.chatSession.findUnique({ where: { id } });
    if (!session) return null;

    // Mark all VISITOR messages as read (admin is now viewing)
    await prisma.chatMessage.updateMany({
      where: { sessionId: id, senderType: "VISITOR", isRead: false },
      data: { isRead: true },
    });
    await prisma.chatSession.update({
      where: { id },
      data: { unreadAdmin: 0 },
    });

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });

    return { session: { ...session, unreadAdmin: 0 }, messages };
  }

  async sendAdminReply(sessionId: number, message: string) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        lastMessageAt: new Date(),
        unreadVisitor: { increment: 1 },
        status: "ACTIVE",
      },
    });

    return prisma.chatMessage.create({
      data: {
        sessionId,
        senderType: "ADMIN",
        senderName: "Admin Globallink",
        message,
        isRead: false,
      },
    });
  }

  async closeSession(id: number) {
    return prisma.chatSession.update({
      where: { id },
      data: { status: "CLOSED" },
    });
  }

  async deleteSession(id: number) {
    return prisma.chatSession.delete({ where: { id } });
  }

  async getTotalUnreadCount() {
    const result = await prisma.chatSession.aggregate({
      _sum: { unreadAdmin: true },
      where: { status: "ACTIVE" },
    });
    return result._sum.unreadAdmin ?? 0;
  }
}

export const chatService = new ChatService();
