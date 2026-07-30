import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/lib/services/destination.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const data = await destinationService.getDestinationWithListings(slug);
    if (!data) {
      return NextResponse.json({ success: false, error: "Destination not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/destinations/[slug] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch destination details" }, { status: 500 });
  }
}
