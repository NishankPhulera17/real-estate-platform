import { destinationRepository } from "../repositories/destination.repository";
import { prisma } from "@/lib/prisma";

export class DestinationService {
  async getDestinations(options?: { limit?: number }) {
    return destinationRepository.getAll(options);
  }

  async getDestinationWithListings(slug: string) {
    return destinationRepository.getBySlugWithProperties(slug);
  }

  async createDestination(input: any) {
    if (!input.name) {
      throw new Error("Destination name is required");
    }

    const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const existing = await destinationRepository.getBySlugWithProperties(slug);
    if (existing) {
      throw new Error(`A destination with slug "${slug}" already exists.`);
    }

    const destination = await destinationRepository.create({
      name: input.name,
      slug: slug,
      description: input.description || null,
      heroImage: input.heroImage || null,
      elevation: input.elevation || null,
      climate: input.climate || null,
      airQuality: input.airQuality || null,
      waterQuality: input.waterQuality || null,
      population: input.population || null,
      internetAvailability: input.internetAvailability || null,
      sustainabilityScore: input.sustainabilityScore !== undefined ? Number(input.sustainabilityScore) : null,
      remoteWorkScore: input.remoteWorkScore !== undefined ? Number(input.remoteWorkScore) : null,
      retirementScore: input.retirementScore !== undefined ? Number(input.retirementScore) : null,
      familyFriendliness: input.familyFriendliness !== undefined ? Number(input.familyFriendliness) : null,
      costOfLiving: input.costOfLiving || null,
      thingsToDo: Array.isArray(input.thingsToDo) ? input.thingsToDo : (input.thingsToDo ? input.thingsToDo.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      ...(input.galleries && input.galleries.length > 0 ? {
        galleries: {
          create: input.galleries.map((url: string) => ({ url }))
        }
      } : {}),
    });

    // Auto-link any existing properties in PostgreSQL that match the destination name
    try {
      const destName = destination.name.trim();
      const destSlugWords = destination.slug.replace(/-/g, ' ').trim();
      await prisma.property.updateMany({
        where: {
          isDeleted: false,
          destinationId: null,
          OR: [
            { location: { address: { contains: destName, mode: 'insensitive' } } },
            { location: { locality: { contains: destName, mode: 'insensitive' } } },
            { title: { contains: destName, mode: 'insensitive' } },
            { location: { locality: { contains: destSlugWords, mode: 'insensitive' } } },
            { location: { address: { contains: destSlugWords, mode: 'insensitive' } } },
          ]
        },
        data: { destinationId: destination.id }
      });
    } catch (err) {
      console.error("Post-destination creation auto-link error:", err);
    }

    return destination;
  }
}

export const destinationService = new DestinationService();
