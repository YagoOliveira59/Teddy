/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { CreateClientUseCase } from '../../application/use-cases/create-client/create-client.use-case';
import { FindAllClientsUseCase } from '../../application/use-cases/find-all-clients/find-all-clients.use-case';
import { FindOneClientUseCase } from '../../application/use-cases/find-one-client/find-one-client.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client/update-client.use-case';
import { DeleteClientUseCase } from '../../application/use-cases/delete-client/delete-client.use-case';
import { ClientMapper } from '../../application/mappers/client.mapper';
import { CreateClientDto } from '../../application/dto/create-client.dto';
import { Client } from '../../domain/entities/client.entity';
import { User } from '@/src/modules/users/domain/entities/user.entity';
import { Client as ClientResponseDto, UpdateClientDto } from '@teddy/types';

jest.mock('../../application/use-cases/create-client/create-client.use-case');
jest.mock(
  '../../application/use-cases/find-all-clients/find-all-clients.use-case',
);
jest.mock(
  '../../application/use-cases/find-one-client/find-one-client.use-case',
);
jest.mock('../../application/use-cases/update-client/update-client.use-case');
jest.mock('../../application/use-cases/delete-client/delete-client.use-case');
jest.mock('../../application/mappers/client.mapper');

describe('ClientsController', () => {
  let controller: ClientsController;
  let createClientUseCase: jest.Mocked<CreateClientUseCase>;
  let findAllClientsUseCase: jest.Mocked<FindAllClientsUseCase>;
  let findOneClientUseCase: jest.Mocked<FindOneClientUseCase>;
  let updateClientUseCase: jest.Mocked<UpdateClientUseCase>;
  let deleteClientUseCase: jest.Mocked<DeleteClientUseCase>;
  let clientMapper: jest.Mocked<ClientMapper>;

  const MOCK_DATE = new Date();
  const MOCK_ISO_STRING = MOCK_DATE.toISOString();

  const mockClientEntity = {
    id: '3aca06a7-9b60-41ea-9d73-f58db550e129',
    name: 'Test Client',
    salary: 50000,
    companyValue: 1000000,
    creatorId: '11d0e2bb-027a-4b04-8dab-53a522fd935a',
    createdAt: MOCK_ISO_STRING,
    updatedAt: MOCK_ISO_STRING,
  } as unknown as Client;

  const mockClientResponseDto = {
    id: '3aca06a7-9b60-41ea-9d73-f58db550e129',
    name: 'Test Client DTO',
    salary: 50000,
    companyValue: 1000000,
    creatorId: '11d0e2bb-027a-4b04-8dab-53a522fd935a',
    createdAt: MOCK_ISO_STRING,
    updatedAt: MOCK_ISO_STRING,
  } as ClientResponseDto;

  const mockUser = { id: '11d0e2bb-027a-4b04-8dab-53a522fd935a' } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        CreateClientUseCase,
        FindAllClientsUseCase,
        FindOneClientUseCase,
        UpdateClientUseCase,
        DeleteClientUseCase,
        ClientMapper,
      ],
    }).compile();

    controller = module.get(ClientsController);
    createClientUseCase = module.get(CreateClientUseCase);
    findAllClientsUseCase = module.get(FindAllClientsUseCase);
    findOneClientUseCase = module.get(FindOneClientUseCase);
    updateClientUseCase = module.get(UpdateClientUseCase);
    deleteClientUseCase = module.get(DeleteClientUseCase);
    clientMapper = module.get(ClientMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a client and return its DTO', async () => {
      const createDto: CreateClientDto = {
        name: 'Test Client',
        salary: 50000,
        companyValue: 1000000,
      };
      createClientUseCase.execute.mockResolvedValue(mockClientEntity);
      clientMapper.toDto.mockReturnValue(mockClientResponseDto);
      const result = await controller.create(createDto, mockUser);
      expect(createClientUseCase.execute).toHaveBeenCalledWith({
        createClientDto: createDto,
        userId: mockUser.id,
      });
      expect(clientMapper.toDto).toHaveBeenCalledWith(mockClientEntity);
      expect(result).toEqual(mockClientResponseDto);
    });
  });

  describe('listAll', () => {
    it('should return all clients', async () => {
      const clients = [mockClientResponseDto];
      findAllClientsUseCase.execute.mockResolvedValue(clients);
      const result = await controller.listAll();
      expect(findAllClientsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(clients);
    });
  });

  describe('findOne', () => {
    it('should return a client DTO by id', async () => {
      const id = '3aca06a7-9b60-41ea-9d73-f58db550e129';
      findOneClientUseCase.execute.mockResolvedValue(mockClientEntity);
      clientMapper.toDto.mockReturnValue(mockClientResponseDto);
      const result = await controller.findOne(id);
      expect(findOneClientUseCase.execute).toHaveBeenCalledWith({ id });
      expect(clientMapper.toDto).toHaveBeenCalledWith(mockClientEntity);
      expect(result).toEqual(mockClientResponseDto);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const id = '3aca06a7-9b60-41ea-9d73-f58db550e129';
      const updateDto: UpdateClientDto = { name: 'Updated Name' };
      updateClientUseCase.execute.mockResolvedValue(undefined);
      await controller.update(id, updateDto);
      expect(updateClientUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          name: 'Updated Name',
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      const id = '3aca06a7-9b60-41ea-9d73-f58db550e129';
      deleteClientUseCase.execute.mockResolvedValue(undefined);
      await controller.remove(id);
      expect(deleteClientUseCase.execute).toHaveBeenCalledWith({
        clientId: id,
      });
    });
  });
});
