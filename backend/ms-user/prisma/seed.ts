import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@armovie.com';
  
  // Using upsert ensures that if the admin already exists, this command will not crash.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // no updates if it exists
    create: {
      name: 'Administrador',
      email: adminEmail,
      // Hash gerado para a senha "admin123456789"
      passwordHash: '$2b$10$4mtsKqYgt9NY1Vb7nmHV1elY7Ne5vA.p61jJEVHbZzS1ATMzzRyV6',
      position: 'Diretor',
      role: 'Admin',
      status: 'Ativo',
    },
  });

  console.log('✅ Seed: Default admin user ensured ->', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
