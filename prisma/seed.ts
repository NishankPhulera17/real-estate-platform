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
      },      {
        title: 'The Great Return: How Reverse Migration Is Reshaping Uttarakhand and Why It Matters',
        slug: 'reverse-migration-reshaping-uttarakhand',
        content: 'For decades, the story of Uttarakhand was defined by one word: *migration*.\n\nEvery year, thousands of young people left their villages and hometowns for Delhi, Mumbai, Bengaluru, Chandigarh, Pune, and other metropolitan cities. They were searching for better education, higher-paying jobs, modern healthcare, and opportunities that seemed impossible to find in the hills.\n\nThe result was visible across the state. Villages became quieter. Schools shut down due to declining enrollment. Agricultural land was abandoned. Traditional homes were locked for years. Entire communities slowly disappeared as generations settled elsewhere.\n\nBut today, a new chapter is being written.\n\nAcross Uttarakhand, a growing number of people are returning—not because they have failed in the cities, but because they are redefining what success looks like.\n\nThis movement is known as *reverse migration*, and it is transforming not only how people live but also how they think about home, work, investment, and the future.\n\nAt NorthNest, we believe this is one of the most significant social and economic shifts happening in India today.\n\n---\n\n## Why Are People Leaving Cities?\n\nFor many years, cities promised everything: careers, growth, financial security, and modern lifestyles.\n\nWhile cities have undoubtedly created opportunities for millions, they have also introduced challenges that affect everyday life.\n\nMany urban residents now face:\n\n* Rising air pollution\n* Long daily commutes\n* Expensive housing\n* Increasing stress and burnout\n* Limited access to green spaces\n* Noise pollution\n* Higher living costs\n* Less time with family\n* Reduced work-life balance\n\nOwning a home in many major cities has become increasingly difficult, while the quality of life often continues to decline.\n\nThe pandemic accelerated a question that many had quietly been asking for years:\n\n*Do we really need to live in a city to build a successful life?*\n\nFor an increasing number of professionals, entrepreneurs, freelancers, creators, retirees, and families, the answer is no.\n\n---\n\n## Technology Changed Everything\n\nOnly a decade ago, living away from major cities meant sacrificing career opportunities.\n\nToday, technology has changed that equation.\n\nRemote work, online businesses, digital consulting, software development, content creation, e-commerce, and global freelancing allow people to earn from anywhere with a reliable internet connection.\n\nWork is becoming increasingly location-independent.\n\nPeople are no longer choosing where to live based solely on where offices are located.\n\nInstead, they are choosing places that offer a healthier, happier, and more meaningful lifestyle.\n\nFor many, Uttarakhand has become that place.\n\n---\n\n## Why Uttarakhand Is Becoming India\'s Lifestyle Destination\n\nUttarakhand offers something that is becoming increasingly rare in modern life.\n\nFresh mountain air.\n\nNatural forests.\n\nClean rivers.\n\nA slower pace of life.\n\nA deep cultural heritage.\n\nHealthy food.\n\nClose-knit communities.\n\nAccess to trekking, adventure, yoga, spirituality, and nature.\n\nWhether someone wants to raise children in a healthier environment, retire peacefully, build a holiday home, or simply escape the constant rush of metropolitan life, Uttarakhand provides an alternative that feels increasingly relevant.\n\nThis is no longer simply about tourism.\n\nPeople want to build lives here.\n\n---\n\n## Reverse Migration Is More Than Coming Home\n\nWhen when people hear the phrase "reverse migration," they often imagine families returning to their ancestral villages.\n\nThat is certainly part of the story.\n\nBut today\'s reverse migration is much broader.\n\nIt includes:\n\n* Professionals relocating permanently from cities\n* Entrepreneurs launching businesses in the hills\n* Creators and artists seeking inspiring environments\n* Remote workers building mountain lifestyles\n* Retirees investing in peaceful communities\n* Families prioritizing healthier childhoods\n* Investors looking for long-term opportunities\n* Individuals reconnecting with their cultural roots\n\nSome return to ancestral homes.\n\nOthers build entirely new ones.\n\nThe common thread is simple:\n\nPeople are choosing quality of life over convenience.\n\n---\n\n## Natural Farming Is Creating New Opportunities\n\nOne of the strongest outcomes of reverse migration has been the revival of agriculture.\n\nAcross Uttarakhand, people are restoring abandoned farmland and embracing natural farming practices.\n\nInstead of relying heavily on chemical-intensive agriculture, many are cultivating:\n\n* Traditional millets\n* Organic vegetables\n* Seasonal fruits\n* Medicinal herbs\n* Honey\n* Herbs and spices\n* Indigenous crops\n\nConsumers across India increasingly value healthy, chemical-free food.\n\nThis growing demand creates opportunities for local farmers, entrepreneurs, hospitality businesses, and agritourism.\n\nLand that once appeared unproductive is becoming valuable again—not only economically but socially and environmentally.\n\n---\n\n## A New Era for Uttarakhand Real Estate\n\nReal estate in Uttarakhand is evolving.\n\nFor years, many buyers viewed property solely as an investment.\n\nToday, purchasing land often represents something much deeper.\n\nPeople are looking for places where they can:\n\nBuild sustainable homes.\n\nCreate weekend retreats.\n\nStart homestays.\n\nDevelop eco-resorts.\n\nLaunch wellness businesses.\n\nPractice farming.\n\nRaise families.\n\nRetire peacefully.\n\nWork remotely.\n\nReconnect with nature.\n\nThe value of a property is no longer measured only in square feet.\n\nIt is measured by the life it enables.\n\n---\n\n## Sustainable Development Must Come First\n\nAs interest in Uttarakhand grows, responsible development becomes increasingly important.\n\nThe Himalayan ecosystem is fragile.\n\nUnplanned construction, excessive commercialization, illegal land practices, and environmental neglect can damage the very landscapes that attract people here.\n\nFuture development should prioritize:\n\n* Environmentally responsible construction\n* Rainwater harvesting\n* Renewable energy\n* Local architecture\n* Water conservation\n* Disaster-resilient planning\n* Respect for local communities\n* Preservation of forests and biodiversity\n\nGrowth should never come at the cost of nature.\n\nThe future of Uttarakhand depends on balancing development with conservation.\n\n---\n\n## Why NorthNest Exists\n\nAt NorthNest, we believe a home is far more than a property transaction.\n\nIt is a life decision.\n\nOur mission is to make reverse migration easier, safer, and more transparent for people who dream of building a future in Uttarakhand.\n\nWhether you\'re searching for a mountain home, agricultural land, an investment opportunity, a retirement property, or simply exploring the possibility of relocating, we want to be your trusted guide.\n\nWe are building more than a real estate platform.\n\nWe are building a movement around better living.\n\nThrough verified property listings, local expertise, migration resources, market insights, and educational content, our goal is to help people make informed decisions while supporting sustainable growth across Uttarakhand.\n\n---\n\n## Looking Ahead\n\nThe future of Uttarakhand is not only about tourism.\n\nIt is about communities.\n\nEntrepreneurship.\n\nNatural farming.\n\nResponsible development.\n\nDigital careers.\n\nHealthier families.\n\nCleaner environments.\n\nAnd a new generation choosing to build meaningful lives closer to nature.\n\nReverse migration is no longer a trend.\n\nIt is a transformation.\n\nAt NorthNest, we are proud to be part of this journey.\n\nBecause finding a home is not just about where you live.\n\nIt is about how you choose to live.\n\n*Welcome to NorthNest. Welcome home.*',
        isPublished: true,
        categories: ['Market News', 'Uttarakhand'],
      },
      {
        title: 'Why City Life No Longer Feels Like Success',
        slug: 'why-city-life-no-longer-feels-like-success',
        content: 'For generations, cities represented ambition.\n\nHigher salaries, better education, endless opportunities, and modern lifestyles attracted millions of people from smaller towns and villages.\n\nBut somewhere along the journey, many began asking an uncomfortable question.\n\nIs this really the life we wanted?\n\nHours spent in traffic. Rising pollution. Expensive housing. Limited green spaces. Constant noise. Increasing stress. Declining mental health.\n\nThe city offers opportunity, but often demands an enormous personal cost.\n\nAir quality has become a daily concern in many metropolitan regions. Children grow up with limited access to nature. Families spend more time commuting than together. Even after years of hard work, owning a home in major cities remains financially difficult for many.\n\nAt the same time, technology has quietly rewritten the rules.\n\nRemote work, online businesses, digital consulting, freelancing, and creator economies allow professionals to earn globally while living almost anywhere.\n\nThis shift has opened a new possibility.\n\nInstead of asking, "Where are the jobs?"\n\nPeople are asking,\n\n"Where do I actually want to live?"\n\nFor thousands, the answer is the mountains.\n\nFresh air.\n\nSlower mornings.\n\nCommunity.\n\nClean water.\n\nSpace.\n\nSilence.\n\nA healthier environment for children.\n\nThe choice is no longer between career and quality of life.\n\nIncreasingly, people are discovering they can have both.\n\nThe future may not belong exclusively to mega cities.\n\nIt may belong to places that allow people to live well.',
        isPublished: true,
        categories: ['Lifestyle', 'Mountain Life'],
      },
      {
        title: 'Why Uttarakhand Could Become India\'s Wellness Capital',
        slug: 'why-uttarakhand-could-become-indias-wellness-capital',
        content: 'Uttarakhand has always been associated with spirituality, rivers, forests, yoga, and the Himalayas.\n\nBut its next chapter may be even bigger.\n\nAs stress-related illnesses, pollution, and lifestyle disorders increase across urban India, demand for wellness destinations continues to grow.\n\nPeople are looking beyond vacations.\n\nThey want places where they can recover physically, mentally, and emotionally.\n\nThis creates opportunities for wellness retreats, eco-resorts, yoga communities, senior living, preventive healthcare, forest therapy, holistic healing, and sustainable residential developments.\n\nReal estate is becoming part of the wellness economy.\n\nDevelopers who prioritize environmental preservation, walkability, renewable energy, rainwater harvesting, and local materials will likely define the next generation of mountain living.\n\nThe future belongs to developments that improve lives rather than simply occupy land.\n\nUttarakhand already possesses what many destinations are trying to build artificially.\n\nNature has already done the hard work.',
        isPublished: true,
        categories: ['Investment', 'Wellness'],
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
