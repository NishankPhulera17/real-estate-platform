import { z } from "zod";
import { LeadStage } from "@prisma/client";

export const captureLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.string().default("Website"),
  type: z.string().default("General Inquiry"),
  notes: z.string().optional(),
  propertyId: z.string().optional(),
  builderId: z.string().optional(),
});

export const updateLeadStageSchema = z.object({
  leadId: z.string(),
  stage: z.nativeEnum(LeadStage),
  note: z.string().optional(),
});

export const addLeadActivitySchema = z.object({
  leadId: z.string(),
  type: z.string(),
  note: z.string(),
});

export type CaptureLeadInput = z.infer<typeof captureLeadSchema>;
export type UpdateLeadStageInput = z.infer<typeof updateLeadStageSchema>;
export type AddLeadActivityInput = z.infer<typeof addLeadActivitySchema>;
