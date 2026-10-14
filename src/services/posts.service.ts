import { postRepository, PostRepository } from "../repositories/post.repository";
import { generateSlug } from "../utils/slug";
import { CreatePostInput, GetPostQuery, UpdatePostInput } from "../validators/post.validator";

export class PostsService {
  constructor(private postRepo: PostRepository = postRepository) {}

  async getPublicPosts(query: GetPostQuery) {
    const { page, limit, search, sortBy, sortOrder } = query;
    const { posts, total } = await this.postRepo.findMany({
      page,
      limit,
      search,
      status: "PUBLISHED",
      sortBy,
      sortOrder,
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicPostBySlug(slug: string) {
    const post = await this.postRepo.findBySlug(slug);
    if (!post || post.status !== "PUBLISHED") {
      const error: any = new Error("Artikel tidak ditemukan");
      error.statusCode = 404;
      error.code = "POST_NOT_FOUND";
      throw error;
    }
    return post;
  }

  async getAdminPosts(query: GetPostQuery) {
    const { page, limit, search, status, sortBy, sortOrder } = query;
    const { posts, total } = await this.postRepo.findMany({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminPostById(id: number) {
    const post = await this.postRepo.findById(id);
    if (!post) {
      const error: any = new Error("Artikel tidak ditemukan");
      error.statusCode = 404;
      error.code = "POST_NOT_FOUND";
      throw error;
    }
    return post;
  }

  async createPost(input: CreatePostInput) {
    let finalSlug = input.slug ? generateSlug(input.slug) : generateSlug(input.title);
    
    // Ensure slug uniqueness
    const existing = await this.postRepo.findBySlug(finalSlug);
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await this.postRepo.create({
      title: input.title,
      slug: finalSlug,
      excerpt: input.excerpt || null,
      content: input.content,
      thumbnailUrl: input.thumbnailUrl || null,
      status: input.status,
      publishedAt: input.status === "PUBLISHED" ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : null,
    });

    return post;
  }

  async updatePost(id: number, input: UpdatePostInput) {
    const existing = await this.postRepo.findById(id);
    if (!existing) {
      const error: any = new Error("Artikel tidak ditemukan");
      error.statusCode = 404;
      error.code = "POST_NOT_FOUND";
      throw error;
    }

    let finalSlug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      finalSlug = generateSlug(input.slug);
      const duplicate = await this.postRepo.findBySlug(finalSlug);
      if (duplicate && duplicate.id !== id) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updateData: any = {
      ...(input.title ? { title: input.title } : {}),
      slug: finalSlug,
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.thumbnailUrl !== undefined ? { thumbnailUrl: input.thumbnailUrl } : {}),
      ...(input.status ? { status: input.status } : {}),
    };

    if (input.status === "PUBLISHED" && !existing.publishedAt) {
      updateData.publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
    } else if (input.publishedAt !== undefined) {
      updateData.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    }

    return this.postRepo.update(id, updateData);
  }

  async deletePost(id: number) {
    const existing = await this.postRepo.findById(id);
    if (!existing) {
      const error: any = new Error("Artikel tidak ditemukan");
      error.statusCode = 404;
      error.code = "POST_NOT_FOUND";
      throw error;
    }
    return this.postRepo.delete(id);
  }

  async getDashboardStats() {
    return this.postRepo.getStats();
  }
}

export const postsService = new PostsService();
