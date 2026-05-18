import crypto from 'crypto';

export function createPlainResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashResetToken(plainToken: string): string {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
}
