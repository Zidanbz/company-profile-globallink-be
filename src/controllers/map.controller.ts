import { Request, Response, NextFunction } from "express";
import { mapService, MapService } from "../services/map.service";
import { sendSuccess } from "../utils/response";

export class MapController {
  constructor(private service: MapService = mapService) {}

  getPublicLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const locations = await this.service.getPublicLocations(req.query as any);
      sendSuccess(res, locations, "Daftar lokasi infrastruktur berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const location = await this.service.getLocationById(id);
      sendSuccess(res, location, "Detail lokasi infrastruktur berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  getAdminLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const locations = await this.service.getPublicLocations(req.query as any);
      sendSuccess(res, locations, "Daftar lokasi admin berhasil diambil");
    } catch (error) {
      next(error);
    }
  };

  createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const location = await this.service.createLocation(req.body);
      sendSuccess(res, location, "Lokasi infrastruktur berhasil ditambahkan", 201);
    } catch (error) {
      next(error);
    }
  };

  updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const location = await this.service.updateLocation(id, req.body);
      sendSuccess(res, location, "Lokasi infrastruktur berhasil diperbarui");
    } catch (error) {
      next(error);
    }
  };

  deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.service.deleteLocation(id);
      sendSuccess(res, { id }, "Lokasi infrastruktur berhasil dihapus");
    } catch (error) {
      next(error);
    }
  };

  getTotalCount = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const count = await this.service.getTotalCount();
      sendSuccess(res, { count }, "Total lokasi berhasil diambil");
    } catch (error) {
      next(error);
    }
  };
}

export const mapController = new MapController();
