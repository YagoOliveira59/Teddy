import { AuthRemoteDataSource } from '../datasources/auth-remote-datasource';
import type { User } from '../../domain/entities/user';
import type { IAuthRepository, LoginResult } from '../../domain/repositories/iauth-repository';

export class AuthRepositoryImpl implements IAuthRepository {
  private readonly remoteDataSource: AuthRemoteDataSource;

  constructor(remoteDataSource: AuthRemoteDataSource) {
    this.remoteDataSource = remoteDataSource;
  }

  async login(credentials: { email: string; password: string }): Promise<LoginResult> {
    const { accessToken } = await this.remoteDataSource.login(credentials);
    localStorage.setItem('authToken', accessToken);
    const user = await this.getProfile();
    return { token: accessToken, user };
  }

  async getProfile(): Promise<User> {
    return await this.remoteDataSource.getProfile();
  }

  async register(data: User): Promise<User> {
  return await this.remoteDataSource.register(data);
}
}