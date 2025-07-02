import type { Client } from "../entities/client";
import type { ISelectedClientsRepository } from "../repositories/i-selected-clients-repository";

export class GetSelectedClients {
  private readonly clientRepository: ISelectedClientsRepository;

  constructor(clientRepository: ISelectedClientsRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(): Promise<Client[]> {
    return await this.clientRepository.getSelectedClients();
  }
}
