import { Injectable } from '@nestjs/common';
import { Client as ClientDto } from '@teddy/types';
import { Client } from '../../domain/entities/client.entity';
import { ClientSchema } from '../../infrastructure/database/schemas/client.schema';
import { UserMapper } from 'src/modules/users/application/mappers/user.mapper';

@Injectable()
export class ClientMapper {
  constructor(private readonly userMapper: UserMapper) {}

  public toDomain(raw: ClientSchema): Client {
    return Client.hydrate(
      {
        name: raw.name,
        salary: raw.salary,
        companyValue: raw.companyValue,
        creatorId: raw.creatorId,
        users:
          raw.users?.map((selection) =>
            this.userMapper.toDomain(selection.user),
          ) ?? [],
      },
      raw.id,
      new Date(raw.createdAt),
      new Date(raw.updatedAt),
    );
  }

  public toDto(client: Client): ClientDto {
    return {
      id: client.id,
      name: client.name,
      salary: client.salary,
      companyValue: client.companyValue,
      creatorId: client.creatorId,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      users: client.users.map((user) => this.userMapper.toDto(user)),
    };
  }

  public toPersistence(client: Client): Partial<ClientSchema> {
    return {
      id: client.id,
      name: client.name,
      salary: client.salary,
      companyValue: client.companyValue,
      creatorId: client.creatorId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
