"use server";

import { destinationService } from "@/lib/services/destination.service";
import { revalidatePath } from "next/cache";

export async function getDestinationsAction(options?: { limit?: number }) {
  try {
    const data = await destinationService.getDestinations(options);
    return { success: true, data };
  } catch (error: any) {
    console.error("getDestinationsAction Error:", error);
    return { error: error.message || "Failed to fetch destinations" };
  }
}

export async function getDestinationBySlugAction(slug: string) {
  try {
    const data = await destinationService.getDestinationWithListings(slug);
    if (!data) {
      return { error: "Destination not found" };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error(`getDestinationBySlugAction (${slug}) Error:`, error);
    return { error: error.message || "Failed to fetch destination details and listings" };
  }
}

export async function createDestinationAction(input: any) {
  try {
    const destination = await destinationService.createDestination(input);
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${destination.slug}`);
    return { success: true, data: destination };
  } catch (error: any) {
    console.error("createDestinationAction Error:", error);
    return { success: false, error: error.message || "Failed to create destination" };
  }
}
