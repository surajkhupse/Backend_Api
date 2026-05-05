import User from '../../database/models/User';
import { normalizeEmail } from './normalizeEmail';

/**
 * Finds user by normalized email, or by case-insensitive match for legacy records.
 */
export async function findUserByEmail(emailRaw: unknown) {
  const normalized = normalizeEmail(emailRaw);
  if (!normalized) return null;
  const exact = await User.findOne({ email: normalized });
  if (exact) return exact;
  return User.findOne({
    $expr: { $eq: [{ $toLower: '$email' }, normalized] },
  });
}
