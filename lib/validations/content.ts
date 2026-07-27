import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(5, "Title too short"),
  content: z.string().min(20, "Content too short"),
  snippet: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;
