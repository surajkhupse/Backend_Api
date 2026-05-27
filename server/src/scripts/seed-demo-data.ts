import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import User from '../modules/users/user.model';
import Tenant from '../modules/tenants/tenant.model';
import { createTenant } from '../modules/tenants/tenant.service';
import { hashPassword } from '../utils/bcrypt';
import { normalizeEmail } from '../modules/users/user.service';
import type { UserRole } from '../modules/users/user.model';

const DEMO_PASSWORD = 'Demo@123';

type SeedUser = {
  name: string;
  email: string;
  role: UserRole;
};

const DEMO_USERS: SeedUser[] = [
  { name: 'Alice Acme', email: 'owner@acme.com', role: 'member' },
  { name: 'Bob Globex', email: 'owner@globex.com', role: 'member' },
  { name: 'Carol Initech', email: 'owner@initech.com', role: 'member' },
  { name: 'Dave Member', email: 'member@acme.com', role: 'member' },
  { name: 'Eve Viewer', email: 'viewer@globex.com', role: 'viewer' },
];

const DEMO_TENANTS = [
  { name: 'Acme Events', domain: 'acme.events.local', ownerEmail: 'owner@acme.com', status: 'active' as const },
  { name: 'Globex Corporation', domain: 'globex.local', ownerEmail: 'owner@globex.com', status: 'active' as const },
  { name: 'Initech Solutions', domain: 'initech.local', ownerEmail: 'owner@initech.com', status: 'active' as const },
];

const TENANT_MEMBERS = [
  { email: 'member@acme.com', tenantOwnerEmail: 'owner@acme.com', role: 'member' as const },
  { email: 'viewer@globex.com', tenantOwnerEmail: 'owner@globex.com', role: 'viewer' as const },
];

async function ensureSuperadmin() {
  const email = 'superadmin@platform.com';
  let user = await User.findOne({ email });
  if (!user) {
    const password = await hashPassword('SuperAdmin@123');
    user = await User.create({
      name: 'Super Admin',
      email,
      password,
      role: 'superadmin',
      isActive: true,
    });
    console.log('Created superadmin:', email);
  } else {
    console.log('Superadmin exists:', email);
  }
}

async function ensureUser({ name, email, role }: SeedUser) {
  const normalized = normalizeEmail(email);
  let user = await User.findOne({ email: normalized });
  const password = await hashPassword(DEMO_PASSWORD);
  if (!user) {
    user = await User.create({
      name,
      email: normalized,
      password,
      role,
      isActive: true,
    });
    console.log('Created user:', normalized, `(${role})`);
    return user;
  }
  console.log('User exists:', normalized);
  return user;
}

async function seed() {
  await connectDB();
  await ensureSuperadmin();

  for (const u of DEMO_USERS) {
    await ensureUser(u);
  }

  for (const t of DEMO_TENANTS) {
    const owner = await User.findOne({ email: normalizeEmail(t.ownerEmail) });
    if (!owner) {
      console.warn('Skip tenant — owner not found:', t.ownerEmail);
      continue;
    }
    const slug = t.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-');
    const exists = await Tenant.findOne({ slug });
    if (exists) {
      console.log('Tenant exists:', t.name, `(${slug})`);
      continue;
    }
    const tenant = await createTenant({
      name: t.name,
      ownerId: owner._id,
      status: t.status,
      domain: t.domain,
    });
    console.log('Created tenant:', tenant.name, '→ owner', t.ownerEmail);
  }

  for (const m of TENANT_MEMBERS) {
    const user = await User.findOne({ email: normalizeEmail(m.email) });
    const owner = await User.findOne({ email: normalizeEmail(m.tenantOwnerEmail) });
    if (!user || !owner?.tenant) {
      console.warn('Skip member assign:', m.email);
      continue;
    }
    if (String(user.tenant) === String(owner.tenant) && user.role === m.role) {
      console.log('Member already assigned:', m.email);
      continue;
    }
    await User.findByIdAndUpdate(user._id, {
      tenant: owner.tenant,
      role: m.role,
    });
    console.log('Assigned', m.email, '→ tenant of', m.tenantOwnerEmail, `(${m.role})`);
  }

  const tenantCount = await Tenant.countDocuments();
  const userCount = await User.countDocuments();
  console.log('\n--- Demo seed complete ---');
  console.log(`Tenants: ${tenantCount} | Users: ${userCount}`);
  console.log('\nLogin credentials (password for demo users):', DEMO_PASSWORD);
  console.log('Superadmin: superadmin@platform.com / SuperAdmin@123');
  console.log('Owners: owner@acme.com, owner@globex.com, owner@initech.com');
  console.log('Others: member@acme.com, viewer@globex.com');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
