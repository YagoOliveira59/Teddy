import { Queue } from 'bullmq';
import { Counter } from 'prom-client';
import { InjectQueue } from '@nestjs/bullmq';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
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
    @InjectQueue('client-tasks') private clientTasksQueue: Queue,
    @InjectMetric('bullmq_jobs_added_total')
    private jobsAddedCounter: Counter<string>,
  ) {}

  async execute({
    createClientDto,
    userId,
  }: CreateClientInput): Promise<Client> {
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

    await this.clientTasksQueue.add('send-welcome-email', {
      name: newClient.name,
    });
    this.jobsAddedCounter.inc({
      queue: 'client-tasks',
      job_name: 'send-welcome-email',
    });

    return newClient;
  }
}
