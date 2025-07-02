import type { ISelectedClientsRepository } from "../repositories/i-selected-clients-repository";

export class ClearSelectedClients {
  private readonly clientRepository: ISelectedClientsRepository;

  constructor(clientRepository: ISelectedClientsRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(): Promise<void> {
    return await this.clientRepository.clearAllSelectedClients();
  }
}
