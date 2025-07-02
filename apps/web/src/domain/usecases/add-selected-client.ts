import type { ISelectedClientsRepository } from "../repositories/i-selected-clients-repository";

export class AddClientToSelection {
  private readonly clientRepository: ISelectedClientsRepository;

  constructor(clientRepository: ISelectedClientsRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.clientRepository.addClientToSelection(id);
  }
}
