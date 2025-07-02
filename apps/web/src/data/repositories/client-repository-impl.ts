import type { Client } from "../../domain/entities/client";
import type { IClientRepository } from "../../domain/repositories/iclient-repository";
import { ClientRemoteDataSource } from "../datasources/client-remote-datasource";

export class ClientRepositoryImpl implements IClientRepository {
  private readonly remoteDataSource: ClientRemoteDataSource;

  constructor(remoteDataSource: ClientRemoteDataSource) {
    this.remoteDataSource = remoteDataSource;
  }

  async getAll(): Promise<Client[]> {
    return await this.remoteDataSource.getAll();
  }

  async create(data: Omit<Client, "id">): Promise<Client> {
    return await this.remoteDataSource.create(data);
  }

  async delete(id: string): Promise<void> {
    await this.remoteDataSource.delete(id);
  }

  async update(id: string, data: Partial<Omit<Client, "id">>): Promise<Client> {
    return await this.remoteDataSource.update(id, data);
  }
}
