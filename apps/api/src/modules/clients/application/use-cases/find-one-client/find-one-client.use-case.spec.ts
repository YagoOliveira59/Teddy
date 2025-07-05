/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { FindOneClientUseCase } from './find-one-client.use-case';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { Client } from '../../../domain/entities/client.entity';

describe('FindOneClientUseCase', () => {
  let useCase: FindOneClientUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;

  const mockClient: Client = {
    id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
    name: 'Test Client',
  } as Client;

  beforeEach(() => {
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
    useCase = new FindOneClientUseCase(mockClientRepository);
  });

  it('should return a client when found', async () => {
    mockClientRepository.findById.mockResolvedValue(mockClient);

    const result = await useCase.execute({
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
    });

    expect(mockClientRepository.findById).toHaveBeenCalledWith(
      '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
    );
    expect(result).toBe(mockClient);
  });

  it('should throw NotFoundException when client is not found', async () => {
    mockClientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockClientRepository.findById).toHaveBeenCalledWith('not-found');
  });
});
