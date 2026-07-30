import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/lib/services/analytics.service";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let cookieId = body.cookieId;
    
    if (!cookieId) {
      const cookieStore = await cookies();
      cookieId = cookieStore.get("visitor_id")?.value;
      if (!cookieId) {
        cookieId = crypto.randomUUID();
      }
    }

    // Stitch current authenticated user session if available
    const session = await auth();
    const resolvedUserId = body.userId || session?.user?.id || undefined;

    const result = await analyticsService.trackEvent({
      cookieId,
      eventType: body.eventType || "SITE_ENTER",
      path: body.path || "/",
      propertyId: body.propertyId || undefined,
      userId: resolvedUserId,
      metadata: body.metadata,
      userAgent: req.headers.get("user-agent") || undefined,
      ipAddress: req.headers.get("x-forwarded-for") || undefined,
      referrer: body.referrer || undefined,
      utmSource: body.utmSource || undefined,
      utmMedium: body.utmMedium || undefined,
      utmCampaign: body.utmCampaign || undefined,
    });

    const response = NextResponse.json(result);
    
    // Ensure the visitor cookie is persisted across browser sessions (1 year expiry)
    response.cookies.set("visitor_id", cookieId, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/track Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to record analytics event" }, { status: 500 });
  }
}

