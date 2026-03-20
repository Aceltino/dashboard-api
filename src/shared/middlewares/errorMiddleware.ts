import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { ApiResponse } from "../http/ApiResponse";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const err = error as
    | AppError
    | {
        name?: string;
        code?: string;
        details?: unknown;
        statusCode?: number;
        message?: string;
      };
  const isAppError =
    err instanceof AppError ||
    err.name === "AppError" ||
    err.code === "validation_error";

  if (isAppError) {
    const appError =
      err instanceof AppError
        ? err
        : new AppError(
            err.message || "Invalid query parameters",
            err.statusCode || 400,
            err.code || "validation_error",
            err.details,
          );

    return res
      .status(appError.statusCode)
      .json(
        ApiResponse.error(
          appError.message,
          appError.statusCode,
          appError.code,
          appError.details,
        ),
      );
  }

  if (err.name === "PrismaClientKnownRequestError") {
    return res.status(400).json(
      ApiResponse.error("Database conflict error", 400, "database_conflict", {
        meta: err.code,
      }),
    );
  }

  console.error(
    `[Internal Error]: ${String((error as Error)?.stack || error)}`,
  );

  return res
    .status(500)
    .json(ApiResponse.error("Internal server error", 500, "internal_error"));
}
