import api from "./client";

export type CategoryType = "EXPENSE" | "INCOME";

export interface CategoryRequest {
  name: string;
  type: CategoryType;
}

export interface CategoryResponse {
  id: number;
  name: string;
  type: CategoryType;
}

export const createCategory = (data: CategoryRequest) =>
  api.post<CategoryResponse>("/category/user", data);

export const listCategories = () =>
  api.get<CategoryResponse[]>("/category");
