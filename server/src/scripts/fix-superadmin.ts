import dotenv from 'dotenv';
dotenv.config();

import User from '../modules/users/user.model';
import { hashPassword } from '../utils/bcrypt';
import connectDB from '../config/db';

const SUPERADMIN_EMAIL = 'superadmin@platform.com';
const SUPERADMIN_PASSWORD = 'SuperAdmin@123';

/**
 * Restores superadmin@platform.com to role=superadmin with no tenant.
 * Run if superadmin was accidentally changed to tenant_admin after creating a tenant.
 */
async function fix() {
  await connectDB();

  const user = await User.findOne({ email: SUPERADMIN_EMAIL });
  if (!user) {
    const password = await hashPassword(SUPERADMIN_PASSWORD);
    await User.create({
      name: 'Super Admin',
      email: SUPERADMIN_EMAIL,
      password,
      role: 'superadmin',
      isActive: true,
    });
    console.log('Created superadmin:', SUPERADMIN_EMAIL);
    process.exit(0);
  }

  const before = { role: user.role, tenant: user.tenant?.toString() ?? null };
  user.role = 'superadmin';
  user.tenant = undefined;
  user.isActive = true;
  if (!user.password) {
    user.password = await hashPassword(SUPERADMIN_PASSWORD);
  }
  await user.save();

  console.log('Superadmin restored:', SUPERADMIN_EMAIL);
  console.log('Before:', before);
  console.log('After: role=superadmin, tenant=null');
  console.log('Log out in the app, then log in again with:', SUPERADMIN_EMAIL);
  process.exit(0);
}

fix().catch((err) => {
  console.error(err);
  process.exit(1);
});
