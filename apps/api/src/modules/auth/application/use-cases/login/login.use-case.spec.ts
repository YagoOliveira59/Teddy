/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { User } from 'src/modules/users/domain/entities/user.entity';

jest.mock('@nestjs/jwt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: '11d0e2bb-027a-4b04-8dab-53a522fd935a',
    email: 'test@example.com',
    name: 'Test User',
  } as unknown as User;

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findWithRelations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        JwtService,
        { provide: IUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    useCase = module.get(LoginUseCase);

    mockJwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return accessToken when user exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockJwtService.sign.mockReturnValue('mocked.jwt.token');
    const result = await useCase.execute(mockUser.email);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
    expect(result).toEqual({ accessToken: 'mocked.jwt.token' });
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const nonExistentEmail = 'notfound@example.com';
    mockUserRepository.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute(nonExistentEmail)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      nonExistentEmail,
    );
    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });
});
