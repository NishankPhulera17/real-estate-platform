"use server";

import { prisma } from "@/lib/prisma";
import { analyticsService } from "@/lib/services/analytics.service";

export interface TelemetryFeedItem {
  id: string;
  visitorId?: string;
  name: string;
  phone: string;
  email?: string;
  propertyTitle: string;
  views: number;
  timeSpent: string;
  score: number;
  status: string;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface TimelineEventItem {
  id: string;
  type: string;
  title: string;
  description: string;
  propertyName?: string;
  propertySlug?: string;
  timestamp: string;
  scoreImpact?: string;
}

export async function getLiveTelemetryFeedAction({ limit = 20 }: { limit?: number } = {}): Promise<{ success: boolean; data?: TelemetryFeedItem[]; error?: string }> {
  try {
    // 1. Fetch leads from PostgreSQL with linked visitors and property information
    const leads = await prisma.lead.findMany({
      include: {
        property: true,
        visitor: {
          include: {
            events: {
              include: { property: true }
            },
            user: true
          }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: limit
    });

    // 2. Also fetch recent active visitors who haven't created a formal lead yet (for live anonymous feed)
    const anonymousVisitors = await prisma.visitor.findMany({
      where: {
        leads: { none: {} },
        events: { some: {} }
      },
      include: {
        events: {
          include: { property: true },
          orderBy: { createdAt: "desc" }
        },
        user: true
      },
      orderBy: { lastVisitedAt: "desc" },
      take: 10
    });

    const feed: TelemetryFeedItem[] = [];

    // Process Formal Leads
    for (const lead of leads) {
      const visitor = lead.visitor;
      const events = visitor?.events || [];
      const viewEvents = events.filter(e => e.eventType === "PROPERTY_VIEW");
      
      let totalSeconds = 0;
      let hasBrochure = lead.type === "Brochure" || lead.type === "Download Brochure";
      let hasSiteVisit = lead.type === "Site Visit" || lead.type === "Book Exploration Visit";

      for (const event of events) {
        if (event.eventType === "BROCHURE_DOWNLOAD") hasBrochure = true;
        if (event.eventType === "SITE_VISIT_REQUEST" || event.eventType === "Site Visit") hasSiteVisit = true;
        if (event.eventType === "TIME_SPENT" && event.metadata) {
          try {
            const meta = JSON.parse(event.metadata);
            if (meta.durationSeconds) totalSeconds += Number(meta.durationSeconds);
          } catch (e) {}
        }
      }

      // If duration is minimal or recorded before time tracking was added, estimate realistically from engagement
      if (totalSeconds < 30) {
        totalSeconds = Math.max(viewEvents.length * 45, 60);
      }
      const timeSpentStr = totalSeconds >= 60 ? `${(totalSeconds / 60).toFixed(1)} mins` : `${totalSeconds} secs`;

      let score = lead.intentScore || 0;
      if (visitor && score === 0) {
        score = await analyticsService.calculateIntentScore(visitor.id);
      }
      if (score === 0) score = Math.min(50 + viewEvents.length * 10, 95);

      let status = "☀️ Warm - Currently Browsing";
      if (hasSiteVisit) status = "🔥 Hot Buyer - Site Visit Requested";
      else if (hasBrochure || score >= 80) status = "🔥 Hot Buyer - Downloaded Brochure";
      else if (viewEvents.length >= 3 || score >= 70) status = "🔥 Hot Buyer - Repeat Visits";
      else if (score < 40) status = "🌱 New - Intent Active";

      feed.push({
        id: lead.id,
        visitorId: visitor?.id || lead.visitorId || undefined,
        name: lead.name || (visitor?.user?.name ? visitor.user.name : "Anonymous Buyer"),
        phone: lead.phone || (visitor?.user?.phone ? visitor.user.phone : "Pending Lead Capture"),
        email: lead.email || visitor?.user?.email || undefined,
        propertyTitle: lead.property?.title || (events.find(e => e.property)?.property?.title) || "Multi-Listing Search",
        views: Math.max(viewEvents.length, 1),
        timeSpent: timeSpentStr,
        score: Math.min(Math.round(score), 100),
        status,
        createdAt: lead.updatedAt || lead.createdAt,
        isAnonymous: false
      });
    }

    // Process Anonymous / Unconverted Visitors
    for (const visitor of anonymousVisitors) {
      const events = visitor.events || [];
      const viewEvents = events.filter(e => e.eventType === "PROPERTY_VIEW");
      if (viewEvents.length === 0 && events.length < 2) continue; // Skip accidental clicks with no real interaction

      let totalSeconds = 0;
      let hasBrochure = false;
      for (const event of events) {
        if (event.eventType === "BROCHURE_DOWNLOAD") hasBrochure = true;
        if (event.eventType === "TIME_SPENT" && event.metadata) {
          try {
            const meta = JSON.parse(event.metadata);
            if (meta.durationSeconds) totalSeconds += Number(meta.durationSeconds);
          } catch (e) {}
        }
      }

      if (totalSeconds < 20) totalSeconds = viewEvents.length * 35;
      const timeSpentStr = totalSeconds >= 60 ? `${(totalSeconds / 60).toFixed(1)} mins` : `${totalSeconds} secs`;

      const score = await analyticsService.calculateIntentScore(visitor.id);
      const latestProperty = events.find(e => e.property)?.property;

      feed.push({
        id: visitor.id,
        visitorId: visitor.id,
        name: visitor.user?.name ? `${visitor.user.name} (Active)` : `Anonymous Visitor #${visitor.cookieId.slice(0, 4)}`,
        phone: visitor.user?.phone || "Pending Lead Capture",
        email: visitor.user?.email || undefined,
        propertyTitle: latestProperty?.title || "Marketplace Browsing",
        views: viewEvents.length,
        timeSpent: timeSpentStr,
        score: Math.min(Math.round(score || (30 + viewEvents.length * 8)), 100),
        status: hasBrochure ? "🔥 Hot Buyer - Downloaded Brochure" : score >= 65 ? "🔥 Hot Buyer - Repeat Visits" : "☀️ Warm - Currently Browsing",
        createdAt: visitor.lastVisitedAt || visitor.createdAt,
        isAnonymous: !visitor.user
      });
    }

    // Sort combined feed by intent score & recency
    feed.sort((a, b) => b.score - a.score || b.createdAt.getTime() - a.createdAt.getTime());

    return { success: true, data: feed.slice(0, limit) };
  } catch (error: any) {
    console.error("Failed to fetch live telemetry feed:", error);
    return { success: false, error: error.message || "Failed to load telemetry" };
  }
}

export async function getVisitorTimelineAction(targetId: string): Promise<{ success: boolean; data?: TimelineEventItem[]; title?: string; subtitle?: string; error?: string }> {
  try {
    const timeline: TimelineEventItem[] = [];
    let visitorId = targetId;
    let headerTitle = "Visitor Timeline";
    let headerSubtitle = "Chronological session events";

    // Check if targetId is actually a Lead ID
    const lead = await prisma.lead.findUnique({
      where: { id: targetId },
      include: {
        property: true,
        visitor: {
          include: {
            events: { include: { property: true }, orderBy: { createdAt: "desc" } },
            user: true
          }
        },
        activities: { orderBy: { createdAt: "desc" } }
      }
    });

    if (lead) {
      headerTitle = `${lead.name}'s Journey`;
      headerSubtitle = `Contact: ${lead.phone}${lead.email ? ` • ${lead.email}` : ""}`;

      if (lead.visitorId) visitorId = lead.visitorId;

      // Add formal CRM lead activities
      for (const act of lead.activities) {
        timeline.push({
          id: act.id,
          type: act.type,
          title: `CRM Event: ${act.type}`,
          description: act.note || "Lead status activity logged.",
          timestamp: act.createdAt.toISOString(),
          scoreImpact: "+15"
        });
      }

      // Add Lead creation event
      timeline.push({
        id: `lead-create-${lead.id}`,
        type: "LEAD_CAPTURED",
        title: "Verified Buyer Identity Captured",
        description: `Submitted inquiry for ${lead.property?.title || "listing"}. Source: ${lead.source}`,
        propertyName: lead.property?.title,
        propertySlug: lead.property?.slug,
        timestamp: lead.createdAt.toISOString(),
        scoreImpact: "+25"
      });
    }

    // Fetch visitor telemetry events if visitor is attached or targetId is visitorId
    const visitor = await analyticsService.getVisitorTimeline(visitorId);
    if (visitor) {
      if (!lead && visitor.user) {
        headerTitle = `${visitor.user.name} (Authenticated)`;
        headerSubtitle = visitor.user.email || "Registered Platform User";
      } else if (!lead) {
        headerTitle = `Anonymous Visitor #${visitor.cookieId.slice(0, 6)}`;
        headerSubtitle = `Tracking Cookie ID: ${visitor.cookieId.slice(0, 16)}...`;
      }

      for (const event of visitor.events) {
        let title = event.eventType;
        let description = `Path: ${event.path}`;
        let scoreImpact = "+5";

        if (event.eventType === "SITE_ENTER") {
          title = "Arrived on Marketplace";
          description = `Landed on ${event.path}${visitor.referrer ? ` via ${visitor.referrer}` : " directly"}.`;
          scoreImpact = "+5";
        } else if (event.eventType === "PROPERTY_VIEW") {
          title = "Examined Property Listing";
          description = `Viewed listing details for ${event.property?.title || "Property ID: " + event.propertyId}.`;
          scoreImpact = "+15";
        } else if (event.eventType === "BROCHURE_DOWNLOAD") {
          title = "Downloaded Price & Brochure PDF";
          description = `High-intent download requested on ${event.property?.title || event.path}.`;
          scoreImpact = "+25";
        } else if (event.eventType === "TIME_SPENT") {
          let secs = 30;
          try {
            const meta = JSON.parse(event.metadata || "{}");
            if (meta.durationSeconds) secs = meta.durationSeconds;
          } catch (e) {}
          title = "Active Browsing Engagement";
          description = `Spent ${secs} seconds exploring ${event.property?.title || "property listing"}.`;
          scoreImpact = "+10";
        } else if (event.eventType === "CTA_CLICK" || event.eventType === "SITE_VISIT_REQUEST") {
          title = "Clicked High-Intent Call-To-Action";
          description = `Initiated lead capture flow on ${event.path}.`;
          scoreImpact = "+20";
        }

        timeline.push({
          id: event.id,
          type: event.eventType,
          title,
          description,
          propertyName: event.property?.title,
          propertySlug: event.property?.slug,
          timestamp: event.createdAt?.toISOString() || new Date().toISOString(),
          scoreImpact
        });
      }
    }

    // Sort merged timeline in descending chronological order
    timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      success: true,
      data: timeline,
      title: headerTitle,
      subtitle: headerSubtitle
    };
  } catch (error: any) {
    console.error("Failed to fetch timeline:", error);
    return { success: false, error: error.message || "Failed to retrieve timeline" };
  }
}
