/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersUseCase } from './find-all-users.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { UserDto } from '@teddy/types';
import { User } from '../../../domain/entities/user.entity';

jest.mock('../../mappers/user.mapper');

describe('FindAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  const mockUserEntities = [
    { id: 'b7e6a8c2-1f2d-4e3b-9c5a-1234567890ab', name: 'Alice' },
    { id: 'c3d2e1f4-5a6b-7c8d-9e0f-abcdef123456', name: 'Bob' },
  ] as unknown as User[];

  const expectedUserDtos: UserDto[] = mockUserEntities.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

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
        FindAllUsersUseCase,
        { provide: IUserRepository, useValue: mockUserRepository },
        UserMapper,
      ],
    }).compile();

    useCase = module.get(FindAllUsersUseCase);
    mockUserMapper = module.get(UserMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of UserDto', async () => {
    mockUserRepository.findAll.mockResolvedValue(mockUserEntities);
    mockUserMapper.toDto
      .mockReturnValueOnce(expectedUserDtos[0])
      .mockReturnValueOnce(expectedUserDtos[1]);
    const result = await useCase.execute();
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockUserMapper.toDto).toHaveBeenCalledTimes(mockUserEntities.length);
    expect(mockUserMapper.toDto).toHaveBeenCalledWith(mockUserEntities[0]);
    expect(mockUserMapper.toDto).toHaveBeenCalledWith(mockUserEntities[1]);
    expect(result).toEqual(expectedUserDtos);
  });

  it('should return an empty array if no users are found', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockUserMapper.toDto).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
