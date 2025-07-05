/* eslint-disable @typescript-eslint/unbound-method */
import { FindOneUserUseCase } from './find-one-user.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';

describe('FindOneUserUseCase', () => {
  let useCase: FindOneUserUseCase;
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
    useCase = new FindOneUserUseCase(mockUserRepository);
  });

  it('should return a user when found', async () => {
    const user: User = {
      id: 'b7e6a8c2-1f2d-4e3b-9c5a-1234567890ab',
      name: 'John Doe',
      email: 'john@example.com',
    } as User;
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute({
      id: 'b7e6a8c2-1f2d-4e3b-9c5a-1234567890ab',
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith(
      'b7e6a8c2-1f2d-4e3b-9c5a-1234567890ab',
    );
    expect(result).toBe(user);
  });

  it('should return null when user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'not-exist' });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('not-exist');
    expect(result).toBeNull();
  });
});
