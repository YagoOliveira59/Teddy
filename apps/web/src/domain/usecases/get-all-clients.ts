import type { Client } from "../entities/client";
import type { IClientRepository } from "../repositories/iclient-repository";

export class GetAllClients {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(): Promise<Client[]> {
    return await this.clientRepository.getAll();
  }
}
