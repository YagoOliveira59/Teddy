import type { Client } from '../entities/client';

export interface ISelectedClientsRepository {
  getSelectedClients(): Promise<Client[]>;
  addClientToSelection(clientId: string): Promise<void>;
  removeClientFromSelection(clientId: string): Promise<void>;
  clearAllSelectedClients(): Promise<void>;
}