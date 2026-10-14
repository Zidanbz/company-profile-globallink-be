import { prisma } from "../config/database";
import { Post, PostStatus, Prisma } from "@prisma/client";

export interface FindPostsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: PostStatus;
  sortBy?: "createdAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export class PostRepository {
  async findMany(options: FindPostsOptions = {}): Promise<{ posts: Post[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const where: Prisma.PostWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
    });
  }

  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({
      data,
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, published, draft, archived] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "ARCHIVED" } }),
    ]);

    return { total, published, draft, archived };
  }
}

export const postRepository = new PostRepository();
