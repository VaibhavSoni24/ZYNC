import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled request error:', err);

  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formatted
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected internal server error occurred'
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message
  });
}
