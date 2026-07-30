import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class DestinationRepository {
  async getAll(options?: { limit?: number }) {
    const destinations = await prisma.destination.findMany({
      take: options?.limit,
      include: {
        _count: {
          select: { properties: true }
        }
      },
      orderBy: { name: "asc" }
    });

    const enhanced = await Promise.all(
      destinations.map(async (d) => {
        let count = d._count?.properties || 0;
        const destName = d.name.trim();
        const destSlugWords = d.slug.replace(/-/g, ' ').trim();
        
        const matchingCount = await prisma.property.count({
          where: {
            isDeleted: false,
            OR: [
              { destinationId: d.id },
              { location: { address: { contains: destName, mode: 'insensitive' } } },
              { location: { locality: { contains: destName, mode: 'insensitive' } } },
              { title: { contains: destName, mode: 'insensitive' } },
              { location: { locality: { contains: destSlugWords, mode: 'insensitive' } } },
              { location: { address: { contains: destSlugWords, mode: 'insensitive' } } },
            ]
          }
        });
        
        return {
          ...d,
          propertyCount: Math.max(count, matchingCount)
        };
      })
    );

    return enhanced;
  }

  async getBySlugWithProperties(slug: string) {
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        galleries: true,
        properties: {
          include: {
            location: true,
            images: true,
          }
        }
      }
    });

    if (!destination) return null;

    const destName = destination.name.trim();
    const destSlugWords = destination.slug.replace(/-/g, ' ').trim();
    
    const matchedProperties = await prisma.property.findMany({
      where: {
        isDeleted: false,
        OR: [
          { destinationId: destination.id },
          { location: { address: { contains: destName, mode: 'insensitive' } } },
          { location: { locality: { contains: destName, mode: 'insensitive' } } },
          { title: { contains: destName, mode: 'insensitive' } },
          { location: { locality: { contains: destSlugWords, mode: 'insensitive' } } },
          { location: { address: { contains: destSlugWords, mode: 'insensitive' } } },
        ]
      },
      include: {
        location: true,
        images: true,
      }
    });

    const unlinkedIds = matchedProperties
      .filter(p => p.destinationId !== destination.id)
      .map(p => p.id);
      
    if (unlinkedIds.length > 0) {
      prisma.property.updateMany({
        where: { id: { in: unlinkedIds } },
        data: { destinationId: destination.id }
      }).catch(err => console.error("Auto-link destinations error:", err));
    }

    const propertyMap = new Map();
    [...destination.properties, ...matchedProperties].forEach(p => {
      propertyMap.set(p.id, p);
    });

    return {
      ...destination,
      properties: Array.from(propertyMap.values()),
    };
  }

  async create(data: Prisma.DestinationCreateInput) {
    return prisma.destination.create({
      data,
      include: {
        galleries: true,
      }
    });
  }
}

export const destinationRepository = new DestinationRepository();
