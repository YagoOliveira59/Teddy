import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from '../../dto/create-client.dto';
import { Client } from '../../../domain/entities/client.entity';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';

interface CreateClientInput {
  createClientDto: CreateClientDto;
  userId: string;
}

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    createClientDto,
    userId,
  }: CreateClientInput): Promise<Client> {
    console.log('--- 1. Executing CreateClientUseCase with input:', {
      createClientDto,
      userId,
    });
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    const newClient = Client.create({
      ...createClientDto,
      creatorId: userId,
    });

    newClient.addUser(user);
    await this.clientRepository.save(newClient);

    return newClient;
  }
}
