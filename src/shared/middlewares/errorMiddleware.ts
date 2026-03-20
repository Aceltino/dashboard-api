import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { ApiResponse } from '../http/ApiResponse';

export function errorMiddleware(
  error: Error & Partial<AppError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      ApiResponse.error(error.message, error.statusCode, error.code, error.details)
    );
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json(
      ApiResponse.error('Database conflict error', 400, 'database_conflict', {
        meta: error.code,
      })
    );
  }

  console.error(`[Internal Error]: ${error.stack}`);

  return res.status(500).json(ApiResponse.error('Internal server error', 500, 'internal_error'));
}
