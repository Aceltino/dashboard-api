export class ApiResponse {
  static success(data: any, message = 'Success', meta?: Record<string, any>) {
    const base = {
      success: true,
      message,
      data,
    } as any;

    if (meta) {
      base.meta = meta;
    }

    return base;
  }

  static error(message = 'Internal Server Error', statusCode = 500, code = 'internal_error', details?: unknown) {
    const result: any = {
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
