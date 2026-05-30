import api from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const login = (data: LoginRequest) =>
  api.post<{ token: string }>("/api/auth/login", data);

export const register = (data: RegisterRequest) =>
  api.post<{ name: string; email: string }>("/users/register", data);
