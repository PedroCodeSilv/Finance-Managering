import api from "./client";

export interface MonthlyBalance {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface TransactionDetail {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  categoryType: "EXPENSE" | "INCOME";
}

export interface AccountBalance {
  accountId: number;
  accountName: string;
  type: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const getMonthlyBalance = () =>
  api.get<MonthlyBalance[]>("/reports/monthly-balance");

export const getTransactionsByCategory = (categoryId: number) =>
  api.get<TransactionDetail[]>(`/reports/category/${categoryId}/transactions`);

export const getAccountBalances = () =>
  api.get<AccountBalance[]>("/reports/account-balances");

export const getTransactionsByAccount = (accountId: number, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  return api.get<TransactionDetail[]>(`/reports/account/${accountId}/transactions${query}`);
};
