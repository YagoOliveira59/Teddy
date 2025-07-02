import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';

interface AssociateClientToUserInput {
  userId: string;
  clientId: string;
}

@Injectable()
export class AssociateClientToUserUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    userId,
    clientId,
  }: AssociateClientToUserInput): Promise<void> {
    const userExists = await this.userRepository.findById(userId);
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const clientExists = await this.clientRepository.findById(clientId);
    if (!clientExists) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    const existingSelections =
      await this.clientRepository.findSelectedByUserId(userId);
    const isAlreadyAssociated = existingSelections?.some(
      (client) => client.id === clientId,
    );

    if (isAlreadyAssociated) {
      throw new ConflictException(
        `Cliente com ID "${clientId}" já está associado a este usuário.`,
      );
    }
    await this.clientRepository.addSelection(userId, clientId);
  }
}
