/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DisassociateClientFromUserUseCase } from './disassociate-client-from-user.use-case';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { User } from '@/src/modules/users/domain/entities/user.entity';
import { Client } from '../../../domain/entities/client.entity';

describe('DisassociateClientFromUserUseCase', () => {
  let useCase: DisassociateClientFromUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockClientRepository: jest.Mocked<IClientRepository>;

  const userId = 'c4d3e508-0bbe-4e9a-994d-120fec513cca';
  const clientIdToRemove = 'b640c436-a39b-4632-a624-487771c42c07';

  const mockUser = {
    id: userId,
    name: 'Test User',
  } as unknown as User;

  const mockSelectedClients = [
    { id: clientIdToRemove },
    { id: '3aca06a7-9b60-41ea-9d73-f58db550e129' },
  ] as Client[];

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
        DisassociateClientFromUserUseCase,
        { provide: IClientRepository, useValue: mockClientRepository },
        { provide: IUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get(DisassociateClientFromUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ userId, clientId: clientIdToRemove }),
    ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it.each([
    {
      scenario: 'client is not in the list',
      selection: [{ id: 'other-client' }] as Client[],
    },
    { scenario: 'selection list is empty', selection: [] },
    { scenario: 'selection list is undefined', selection: null },
  ])('should throw NotFoundException if $scenario', async ({ selection }) => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockClientRepository.findSelectedByUserId.mockResolvedValue(selection);
    await expect(
      useCase.execute({ userId, clientId: clientIdToRemove }),
    ).rejects.toThrow(
      new NotFoundException(
        `Cliente com ID "${clientIdToRemove}" não está na lista de seleção deste usuário.`,
      ),
    );

    expect(mockClientRepository.findSelectedByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockClientRepository.removeSelection).not.toHaveBeenCalled();
  });

  it('should call removeSelection if user and client association exists', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockClientRepository.findSelectedByUserId.mockResolvedValue(
      mockSelectedClients,
    );
    mockClientRepository.removeSelection.mockResolvedValue(undefined);
    await useCase.execute({ userId, clientId: clientIdToRemove });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockClientRepository.findSelectedByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockClientRepository.removeSelection).toHaveBeenCalledWith(
      userId,
      clientIdToRemove,
    );
  });
});
