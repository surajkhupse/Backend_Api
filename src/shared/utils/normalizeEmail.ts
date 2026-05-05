export function normalizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}
