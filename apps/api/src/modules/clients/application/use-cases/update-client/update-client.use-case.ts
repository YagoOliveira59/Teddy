import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateClientDto } from '@teddy/types';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';

type UpdateClientInput = UpdateClientDto & {
  id: string;
  userId: string;
};

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(input: UpdateClientInput): Promise<void> {
    const { id, userId, name, salary, companyValue } = input;

    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }

    const isCreator = client.creatorId === userId;
    if (!isCreator) {
      throw new ForbiddenException(
        'You do not have permission to update this client.',
      );
    }

    if (name !== undefined) {
      client.changeName(name);
    }

    if (salary !== undefined) {
      client.updateSalary(salary);
    }

    if (companyValue !== undefined) {
      client.updateCompanyValue(companyValue);
    }

    await this.clientRepository.update(client);
  }
}
