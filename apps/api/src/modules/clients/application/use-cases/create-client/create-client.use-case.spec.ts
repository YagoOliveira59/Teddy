/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Counter } from 'prom-client';

import { CreateClientUseCase } from './create-client.use-case';
import { IClientRepository } from '@modules/clients/domain/repositories/client.repository.interface';
import { IUserRepository } from '@modules/users/domain/repositories/user.repository.interface';
import { CreateClientDto } from '@modules/clients/application/dto/create-client.dto';
import { Client } from '@modules/clients/domain/entities/client.entity';
import { User } from '@modules/users/domain/entities/user.entity';

jest.mock('@modules/clients/domain/entities/client.entity');

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockQueue: jest.Mocked<Queue>;
  let mockCounter: jest.Mocked<Counter<string>>;

  const mockClient = {
    id: 'client-id-123',
    name: 'New Client',
    addUser: jest.fn(),
  } as unknown as jest.Mocked<Client>;

  const sampleUser = { id: 'user-id-123', name: 'User Test' } as User;

  const createClientDto: CreateClientDto = {
    name: 'New Client',
    salary: 5000,
    companyValue: 100000,
  };

  beforeEach(async () => {
    (Client.create as jest.Mock).mockReturnValue(mockClient);

    mockClientRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findSelectedByUserId: jest.fn(),
      addSelection: jest.fn(),
      removeSelection: jest.fn(),
      removeAllSelections: jest.fn(),
    };

    mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findWithRelations: jest.fn(),
    };

    mockQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<Queue>;

    mockCounter = {
      inc: jest.fn(),
      get: jest.fn(),
      labels: jest.fn(),
      reset: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<Counter<string>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientUseCase,
        { provide: IClientRepository, useValue: mockClientRepository },
        { provide: IUserRepository, useValue: mockUserRepository },
        { provide: getQueueToken('client-tasks'), useValue: mockQueue },
        {
          provide: 'PROM_METRIC_BULLMQ_JOBS_ADDED_TOTAL',
          useValue: mockCounter,
        },
      ],
    }).compile();

    useCase = module.get<CreateClientUseCase>(CreateClientUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um cliente com sucesso', async () => {
    mockUserRepository.findById.mockResolvedValue(sampleUser);
    mockClientRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      createClientDto,
      userId: sampleUser.id,
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith(sampleUser.id);
    expect(Client.create).toHaveBeenCalledWith({
      ...createClientDto,
      creatorId: sampleUser.id,
    });
    expect(mockClient.addUser).toHaveBeenCalledWith(sampleUser);
    expect(mockClientRepository.save).toHaveBeenCalledWith(mockClient);
    expect(mockQueue.add).toHaveBeenCalledWith('send-welcome-email', {
      name: mockClient.name,
    });
    expect(mockCounter.inc).toHaveBeenCalledWith({
      queue: 'client-tasks',
      job_name: 'send-welcome-email',
    });
    expect(result).toBe(mockClient);
  });

  it('deve lançar NotFoundException se usuário não for encontrado', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ createClientDto, userId: 'invalid-id' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserRepository.findById).toHaveBeenCalledWith('invalid-id');
    expect(mockClientRepository.save).not.toHaveBeenCalled();
    expect(mockQueue.add).not.toHaveBeenCalled();
    expect(mockCounter.inc).not.toHaveBeenCalled();
  });
});
