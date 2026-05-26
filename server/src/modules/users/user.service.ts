import User from './user.model';

export function normalizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

export async function findUserByEmail(emailRaw: unknown) {
  const normalized = normalizeEmail(emailRaw);
  if (!normalized) return null;
  const exact = await User.findOne({ email: normalized });
  if (exact) return exact;
  return User.findOne({
    $expr: { $eq: [{ $toLower: '$email' }, normalized] },
  });
}
