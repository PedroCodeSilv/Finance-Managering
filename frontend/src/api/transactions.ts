import api from "./client";

export interface TransactionRequest {
  amount: number;
  description: string;
  accountId: number;
  categoryId: number;
  transactionDate?: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  description: string;
}

export interface TransactionByCategory {
  categoryId: number;
  categoryName: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
}

export const createTransaction = (data: TransactionRequest) =>
  api.post<TransactionResponse>("/transactions/user", data);

export const listTransactionsByCategory = () =>
  api.get<TransactionByCategory[]>("/transactions");
