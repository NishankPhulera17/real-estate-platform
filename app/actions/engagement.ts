"use server";

import { auth } from "@/auth";
import { engagementService } from "@/lib/services/engagement.service";
import { AppointmentInput, ReviewInput } from "@/lib/validations/engagement";

// Favorites
export async function toggleFavoriteAction(propertyId: string) {
  const session = await auth();
  if (!session) return { error: "Must be logged in to favorite" };

  try {
    // Attempt to remove first, if it fails because it doesn't exist, we add it.
    // This could be optimized with a check, but try/catch is fine for toggle.
    try {
      await engagementService.removeFavorite(session.user.id, propertyId);
      return { success: true, action: "removed" };
    } catch {
      await engagementService.addFavorite(session.user.id, propertyId);
      return { success: true, action: "added" };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getFavoritesAction() {
  const session = await auth();
  if (!session) return { error: "Must be logged in" };
  const favorites = await engagementService.getFavorites(session.user.id);
  return { success: true, data: favorites };
}

// Compare
export async function toggleCompareAction(propertyId: string) {
  const session = await auth();
  if (!session) return { error: "Must be logged in to compare" };

  try {
    try {
      await engagementService.removeComparison(session.user.id, propertyId);
      return { success: true, action: "removed" };
    } catch {
      await engagementService.addComparison(session.user.id, propertyId);
      return { success: true, action: "added" };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCompareAction() {
  const session = await auth();
  if (!session) return { error: "Must be logged in" };
  const compare = await engagementService.getComparison(session.user.id);
  return { success: true, data: compare };
}

// Appointments
export async function bookAppointmentAction(data: AppointmentInput) {
  const session = await auth();
  if (!session) return { error: "Must be logged in" };

  try {
    const appointment = await engagementService.bookAppointment(session.user.id, data);
    return { success: true, data: appointment };
  } catch (error: any) {
    return { error: "Failed to book appointment" };
  }
}

// Reviews
export async function submitReviewAction(data: ReviewInput) {
  const session = await auth();
  if (!session) return { error: "Must be logged in" };

  try {
    const review = await engagementService.submitReview(session.user.id, data);
    return { success: true, data: review };
  } catch (error: any) {
    return { error: "Failed to submit review" };
  }
}
