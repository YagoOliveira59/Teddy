import type { IClientRepository } from "../repositories/iclient-repository";

export class DeleteClient {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    return this.clientRepository.delete(id);
  }
}
