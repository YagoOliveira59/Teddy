import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { PinoLogger } from 'nestjs-pino';

interface DeleteClientInput {
  clientId: string;
}

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    private readonly logger: PinoLogger,
  ) {}

  async execute({ clientId }: DeleteClientInput): Promise<void> {
    const client = await this.clientRepository.findById(clientId);

    if (!client) {
      this.logger.warn(
        { clientId },
        'Client not found during delete operation',
      );
      throw new NotFoundException(`Client with ID "${clientId}" not found.`);
    }

    await this.clientRepository.delete(clientId);
    this.logger.info({ clientId }, 'Client successfully deleted');
  }
}
