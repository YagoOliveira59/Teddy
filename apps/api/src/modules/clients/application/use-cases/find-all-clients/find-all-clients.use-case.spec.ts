/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllClientsUseCase } from './find-all-clients.use-case';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { ClientMapper } from '../../mappers/client.mapper';
import { Client } from '../../../domain/entities/client.entity';
import { Client as ClientDto } from '@teddy/types';

jest.mock('../../../domain/entities/client.entity');
jest.mock('../../mappers/client.mapper');

describe('FindAllClientsUseCase', () => {
  let useCase: FindAllClientsUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;
  let mockClientMapper: jest.Mocked<ClientMapper>;

  const mockEntities = [
    {
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
      name: 'Client 1',
    } as unknown as Client,
    {
      id: 'c4d3e508-0bbe-4e9a-994d-120fec513cca',
      name: 'Client 2',
    } as unknown as Client,
  ];

  const expectedDtos: ClientDto[] = mockEntities.map((client) => ({
    id: client.id,
    name: client.name,
  })) as ClientDto[];

  beforeEach(async () => {
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
        FindAllClientsUseCase,
        { provide: IClientRepository, useValue: mockClientRepository },
        ClientMapper,
      ],
    }).compile();

    useCase = module.get(FindAllClientsUseCase);

    mockClientMapper = module.get(ClientMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of mapped ClientDto', async () => {
    mockClientRepository.findAll.mockResolvedValue(mockEntities);
    mockClientMapper.toDto
      .mockReturnValueOnce(expectedDtos[0])
      .mockReturnValueOnce(expectedDtos[1]);

    const result = await useCase.execute();
    expect(mockClientRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockClientMapper.toDto).toHaveBeenCalledTimes(mockEntities.length);
    expect(mockClientMapper.toDto).toHaveBeenCalledWith(mockEntities[0]);
    expect(mockClientMapper.toDto).toHaveBeenCalledWith(mockEntities[1]);
    expect(result).toEqual(expectedDtos);
  });

  it('should return an empty array if no clients are found', async () => {
    mockClientRepository.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(mockClientRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockClientMapper.toDto).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
