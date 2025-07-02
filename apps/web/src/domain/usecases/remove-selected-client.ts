import type { ISelectedClientsRepository } from "../repositories/i-selected-clients-repository";

export class RemoveClientFromSelection {
  private readonly clientRepository: ISelectedClientsRepository;

  constructor(clientRepository: ISelectedClientsRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    return await this.clientRepository.removeClientFromSelection(id);
  }
}
