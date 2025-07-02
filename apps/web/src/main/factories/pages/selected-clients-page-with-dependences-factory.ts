import { AddClientToSelection } from "@/domain/usecases/add-selected-client";
import { GetSelectedClients } from "@/domain/usecases/get-selected-clients";
import { RemoveClientFromSelection } from "@/domain/usecases/remove-selected-client";
import { ClearSelectedClients } from "@/domain/usecases/clear-selected-clients";

import { makeSelectedClientsRepository } from "../repositories/selected-clients-repository-factory";

export function makeSelectedClientsDependencies() {
  const repository = makeSelectedClientsRepository();

  return {
    getSelectedClientsUseCase: new GetSelectedClients(repository),
    addClientToSelectionUseCase: new AddClientToSelection(repository),
    removeClientFromSelectionUseCase: new RemoveClientFromSelection(repository),
    clearSelectedClientsUseCase: new ClearSelectedClients(repository),
  };
}
