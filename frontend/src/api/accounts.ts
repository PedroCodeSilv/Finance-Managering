import api from "./client";

export type AccountType = "CHECKING" | "CASH" | "CREDIT" | "DEBIT";
export type AccountCurrency = "BRL" | "USD" | "EUR";

export interface AccountRequest {
  name: string;
  type: AccountType;
  currency: AccountCurrency;
}

export interface AccountResponse {
  id: number;
  name: string;
  type: AccountType;
  currency: AccountCurrency;
}

export const createAccount = (data: AccountRequest) =>
  api.post<AccountResponse>("/account/user", data);

export const listAccounts = () =>
  api.get<AccountResponse[]>("/account/user");
