"use server";

import { auth } from "@/auth";
import { leadService } from "@/lib/services/lead.service";
import { CaptureLeadInput, UpdateLeadStageInput, AddLeadActivityInput } from "@/lib/validations/lead";

// Public endpoint for capturing leads (e.g. from property page CTA)
export async function captureLeadAction(data: CaptureLeadInput) {
  try {
    const session = await auth();
    // User might be logged in or guest, if logged in, link user ID if desired
    // Here we pass session?.user?.id just in case
    const lead = await leadService.captureLead(data, session?.user?.id);
    return { success: true, data: lead };
  } catch (error: any) {
    return { error: error.message || "Failed to capture lead" };
  }
}

// Protected endpoints for Builders and Admins
export async function updateLeadStageAction(data: UpdateLeadStageInput) {
  const session = await auth();
  if (!session || !["BUILDER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const lead = await leadService.updateLeadStage(data);
    return { success: true, data: lead };
  } catch (error: any) {
    return { error: "Failed to update lead stage" };
  }
}

export async function addLeadActivityAction(data: AddLeadActivityInput) {
  const session = await auth();
  if (!session || !["BUILDER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const activity = await leadService.addActivity(data);
    return { success: true, data: activity };
  } catch (error: any) {
    return { error: "Failed to add activity" };
  }
}

export async function getDashboardLeadsAction() {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    if (session.user.role === "ADMIN") {
      const leads = await leadService.getAllLeads();
      return { success: true, data: leads };
    } else if (session.user.role === "BUILDER") {
      const leads = await leadService.getBuilderLeads(session.user.id); // Assuming builder user ID is the builder ID itself (needs mapping ideally)
      return { success: true, data: leads };
    }
    return { error: "Unauthorized" };
  } catch (error: any) {
    return { error: "Failed to fetch leads" };
  }
}
