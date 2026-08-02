import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seeding...');

  // Check if already seeded to prevent wiping production data
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  if (existingAdmin) {
    console.log('Database already seeded. Skipping...');
    return;
  }

  // Clean DB
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.comparisonProperty.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();

  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyDocument.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.location.deleteMany();
  await prisma.property.deleteMany();

  await prisma.destinationGallery.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.state.deleteMany();

  await prisma.blog.deleteMany();
  await prisma.builder.deleteMany();
  await prisma.broker.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (Admin, Builder, Broker)
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const builderUser = await prisma.user.create({
    data: {
      name: 'NorthNest',
      email: 'northnest@example.com',
      password: passwordHash,
      role: Role.BUILDER,
      builder: {
        create: {
          name: 'NorthNest',
          slug: 'NorthNest-builders',
          experienceYears: 25,
          rating: 4.8,
          description: 'India\'s best real estate developer.',
        }
      }
    },
    include: { builder: true }
  });

  const brokerUser = await prisma.user.create({
    data: {
      name: 'PropTiger Realty',
      email: 'broker@example.com',
      password: passwordHash,
      role: Role.BROKER,
      broker: {
        create: {
          companyName: 'PropTiger Realty',
          rating: 4.5,
        }
      }
    },
    include: { broker: true }
  });

  // Create States & Cities
  const maharashtra = await prisma.state.create({
    data: { name: 'Maharashtra' }
  });

  const mumbai = await prisma.city.create({
    data: { name: 'Mumbai', stateId: maharashtra.id }
  });

  const pune = await prisma.city.create({
    data: { name: 'Pune', stateId: maharashtra.id }
  });

  // Create Amenities
  const pool = await prisma.amenity.create({ data: { name: 'Swimming Pool' } });
  const gym = await prisma.amenity.create({ data: { name: 'Gymnasium' } });
  const security = await prisma.amenity.create({ data: { name: '24/7 Security' } });

  // Create Destinations
  console.log('Creating destinations...');
  const mukteshwar = await prisma.destination.create({
    data: {
      name: 'Mukteshwar',
      slug: 'mukteshwar',
      description: 'Serene Himalayan views, apple orchards, and a perfect climate for remote work.',
      heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
      airQuality: 'Excellent (AQI 30)',
      climate: 'Sub-tropical Himalayan',
      waterQuality: 'Natural Mountain Springs',
      internetAvailability: 'High-Speed Fiber',
      sustainabilityScore: 94,
      remoteWorkScore: 98,
      retirementScore: 96,
      familyFriendliness: 92,
      thingsToDo: ['Apple Orchard Trails', 'Paragliding & Adventure', 'Valley Sunset Viewpoints', 'Bhakra Waterfalls Trek'],
      localBusinesses: ['Organic Tea Café', 'Co-work Retreat Hub', 'Artisanal Bakery & Roast'],
    }
  });

  const coorg = await prisma.destination.create({
    data: {
      name: 'Coorg',
      slug: 'coorg',
      description: 'Coffee plantations, misty mornings, and lush green valleys.',
      heroImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80',
      airQuality: 'Pristine (AQI 25)',
      climate: 'Cool Tropical & Misty',
      waterQuality: 'River Springs & Rainwater Harvesting',
      internetAvailability: 'Dedicated 5G & Fiber',
      sustainabilityScore: 95,
      remoteWorkScore: 92,
      retirementScore: 97,
      familyFriendliness: 94,
      thingsToDo: ['Coffee Estate Tasting', 'Dubare Elephant Camp', 'Abbey Falls Excursions', 'Spice Garden Trails'],
      localBusinesses: ['Estate Brew & Roasters', 'Spice Plantation Co-op', 'Valley Meditation Haven'],
    }
  });

  const southGoa = await prisma.destination.create({
    data: {
      name: 'South Goa Countryside',
      slug: 'south-goa',
      description: 'Quiet village life, sustainable communities, and pristine nature away from the crowds.',
      heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
      airQuality: 'Fresh Coastal (AQI 32)',
      climate: 'Tropical Maritime',
      waterQuality: 'Filtered Ground & Borewell',
      internetAvailability: 'Gigabit Optic Fiber',
      sustainabilityScore: 92,
      remoteWorkScore: 99,
      retirementScore: 95,
      familyFriendliness: 93,
      thingsToDo: ['Secluded Cove Walks', 'Heritage Portuguese Architecture Tour', 'Sunset Kayaking', 'Weekly Organic Markets'],
      localBusinesses: ['Artisan Sourdough Studio', 'Community Co-working Lounge', 'Sustainable Seafood & Cafe'],
    }
  });

  // Create Properties (Looping to create 50 properties, linked with Destinations)
  console.log('Creating properties...');
  for (let i = 1; i <= 50; i++) {
    const isBuilderProp = i % 2 === 0;

    let targetDest = mukteshwar;
    let localityName = "Mukteshwar Valley";
    let propTitle = `Himalayan Ridge Villa ${i}`;
    let propImg = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

    if (i > 18 && i <= 34) {
      targetDest = coorg;
      localityName = "Coorg Estate Highlands";
      propTitle = `Misty Coffee Estate Villa ${i}`;
      propImg = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";
    } else if (i > 34) {
      targetDest = southGoa;
      localityName = "Assagao Countryside Retreats";
      propTitle = `Heritage Countryside Manor ${i}`;
      propImg = "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80";
    }

    await prisma.property.create({
      data: {
        title: propTitle,
        slug: `${propTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        description: `A verified luxury development in ${targetDest.name} featuring pristine valley views, eco-friendly features, and seamless connectivity.`,
        price: 35000000 + (i * 500000),
        propertyType: i % 3 === 0 ? 'Villa' : 'Penthouse',
        possessionStatus: i % 3 === 0 ? 'Under Construction' : 'Ready to Move',
        status: 'PUBLISHED',
        bhk: (i % 3) + 3, // 3, 4, or 5 BHK
        bedrooms: (i % 3) + 3,
        bathrooms: (i % 3) + 2,
        areaSqFt: 2200 + (i * 120),
        cityId: i % 2 === 0 ? mumbai.id : pune.id,
        builderId: isBuilderProp ? builderUser.builder?.id : null,
        brokerId: !isBuilderProp ? brokerUser.broker?.id : null,
        destinationId: targetDest.id,

        location: {
          create: {
            address: `${i} Scenic Crest View`,
            locality: localityName,
          }
        },
        amenities: {
          create: [
            { amenityId: pool.id },
            { amenityId: gym.id },
            { amenityId: security.id },
          ]
        },
        images: {
          create: [
            { url: propImg, isCover: true },
            { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", isCover: false }
          ]
        }
      }
    });
  }

  // Create Blogs
  await prisma.blog.createMany({
    data: [
      {
        title: 'Why New Tehri is the Next Big Luxury Vacation Home Destination',
        slug: 'tehri-lake-investment-guide',
        content: 'Tehri has consistently outperformed traditional hill stations in Uttarakhand. With the massive Tehri Lake and government initiatives to develop world-class water sports and luxury tourism, land values have appreciated by over 22% YoY. Investors are flocking to build luxury villas and boutique resorts overlooking the magnificent reservoir.',
        isPublished: true,
        categories: ['Investment', 'Tehri'],
      },
      {
        title: 'Dehradun Real Estate Boom: Connecting City Comforts with Nature',
        slug: 'dehradun-real-estate-boom',
        content: 'Dehradun is witnessing an unprecedented transition from a quiet retirement town to a bustling residential hub. The Delhi-Dehradun Expressway is the principal catalyst, cutting travel time drastically and making it a prime location for remote workers, retirees, and families looking for a blend of urban amenities and natural serenity.',
        isPublished: true,
        categories: ['Market News', 'Dehradun'],
      },
      {
        title: 'Kanatal: The Hidden Gem for Exclusive Mountain Retreats',
        slug: 'kanatal-hidden-gem-uttarakhand',
        content: 'While Mussoorie remains crowded, neighboring Kanatal offers the untouched beauty and tranquility that high-end buyers crave. Known for its lush pine forests and panoramic Himalayan views, Kanatal is emerging as a hotspot for sustainable, luxury eco-estates. Buyers are prioritizing privacy and nature, making this quiet hamlet highly sought after.',
        isPublished: true,
        categories: ['Lifestyle', 'Kanatal'],
      }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
