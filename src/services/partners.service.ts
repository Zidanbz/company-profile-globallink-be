import { prisma } from "../config/database";

export interface CreatePartnerDTO {
  name: string;
  category?: string; // "PARTNER" or "CLIENT"
  logoUrl: string;
  svgContent?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdatePartnerDTO extends Partial<CreatePartnerDTO> {}

export class PartnersService {
  async getAllPublic(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category.toUpperCase();
    }
    return prisma.partnerLogo.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async getAllAdmin(category?: string) {
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }
    return prisma.partnerLogo.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async getById(id: number) {
    return prisma.partnerLogo.findUnique({
      where: { id },
    });
  }

  async create(data: CreatePartnerDTO) {
    return prisma.partnerLogo.create({
      data: {
        name: data.name,
        category: (data.category || "PARTNER").toUpperCase(),
        logoUrl: data.logoUrl,
        svgContent: data.svgContent || null,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: number, data: UpdatePartnerDTO) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category.toUpperCase();
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
    if (data.svgContent !== undefined) updateData.svgContent = data.svgContent;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.partnerLogo.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return prisma.partnerLogo.delete({
      where: { id },
    });
  }
}

export const partnersService = new PartnersService();
