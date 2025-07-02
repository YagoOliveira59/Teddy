import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';

interface DisassociateClientFromUserInput {
  userId: string;
  clientId: string;
}

@Injectable()
export class DisassociateClientFromUserUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clientId,
  }: DisassociateClientFromUserInput): Promise<void> {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const existingSelections =
      await this.clientRepository.findSelectedByUserId(userId);
    const isAssociated = existingSelections?.some(
      (client) => client.id === clientId,
    );

    if (!isAssociated) {
      throw new NotFoundException(
        `Cliente com ID "${clientId}" não está na lista de seleção deste usuário.`,
      );
    }
    await this.clientRepository.removeSelection(userId, clientId);
  }
}
