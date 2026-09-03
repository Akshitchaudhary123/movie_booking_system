
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const;

async function main() {
  console.log('🌱 Starting database seed...');

  // ==========================================
  // 1. Create system roles
  // ==========================================

  const superAdminRole = await prisma.role.upsert({
    where: {
      name: ROLES.SUPER_ADMIN,
    },
    update: {},
    create: {
      name: ROLES.SUPER_ADMIN,
    },
  });

  await prisma.role.upsert({
    where: {
      name: ROLES.ADMIN,
    },
    update: {},
    create: {
      name: ROLES.ADMIN,
    },
  });

  await prisma.role.upsert({
    where: {
      name: ROLES.CUSTOMER,
    },
    update: {},
    create: {
      name: ROLES.CUSTOMER,
    },
  });

  console.log('✅ Roles seeded');

  // ==========================================
  // 2. Validate admin credentials
  // ==========================================

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are required',
    );
  }

  // ==========================================
  // 3. Hash admin password
  // ==========================================

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // ==========================================
  // 4. Create / update SUPER_ADMIN
  // ==========================================

  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      roleId: superAdminRole.id,
    },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      roleId: superAdminRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`✅ SUPER_ADMIN created/updated: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });