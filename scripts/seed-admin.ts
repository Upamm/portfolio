// Seed script to create master admin account
// Run with: bun run scripts/seed-admin.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@upam.com';
  const password = 'Admin@123456';
  const name = 'Upam';

  // Check if admin already exists
  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin account already exists: ${email}`);
    console.log(`   Role: ${existing.role}`);
    console.log(`   Name: ${existing.name}`);
    return;
  }

  // Create admin account
  const hashedPassword = await bcrypt.hash(password, 12);
  const admin = await prisma.client.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      company: 'Upam Web Services',
      phone: null,
      address: null,
      isActive: true,
    },
  });

  console.log('✅ Master admin account created successfully!');
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: ${admin.role}`);
  console.log('');
  console.log('⚠️  Please change the password after first login!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
