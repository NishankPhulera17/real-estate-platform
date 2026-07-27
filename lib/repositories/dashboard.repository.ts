import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  async getAdminStats() {
    const [totalUsers, activeUsers, builders, brokers, properties, publishedProperties, drafts, leads, appointments] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { /* Assuming active check, maybe last login within 30 days */ } }),
      prisma.builder.count(),
      prisma.broker.count(),
      prisma.property.count({ where: { isDeleted: false } }),
      prisma.property.count({ where: { isDeleted: false, status: "PUBLISHED" } }),
      prisma.property.count({ where: { isDeleted: false, status: "DRAFT" } }),
      prisma.lead.count(),
      prisma.appointment.count(),
    ]);

    const wonLeads = await prisma.lead.count({ where: { stage: "WON" } });
    const conversionRate = leads > 0 ? (wonLeads / leads) * 100 : 0;

    return {
      totalUsers,
      activeUsers,
      builders,
      brokers,
      properties,
      publishedProperties,
      drafts,
      leads,
      appointments,
      conversionRate,
    };
  }

  async getBuilderStats(builderId: string) {
    const [properties, leads, appointments] = await Promise.all([
      prisma.property.count({ where: { builderId, isDeleted: false } }),
      prisma.lead.count({ where: { builderId } }),
      prisma.appointment.count({ where: { builderId } }),
    ]);

    const wonLeads = await prisma.lead.count({ where: { builderId, stage: "WON" } });
    const conversionRate = leads > 0 ? (wonLeads / leads) * 100 : 0;

    return { properties, leads, appointments, conversionRate };
  }

  async getBrokerStats(brokerId: string) {
    const properties = await prisma.property.count({ where: { brokerId, isDeleted: false } });
    
    // Brokers typically might not have direct leads tracked in the same builder way, but we can query by property
    const leads = await prisma.lead.count({
      where: {
        property: { brokerId }
      }
    });

    return { properties, inquiries: leads };
  }
}

export const dashboardRepository = new DashboardRepository();
