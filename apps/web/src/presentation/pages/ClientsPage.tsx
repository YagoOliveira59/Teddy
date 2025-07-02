import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

import ClientCard from "../components/ui/ClientCard";
import Pagination from "../components/ui/Pagination";
import ClientForm from "../components/ClientForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

import type { Client } from "../../domain/entities/client";
import { GetAllClients } from "../../domain/usecases/get-all-clients";
import { CreateClient } from "../../domain/usecases/create-client";
import { UpdateClient } from "../../domain/usecases/update-client";
import { DeleteClient } from "../../domain/usecases/delete-client";

interface ClientsPageProps {
  createClient: CreateClient;
  getAllClients: GetAllClients;
  updateClient: UpdateClient;
  deleteClient: DeleteClient;
}

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; client: Client };

/* const MOCK_CLIENTS: Client[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  name: `Eduardo ${i + 1}`,
  salary: 3500 + i * 50,
  companyValue: 120000 + i * 1000,
})); */

function ClientsPage({
  createClient,
  getAllClients,
  updateClient,
  deleteClient,
}: ClientsPageProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [modalState, setModalState] = useState<ModalState>({ mode: "closed" });
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllClients.execute();
      setClients(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "Falha ao buscar clientes.";
      setError(errorMessage);
      console.error("Falha ao buscar clientes", err);
    } finally {
      setLoading(false);
    }
  }, [getAllClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const currentClients = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return clients.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, clients]);

  const totalPages = Math.ceil(clients.length / itemsPerPage);

  const handleOpenCreateModal = () => setModalState({ mode: "create" });
  const handleOpenEditModal = (id: string) => {
    const clientToEdit = clients.find((c) => c.id === id);
    if (clientToEdit) {
      setModalState({ mode: "edit", client: clientToEdit });
    }
  };
  const handleCloseModal = () => setModalState({ mode: "closed" });
  const handleOpenDeleteModal = (client: Client) => setClientToDelete(client);
  const handleCancelDelete = () => setClientToDelete(null);

  const handleFormSubmit = useCallback(
    async (data: Omit<Client, "id">) => {
      setError(null);
      try {
        if (modalState.mode === "create") {
          await createClient.execute(data);
          alert("Cliente criado com sucesso!");
        } else if (modalState.mode === "edit") {
          await updateClient.execute(modalState.client.id, data);
          alert("Cliente atualizado com sucesso!");
        }
        handleCloseModal();
        fetchClients();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message);
      }
    },
    [modalState, createClient, updateClient, fetchClients],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (clientToDelete) {
      setError(null);
      try {
        await deleteClient.execute(clientToDelete.id);
        alert("Cliente excluído com sucesso!");
        setClientToDelete(null);
        fetchClients();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message);
        setClientToDelete(null);

      }
    }
  }, [clientToDelete, deleteClient, fetchClients]);
  if (loading) {
    return <div className="p-8 text-center">Carregando clientes...</div>;
  }

/*   const handleAdd = (id: string) => alert(`Adicionar cliente ID: ${id}`); */

  return (
    <div className="min-h-[700px] max-w-[1200px] mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-center">
          <p>{error}</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-gray-800">
          <span className="font-bold">{clients.length}</span> clientes
          encontrados:
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="itemsPerPage" className="text-gray-600">
            Clientes por página:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border-gray-300 bg-transparent rounded-md shadow-sm p-1 active:border-orange-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {currentClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={handleOpenEditModal}
            onDelete={() => handleOpenDeleteModal(client)}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleOpenCreateModal}
          className="w-full text-center border-2 border-orange-500 text-orange-500 font-semibold rounded-lg py-3 hover:bg-orange-500 hover:text-white transition-colors duration-200"
        >
          Criar Cliente
        </button>
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AnimatePresence>
        {modalState.mode !== "closed" && (
          <ClientForm
            title={
              modalState.mode === "create"
                ? "Criar cliente:"
                : `Editar cliente: ${modalState.client.name}`
            }
            initialData={modalState.mode === "edit" ? modalState.client : {}}
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {clientToDelete && (
          <DeleteConfirmationModal
            clientName={clientToDelete.name}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClientsPage;
