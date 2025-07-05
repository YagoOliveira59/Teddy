/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

jest.mock('bcrypt');

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUser: jest.Mocked<User>;

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

    mockUser = {
      id: '123',
      name: 'Old Name',
      email: 'test@test.com',
      changeName: jest.fn(),
      changePassword: jest.fn(),
    } as unknown as jest.Mocked<User>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get(UpdateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({ id: '123', name: 'New Name' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should update user name if provided', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    await useCase.execute({ id: '123', name: 'Updated Name' });
    expect(mockUser.changeName).toHaveBeenCalledWith('Updated Name');
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should update user password if provided', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    await useCase.execute({ id: '123', password: 'newpass' });
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    expect(mockUser.changePassword).toHaveBeenCalledWith('hashedPassword');
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should update both name and password if both provided', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    await useCase.execute({ id: '123', name: 'Name', password: 'pass' });
    expect(mockUser.changeName).toHaveBeenCalledWith('Name');
    expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
    expect(mockUser.changePassword).toHaveBeenCalledWith('hashedPassword');
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should not call changeName or changePassword if neither is provided', async () => {
    mockUserRepository.findById.mockResolvedValue(mockUser);
    await useCase.execute({ id: '123' });
    expect(mockUser.changeName).not.toHaveBeenCalled();
    expect(mockUser.changePassword).not.toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  });
});
