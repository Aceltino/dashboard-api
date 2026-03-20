export interface TransactionEntity {
  id: number;
  category: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardRepository {
  findTransactions(start: Date, end: Date): Promise<TransactionEntity[]>;
}
