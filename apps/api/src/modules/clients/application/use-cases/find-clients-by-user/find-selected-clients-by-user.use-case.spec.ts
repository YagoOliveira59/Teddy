/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindSelectedClientsByUserUseCase } from './find-selected-clients-by-user.use-case';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { ClientMapper } from '../../mappers/client.mapper';
import { Client } from 'src/modules/clients/domain/entities/client.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { Client as ClientDto } from '@teddy/types';

jest.mock('../../mappers/client.mapper');

describe('FindSelectedClientsByUserUseCase', () => {
  let useCase: FindSelectedClientsByUserUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockClientMapper: jest.Mocked<ClientMapper>;

  const userId = '11d0e2bb-027a-4b04-8dab-53a522fd935a';
  const mockUser = { id: userId, name: 'Test User' } as unknown as User;

  const mockClients: Client[] = [
    { id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf', name: 'Client 1' },
    { id: 'c4d3e508-0bbe-4e9a-994d-120fec513cca', name: 'Client 2' },
  ] as Client[];

  const mockClientDtos: ClientDto[] = [
    { id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf', name: 'Client 1 DTO' },
    { id: 'c4d3e508-0bbe-4e9a-994d-120fec513cca', name: 'Client 2 DTO' },
  ] as ClientDto[];

  beforeEach(async () => {
    mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findWithRelations: jest.fn(),
    };

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindSelectedClientsByUserUseCase,
        { provide: IClientRepository, useValue: mockClientRepository },
        { provide: IUserRepository, useValue: mockUserRepository },
        ClientMapper,
      ],
    }).compile();

    useCase = module.get(FindSelectedClientsByUserUseCase);
    mockClientMapper = module.get(ClientMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ userId })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should return an empty array if no clients are selected', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockClientRepository.findSelectedByUserId.mockResolvedValue([]);
    const result = await useCase.execute({ userId });
    expect(result).toEqual([]);
    expect(mockClientRepository.findSelectedByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockClientMapper.toDto).not.toHaveBeenCalled();
  });

  it('should return mapped clients if clients are found', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockClientRepository.findSelectedByUserId.mockResolvedValue(mockClients);
    mockClientMapper.toDto
      .mockReturnValueOnce(mockClientDtos[0])
      .mockReturnValueOnce(mockClientDtos[1]);
    const result = await useCase.execute({ userId });
    expect(result).toEqual(mockClientDtos);
    expect(mockClientMapper.toDto).toHaveBeenCalledTimes(mockClients.length);
    expect(mockClientMapper.toDto).toHaveBeenCalledWith(mockClients[0]);
    expect(mockClientMapper.toDto).toHaveBeenCalledWith(mockClients[1]);
  });
});
