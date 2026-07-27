import { engagementRepository } from "../repositories/engagement.repository";
import { AppointmentInput, appointmentSchema, ReviewInput, reviewSchema } from "../validations/engagement";

export class EngagementService {
  async addFavorite(userId: string, propertyId: string) {
    try {
      return await engagementRepository.addFavorite(userId, propertyId);
    } catch (error) {
      throw new Error("Could not add favorite. It may already exist.");
    }
  }

  async removeFavorite(userId: string, propertyId: string) {
    return engagementRepository.removeFavorite(userId, propertyId);
  }

  async getFavorites(userId: string) {
    return engagementRepository.getFavorites(userId);
  }

  async addComparison(userId: string, propertyId: string) {
    return engagementRepository.addComparison(userId, propertyId);
  }

  async removeComparison(userId: string, propertyId: string) {
    return engagementRepository.removeComparison(userId, propertyId);
  }

  async getComparison(userId: string) {
    return engagementRepository.getComparison(userId);
  }

  async bookAppointment(userId: string, data: AppointmentInput) {
    const parsed = appointmentSchema.parse(data);
    return engagementRepository.createAppointment({
      userId,
      propertyId: parsed.propertyId,
      builderId: parsed.builderId,
      date: parsed.date,
      time: parsed.time,
      status: "Scheduled"
    });
  }

  async submitReview(userId: string, data: ReviewInput) {
    const parsed = reviewSchema.parse(data);
    return engagementRepository.createReview({
      userId,
      propertyId: parsed.propertyId,
      rating: parsed.rating,
      comment: parsed.comment,
      isApproved: false // Requires admin approval
    });
  }
}

export const engagementService = new EngagementService();
