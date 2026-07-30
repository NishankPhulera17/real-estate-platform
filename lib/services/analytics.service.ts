import { analyticsRepository } from "../repositories/analytics.repository";
import { prisma } from "@/lib/prisma";

export interface TrackEventInput {
  cookieId: string;
  eventType: string;
  path: string;
  propertyId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export class AnalyticsService {
  async trackEvent(input: TrackEventInput) {
    try {
      const visitor = await analyticsRepository.upsertVisitor(input.cookieId, {
        userId: input.userId,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
        referrer: input.referrer,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
      });

      const metadataStr = input.metadata ? JSON.stringify(input.metadata) : undefined;
      const event = await analyticsRepository.createEvent({
        visitorId: visitor.id,
        userId: input.userId || visitor.userId || undefined,
        propertyId: input.propertyId,
        eventType: input.eventType,
        path: input.path,
        metadata: metadataStr,
      });

      const intentScore = await this.calculateIntentScore(visitor.id);

      const existingLeads = await prisma.lead.findMany({
        where: { visitorId: visitor.id },
      });

      if (existingLeads.length > 0) {
        await prisma.lead.updateMany({
          where: { visitorId: visitor.id },
          data: { intentScore },
        });
      } else if (input.userId) {
        if (intentScore >= 35 && input.propertyId) {
          const user = await prisma.user.findUnique({
            where: { id: input.userId },
          });

          if (user && user.role === "BUYER" || user?.role === "GUEST") {
            const existingAutoLead = await prisma.lead.findFirst({
              where: {
                OR: [{ email: user.email }, { name: user.name }],
                type: "High-Intent Browsing",
              },
            });

            if (!existingAutoLead) {
              const property = await prisma.property.findUnique({
                where: { id: input.propertyId },
              });
              await prisma.lead.create({
                data: {
                  name: user.name || "Authenticated Buyer",
                  phone: user.phone || "N/A",
                  email: user.email,
                  source: input.utmSource ? `Web - ${input.utmSource}` : "Automated Intent Tracker",
                  type: "High-Intent Browsing",
                  stage: "NEW",
                  notes: `System auto-created: User checked out ${property?.title || "listings"} with Intent Score ${intentScore}.`,
                  propertyId: input.propertyId,
                  visitorId: visitor.id,
                  intentScore: intentScore,
                  activities: {
                    create: {
                      type: "System",
                      note: `High buyer intent detected (Score: ${intentScore}). Active browsing history matched.`,
                    },
                  },
                },
              });
            }
          }
        }
      }

      return { success: true, eventId: event.id, visitorId: visitor.id, intentScore };
    } catch (error: any) {
      console.error("Error in AnalyticsService.trackEvent:", error);
      return { success: false, error: error.message };
    }
  }

  async calculateIntentScore(visitorId: string): Promise<number> {
    try {
      const stats = await analyticsRepository.getVisitorStats(visitorId);
      const viewData = await analyticsRepository.getVisitorPropertyViewCount(visitorId);

      let score = 0;

      const totalViews = viewData.totalViews || 0;
      const distinctProps = viewData.distinctProperties || 0;
      score += totalViews * 10;
      score += distinctProps * 15;

      if (totalViews - distinctProps >= 2) {
        score += 20;
      }

      if (stats["COMPARE_ADD"]) score += stats["COMPARE_ADD"] * 15;
      if (stats["WISHLIST_ADD"] || stats["FAVORITE_ADD"]) score += (stats["WISHLIST_ADD"] || stats["FAVORITE_ADD"] || 0) * 20;
      if (stats["BROCHURE_DOWNLOAD"]) score += stats["BROCHURE_DOWNLOAD"] * 25;
      if (stats["CTA_CLICK"]) score += stats["CTA_CLICK"] * 15;

      return Math.min(Math.round(score), 100);
    } catch (e) {
      console.error("Error calculating intent score:", e);
      return 0;
    }
  }

  async getVisitorTimeline(visitorOrCookieId: string) {
    let visitor = await analyticsRepository.getVisitorByCookieId(visitorOrCookieId);
    if (!visitor) {
      visitor = await analyticsRepository.getVisitorById(visitorOrCookieId);
    }
    return visitor;
  }
}

export const analyticsService = new AnalyticsService();
