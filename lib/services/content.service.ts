import { contentRepository } from "../repositories/content.repository";
import { BlogInput, blogSchema } from "../validations/content";
import { uploadImage } from "../cloudinary";
import { logAudit } from "../utils/audit";
import { Prisma } from "@prisma/client";

export class ContentService {
  async createBlog(data: BlogInput, coverImage?: File, userId?: string) {
    const parsed = blogSchema.parse(data);
    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const createData: Prisma.BlogCreateInput = {
      title: parsed.title,
      slug,
      content: parsed.content,
      snippet: parsed.snippet,
      seoTitle: parsed.seoTitle,
      seoDesc: parsed.seoDesc,
      categories: parsed.categories,
      tags: parsed.tags,
      isPublished: parsed.isPublished,
    };

    if (coverImage) {
      createData.coverImage = await uploadImage(coverImage);
    }

    const blog = await contentRepository.createBlog(createData);
    
    await logAudit("CREATE", "Blog", blog.id, userId, { title: blog.title });

    return blog;
  }

  async getBlogs(publishedOnly = true) {
    return contentRepository.getBlogs(publishedOnly);
  }

  async sendNotification(userId: string, type: string, message: string) {
    return contentRepository.createNotification({
      user: { connect: { id: userId } },
      type,
      message,
    });
  }

  async getUserNotifications(userId: string) {
    return contentRepository.getNotifications(userId);
  }

  async markNotificationRead(id: string) {
    return contentRepository.markNotificationRead(id);
  }
}

export const contentService = new ContentService();
