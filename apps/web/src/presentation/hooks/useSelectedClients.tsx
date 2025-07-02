import { useContext } from "react";
import { SelectedClientsContext } from "../contexts/SelectedClientsContext";

export function useSelectedClients() {
  const context = useContext(SelectedClientsContext);
  if (!context) {
    throw new Error(
      "useSelectedClients deve ser usado dentro de um SelectedClientsProvider",
    );
  }
  return context;
}
