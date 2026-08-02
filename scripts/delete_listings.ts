import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Deleting all properties and destinations from the live DB...");
  
  try {
    const deletedProperties = await prisma.property.deleteMany({});
    console.log(`Deleted ${deletedProperties.count} properties.`);
  } catch (e) {
    console.error("Error deleting properties:", e);
  }

  try {
    const deletedDestinations = await prisma.destination.deleteMany({});
    console.log(`Deleted ${deletedDestinations.count} destinations.`);
  } catch (e) {
    console.error("Error deleting destinations:", e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
