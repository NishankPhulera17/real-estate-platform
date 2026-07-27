"use server";

import { auth } from "@/auth";
import { contentService } from "@/lib/services/content.service";
import { BlogInput } from "@/lib/validations/content";

export async function createBlogAction(data: BlogInput, formData?: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const file = formData?.get("coverImage") as File | undefined;
    const blog = await contentService.createBlog(data, file, session.user.id);
    return { success: true, data: blog };
  } catch (error: any) {
    return { error: error.message || "Failed to create blog post" };
  }
}

export async function getBlogsAction() {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";
    // Admins see all, others see only published
    const blogs = await contentService.getBlogs(!isAdmin);
    return { success: true, data: blogs };
  } catch (error: any) {
    return { error: "Failed to fetch blogs" };
  }
}

export async function getNotificationsAction() {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    const notifications = await contentService.getUserNotifications(session.user.id);
    return { success: true, data: notifications };
  } catch (error: any) {
    return { error: "Failed to fetch notifications" };
  }
}

export async function markNotificationReadAction(id: string) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    await contentService.markNotificationRead(id);
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to mark read" };
  }
}
