import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IClientRepository } from '../../../domain/repositories/client.repository.interface';

import { Client } from '../../../domain/entities/client.entity';
import { ClientSchema } from '../schemas/client.schema';
import { ClientMapper } from '../../../application/mappers/client.mapper';

import { UserClientSchema } from 'src/modules/users/infrastructure/database/schemas/user-client.schema';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientSchema)
    private readonly clientOrmRepository: Repository<ClientSchema>,
    private readonly mapper: ClientMapper,
    @InjectRepository(UserClientSchema)
    private readonly userClientOrmRepository: Repository<UserClientSchema>,
  ) {}

  async save(client: Client): Promise<void> {
    const clientPersistenceModel = this.mapper.toPersistence(client);
    await this.clientOrmRepository.save(clientPersistenceModel);
  }

  async findById(id: string): Promise<Client | null> {
    const clientFound = await this.clientOrmRepository.findOneBy({ id });

    if (!clientFound) {
      return null;
    }

    return this.mapper.toDomain(clientFound);
  }

  async findAll(): Promise<Client[]> {
    const clientsFound = await this.clientOrmRepository.find();
    return clientsFound.map((client) => this.mapper.toDomain(client));
  }

  async update(client: Client): Promise<void> {
    const clientPersistenceModel = this.mapper.toPersistence(client);
    await this.clientOrmRepository.update(client.id, clientPersistenceModel);
  }

  async delete(id: string): Promise<void> {
    await this.clientOrmRepository.delete(id);
  }

  async findSelectedByUserId(userId: string): Promise<Client[]> {
    const selections = await this.userClientOrmRepository.find({
      where: { userId },
      relations: ['client'],
    });
    const clientSchemas = selections.map((s) => s.client);
    return clientSchemas.map((schema) => this.mapper.toDomain(schema));
  }

  async addSelection(userId: string, clientId: string): Promise<void> {
    const newSelection = this.userClientOrmRepository.create({
      userId,
      clientId,
    });
    await this.userClientOrmRepository.save(newSelection);
  }

  async removeSelection(userId: string, clientId: string): Promise<void> {
    await this.userClientOrmRepository.delete({ userId, clientId });
  }

  async removeAllSelections(userId: string): Promise<void> {
    await this.userClientOrmRepository.delete({ userId });
  }
}
