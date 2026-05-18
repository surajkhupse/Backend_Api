import type { Types } from 'mongoose';

/** Incoming JSON for POST /register */
export interface RegisterBodyDto {
  name?: string;
  email?: string;
  password?: string;
}

/** Incoming JSON for POST /login */
export interface LoginBodyDto {
  email?: string;
  password?: string;
  /** Optional label for this device (or send `X-Device-Name`) */
  deviceName?: string;
}

/** Incoming JSON for POST /forgot-password */
export interface ForgotPasswordBodyDto {
  email?: string;
}

/** Incoming JSON for POST /reset-password */
export interface ResetPasswordBodyDto {
  token?: string;
  password?: string;
}

/** User subset returned on successful registration */
export interface RegisteredUserDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt?: Date;
}

/** Login, refresh, and SSO JSON success shape */
export interface TokenPairResponseDto {
  accessToken: string;
  refreshToken: string;
  /** Same as `accessToken` (legacy) */
  token: string;
  /** Access token TTL in seconds */
  expiresIn: number;
}

/** @deprecated use TokenPairResponseDto */
export type LoginSuccessDataDto = TokenPairResponseDto;

/** POST /api/auth/refresh */
export interface RefreshTokenBodyDto {
  refreshToken?: string;
  /** Optional; refreshes session metadata for the rotated token */
  deviceName?: string;
}

/** POST /api/auth/logout */
export interface LogoutBodyDto {
  refreshToken?: string;
}
