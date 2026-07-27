import { prisma } from "@/lib/prisma";

export class EngagementRepository {
  async addFavorite(userId: string, propertyId: string) {
    return prisma.favorite.create({
      data: { userId, propertyId }
    });
  }

  async removeFavorite(userId: string, propertyId: string) {
    return prisma.favorite.delete({
      where: {
        userId_propertyId: { userId, propertyId }
      }
    });
  }

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: { property: true }
    });
  }

  async addComparison(userId: string, propertyId: string) {
    // get user's comparison or create one
    let comparison = await prisma.comparison.findFirst({
      where: { userId }
    });

    if (!comparison) {
      comparison = await prisma.comparison.create({
        data: { userId }
      });
    }

    // prevent >4 properties
    const count = await prisma.comparisonProperty.count({
      where: { comparisonId: comparison.id }
    });
    
    if (count >= 4) {
      throw new Error("Cannot compare more than 4 properties");
    }

    return prisma.comparisonProperty.create({
      data: { comparisonId: comparison.id, propertyId }
    });
  }

  async removeComparison(userId: string, propertyId: string) {
    const comparison = await prisma.comparison.findFirst({ where: { userId } });
    if (!comparison) return;
    
    return prisma.comparisonProperty.delete({
      where: {
        comparisonId_propertyId: {
          comparisonId: comparison.id,
          propertyId
        }
      }
    });
  }

  async getComparison(userId: string) {
    return prisma.comparison.findFirst({
      where: { userId },
      include: { properties: { include: { property: true } } }
    });
  }

  async createAppointment(data: any) {
    return prisma.appointment.create({ data });
  }

  async createReview(data: any) {
    return prisma.review.create({ data });
  }
}

export const engagementRepository = new EngagementRepository();
