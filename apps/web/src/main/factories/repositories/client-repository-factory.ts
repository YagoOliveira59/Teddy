
import { makeAxiosHttpClient } from "../../../infra/http/axios-http-client";
import { ClientRemoteDataSource } from "../../../data/datasources/client-remote-datasource";
import { ClientRepositoryImpl } from "../../../data/repositories/client-repository-impl";
import type { IClientRepository } from "../../../domain/repositories/iclient-repository";

export function makeClientRepository(): IClientRepository {
  const httpClient = makeAxiosHttpClient();
  const remoteDataSource = new ClientRemoteDataSource(httpClient);
  const clientRepository = new ClientRepositoryImpl(remoteDataSource);

  return clientRepository;
}
