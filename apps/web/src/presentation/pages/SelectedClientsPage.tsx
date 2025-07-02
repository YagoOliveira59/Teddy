import ClientCard from "../components/ui/ClientCard";
import { useSelectedClients } from "../hooks/useSelectedClients";

export function SelectedClientsPage() {
  const { selectedClients, clearClients } = useSelectedClients();

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-gray-800">
          <span className="font-bold">{selectedClients.length}</span> clientes
          selecionados:
        </h2>
      </div>

      {selectedClients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {selectedClients.map((client) => (
            <ClientCard key={client.id} client={client} variant="selection" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Nenhum cliente selecionado ainda.</p>
          <p className="text-sm text-gray-500 mt-2">
            Vá para a página de Clientes para adicionar.
          </p>
        </div>
      )}

      {selectedClients.length > 0 && (
        <div className="mt-8">
          <button
            onClick={clearClients}
            className="w-full text-center border-2 border-orange-500 text-orange-500 font-semibold rounded-lg py-3 hover:bg-orange-500 hover:text-white transition-colors duration-200"
          >
            Limpar clientes selecionados
          </button>
        </div>
      )}
    </div>
  );
}
