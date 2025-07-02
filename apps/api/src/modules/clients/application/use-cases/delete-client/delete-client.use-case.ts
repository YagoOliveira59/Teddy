import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { PinoLogger } from 'nestjs-pino';

interface DeleteClientInput {
  clientId: string;
  userId: string;
}

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    private readonly logger: PinoLogger,
  ) {}

  async execute({ clientId, userId }: DeleteClientInput): Promise<void> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      this.logger.warn(
        { clientId },
        'Client not found during delete operation',
      );
      throw new NotFoundException(`Client with ID "${clientId}" not found.`);
    }

    if (client.creatorId !== userId) {
      this.logger.warn(
        { clientId, userId },
        'User does not have permission to delete client',
      );
      throw new ForbiddenException(
        'You do not have permission to delete this client.',
      );
    }

    await this.clientRepository.delete(clientId);
    this.logger.info({ clientId, userId }, 'Client successfully deleted');
  }
}
