/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteClientUseCase } from './delete-client.use-case';
import { IClientRepository } from '@modules/clients/domain/repositories/client.repository.interface';
import { Client } from '@modules/clients/domain/entities/client.entity';
import { PinoLogger } from 'nestjs-pino';

describe('DeleteClientUseCase', () => {
  let useCase: DeleteClientUseCase;
  let mockClientRepository: jest.Mocked<IClientRepository>;
  let mockLogger: jest.Mocked<PinoLogger>;

  beforeEach(async () => {
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

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      log: jest.fn(),
    } as unknown as jest.Mocked<PinoLogger>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteClientUseCase,
        { provide: IClientRepository, useValue: mockClientRepository },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<DeleteClientUseCase>(DeleteClientUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete client if found', async () => {
    const clientId = '11d0e2bb-027a-4b04-8dab-53a522fd935a';

    mockClientRepository.findById.mockResolvedValue({ id: clientId } as Client);
    mockClientRepository.delete.mockResolvedValue(undefined);

    await useCase.execute({ clientId });

    expect(mockClientRepository.findById).toHaveBeenCalledWith(clientId);
    expect(mockClientRepository.delete).toHaveBeenCalledWith(clientId);
    expect(mockLogger.info).toHaveBeenCalledWith(
      { clientId },
      'Client successfully deleted',
    );
  });

  it('should throw NotFoundException if client not found', async () => {
    const clientId = 'client-id-404';

    mockClientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ clientId })).rejects.toThrow(
      NotFoundException,
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      { clientId },
      'Client not found during delete operation',
    );
    expect(mockClientRepository.delete).not.toHaveBeenCalled();
    expect(mockLogger.info).not.toHaveBeenCalled();
  });
});
