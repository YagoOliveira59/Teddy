import { HomePage } from '../../../presentation/pages/HomePage';
import { makeClientRepository } from '../repositories/client-repository-factory';
import { GetAllClients } from '../../../domain/usecases/get-all-clients';

export function makeHomePage() {
  const clientRepository = makeClientRepository(); 
  const getAllClients = new GetAllClients(clientRepository);
  return <HomePage getAllClients={getAllClients} />;
}