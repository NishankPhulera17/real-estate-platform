export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Plot' | 'Commercial Office' | 'Retail Shop';
export type PossessionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch' | 'Ready to Build';
export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type FacingDirection = 'North' | 'East' | 'North-East' | 'West' | 'South';

export interface Property {
  id: string;
  title: string;
  slug: string;
  priceDisplay: string; // e.g. "₹2.45 Cr"
  priceVal: number; // in INR e.g. 24500000
  pricePerSqFt: number; // e.g. 14500
  location: {
    address: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  builder: {
    id: string;
    name: string;
    logo: string;
  };
  bhk: number;
  bathrooms: number;
  areaSqFt: number;
  propertyType: PropertyType;
  possessionStatus: PossessionStatus;
  possessionDate?: string;
  reraId: string;
  furnishing: FurnishingStatus;
  facing: FacingDirection;
  parking: number;
  tags: string[]; // e.g. ['Luxury', 'Near Metro', 'Golf View']
  images: string[];
  videos?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlans: {
    name: string;
    bhk: string;
    sizeSqFt: number;
    price: string;
    image: string;
  }[];
  priceTrends: {
    year: string;
    avgPricePerSqFt: number;
  }[];
  investmentScore: number; // 0-100 score
  rentalYieldPercent: number; // e.g. 4.8%
  amenities: string[];
  highlights: string[];
  description: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface Builder {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  experienceYears: number;
  completedProjectsCount: number;
  ongoingProjectsCount: number;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  headquarters: string;
  popularProjects: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  budgetRange: string;
  preferredLocation: string;
  propertyId?: string;
  propertyTitle?: string;
  source: 'Website' | 'WhatsApp' | 'Google Ads' | 'Facebook' | 'Referral' | 'Organic';
  timeline: 'Immediate' | '1-3 Months' | '3-6 Months' | 'Exploring';
  stage: 'New' | 'Contacted' | 'Interested' | 'Qualified' | 'Site Visit Scheduled' | 'Negotiation' | 'Booked' | 'Lost';
  salesperson: string;
  notes: string[];
  createdAt: string;
  nextFollowUp?: string;
  isHighIntent?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Buying Guide' | 'Investment' | 'Area Reviews' | 'Market News' | 'Loans & Finance' | 'Interior Design';
  snippet: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  coverImage: string;
  tags: string[];
}

export interface LocalityInfo {
  slug: string;
  name: string;
  city: string;
  avgPricePerSqFt: number;
  growthYoyPercent: number;
  heroImage: string;
  description: string;
  nearbyInfra: {
    category: 'Metro' | 'School' | 'Hospital' | 'Airport' | 'Shopping';
    name: string;
    distanceKm: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
