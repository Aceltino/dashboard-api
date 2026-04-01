import { TransactionEntity } from "../../core/entities/transaction.entity";

export type { TransactionEntity };

export interface CreateTransactionInput {
  category: string;
  amount: number;
  status: string;
}

export interface DashboardRepository {
  findTransactions(start: Date, end: Date): Promise<TransactionEntity[]>;
  createTransaction(data: CreateTransactionInput): Promise<TransactionEntity>;
  getCategoryTotal(category: string): Promise<number>;
}
