import api from "./client";

export interface CompanyRequest {
  name: string;
  cnpj?: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  cnpj: string | null;
}

export const createCompany = (data: CompanyRequest) =>
  api.post<CompanyResponse>("/companies", data);

export const listCompanies = () =>
  api.get<CompanyResponse[]>("/companies");
