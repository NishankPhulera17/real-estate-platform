import { z } from "zod";
import { PropertyStatus } from "@prisma/client";

export const propertySchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().optional(),
  price: z.number().positive(),
  propertyType: z.string(),
  possessionStatus: z.string(),
  bhk: z.number().int().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  parking: z.number().int().optional(),
  furnished: z.string().optional(),
  areaSqFt: z.number().positive(),
  reraId: z.string().optional(),
  
  cityId: z.string().optional(),
  
  // Location
  address: z.string().min(5),
  locality: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Relations & Media
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export const propertyUpdateSchema = propertySchema.partial().extend({
  status: z.nativeEnum(PropertyStatus).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
