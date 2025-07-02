import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';

interface DisassociateAllClientsFromUserInput {
  userId: string;
}

@Injectable()
export class DisassociateAllClientsFromUserUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
  }: DisassociateAllClientsFromUserInput): Promise<void> {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.clientRepository.removeAllSelections(userId);
  }
}
