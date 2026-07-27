import { Property, Builder, Lead, BlogPost, LocalityInfo } from '../types';

export const MOCK_BUILDERS: Builder[] = [
  {
    id: 'bldr-1',
    slug: 'dlf-limited',
    name: 'DLF Limited',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
    description: 'India\'s premier real estate developer with over 75 years of track record in creating luxury residential and iconic commercial developments.',
    experienceYears: 76,
    completedProjectsCount: 145,
    ongoingProjectsCount: 12,
    rating: 4.9,
    reviewsCount: 1240,
    headquarters: 'Gurgaon, Haryana',
    popularProjects: ['DLF The Camellias', 'DLF Cybercity', 'DLF Crest', 'DLF Privana'],
    contactEmail: 'contact@dlf.in',
    contactPhone: '+91 124 4567 890'
  },
  {
    id: 'bldr-2',
    slug: 'godrej-properties',
    name: 'Godrej Properties',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
    description: 'Combining the Godrej philosophy of innovation, sustainability, and excellence to real estate developments across top metro cities.',
    experienceYears: 34,
    completedProjectsCount: 88,
    ongoingProjectsCount: 24,
    rating: 4.8,
    reviewsCount: 980,
    headquarters: 'Mumbai, Maharashtra',
    popularProjects: ['Godrej Woods Noida', 'Godrej Meridian Gurgaon', 'Godrej Platinum Mumbai'],
    contactEmail: 'sales@godrejproperties.com',
    contactPhone: '+91 22 6888 7777'
  },
  {
    id: 'bldr-3',
    slug: 'sobha-limited',
    name: 'Sobha Limited',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    description: 'Renowned for backwards integration and uncompromising construction quality in residential and township luxury projects.',
    experienceYears: 29,
    completedProjectsCount: 112,
    ongoingProjectsCount: 18,
    rating: 4.8,
    reviewsCount: 860,
    headquarters: 'Bengaluru, Karnataka',
    popularProjects: ['Sobha City Gurgaon', 'Sobha Dream Acres', 'Sobha Royal Pavilion'],
    contactEmail: 'info@sobha.com',
    contactPhone: '+91 80 4646 4500'
  },
  {
    id: 'bldr-4',
    slug: 'oberoi-realty',
    name: 'Oberoi Realty',
    logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
    description: 'Defining contemporary high-end luxury architectural marvels across Mumbai\'s most coveted addresses.',
    experienceYears: 40,
    completedProjectsCount: 42,
    ongoingProjectsCount: 8,
    rating: 4.9,
    reviewsCount: 750,
    headquarters: 'Mumbai, Maharashtra',
    popularProjects: ['Oberoi Three Birds', 'Oberoi Sky City', 'Oberoi Enigma'],
    contactEmail: 'enquiry@oberoirealty.com',
    contactPhone: '+91 22 2849 0000'
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-land-1',
    slug: 'sunset-ridge-plots-mukteshwar',
    title: 'Sunset Ridge Premium Plots',
    priceDisplay: '₹85 L',
    priceVal: 8500000,
    pricePerSqFt: 1888,
    location: {
      city: 'Mukteshwar',
      state: 'Uttarakhand',
      address: 'Sunset Ridge, South Face, Mukteshwar',
      locality: 'Sunset Ridge',
      pincode: '263138',
      lat: 29.4722,
      lng: 79.6467
    },
    builder: {
      id: 'bldr-1',
      name: 'DLF Limited & NorthNest',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'
    },
    bhk: 0,
    bathrooms: 0,
    areaSqFt: 4500,
    propertyType: 'Plot',
    possessionStatus: 'Ready to Build',
    reraId: 'UK-RERA-2023-14',
    furnishing: 'Unfurnished',
    facing: 'South',
    parking: 2,
    tags: ['Clear Title', 'Motorable Road', 'Water Connection', 'Electricity Available', 'South Facing'],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlans: [],
    priceTrends: [
      { year: '2023', avgPricePerSqFt: 1600 },
      { year: '2024', avgPricePerSqFt: 1888 }
    ],
    investmentScore: 94,
    rentalYieldPercent: 4.2,
    amenities: ['Private Road Access', 'Gated Community', 'High-Speed Internet Area'],
    highlights: ['Clear Title', 'Himalayan Snow Peak View'],
    description: 'A pristine, clear-title 1 Nali (4500 sqft) plot facing the Himalayan snow peaks. Perfect for building a premium mountain retreat or eco-home.'
  },
  {
    id: 'prop-101',
    title: 'DLF The Camellias Ultra Luxury Residence',
    slug: 'dlf-the-camellias-golf-course-road',
    priceDisplay: '₹34.50 Cr',
    priceVal: 345000000,
    pricePerSqFt: 46000,
    location: {
      address: 'Golf Course Road, Sector 42',
      locality: 'Golf Course Road',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      lat: 28.4595,
      lng: 77.0965
    },
    builder: {
      id: 'bldr-1',
      name: 'DLF Limited',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80'
    },
    bhk: 4,
    bathrooms: 5,
    areaSqFt: 7500,
    propertyType: 'Penthouse',
    possessionStatus: 'Ready to Move',
    possessionDate: '2024-01-01',
    reraId: 'HRERA-GGM-782-2020',
    furnishing: 'Furnished',
    facing: 'North-East',
    parking: 4,
    tags: ['Ultra Luxury', 'Golf Course Facing', 'Private Elevator', 'RERA Approved'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample',
    floorPlans: [
      {
        name: '4 BHK Grand Suite + Maid',
        bhk: '4 BHK',
        sizeSqFt: 7500,
        price: '₹34.50 Cr',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      }
    ],
    priceTrends: [
      { year: '2021', avgPricePerSqFt: 32000 },
      { year: '2022', avgPricePerSqFt: 36500 },
      { year: '2023', avgPricePerSqFt: 41000 },
      { year: '2024', avgPricePerSqFt: 46000 }
    ],
    investmentScore: 94,
    rentalYieldPercent: 4.8,
    amenities: [
      'Olympic Swimming Pool',
      '7-Star Clubhouse',
      'Private Helipad',
      'Cigar Lounge & Wine Cellar',
      'Golf Simulator',
      '24/7 Concierge Service',
      'EV Charging Stations',
      'Multi-tier Security System'
    ],
    highlights: [
      'Overlooking 18-hole Arnold Palmer Designed Golf Course',
      'Double height ceiling lounge with Italian Marble flooring',
      'Smart home automation integrated with Lutron & Control4',
      'Pre-approved home loans from HDFC, ICICI, SBI'
    ],
    description: 'DLF The Camellias stands as India\'s most celebrated ultra-luxury residential address on Golf Course Road, Gurgaon. Designed by world-renowned architects Hafeez Contractor and HBA Atlanta.',
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'prop-102',
    title: 'Godrej Tropical Isle Sector 146',
    slug: 'godrej-tropical-isle-noida-sec-146',
    priceDisplay: '₹2.85 Cr',
    priceVal: 28500000,
    pricePerSqFt: 14250,
    location: {
      address: 'Sector 146, Noida Expressway',
      locality: 'Noida Expressway',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201310',
      lat: 28.4812,
      lng: 77.4290
    },
    builder: {
      id: 'bldr-2',
      name: 'Godrej Properties',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=300&q=80'
    },
    bhk: 3,
    bathrooms: 3,
    areaSqFt: 2000,
    propertyType: 'Apartment',
    possessionStatus: 'Under Construction',
    possessionDate: '2027-06-30',
    reraId: 'UPRERAPRJ303390',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    parking: 2,
    tags: ['Island Theme', 'Metro Adjacent', 'High ROI', 'Green Certified'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlans: [
      {
        name: '3 BHK Royale',
        bhk: '3 BHK',
        sizeSqFt: 2000,
        price: '₹2.85 Cr',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      }
    ],
    priceTrends: [
      { year: '2022', avgPricePerSqFt: 9800 },
      { year: '2023', avgPricePerSqFt: 11800 },
      { year: '2024', avgPricePerSqFt: 14250 }
    ],
    investmentScore: 89,
    rentalYieldPercent: 5.2,
    amenities: [
      'Man-made Tropical Beach Lagoon',
      'Infinity Pool',
      'Skyscraper Skywalk',
      'Co-working Pods',
      'Tennis & Pickleball Courts',
      'Organic Cafe'
    ],
    highlights: [
      'Direct connectivity to Jewar International Airport corridor',
      '0 km from Sector 146 Aqua Line Metro Station',
      '7-acre central tropical forest theme park'
    ],
    description: 'Godrej Tropical Isle brings resort-style island living to Noida Expressway with lush lagoons, palm-lined promenades, and state-of-the-art home technology.',
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'prop-103',
    title: 'Sobha International City Villas',
    slug: 'sobha-international-city-dwarka-expressway',
    priceDisplay: '₹7.20 Cr',
    priceVal: 72000000,
    pricePerSqFt: 18000,
    location: {
      address: 'Sector 109, Dwarka Expressway',
      locality: 'Dwarka Expressway',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122017',
      lat: 28.5284,
      lng: 77.0267
    },
    builder: {
      id: 'bldr-3',
      name: 'Sobha Limited',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80'
    },
    bhk: 5,
    bathrooms: 6,
    areaSqFt: 4000,
    propertyType: 'Villa',
    possessionStatus: 'Ready to Move',
    possessionDate: '2023-10-01',
    reraId: 'HRERA-489-2019',
    furnishing: 'Unfurnished',
    facing: 'North',
    parking: 3,
    tags: ['Gated Villa', 'Private Garden', 'High Quality', 'Near IGI Airport'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlans: [
      {
        name: '5 BHK Independent Villa + Terrace',
        bhk: '5 BHK',
        sizeSqFt: 4000,
        price: '₹7.20 Cr',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      }
    ],
    priceTrends: [
      { year: '2021', avgPricePerSqFt: 12500 },
      { year: '2022', avgPricePerSqFt: 14800 },
      { year: '2023', avgPricePerSqFt: 16500 },
      { year: '2024', avgPricePerSqFt: 18000 }
    ],
    investmentScore: 91,
    rentalYieldPercent: 4.1,
    amenities: [
      'Private Swimming Pool',
      'Double Height Living Room',
      'Private Terrace Garden',
      'Sobha Signature Club',
      '24-Hour Power Backup'
    ],
    highlights: [
      '15 minutes drive to IGI Delhi Airport',
      '150-acre low-density villa township',
      'Zero plaster cracks guaranteed with German Formwork'
    ],
    description: 'Sobha International City offers luxury independent villa living with private gardens, private elevators, and German precision engineering.',
    isFeatured: true,
    isTrending: false
  },
  {
    id: 'prop-104',
    title: 'Oberoi Sky City Sky Towers',
    slug: 'oberoi-sky-city-borivali-mumbai',
    priceDisplay: '₹4.90 Cr',
    priceVal: 49000000,
    pricePerSqFt: 35000,
    location: {
      address: 'Western Express Highway, Borivali East',
      locality: 'Borivali East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400066',
      lat: 19.2307,
      lng: 72.8567
    },
    builder: {
      id: 'bldr-4',
      name: 'Oberoi Realty',
      logo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80'
    },
    bhk: 3,
    bathrooms: 3,
    areaSqFt: 1400,
    propertyType: 'Apartment',
    possessionStatus: 'Ready to Move',
    possessionDate: '2024-03-01',
    reraId: 'P51800003582',
    furnishing: 'Furnished',
    facing: 'West',
    parking: 2,
    tags: ['Sea View', 'WEH Connectivity', 'Sky Lounge', 'RERA Approved'],
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlans: [
      {
        name: '3 BHK Deluxe',
        bhk: '3 BHK',
        sizeSqFt: 1400,
        price: '₹4.90 Cr',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
      }
    ],
    priceTrends: [
      { year: '2022', avgPricePerSqFt: 28000 },
      { year: '2023', avgPricePerSqFt: 31500 },
      { year: '2024', avgPricePerSqFt: 35000 }
    ],
    investmentScore: 92,
    rentalYieldPercent: 3.9,
    amenities: [
      'Sky Deck Observatory',
      'Full-size Basketball Court',
      'Temp-controlled Pool',
      'Direct Mall Access'
    ],
    highlights: [
      'Connected to Sky City Mall & Metro Station',
      'Panoramas of Sanjay Gandhi National Park',
      'Iconic architectural facade'
    ],
    description: 'Oberoi Sky City reimagines high-rise luxury in Mumbai with integrated transit retail, world-class sports facilities, and panoramic green views.',
    isFeatured: false,
    isTrending: true
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-901',
    name: 'Vikram Malhotra',
    phone: '+91 98765 43210',
    email: 'vikram.m@gmail.com',
    budgetRange: '₹3 Cr - ₹5 Cr',
    preferredLocation: 'Golf Course Road, Gurgaon',
    propertyId: 'prop-101',
    propertyTitle: 'DLF The Camellias Ultra Luxury Residence',
    source: 'Website',
    timeline: 'Immediate',
    stage: 'Site Visit Scheduled',
    salesperson: 'Ananya Sharma',
    notes: [
      'Client is an NRI investor currently in Delhi.',
      'Requested Saturday 11 AM site visit with family.',
      'Interested in 4 BHK Penthouse layout.'
    ],
    createdAt: '2026-07-20T10:30:00Z',
    nextFollowUp: '2026-07-25',
    isHighIntent: true
  },
  {
    id: 'lead-902',
    name: 'Priya Sundaram',
    phone: '+91 98112 34567',
    email: 'priya.sundaram@techcorp.com',
    budgetRange: '₹2.5 Cr - ₹3 Cr',
    preferredLocation: 'Noida Expressway',
    propertyId: 'prop-102',
    propertyTitle: 'Godrej Tropical Isle Sector 146',
    source: 'Google Ads',
    timeline: '1-3 Months',
    stage: 'Interested',
    salesperson: 'Rohan Mehta',
    notes: [
      'Looking for tax savings reinvestment.',
      'Downloaded brochure and price breakup.'
    ],
    createdAt: '2026-07-21T14:15:00Z',
    nextFollowUp: '2026-07-24',
    isHighIntent: true
  },
  {
    id: 'lead-903',
    name: 'Rajesh Verma',
    phone: '+91 99001 88776',
    email: 'rverma@real-investors.in',
    budgetRange: '₹6 Cr - ₹8 Cr',
    preferredLocation: 'Dwarka Expressway',
    propertyId: 'prop-103',
    propertyTitle: 'Sobha International City Villas',
    source: 'WhatsApp',
    timeline: 'Immediate',
    stage: 'Negotiation',
    salesperson: 'Ananya Sharma',
    notes: [
      'Second site visit completed on Tuesday.',
      'Discussing 5% payment plan milestone modification.'
    ],
    createdAt: '2026-07-15T09:00:00Z',
    nextFollowUp: '2026-07-23',
    isHighIntent: true
  },
  {
    id: 'lead-904',
    name: 'Karan Kapoor',
    phone: '+91 97654 12300',
    email: 'karan.kapoor@designstudio.com',
    budgetRange: '₹4 Cr - ₹5 Cr',
    preferredLocation: 'Mumbai West',
    propertyId: 'prop-104',
    propertyTitle: 'Oberoi Sky City Sky Towers',
    source: 'Referral',
    timeline: '3-6 Months',
    stage: 'New',
    salesperson: 'Unassigned',
    notes: [
      'Inquired via contact expert CTA on homepage.'
    ],
    createdAt: '2026-07-22T08:10:00Z',
    isHighIntent: false
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'gurgaon-golf-course-road-investment-guide-2026',
    title: 'Why Golf Course Road Remains Gurgaon\'s Top Capital Growth Hub in 2026',
    category: 'Investment',
    snippet: 'An in-depth analysis of supply constraints, rental yield appreciation, and why NRI investors are doubling down on luxury Golf Course Road projects.',
    content: 'Golf Course Road has consistently outperformed traditional micro-markets in the National Capital Region (NCR). With limited land banks remaining and unprecedented demand for gated ultra-luxury high-rises, capital value appreciation has crossed 18% YoY.',
    author: {
      name: 'Aditya Oberoi',
      role: 'Head of Real Estate Intelligence',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-07-18',
    readTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gurgaon', 'Golf Course Road', 'Luxury Real Estate', 'Market Trends']
  },
  {
    id: 'blog-2',
    slug: 'noida-expressway-jewar-airport-impact',
    title: 'Jewar Airport Operational Timeline & Impact on Noida Expressway Real Estate',
    category: 'Market News',
    snippet: 'Exploring how upcoming commercial corridors and international aviation connectivity are driving 25%+ price surges along Sector 140 to 150.',
    content: 'Noida Expressway is witnessing an unprecedented transition from affordable suburbia to a high-end corporate and residential hub. The commercial readiness of Noida International Airport at Jewar is the principal catalyst.',
    author: {
      name: 'Neha Kapoor',
      role: 'Senior Market Analyst',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-07-12',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    tags: ['Noida', 'Jewar Airport', 'Infrastructure', 'Price Trends']
  }
];

export const MOCK_LOCALITIES: Record<string, LocalityInfo> = {
  gurgaon: {
    slug: 'gurgaon',
    name: 'Golf Course Road & Extension',
    city: 'Gurgaon',
    avgPricePerSqFt: 28500,
    growthYoyPercent: 14.5,
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Gurgaon\'s financial and luxury epicenter home to multinational corporate headquarters, Michelin-standard dining, and premier golf courses.',
    nearbyInfra: [
      { category: 'Metro', name: 'Sector 53-54 Rapid Metro', distanceKm: 0.5 },
      { category: 'Airport', name: 'IGI Airport Delhi', distanceKm: 18.0 },
      { category: 'Hospital', name: 'Fortis Memorial Research Institute', distanceKm: 4.2 },
      { category: 'School', name: 'The Heritage School', distanceKm: 2.1 }
    ],
    faqs: [
      {
        question: 'What is the average price range for 3 BHK apartments in Golf Course Road?',
        answer: 'Prices typically range from ₹4.5 Cr to ₹12 Cr depending on the builder tier, age of property, and golf view orientation.'
      },
      {
        question: 'Is Golf Course Road suitable for high rental yield investment?',
        answer: 'Yes, corporate expats and C-suite executives yield 4.5% to 5.2% gross rental returns, among the highest in North India.'
      }
    ]
  },
  noida: {
    slug: 'noida',
    name: 'Noida Expressway & Sector 146',
    city: 'Noida',
    avgPricePerSqFt: 12800,
    growthYoyPercent: 19.2,
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'A planned low-density township with wide green corridors, seamless connectivity via Aqua Line Metro, and proximity to upcoming IT parks.',
    nearbyInfra: [
      { category: 'Metro', name: 'Sector 146 Aqua Line Metro', distanceKm: 0.2 },
      { category: 'Airport', name: 'Jewar Noida International Airport', distanceKm: 32.0 },
      { category: 'Hospital', name: 'Jaypee Hospital', distanceKm: 6.5 },
      { category: 'Shopping', name: 'Mall of India', distanceKm: 14.0 }
    ],
    faqs: [
      {
        question: 'What are the main advantages of investing along Noida Expressway?',
        answer: 'Low density zoning, 80% open green space compliance, and direct 35-minute expressway travel to Jewar Airport.'
      }
    ]
  }
};
