import { leadRepository } from "../repositories/lead.repository";
import { CaptureLeadInput, captureLeadSchema, UpdateLeadStageInput, updateLeadStageSchema, AddLeadActivityInput, addLeadActivitySchema } from "../validations/lead";
import { Prisma } from "@prisma/client";

export class LeadService {
  async captureLead(data: CaptureLeadInput, userId?: string) {
    const parsed = captureLeadSchema.parse(data);

    const createData: Prisma.LeadCreateInput = {
      name: parsed.name,
      phone: parsed.phone,
      email: parsed.email,
      source: parsed.source,
      type: parsed.type,
      notes: parsed.notes,
    };

    if (userId) createData.assignedUser = { connect: { id: userId } };
    if (parsed.propertyId) createData.property = { connect: { id: parsed.propertyId } };
    if (parsed.builderId) createData.builder = { connect: { id: parsed.builderId } };

    const lead = await leadRepository.createLead(createData);

    // Automatically log activity for creation
    await leadRepository.addActivity(lead.id, "System", "Lead captured from " + parsed.source);

    return lead;
  }

  async updateLeadStage(data: UpdateLeadStageInput) {
    const parsed = updateLeadStageSchema.parse(data);
    const updated = await leadRepository.updateLeadStage(parsed.leadId, parsed.stage);
    
    await leadRepository.addActivity(
      parsed.leadId, 
      "StageChange", 
      `Stage changed to ${parsed.stage}${parsed.note ? ` - ${parsed.note}` : ""}`
    );

    return updated;
  }

  async addActivity(data: AddLeadActivityInput) {
    const parsed = addLeadActivitySchema.parse(data);
    return leadRepository.addActivity(parsed.leadId, parsed.type, parsed.note);
  }

  async getBuilderLeads(builderId: string) {
    return leadRepository.getLeadsByBuilder(builderId);
  }

  async getAllLeads() {
    return leadRepository.getAllLeads();
  }
}

export const leadService = new LeadService();
