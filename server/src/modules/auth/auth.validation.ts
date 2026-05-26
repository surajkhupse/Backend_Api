import type { IUser } from '../users/user.model';

/** Failed password attempts before lock (default 5). */
export function maxLoginAttemptsBeforeLock(): number {
  const n = Number(process.env.ACCOUNT_LOCK_MAX_ATTEMPTS);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return 5;
}

/** How long the account stays locked, in ms (default 15 minutes). */
export function accountLockDurationMs(): number {
  const n = Number(process.env.ACCOUNT_LOCK_DURATION_MS);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return 15 * 60 * 1000;
}

export function isAccountLocked(user: IUser): boolean {
  return !!(user.lockUntil && user.lockUntil.getTime() > Date.now());
}

/** Clears lock state when `lockUntil` is in the past. Returns whether the document was changed. */
export function clearExpiredLock(user: IUser): boolean {
  const now = Date.now();
  if (user.lockUntil && user.lockUntil.getTime() <= now) {
    user.lockUntil = undefined;
    user.failedLoginAttempts = 0;
    return true;
  }
  return false;
}
