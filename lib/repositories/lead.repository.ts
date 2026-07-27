import { prisma } from "@/lib/prisma";
import { Prisma, LeadStage } from "@prisma/client";

export class LeadRepository {
  async createLead(data: Prisma.LeadCreateInput) {
    return prisma.lead.create({ data });
  }

  async updateLeadStage(id: string, stage: LeadStage) {
    return prisma.lead.update({
      where: { id },
      data: { stage },
    });
  }

  async addActivity(leadId: string, type: string, note?: string) {
    return prisma.leadActivity.create({
      data: {
        leadId,
        type,
        note,
      }
    });
  }

  async getLeadsByBuilder(builderId: string) {
    return prisma.lead.findMany({
      where: { builderId },
      include: { property: true, activities: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllLeads() {
    return prisma.lead.findMany({
      include: { property: true, builder: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const leadRepository = new LeadRepository();
