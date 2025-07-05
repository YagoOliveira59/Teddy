/* eslint-disable @typescript-eslint/unbound-method */

import { DisassociateAllClientsFromUserUseCase } from './disassociate-all-clients-from-user.use-case';
import { NotFoundException } from '@nestjs/common';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { IUserRepository } from '@/src/modules/users/domain/repositories/user.repository.interface';
import { User } from '@/src/modules/users/domain/entities/user.entity';

describe('DisassociateAllClientsFromUserUseCase', () => {
  let useCase: DisassociateAllClientsFromUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockClientRepository: jest.Mocked<IClientRepository>;

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

    useCase = new DisassociateAllClientsFromUserUseCase(
      mockClientRepository,
      mockUserRepository,
    );
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ userId: 'nonexistent-user' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      'nonexistent-user',
    );
    expect(mockClientRepository.removeAllSelections).not.toHaveBeenCalled();
  });

  it('should call removeAllSelections if user exists', async () => {
    mockUserRepository.findById.mockResolvedValue({
      id: 'b640c436-a39b-4632-a624-487771c42c07',
    } as User);
    mockClientRepository.removeAllSelections.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ userId: 'b640c436-a39b-4632-a624-487771c42c07' }),
    ).resolves.toBeUndefined();

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      'b640c436-a39b-4632-a624-487771c42c07',
    );
    expect(mockClientRepository.removeAllSelections).toHaveBeenCalledWith(
      'b640c436-a39b-4632-a624-487771c42c07',
    );
  });
});
