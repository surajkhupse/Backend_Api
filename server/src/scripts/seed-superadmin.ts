import dotenv from 'dotenv';
dotenv.config();

import User from '../modules/users/user.model';
import { hashPassword } from '../utils/bcrypt';
import connectDB from '../config/db';

async function seed() {
  await connectDB();

  const email = 'superadmin@platform.com';
  const password = await hashPassword('SuperAdmin@123');
  let user = await User.findOne({ email });

  if (user) {
    user.role = 'superadmin';
    user.tenant = undefined;
    user.isActive = true;
    if (!user.password) user.password = password;
    await user.save();
    console.log('Superadmin ensured (role restored if needed):', email);
    process.exit(0);
  }

  const superadmin = await User.create({
    name: 'Super Admin',
    email,
    password,
    role: 'superadmin',
    isActive: true,
  });

  console.log('Superadmin created:', superadmin.toObject().email);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});