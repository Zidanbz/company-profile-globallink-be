import { z } from "zod";

export const mapCategoryEnum = z.enum([
  "FIBER_OPTIC",
  "DATA_CENTER",
  "POP",
  "OFFICE",
  "COVERAGE",
  "OTHER",
]);

export const createMapLocationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama lokasi wajib diisi").max(255),
    category: mapCategoryEnum,
    latitude: z
      .number({ invalid_type_error: "Latitude harus berupa angka" })
      .min(-90, "Latitude minimal -90")
      .max(90, "Latitude maksimal 90"),
    longitude: z
      .number({ invalid_type_error: "Longitude harus berupa angka" })
      .min(-180, "Longitude minimal -180")
      .max(180, "Longitude maksimal 180"),
    description: z.string().optional().nullable(),
  }),
});

export const updateMapLocationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID harus berupa angka"),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    category: mapCategoryEnum.optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    description: z.string().optional().nullable(),
  }),
});

export const getMapQuerySchema = z.object({
  query: z.object({
    category: mapCategoryEnum.optional(),
    search: z.string().optional(),
  }),
});

export type CreateMapLocationInput = z.infer<typeof createMapLocationSchema>["body"];
export type UpdateMapLocationInput = z.infer<typeof updateMapLocationSchema>["body"];
export type GetMapQuery = z.infer<typeof getMapQuerySchema>["query"];
