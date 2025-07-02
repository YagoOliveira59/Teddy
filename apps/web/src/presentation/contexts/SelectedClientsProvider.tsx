import {
  useState,
  type ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { useAuth } from "@/presentation/hooks/useAuth";
import { SelectedClientsContext } from "./SelectedClientsContext";

import type { Client } from "../../domain/entities/client";

import { AddClientToSelection } from "../../domain/usecases/add-selected-client";
import { GetSelectedClients } from "../../domain/usecases/get-selected-clients";
import { RemoveClientFromSelection } from "../../domain/usecases/remove-selected-client";
import { ClearSelectedClients } from "../../domain/usecases/clear-selected-clients";

interface SelectedClientsProviderProps {
  children: ReactNode;
  getSelectedClientsUseCase: GetSelectedClients;
  addClientToSelectionUseCase: AddClientToSelection;
  removeClientFromSelectionUseCase: RemoveClientFromSelection;
  clearSelectedClientsUseCase: ClearSelectedClients;
}

export function SelectedClientsProvider({
  children,
  getSelectedClientsUseCase,
  addClientToSelectionUseCase,
  removeClientFromSelectionUseCase,
  clearSelectedClientsUseCase,
}: SelectedClientsProviderProps) {
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      getSelectedClientsUseCase
        .execute()
        .then((response) => setSelectedClients(response))
        .catch((err) =>
          console.error("Falha ao buscar clientes selecionados", err),
        )
        .finally(() => setLoading(false));
    } else {
      setSelectedClients([]);
      setLoading(false);
    }
  }, [isAuthenticated, getSelectedClientsUseCase]);

  const addClient = useCallback(
    async (client: Client) => {
      setSelectedClients((prev) => [...prev, client]);
      try {
        await addClientToSelectionUseCase.execute(client.id);
      } catch (error) {
        console.error("Falha ao adicionar cliente:", error);
        setSelectedClients((prev) => prev.filter((c) => c.id !== client.id));
        alert("Não foi possível adicionar o cliente. Tente novamente.");
      }
    },
    [addClientToSelectionUseCase],
  );

  const removeClient = useCallback(
    async (clientId: string) => {
      const originalState = [...selectedClients];
      setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
      try {
        await removeClientFromSelectionUseCase.execute(clientId);
      } catch (error) {
        console.error("Falha ao remover cliente:", error);
        setSelectedClients(originalState);
        alert("Não foi possível remover o cliente. Tente novamente.");
      }
    },
    [selectedClients, removeClientFromSelectionUseCase],
  );

  const clearClients = useCallback(async () => {
    const originalState = [...selectedClients];
    setSelectedClients([]);
    try {
      await clearSelectedClientsUseCase.execute();
    } catch (error) {
      console.error("Falha ao limpar seleção:", error);
      setSelectedClients(originalState);
      alert("Não foi possível limpar a seleção. Tente novamente.");
    }
  }, [selectedClients, clearSelectedClientsUseCase]);

  const isSelected = useCallback(
    (clientId: string) => {
      return selectedClients.some((c) => c.id === clientId);
    },
    [selectedClients],
  );

  const value = useMemo(
    () => ({
      selectedClients,
      loading,
      addClient,
      removeClient,
      clearClients,
      isSelected,
    }),
    [
      selectedClients,
      loading,
      addClient,
      removeClient,
      clearClients,
      isSelected,
    ],
  );

  return (
    <SelectedClientsContext.Provider value={value}>
      {children}
    </SelectedClientsContext.Provider>
  );
}
