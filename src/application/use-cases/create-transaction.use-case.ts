import { AppError } from "../../shared/errors/AppError";
import {
  CreateTransactionInput,
  DashboardRepository,
} from "../ports/dashboard.repository";
import { TransactionEntity } from "../../core/entities/transaction.entity";
import { logMessage } from "../../shared/utils/logger";

export class CreateTransactionUseCase {
  constructor(private repository: DashboardRepository) {}

  async execute(input: CreateTransactionInput): Promise<TransactionEntity> {
    logMessage(
      "src/application/use-cases/create-transaction.use-case.ts",
      `execute called with input=${JSON.stringify(input)}`,
    );

    const category = input.category.trim();
    const status = input.status.trim();
    const amount = Number(input.amount);

    if (!category) {
      throw new AppError("category is required", 400, "validation_error");
    }

    if (!status) {
      throw new AppError("status is required", 400, "validation_error");
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError(
        "amount must be a positive number",
        400,
        "validation_error",
      );
    }

    try {
      return await this.repository.createTransaction({
        category,
        amount,
        status,
      });
    } catch (error) {
      throw new AppError(
        "Unable to create transaction",
        500,
        "transaction_creation_failed",
        { originalError: error },
      );
    }
  }
}
