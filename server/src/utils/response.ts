import type { Response } from 'express';

export const STATUS_MESSAGES: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  423: 'Locked',
  500: 'Internal Server Error',
};

export function reply(
  res: Response,
  statusCode: number,
  message?: string,
  extra?: object
): Response {
  const msg =
    message !== undefined && message !== null && message !== ''
      ? message
      : STATUS_MESSAGES[statusCode] || 'Error';
  const body: Record<string, unknown> = { statusCode, message: msg };
  if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
    Object.assign(body, extra as Record<string, unknown>);
  }
  return res.status(statusCode).json(body);
}
