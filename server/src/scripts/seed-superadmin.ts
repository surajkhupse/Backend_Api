import dotenv from 'dotenv';
dotenv.config();

import User from '../modules/users/user.model';
import { hashPassword } from '../utils/bcrypt';
import connectDB from '../config/db';

async function seed() {
  await connectDB();

  const existing = await User.findOne({ role: 'superadmin' });
  if (existing) {
    console.log('Superadmin already exists:', existing.email);
    process.exit(0);
  }

  const password = await hashPassword('SuperAdmin@123');
  const superadmin = await User.create({
    name: 'Super Admin',
    email: 'superadmin@platform.com',
    password,
    role: 'superadmin',
    tenant: undefined,
    isActive: true,
  });

  console.log('Superadmin created:', superadmin.toObject().email);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});