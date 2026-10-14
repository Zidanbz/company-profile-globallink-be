import { prisma } from "../config/database";

export interface CreateServiceDTO {
  title: string;
  slug?: string;
  description: string;
  icon?: string;
  badge?: string;
  imageUrl?: string;
  features?: string[];
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateServiceDTO extends Partial<CreateServiceDTO> {}

export class ServicesService {
  async getAllPublic() {
    return prisma.serviceItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getAllAdmin() {
    return prisma.serviceItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async getById(id: number) {
    return prisma.serviceItem.findUnique({
      where: { id },
    });
  }

  async getBySlug(slug: string) {
    return prisma.serviceItem.findUnique({
      where: { slug },
    });
  }

  async create(data: CreateServiceDTO) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return prisma.serviceItem.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        icon: data.icon || "Network",
        badge: data.badge || null,
        imageUrl: data.imageUrl || null,
        features: data.features
          ? Array.isArray(data.features)
            ? JSON.stringify(data.features)
            : data.features
          : null,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: number, data: UpdateServiceDTO) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.features !== undefined) {
      updateData.features = Array.isArray(data.features)
        ? JSON.stringify(data.features)
        : data.features;
    }
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.serviceItem.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return prisma.serviceItem.delete({
      where: { id },
    });
  }
}

export const servicesService = new ServicesService();
