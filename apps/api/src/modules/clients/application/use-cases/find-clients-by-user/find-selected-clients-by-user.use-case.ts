import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';
import { ClientMapper } from '../../mappers/client.mapper';

interface FindSelectedClientsByUserInput {
  userId: string;
}

@Injectable()
export class FindSelectedClientsByUserUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly clientMapper: ClientMapper,
  ) {}

  async execute({
    userId,
  }: FindSelectedClientsByUserInput): Promise<
    ReturnType<ClientMapper['toDto']>[]
  > {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const clients = await this.clientRepository.findSelectedByUserId(userId);
    if (!clients || clients.length === 0) return [];

    return clients.map((client) => this.clientMapper.toDto(client));
  }
}
