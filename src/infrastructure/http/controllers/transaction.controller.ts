import { Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { ApiResponse } from "../../../shared/http/ApiResponse";
import { CreateTransactionUseCase } from "../../../application/use-cases/create-transaction.use-case";
import { PrismaDashboardRepository } from "../../repositories/prisma-dashboard.repository";
import { transactionBodySchema } from "../../../shared/validators/transaction.validator";
import { logMessage } from "../../../shared/utils/logger";

export class TransactionController {
  private useCase: CreateTransactionUseCase;

  constructor(private repository = new PrismaDashboardRepository()) {
    this.useCase = new CreateTransactionUseCase(this.repository);
  }

  async handle(req: Request, res: Response) {
    logMessage(
      "src/infrastructure/http/controllers/transaction.controller.ts",
      `handle called with body=${JSON.stringify(req.body)}`,
    );

    const parseResult = transactionBodySchema.safeParse(req.body);

    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      logMessage(
        "src/infrastructure/http/controllers/transaction.controller.ts",
        `validation failed: ${JSON.stringify(issues)}`,
      );

      throw new AppError(
        "Invalid transaction payload",
        400,
        "validation_error",
        {
          issues,
        },
      );
    }

    const transaction = await this.useCase.execute(parseResult.data);

    return res
      .status(201)
      .json(
        ApiResponse.success(transaction, "Transaction created successfully"),
      );
  }
}
