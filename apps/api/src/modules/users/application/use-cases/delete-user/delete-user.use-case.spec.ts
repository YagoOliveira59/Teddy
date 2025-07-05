/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

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

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should delete user if user exists', async () => {
    const userId = '3aca06a7-9b60-41ea-9d73-f58db550e129';
    mockUserRepository.findById.mockResolvedValue({ id: userId } as User);
    mockUserRepository.delete.mockResolvedValue(undefined);

    await expect(
      deleteUserUseCase.execute({ id: userId }),
    ).resolves.toBeUndefined();
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const userId = '456';
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute({ id: userId })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
