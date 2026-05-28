import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { reply } from '../utils/response';
import { AppError } from '../utils/app-error';

type DuplicateKeyError = {
  code?: number;
  keyValue?: Record<string, unknown>;
};

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: Record<string, unknown> | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    details = {
      fields: Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
    };
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if ((err as DuplicateKeyError)?.code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
    details = { keyValue: (err as DuplicateKeyError).keyValue };
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  return void reply(res, statusCode, message, details);
}
