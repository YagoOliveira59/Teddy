/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindUserByEmailUseCase } from './find-user-by-email.use-case';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

describe('FindUserByEmailUseCase', () => {
  let useCase: FindUserByEmailUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: 'b7e6a8c2-1f2d-4e3b-9c5a-1234567890ab',
    email: 'test@example.com',
    name: 'Test User',
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
        FindUserByEmailUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get(FindUserByEmailUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when found by email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    const result = await useCase.execute({ email: mockUser.email });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(result).toBe(mockUser);
  });

  it('should return null when user is not found', async () => {
    const email = 'notfound@example.com';
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const result = await useCase.execute({ email });
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toBeNull();
  });
});
