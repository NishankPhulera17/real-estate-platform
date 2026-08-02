import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });
  console.log("User:", user);
  if (user && user.password) {
    const isValid = await bcrypt.compare('password123', user.password);
    console.log("Password valid:", isValid);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
