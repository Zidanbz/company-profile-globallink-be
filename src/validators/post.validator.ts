import { z } from "zod";

export const postStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul artikel wajib diisi").max(255),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().min(1, "Konten artikel wajib diisi"),
    thumbnailUrl: z.string().url("URL thumbnail tidak valid").optional().or(z.literal("")),
    status: postStatusEnum.default("DRAFT"),
    publishedAt: z.string().datetime().optional().nullable(),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID harus berupa angka"),
  }),
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    slug: z.string().optional(),
    excerpt: z.string().optional().nullable(),
    content: z.string().min(1).optional(),
    thumbnailUrl: z.string().url().optional().or(z.literal("")).nullable(),
    status: postStatusEnum.optional(),
    publishedAt: z.string().datetime().optional().nullable(),
  }),
});

export const getPostQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n <= 100, "Maksimal limit adalah 100").default("10"),
    search: z.string().optional(),
    status: postStatusEnum.optional(),
    sortBy: z.enum(["createdAt", "publishedAt", "title"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type UpdatePostInput = z.infer<typeof updatePostSchema>["body"];
export type GetPostQuery = z.infer<typeof getPostQuerySchema>["query"];
