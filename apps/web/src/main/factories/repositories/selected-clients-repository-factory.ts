import { makeAxiosHttpClient } from "../../../infra/http/axios-http-client";
import { ClientRemoteDataSource } from "../../../data/datasources/client-remote-datasource";
import { SelectedClientsRepositoryImpl } from '../../../data/repositories/selected-clients-repository-impl';
import type { ISelectedClientsRepository } from '../../../domain/repositories/i-selected-clients-repository';

export function makeSelectedClientsRepository(): ISelectedClientsRepository {
  const httpClient = makeAxiosHttpClient();
  const remoteDataSource = new ClientRemoteDataSource(httpClient);
  const selectedClientRepository = new SelectedClientsRepositoryImpl(remoteDataSource);

  return selectedClientRepository;
}
