import { mapRepository, MapRepository } from "../repositories/map.repository";
import { CreateMapLocationInput, GetMapQuery, UpdateMapLocationInput } from "../validators/map.validator";
import { Prisma } from "@prisma/client";

export class MapService {
  constructor(private mapRepo: MapRepository = mapRepository) {}

  async getPublicLocations(query: GetMapQuery) {
    const locations = await this.mapRepo.findMany({
      category: query.category,
      search: query.search,
    });
    return locations;
  }

  async getLocationById(id: number) {
    const location = await this.mapRepo.findById(id);
    if (!location) {
      const error: any = new Error("Lokasi tidak ditemukan");
      error.statusCode = 404;
      error.code = "LOCATION_NOT_FOUND";
      throw error;
    }
    return location;
  }

  async createLocation(input: CreateMapLocationInput) {
    const location = await this.mapRepo.create({
      name: input.name,
      category: input.category,
      latitude: new Prisma.Decimal(input.latitude),
      longitude: new Prisma.Decimal(input.longitude),
      description: input.description || null,
    });
    return location;
  }

  async updateLocation(id: number, input: UpdateMapLocationInput) {
    const existing = await this.mapRepo.findById(id);
    if (!existing) {
      const error: any = new Error("Lokasi tidak ditemukan");
      error.statusCode = 404;
      error.code = "LOCATION_NOT_FOUND";
      throw error;
    }

    const data: Prisma.MapLocationUpdateInput = {
      ...(input.name ? { name: input.name } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.latitude !== undefined ? { latitude: new Prisma.Decimal(input.latitude) } : {}),
      ...(input.longitude !== undefined ? { longitude: new Prisma.Decimal(input.longitude) } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    };

    return this.mapRepo.update(id, data);
  }

  async deleteLocation(id: number) {
    const existing = await this.mapRepo.findById(id);
    if (!existing) {
      const error: any = new Error("Lokasi tidak ditemukan");
      error.statusCode = 404;
      error.code = "LOCATION_NOT_FOUND";
      throw error;
    }
    return this.mapRepo.delete(id);
  }

  async getTotalCount() {
    return this.mapRepo.count();
  }
}

export const mapService = new MapService();
