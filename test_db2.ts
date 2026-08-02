import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient(); // No pg adapter

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });
  console.log("User:", user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
