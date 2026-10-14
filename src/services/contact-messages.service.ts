import { prisma } from "../config/database";

export interface CreateContactMessageDTO {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export class ContactMessagesService {
  async create(data: CreateContactMessageDTO) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      },
    });
  }

  async getAllAdmin(page: number = 1, limit: number = 20, isRead?: boolean) {
    const where: any = {};
    if (typeof isRead === "boolean") {
      where.isRead = isRead;
    }

    const [total, items] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(id: number, isRead: boolean = true) {
    return prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  async delete(id: number) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }

  async getUnreadCount() {
    return prisma.contactMessage.count({
      where: { isRead: false },
    });
  }
}

export const contactMessagesService = new ContactMessagesService();
