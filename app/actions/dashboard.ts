"use server";

import { auth } from "@/auth";
import { dashboardService } from "@/lib/services/dashboard.service";
import { prisma } from "@/lib/prisma";

export async function getDashboardStatsAction() {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  try {
    const role = session.user.role;

    if (role === "ADMIN") {
      const stats = await dashboardService.getAdminDashboard();
      return { success: true, data: stats };
    } else if (role === "BUILDER") {
      // Find builder ID based on User ID
      const builder = await prisma.builder.findUnique({ where: { userId: session.user.id } });
      if (!builder) return { error: "Builder profile not found" };
      const stats = await dashboardService.getBuilderDashboard(builder.id);
      return { success: true, data: stats };
    } else if (role === "BROKER") {
      const broker = await prisma.broker.findUnique({ where: { userId: session.user.id } });
      if (!broker) return { error: "Broker profile not found" };
      const stats = await dashboardService.getBrokerDashboard(broker.id);
      return { success: true, data: stats };
    }

    return { error: "No dashboard stats for this role" };
  } catch (error: any) {
    return { error: "Failed to fetch dashboard stats" };
  }
}
