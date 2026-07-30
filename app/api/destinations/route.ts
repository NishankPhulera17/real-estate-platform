import { NextRequest, NextResponse } from "next/server";
import { destinationService } from "@/lib/services/destination.service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const data = await destinationService.getDestinations({ limit });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /api/destinations Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch destinations" }, { status: 500 });
  }
}
