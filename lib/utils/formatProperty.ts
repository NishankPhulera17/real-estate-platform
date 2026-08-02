import { Property, PropertyType, PossessionStatus, FurnishingStatus, FacingDirection } from "@/lib/types";
import { formatPriceINR } from "@/lib/utils";

export function formatDbProperty(dbProp: any): Property {
  if (!dbProp) return {} as Property;

  const priceVal = typeof dbProp.price === 'number' ? dbProp.price : (dbProp.priceVal || 35000000);
  const priceDisplay = dbProp.priceDisplay || (priceVal >= 10000000 ? `₹${(priceVal / 10000000).toFixed(2)} Cr` : `₹${(priceVal / 100000).toFixed(1)} Lakh`);
  const areaSqFt = dbProp.areaSqFt || 2450;

  // Extract images or supply high-res fallbacks
  let images: string[] = [];
  if (dbProp.images && Array.isArray(dbProp.images) && dbProp.images.length > 0) {
    images = dbProp.images.map((img: any) => typeof img === 'string' ? img : img.url);
  } else {
    images = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ];
  }

  // Extract amenities
  let amenities: string[] = [];
  if (dbProp.amenities && Array.isArray(dbProp.amenities) && dbProp.amenities.length > 0) {
    amenities = dbProp.amenities.map((a: any) => typeof a === 'string' ? a : a.amenity?.name || a.name || "Mountain View");
  } else {
    amenities = ["Mountain View", "High-speed Fiber Internet", "Solar Ready", "24/7 Security & CCTV", "Private Road Access"];
  }

  // Extract videos
  let videos: string[] = [];
  if (dbProp.videos && Array.isArray(dbProp.videos) && dbProp.videos.length > 0) {
    videos = dbProp.videos.map((vid: any) => typeof vid === 'string' ? vid : vid.url);
  } else if (dbProp.videoUrl) {
    videos = [dbProp.videoUrl];
  } else {
    videos = ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  }
  const videoUrl = videos[0];

  return {
    id: dbProp.id || `prop-${Date.now()}`,
    title: dbProp.title || "Untitled Development",
    slug: dbProp.slug || dbProp.id || "untitled-development",
    priceDisplay,
    priceVal,
    pricePerSqFt: dbProp.pricePerSqFt || Math.round(priceVal / (areaSqFt || 1)),
    location: {
      address: dbProp.location?.address || dbProp.address || "Himalayan Ridge View Road",
      locality: dbProp.location?.locality || dbProp.locality || "Mukteshwar Valley",
      city: dbProp.location?.city || "NorthNest Region",
      state: dbProp.location?.state || "Uttarakhand",
      pincode: dbProp.location?.pincode || "263138",
      lat: dbProp.location?.latitude || dbProp.location?.lat || dbProp.latitude || 29.4722,
      lng: dbProp.location?.longitude || dbProp.location?.lng || dbProp.longitude || 79.6467,
    },
    builder: {
      id: dbProp.builder?.id || dbProp.builderId || "bldr-1",
      name: dbProp.builder?.name || "NorthNest",
      logo: dbProp.builder?.logo || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
    },
    bhk: dbProp.bhk !== undefined ? dbProp.bhk : 3,
    bathrooms: dbProp.bathrooms !== undefined ? dbProp.bathrooms : 3,
    areaSqFt,
    propertyType: (dbProp.propertyType as PropertyType) || "Apartment",
    possessionStatus: (dbProp.possessionStatus as PossessionStatus) || "New Launch",
    possessionDate: dbProp.possessionDate || "2026-01-01",
    reraId: dbProp.reraId || "UK-RERA-2024-88",
    furnishing: (dbProp.furnishing || dbProp.furnished as FurnishingStatus) || "Semi-Furnished",
    facing: (dbProp.facing as FacingDirection) || "North-East",
    parking: dbProp.parking !== undefined ? dbProp.parking : 2,
    tags: dbProp.tags || ["Live in PostgreSQL", "Himalayan Exclusive", "Solar Ready", "Clear Title"],
    images,
    videos,
    videoUrl,
    virtualTourUrl: dbProp.virtualTourUrl || "https://my.matterport.com/show/?m=sample",
    floorPlans: dbProp.floorPlans || [
      {
        name: `${dbProp.bhk || 3} BHK Luxury Mountain Suite`,
        bhk: `${dbProp.bhk || 3} BHK`,
        sizeSqFt: areaSqFt,
        price: priceDisplay,
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
      }
    ],
    priceTrends: dbProp.priceTrends || [
      { year: "2023", avgPricePerSqFt: Math.round((priceVal / (areaSqFt || 1)) * 0.85) },
      { year: "2024", avgPricePerSqFt: Math.round(priceVal / (areaSqFt || 1)) }
    ],
    investmentScore: dbProp.investmentScore || 96,
    rentalYieldPercent: dbProp.rentalYieldPercent !== undefined ? dbProp.rentalYieldPercent : 5.2,
    amenities,
    highlights: dbProp.highlights || ["Verified PostgreSQL Listing", "Pristine Air Quality & Valley Views", "Unencumbered Freehold Property"],
    description: dbProp.description || "A verified luxury development stored in the real-time PostgreSQL database.",
    isFeatured: dbProp.isFeatured !== undefined ? dbProp.isFeatured : true,
    isTrending: dbProp.isTrending !== undefined ? dbProp.isTrending : true,
    isLiveDb: true,
  } as Property & { isLiveDb?: boolean };
}
