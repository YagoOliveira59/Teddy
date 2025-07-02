import type { Client } from '../entities/client';

export interface IClientRepository {
  getAll(): Promise<Client[]>;
  create(data: Omit<Client, 'id'>): Promise<Client>;
  update(id: string, data: Partial<Omit<Client, 'id'>>): Promise<Client>;
  delete(id: string): Promise<void>;
}