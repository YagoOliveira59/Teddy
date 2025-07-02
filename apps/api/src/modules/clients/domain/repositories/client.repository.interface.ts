import { Client } from '../entities/client.entity';

export abstract class IClientRepository {
  abstract save(client: Client): Promise<void>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findAll(): Promise<Client[]>;
  abstract update(client: Client): Promise<void>;
  abstract delete(id: string): Promise<void>;

  abstract findSelectedByUserId(id: string): Promise<Client[] | null>;
  abstract addSelection(userId: string, clientId: string): Promise<void>;
  abstract removeSelection(userId: string, clientId: string): Promise<void>;
  abstract removeAllSelections(userId: string): Promise<void>;
}
