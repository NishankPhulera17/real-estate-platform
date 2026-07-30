import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class AnalyticsRepository {
  async upsertVisitor(
    cookieId: string,
    data: {
      userId?: string;
      userAgent?: string;
      ipAddress?: string;
      referrer?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    }
  ) {
    let validUserId = data.userId;
    if (validUserId) {
      const userExists = await prisma.user.findUnique({ where: { id: validUserId } });
      if (!userExists) validUserId = undefined;
    }

    return prisma.visitor.upsert({
      where: { cookieId },
      update: {
        lastVisitedAt: new Date(),
        ...(validUserId ? { userId: validUserId } : {}),
        ...(data.utmSource ? { utmSource: data.utmSource } : {}),
        ...(data.utmMedium ? { utmMedium: data.utmMedium } : {}),
        ...(data.utmCampaign ? { utmCampaign: data.utmCampaign } : {}),
      },
      create: {
        cookieId,
        userId: validUserId,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
  }

  async createEvent(data: {
    visitorId: string;
    userId?: string;
    propertyId?: string;
    eventType: string;
    path: string;
    metadata?: string;
  }) {
    return prisma.trackingEvent.create({
      data: {
        visitorId: data.visitorId,
        userId: data.userId,
        propertyId: data.propertyId,
        eventType: data.eventType,
        path: data.path,
        metadata: data.metadata,
      },
    });
  }

  async getVisitorByCookieId(cookieId: string) {
    return prisma.visitor.findUnique({
      where: { cookieId },
      include: {
        events: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                propertyType: true,
                images: { where: { isCover: true }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        user: true,
      },
    });
  }

  async getVisitorById(visitorId: string) {
    return prisma.visitor.findUnique({
      where: { id: visitorId },
      include: {
        events: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                propertyType: true,
                images: { take: 1 },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        user: true,
      },
    });
  }

  async getVisitorPropertyViewCount(visitorId: string) {
    const events = await prisma.trackingEvent.findMany({
      where: {
        visitorId,
        eventType: "PROPERTY_VIEW",
        propertyId: { not: null },
      },
      select: { propertyId: true, createdAt: true },
    });

    const uniqueProperties = new Set(events.map((e) => e.propertyId));
    return {
      totalViews: events.length,
      distinctProperties: uniqueProperties.size,
      events,
    };
  }

  async getVisitorStats(visitorId: string) {
    const events = await prisma.trackingEvent.groupBy({
      by: ["eventType"],
      where: { visitorId },
      _count: true,
    });

    return events.reduce((acc, curr) => {
      acc[curr.eventType] = curr._count;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const analyticsRepository = new AnalyticsRepository();
