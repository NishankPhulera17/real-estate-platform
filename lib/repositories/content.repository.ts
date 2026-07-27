import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ContentRepository {
  async createBlog(data: Prisma.BlogCreateInput) {
    return prisma.blog.create({ data });
  }

  async getBlogs(publishedOnly = true) {
    return prisma.blog.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  async createNotification(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markNotificationRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}

export const contentRepository = new ContentRepository();
