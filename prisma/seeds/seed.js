const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lct.com' },
    update: {},
    create: {
      email: 'admin@lct.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log({ admin });

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'user@lct.com' },
    update: {},
    create: {
      email: 'user@lct.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'USER',
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log({ testUser });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
