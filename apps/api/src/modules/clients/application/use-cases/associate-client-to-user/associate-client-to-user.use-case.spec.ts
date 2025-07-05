/* eslint-disable @typescript-eslint/unbound-method */
import { AssociateClientToUserUseCase } from './associate-client-to-user.use-case';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IClientRepository } from 'src/modules/clients/domain/repositories/client.repository.interface';
import { User } from '@/src/modules/users/domain/entities/user.entity';
import { Client } from '../../../domain/entities/client.entity';

describe('AssociateClientToUserUseCase', () => {
  let useCase: AssociateClientToUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockClientRepository: jest.Mocked<IClientRepository>;

  const userId = 'c4d3e508-0bbe-4e9a-994d-120fec513cca';
  const clientId = 'b640c436-a39b-4632-a624-487771c42c07';

  beforeEach(() => {
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

    useCase = new AssociateClientToUserUseCase(
      mockClientRepository,
      mockUserRepository,
    );
  });

  it('should associate client to user if both exist and not already associated', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: userId } as User);
    mockClientRepository.findById.mockResolvedValue({ id: clientId } as Client);
    mockClientRepository.findSelectedByUserId.mockResolvedValue([]);
    mockClientRepository.addSelection.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ userId, clientId }),
    ).resolves.toBeUndefined();

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockClientRepository.findById).toHaveBeenCalledWith(clientId);
    expect(mockClientRepository.findSelectedByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockClientRepository.addSelection).toHaveBeenCalledWith(
      userId,
      clientId,
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId, clientId })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockClientRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: userId } as User);
    mockClientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ userId, clientId })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockClientRepository.findById).toHaveBeenCalledWith(clientId);
    expect(mockClientRepository.findSelectedByUserId).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if client is already associated to user', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: userId } as User);
    mockClientRepository.findById.mockResolvedValue({ id: clientId } as Client);
    mockClientRepository.findSelectedByUserId.mockResolvedValue([
      { id: clientId },
    ] as Client[]);

    await expect(useCase.execute({ userId, clientId })).rejects.toThrow(
      ConflictException,
    );

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockClientRepository.findById).toHaveBeenCalledWith(clientId);
    expect(mockClientRepository.findSelectedByUserId).toHaveBeenCalledWith(
      userId,
    );
    expect(mockClientRepository.addSelection).not.toHaveBeenCalled();
  });
});
