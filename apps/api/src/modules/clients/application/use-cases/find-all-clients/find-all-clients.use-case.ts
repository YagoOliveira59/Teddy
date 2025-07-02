import { Injectable, Inject } from '@nestjs/common';
import { Client as ClientDto } from '@teddy/types';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { ClientMapper } from '../../mappers/client.mapper';

@Injectable()
export class FindAllClientsUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    private readonly clientMapper: ClientMapper,
  ) {}

  async execute(): Promise<ClientDto[]> {
    const clients = await this.clientRepository.findAll();
    return clients.map((client) => this.clientMapper.toDto(client));
  }
}
