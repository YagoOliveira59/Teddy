import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, CheckSquare } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useSelectedClients } from "../hooks/useSelectedClients";
import { GetAllClients } from "../../domain/usecases/get-all-clients";

interface HomePageProps {
  getAllClients: GetAllClients;
}

export function HomePage({ getAllClients }: HomePageProps) {
  const { user } = useAuth();
  const { selectedClients } = useSelectedClients();

  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalClients = async () => {
      try {
        setLoading(true);
        const clients = await getAllClients.execute();
        setTotalClients(clients.length);
      } catch (error) {
        console.error("Erro ao buscar total de clientes", error);
        setTotalClients(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalClients();
  }, [getAllClients]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Bem-vindo(a) de volta, {user?.name.split(" ")[0]}!
      </h1>
      <p className="text-gray-600 mb-8">
        Aqui está um resumo da sua atividade.
      </p>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Clientes</p>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? "..." : totalClients}
            </p>
          </div>
          <Users className="text-orange-500" size={36} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Clientes na Seleção</p>
            <p className="text-3xl font-bold text-gray-900">
              {selectedClients.length}
            </p>
          </div>
          <CheckSquare className="text-orange-500" size={36} />
        </div>
      </div>

      {/* Cards de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/clients"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="font-bold text-lg text-gray-800">
            Gerenciar Clientes
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Veja, crie, edite e delete seus clientes.
          </p>
        </Link>
        <Link
          to="/selected-clients"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="font-bold text-lg text-gray-800">Ver Seleção</h3>
          <p className="text-sm text-gray-600 mt-1">
            Confira a lista de clientes que você selecionou.
          </p>
        </Link>
      </div>
    </div>
  );
}
