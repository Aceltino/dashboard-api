export interface TransactionEntity {
  id: number;
  category: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
