import { propertyRepository } from "../repositories/property.repository";
import { PropertyInput, propertySchema, PropertyUpdateInput, propertyUpdateSchema } from "../validations/property";
import { uploadImage } from "../cloudinary";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PropertyService {
  async createProperty(data: PropertyInput, builderId?: string, brokerId?: string) {
    const parsed = propertySchema.parse(data);

    // Generate unique slug
    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const createData: Prisma.PropertyCreateInput = {
      title: parsed.title,
      slug,
      description: parsed.description,
      price: parsed.price,
      pricePerSqFt: parsed.areaSqFt ? parsed.price / parsed.areaSqFt : null,
      propertyType: parsed.propertyType,
      possessionStatus: parsed.possessionStatus,
      status: 'PUBLISHED',
      bhk: parsed.bhk,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      parking: parsed.parking,
      furnished: parsed.furnished,
      areaSqFt: parsed.areaSqFt,
      reraId: parsed.reraId,
      location: {
        create: {
          address: parsed.address,
          locality: parsed.locality,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        }
      },
    };

    if (parsed.cityId) createData.city = { connect: { id: parsed.cityId } };
    if (builderId) createData.builder = { connect: { id: builderId } };
    if (brokerId) createData.broker = { connect: { id: brokerId } };
    
    // Auto-associate with matching destination if present in database
    try {
      const allDestinations = await prisma.destination.findMany({ select: { id: true, name: true, slug: true } });
      const matchText = `${parsed.locality || ''} ${parsed.address || ''} ${parsed.title || ''}`.toLowerCase();
      const matchedDest = allDestinations.find(d => 
        matchText.includes(d.name.toLowerCase().trim()) || 
        matchText.includes(d.slug.replace(/-/g, ' ').toLowerCase().trim())
      );
      if (matchedDest) {
        createData.destination = { connect: { id: matchedDest.id } };
      }
    } catch (err) {
      console.error("Error auto-matching destination during property creation:", err);
    }

    if (parsed.amenities && parsed.amenities.length > 0) {
      createData.amenities = {
        create: parsed.amenities.map(id => ({
          amenity: { connect: { id } }
        }))
      };
    }

    if (parsed.images && parsed.images.length > 0) {
      createData.images = {
        create: parsed.images.map((url, idx) => ({
          url,
          isCover: idx === 0,
          order: idx,
        }))
      };
    }

    if (parsed.videos && parsed.videos.length > 0) {
      createData.videos = {
        create: parsed.videos.map((url) => ({
          url,
          provider: url.includes('youtube') || url.includes('youtu.be') ? 'YouTube' : 'Custom',
        }))
      };
    }

    return propertyRepository.create(createData);
  }

  async updateProperty(id: string, data: PropertyUpdateInput) {
    const parsed = propertyUpdateSchema.parse(data);
    const updateData: Prisma.PropertyUpdateInput = { ...parsed } as any;
    
    if (parsed.address || parsed.locality || parsed.latitude || parsed.longitude) {
      updateData.location = {
        update: {
          address: parsed.address,
          locality: parsed.locality,
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        }
      };
    }
    
    // Cleanup custom properties used in DTO but not directly in Prisma Model
    delete (updateData as any).address;
    delete (updateData as any).locality;
    delete (updateData as any).latitude;
    delete (updateData as any).longitude;
    delete (updateData as any).amenities;

    return propertyRepository.update(id, updateData);
  }

  async deleteProperty(id: string, soft: boolean = true) {
    return propertyRepository.delete(id, soft);
  }

  async getPropertyById(id: string) {
    return propertyRepository.findById(id);
  }

  async searchProperties(filters: Parameters<typeof propertyRepository.search>[0]) {
    return propertyRepository.search(filters);
  }

  async uploadPropertyImage(propertyId: string, file: File, isCover: boolean = false) {
    const url = await uploadImage(file);
    return propertyRepository.update(propertyId, {
      images: {
        create: {
          url,
          isCover,
        }
      }
    });
  }
}

export const propertyService = new PropertyService();
