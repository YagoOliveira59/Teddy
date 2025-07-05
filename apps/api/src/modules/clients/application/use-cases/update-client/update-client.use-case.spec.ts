/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { UpdateClientUseCase } from './update-client.use-case';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';
import { Client } from '../../../domain/entities/client.entity';

describe('UpdateClientUseCase', () => {
  let useCase: UpdateClientUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;
  let mockClient: jest.Mocked<Client>;

  beforeEach(() => {
    mockClient = {
      id: '11d0e2bb-027a-4b04-8dab-53a522fd935a',
      name: 'Cliente Antigo',
      salary: 50000,
      companyValue: 1000000,
      changeName: jest.fn(),
      updateSalary: jest.fn(),
      updateCompanyValue: jest.fn(),
    } as unknown as jest.Mocked<Client>;

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

    useCase = new UpdateClientUseCase(mockClientRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockClientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: '1', name: 'John' })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockClientRepository.findById).toHaveBeenCalledWith('1');
    expect(mockClientRepository.update).not.toHaveBeenCalled();
  });

  it('should update name if provided', async () => {
    mockClientRepository.findById.mockResolvedValue(mockClient);

    await useCase.execute({
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
      name: 'Jane',
    });

    expect(mockClient.changeName).toHaveBeenCalledWith('Jane');
    expect(mockClient.updateSalary).not.toHaveBeenCalled();
    expect(mockClient.updateCompanyValue).not.toHaveBeenCalled();
    expect(mockClientRepository.update).toHaveBeenCalledWith(mockClient);
  });

  it('should update salary if provided', async () => {
    mockClientRepository.findById.mockResolvedValue(mockClient);

    await useCase.execute({
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
      salary: 5000,
    });

    expect(mockClient.updateSalary).toHaveBeenCalledWith(5000);
    expect(mockClient.changeName).not.toHaveBeenCalled();
    expect(mockClient.updateCompanyValue).not.toHaveBeenCalled();
    expect(mockClientRepository.update).toHaveBeenCalledWith(mockClient);
  });

  it('should update companyValue if provided', async () => {
    mockClientRepository.findById.mockResolvedValue(mockClient);

    await useCase.execute({
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
      companyValue: 100000,
    });

    expect(mockClient.updateCompanyValue).toHaveBeenCalledWith(100000);
    expect(mockClient.changeName).not.toHaveBeenCalled();
    expect(mockClient.updateSalary).not.toHaveBeenCalled();
    expect(mockClientRepository.update).toHaveBeenCalledWith(mockClient);
  });

  it('should update all fields if all are provided', async () => {
    mockClientRepository.findById.mockResolvedValue(mockClient);

    await useCase.execute({
      id: '6d28362e-5f1a-43f1-b58e-ab4b0f12b4bf',
      name: 'Jane',
      salary: 6000,
      companyValue: 200000,
    });

    expect(mockClient.changeName).toHaveBeenCalledWith('Jane');
    expect(mockClient.updateSalary).toHaveBeenCalledWith(6000);
    expect(mockClient.updateCompanyValue).toHaveBeenCalledWith(200000);
    expect(mockClientRepository.update).toHaveBeenCalledWith(mockClient);
  });
});
