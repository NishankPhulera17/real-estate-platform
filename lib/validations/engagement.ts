import { z } from "zod";

export const appointmentSchema = z.object({
  propertyId: z.string(),
  builderId: z.string().optional(),
  date: z.coerce.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:mm)"),
});

export const reviewSchema = z.object({
  propertyId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
