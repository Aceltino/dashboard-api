export class ApiResponse {
  static success<T>(
    data: T,
    message = "Success",
    meta?: Record<string, unknown>,
  ) {
    const base = {
      success: true,
      message,
      data,
    } as {
      success: true;
      message: string;
      data: T;
      meta?: Record<string, unknown>;
    };

    if (meta) {
      base.meta = meta;
    }

    return base;
  }

  static error(
    message = "Internal Server Error",
    statusCode = 500,
    code = "internal_error",
    details?: unknown,
  ) {
    const result: {
      success: false;
      error: {
        message: string;
        code: string;
        statusCode: number;
        details?: unknown;
      };
    } = {
      success: false,
      error: {
        message,
        code,
        statusCode,
      },
    };

    if (details) {
      result.error.details = details;
    }

    return result;
  }
}
