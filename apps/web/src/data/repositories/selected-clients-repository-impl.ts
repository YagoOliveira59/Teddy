import type { ISelectedClientsRepository } from "../../domain/repositories/i-selected-clients-repository";
import { ClientRemoteDataSource } from "../datasources/client-remote-datasource";
import type { Client } from "../../domain/entities/client";

export class SelectedClientsRepositoryImpl
  implements ISelectedClientsRepository
{
  private readonly remoteDataSource: ClientRemoteDataSource;

  constructor(remoteDataSource: ClientRemoteDataSource) {
    this.remoteDataSource = remoteDataSource;
  }

  async getSelectedClients(): Promise<Client[]> {
    return await this.remoteDataSource.getSelectedClients();
  }

  async addClientToSelection(id: string): Promise<void> {
    await this.remoteDataSource.addClientToSelection(id);
  }

  async removeClientFromSelection(id: string): Promise<void> {
    await this.remoteDataSource.removeClientFromSelection(id);
  }

  async clearAllSelectedClients(): Promise<void> {
    await this.remoteDataSource.clearAllSelectedClients();
  }
}
