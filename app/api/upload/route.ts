import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided in upload request." },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Check if real Cloudinary keys have been entered in .env yet
    const isPlaceholderConfig =
      !cloudName ||
      cloudName === "your_cloud_name" ||
      !apiKey ||
      apiKey === "your_api_key" ||
      !apiSecret ||
      apiSecret === "your_api_secret";

    if (isPlaceholderConfig) {
      console.warn(
        "[Cloudinary Upload] Real credentials not set in .env. Returning simulated Cloudinary URL for testing."
      );
      // Fallback simulated URL so UI testing works before user pastes real keys
      return NextResponse.json({
        success: true,
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        isSimulated: true,
        message:
          "Simulated Cloudinary upload. Please replace placeholders in .env with your Cloudinary dashboard credentials.",
      });
    }

    // Upload directly via Cloudinary server-side SDK stream to folder: 'real_estate'
    const secureUrl = await uploadImage(file);

    return NextResponse.json({
      success: true,
      url: secureUrl,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("POST /api/upload Cloudinary Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "An unknown error occurred while uploading file to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
