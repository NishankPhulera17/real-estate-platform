import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PropertyRepository {
  async create(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({
      data,
      include: { location: true, amenities: true, images: true, videos: true },
    });
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({
      where: { id },
      data,
      include: { location: true, amenities: true, images: true, videos: true },
    });
  }

  async findById(id: string) {
    return prisma.property.findFirst({
      where: { 
        isDeleted: false,
        OR: [{ id: id }, { slug: id }] 
      },
      include: {
        location: true,
        images: true,
        videos: true,
        amenities: { include: { amenity: true } },
        builder: true,
        broker: true,
      },
    });
  }

  async delete(id: string, soft: boolean = true) {
    if (soft) {
      return prisma.property.update({
        where: { id },
        data: { isDeleted: true, status: "ARCHIVED" },
      });
    }
    return prisma.property.delete({ where: { id } });
  }

  async search(filters: {
    cityId?: string;
    locality?: string;
    builderId?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bhk?: number;
    readyToMove?: boolean;
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      isDeleted: false,
      status: "PUBLISHED",
    };

    if (filters.cityId) where.cityId = filters.cityId;
    if (filters.builderId) where.builderId = filters.builderId;
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.bhk) where.bhk = filters.bhk;
    if (filters.readyToMove !== undefined) {
      where.possessionStatus = filters.readyToMove ? "Ready to Move" : "Under Construction";
    }
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.locality) {
      where.location = { locality: { contains: filters.locality, mode: 'insensitive' } };
    }
    if (filters.searchTerm) {
      where.OR = [
        { title: { contains: filters.searchTerm, mode: 'insensitive' } },
        { description: { contains: filters.searchTerm, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy === "price_asc") orderBy = { price: 'asc' };
    if (filters.sortBy === "price_desc") orderBy = { price: 'desc' };

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { location: true, images: true, videos: true, builder: true, broker: true },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      data,
      metadata: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const propertyRepository = new PropertyRepository();
