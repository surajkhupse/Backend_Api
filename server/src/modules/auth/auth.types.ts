export interface LoginBodyDto {
  email?: string;
  password?: string;
  deviceName?: string;
}

export interface ForgotPasswordBodyDto {
  email?: string;
}

export interface ResetPasswordBodyDto {
  token?: string;
  password?: string;
}

export interface TokenPairResponseDto {
  accessToken: string;
  refreshToken: string;
  token: string;
  expiresIn: number;
}

/** @deprecated use TokenPairResponseDto */
export type LoginSuccessDataDto = TokenPairResponseDto;

export interface RefreshTokenBodyDto {
  refreshToken?: string;
  deviceName?: string;
}

export interface LogoutBodyDto {
  refreshToken?: string;
}

export interface ApiReplyBody {
  statusCode: number;
  message: string;
}
