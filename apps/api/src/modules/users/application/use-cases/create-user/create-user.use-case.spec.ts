/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '@teddy/types';

jest.mock('bcrypt');
jest.mock('../../../domain/entities/user.entity');

const mockedBcrypt: jest.Mocked<typeof bcrypt> = bcrypt as jest.Mocked<
  typeof bcrypt
>;

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const hashedPassword = 'hashedPassword';
  const dto: CreateUserDto = {
    name: 'Test',
    email: 'unique@example.com',
    password: 'password',
  };

  const mockExistingUser = {
    id: '3aca06a7-9b60-41ea-9d73-f58db550e129',
    email: dto.email,
    name: 'Existing User',
  } as unknown as User;

  const mockNewUser = {
    id: '0ffdddfb-12ea-4206-aff5-e6fa2ad6df41',
    name: dto.name,
    email: dto.email,
    passwordHash: hashedPassword,
  } as unknown as User;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get(CreateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ConflictException if user already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockExistingUser);
    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  it('should hash password and save new user if email is unique', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (mockedBcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (User.create as jest.Mock).mockReturnValue(mockNewUser);
    mockUserRepository.save.mockResolvedValue(undefined);
    await useCase.execute(dto);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockedBcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      name: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockNewUser);
  });
});
