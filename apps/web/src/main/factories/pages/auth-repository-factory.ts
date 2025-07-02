import { makeAxiosHttpClient } from "../../../infra/http/axios-http-client";
import { AuthRemoteDataSource } from "../../../data/datasources/auth-remote-datasource";
import { AuthRepositoryImpl } from "../../../data/repositories/auth-repository-impl";
import type { IAuthRepository } from "../../../domain/repositories/iauth-repository";

export function makeAuthRepository(): IAuthRepository {
  const httpClient = makeAxiosHttpClient();
  const remoteDataSource = new AuthRemoteDataSource(httpClient);
  const authRepository = new AuthRepositoryImpl(remoteDataSource);

  return authRepository;
}
