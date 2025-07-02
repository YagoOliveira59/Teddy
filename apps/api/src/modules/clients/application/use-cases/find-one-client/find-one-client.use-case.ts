import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { Client } from '../../../domain/entities/client.entity';

interface FindOneClientInput {
  id: string;
}

@Injectable()
export class FindOneClientUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute({ id }: FindOneClientInput): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Cliente com ID "${id}" não encontrado.`);
    }
    return client;
  }
}
