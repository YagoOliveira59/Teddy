import type { Client } from "../entities/client";
import type { IClientRepository } from "../repositories/iclient-repository";

export class UpdateClient {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string, data: Partial<Omit<Client, 'id'>>): Promise<Client> {
    return this.clientRepository.update(id, data);
  }
}
