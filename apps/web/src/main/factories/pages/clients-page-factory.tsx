import ClientsPage from "../../../presentation/pages/ClientsPage";
import { makeClientRepository } from '../repositories/client-repository-factory';

import { CreateClient } from "../../../domain/usecases/create-client";
import { GetAllClients } from "../../../domain/usecases/get-all-clients";
import { UpdateClient } from "../../../domain/usecases/update-client";
import { DeleteClient } from "../../../domain/usecases/delete-client";

export function makeClientsPage() {
  const clientRepository = makeClientRepository(); 

  const createClient = new CreateClient(clientRepository);
  const getAllClients = new GetAllClients(clientRepository);
  const updateClient = new UpdateClient(clientRepository);
  const deleteClient = new DeleteClient(clientRepository);
  return (
    <ClientsPage
      createClient={createClient}
      getAllClients={getAllClients}
      updateClient={updateClient}
      deleteClient={deleteClient}
    />
  );
}
