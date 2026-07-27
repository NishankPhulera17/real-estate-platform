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
      name: 'DLF Builders',
      email: 'builder@example.com',
      password: passwordHash,
      role: Role.BUILDER,
      builder: {
        create: {
          name: 'DLF Builders',
          slug: 'dlf-builders',
          experienceYears: 75,
          rating: 4.8,
          description: 'India\'s largest commercial real estate developer.',
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

  // Create Properties (Looping to create 50 properties, 100 properties is a lot for seed execution time, reducing to 50 for realistic fast seed)
  console.log('Creating properties...');
  for (let i = 1; i <= 50; i++) {
    const isBuilderProp = i % 2 === 0;
    
    await prisma.property.create({
      data: {
        title: `Luxury Apartment ${i} in ${i % 2 === 0 ? 'Mumbai' : 'Pune'}`,
        slug: `luxury-apartment-${i}-${Date.now()}`,
        description: 'A beautiful luxury apartment with great views.',
        price: 5000000 + (i * 100000),
        propertyType: 'Apartment',
        possessionStatus: i % 3 === 0 ? 'Under Construction' : 'Ready to Move',
        status: 'PUBLISHED',
        bhk: (i % 3) + 2, // 2, 3, or 4 BHK
        bedrooms: (i % 3) + 2,
        bathrooms: (i % 3) + 1,
        areaSqFt: 1000 + (i * 50),
        cityId: i % 2 === 0 ? mumbai.id : pune.id,
        builderId: isBuilderProp ? builderUser.builder?.id : null,
        brokerId: !isBuilderProp ? brokerUser.broker?.id : null,
        
        location: {
          create: {
            address: `${i} Main St`,
            locality: i % 2 === 0 ? 'Bandra' : 'Kalyani Nagar',
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
            { url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', isCover: true }
          ]
        }
      }
    });
  }

  // Create Blogs
  await prisma.blog.create({
    data: {
      title: 'Top 10 Investment Areas in Mumbai',
      slug: 'top-10-investment-areas-mumbai',
      content: 'Detailed analysis of Mumbai real estate...',
      isPublished: true,
      categories: ['Investment', 'Mumbai'],
    }
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
