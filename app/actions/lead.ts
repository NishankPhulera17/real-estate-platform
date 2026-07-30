"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import { leadService } from "@/lib/services/lead.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { CaptureLeadInput, UpdateLeadStageInput, AddLeadActivityInput } from "@/lib/validations/lead";

// Public endpoint for capturing leads (e.g. from property page CTA)
export async function captureLeadAction(data: CaptureLeadInput) {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const cookieId = cookieStore.get("visitor_id")?.value;

    let visitorId: string | undefined = undefined;
    let intentScore = 55; // Default strong baseline for submitting contact details

    if (cookieId) {
      const visitor = await analyticsService.getVisitorTimeline(cookieId);
      if (visitor) {
        visitorId = visitor.id;
        const calculatedScore = await analyticsService.calculateIntentScore(visitor.id);
        intentScore = Math.max(calculatedScore, intentScore);
      }
    }

    const lead = await leadService.captureLead(data, session?.user?.id, visitorId, intentScore);
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
