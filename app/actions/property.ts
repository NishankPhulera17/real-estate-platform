"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { propertyService } from "@/lib/services/property.service";
import { PropertyInput, PropertyUpdateInput } from "@/lib/validations/property";

export async function createPropertyAction(data: PropertyInput) {
  const session = await auth();
  if (!session || !["BUILDER", "BROKER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    let builderId: string | undefined;
    let brokerId: string | undefined;

    if (session.user.role === "BUILDER") {
      const builder = await prisma.builder.findUnique({ where: { userId: session.user.id } });
      if (builder) {
        builderId = builder.id;
      } else {
        const newBuilder = await prisma.builder.create({
          data: {
            userId: session.user.id,
            name: session.user.name || "Developer Console Profile",
            slug: `builder-${Date.now()}`,
          }
        });
        builderId = newBuilder.id;
      }
    }

    if (session.user.role === "BROKER") {
      const broker = await prisma.broker.findUnique({ where: { userId: session.user.id } });
      if (broker) {
        brokerId = broker.id;
      } else {
        const newBroker = await prisma.broker.create({
          data: {
            userId: session.user.id,
            companyName: session.user.name || "Broker Realty Agency",
          }
        });
        brokerId = newBroker.id;
      }
    }

    const property = await propertyService.createProperty(data, builderId, brokerId);
    return { success: true, data: property };
  } catch (error: any) {
    console.error("createPropertyAction Error:", error);
    return { error: error.message || "Failed to create property" };
  }
}

export async function updatePropertyAction(id: string, data: PropertyUpdateInput) {
  const session = await auth();
  if (!session || !["BUILDER", "BROKER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const property = await propertyService.updateProperty(id, data);
    return { success: true, data: property };
  } catch (error: any) {
    return { error: error.message || "Failed to update property" };
  }
}

export async function deletePropertyAction(id: string) {
  const session = await auth();
  if (!session || !["BUILDER", "BROKER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await propertyService.deleteProperty(id, true);
    return { success: true };
  } catch (error: any) {
    return { error: "Failed to delete property" };
  }
}

export async function uploadPropertyImageAction(propertyId: string, formData: FormData, isCover: boolean = false) {
  const session = await auth();
  if (!session || !["BUILDER", "BROKER", "ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const file = formData.get("image") as File;
    if (!file) return { error: "No file provided" };
    
    await propertyService.uploadPropertyImage(propertyId, file, isCover);
    return { success: true };
  } catch (error: any) {
    return { error: "Image upload failed" };
  }
}

export async function searchPropertiesAction(filters: Parameters<typeof propertyService.searchProperties>[0]) {
  try {
    return await propertyService.searchProperties(filters);
  } catch (error: any) {
    return { error: "Search failed" };
  }
}

export async function getPropertyByIdAction(id: string) {
  try {
    const property = await propertyService.getPropertyById(id);
    if (!property) return { error: "Property not found" };
    return { success: true, data: property };
  } catch (error: any) {
    return { error: "Failed to fetch property details" };
  }
}
