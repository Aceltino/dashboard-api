import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../shared/errors/AppError';

export function errorMiddleware(
    error: Error & Partial<AppError>,
    req: Request,
    res: Response,
    next: NextFunction
) {

    // Se o erro for uma instância do nosso AppError (erro previsto)
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    // Se for um erro do Prisma (ex: violação de constraint)
    if (error.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            success: false,
            message: 'Database conflict error',
            code: error.statusCode
        });
    }

    // Erro inesperado (500) - Logar para debug interno
    console.error(`[Internal Error]: ${error.stack}`);

    return res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
}