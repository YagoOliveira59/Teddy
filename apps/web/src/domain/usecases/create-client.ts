import type { Client } from "../entities/client";
import type { IClientRepository } from "../repositories/iclient-repository";

export class CreateClient {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(data: Omit<Client, "id">): Promise<Client> {
    if (!data.name || !data.companyValue || !data.salary) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    return this.clientRepository.create(data);
  }
}
