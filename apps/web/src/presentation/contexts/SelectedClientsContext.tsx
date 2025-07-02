import { createContext } from "react";
import type { Client } from "../../domain/entities/client";

interface SelectedClientsContextType {
  selectedClients: Client[];
  loading: boolean;
  addClient: (client: Client) => Promise<void>;
  removeClient: (clientId: string) => Promise<void>;
  clearClients: () => Promise<void>;
  isSelected: (clientId: string) => boolean;
}

export const SelectedClientsContext = createContext<
  SelectedClientsContextType | undefined
>(undefined);
