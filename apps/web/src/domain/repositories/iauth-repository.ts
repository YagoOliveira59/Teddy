import type { User } from "../entities/user";

export interface LoginResult {
  token: string;
  user: User;
}

export interface IAuthRepository {
  login(credentials: { email: string; password: string }): Promise<LoginResult>;
  register(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  getProfile(): Promise<User>;
}
