/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users/find-all-users.use-case';
import { FindOneUserUseCase } from '../../application/use-cases/find-one-user/find-one-user.use-case';
import { FindUserByEmailUseCase } from '../../application/use-cases/find-user-by-email/find-user-by-email.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { CreateUserDto, UpdateUserDto, UserDto } from '@teddy/types';
import { User } from '../../domain/entities/user.entity';

jest.mock('../../application/use-cases/create-user/create-user.use-case');
jest.mock('../../application/use-cases/find-all-users/find-all-users.use-case');
jest.mock('../../application/use-cases/find-one-user/find-one-user.use-case');
jest.mock(
  '../../application/use-cases/find-user-by-email/find-user-by-email.use-case',
);
jest.mock('../../application/use-cases/update-user/update-user.use-case');
jest.mock('../../application/use-cases/delete-user/delete-user.use-case');

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let findAllUsersUseCase: jest.Mocked<FindAllUsersUseCase>;
  let findOneUserUseCase: jest.Mocked<FindOneUserUseCase>;
  let findUserByEmailUseCase: jest.Mocked<FindUserByEmailUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;

  const MOCK_DATE = new Date();
  const MOCK_ISO_STRING = MOCK_DATE.toISOString();

  const mockUserEntity = {
    id: '1',
    name: 'Test User',
    email: 'a@b.com',
    createdAt: MOCK_ISO_STRING,
    updatedAt: MOCK_ISO_STRING,
  } as unknown as User;

  const mockUserDto = {
    id: '1',
    name: 'Test User',
    email: 'a@b.com',
    createdAt: MOCK_ISO_STRING,
    updatedAt: MOCK_ISO_STRING,
  } as unknown as UserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CreateUserUseCase,
        FindAllUsersUseCase,
        FindOneUserUseCase,
        FindUserByEmailUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
      ],
    }).compile();

    controller = module.get(UsersController);
    createUserUseCase = module.get(CreateUserUseCase);
    findAllUsersUseCase = module.get(FindAllUsersUseCase);
    findOneUserUseCase = module.get(FindOneUserUseCase);
    findUserByEmailUseCase = module.get(FindUserByEmailUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createUserUseCase.execute and resolve without a return value', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'pass',
        name: 'Test User',
      };
      createUserUseCase.execute.mockResolvedValue(undefined);
      await expect(controller.create(createUserDto)).resolves.toBeUndefined();
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should call findAllUsersUseCase.execute and return an array of user DTOs', async () => {
      const usersDto = [mockUserDto];
      findAllUsersUseCase.execute.mockResolvedValue(usersDto);
      await expect(controller.findAll()).resolves.toEqual(usersDto);
      expect(findAllUsersUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOneUserUseCase.execute and return a user DTO', async () => {
      findOneUserUseCase.execute.mockResolvedValue(mockUserEntity);
      await expect(controller.findOne(mockUserDto.id)).resolves.toEqual(
        mockUserDto,
      );
      expect(findOneUserUseCase.execute).toHaveBeenCalledWith({
        id: mockUserDto.id,
      });
    });
  });

  describe('findByEmail', () => {
    it('should call findUserByEmailUseCase.execute and return a user DTO', async () => {
      findUserByEmailUseCase.execute.mockResolvedValue(mockUserEntity);

      await expect(controller.findByEmail(mockUserDto.email)).resolves.toEqual(
        mockUserDto,
      );
      expect(findUserByEmailUseCase.execute).toHaveBeenCalledWith({
        email: mockUserDto.email,
      });
    });
  });

  describe('update', () => {
    it('should call updateUserUseCase.execute and resolve without a return value', async () => {
      const updateDto: UpdateUserDto = { name: 'Updated' };
      updateUserUseCase.execute.mockResolvedValue(undefined);
      await expect(
        controller.update(mockUserDto.id, updateDto),
      ).resolves.toBeUndefined();
      expect(updateUserUseCase.execute).toHaveBeenCalledWith({
        id: mockUserDto.id,
        ...updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should call deleteUserUseCase.execute and return nothing (void)', async () => {
      deleteUserUseCase.execute.mockResolvedValue(undefined);
      await expect(controller.remove(mockUserDto.id)).resolves.toBeUndefined();
      expect(deleteUserUseCase.execute).toHaveBeenCalledWith({
        id: mockUserDto.id,
      });
    });
  });
});
