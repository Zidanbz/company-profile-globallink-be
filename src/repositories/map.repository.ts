import { prisma } from "../config/database";
import { MapLocation, MapLocationCategory, Prisma } from "@prisma/client";

export interface FindMapOptions {
  category?: MapLocationCategory;
  search?: string;
}

export class MapRepository {
  async findMany(options: FindMapOptions = {}): Promise<MapLocation[]> {
    const { category, search } = options;
    const where: Prisma.MapLocationWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    return prisma.mapLocation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number): Promise<MapLocation | null> {
    return prisma.mapLocation.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.MapLocationCreateInput): Promise<MapLocation> {
    return prisma.mapLocation.create({
      data,
    });
  }

  async update(id: number, data: Prisma.MapLocationUpdateInput): Promise<MapLocation> {
    return prisma.mapLocation.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<MapLocation> {
    return prisma.mapLocation.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return prisma.mapLocation.count();
  }
}

export const mapRepository = new MapRepository();
