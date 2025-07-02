import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Minus } from "lucide-react";
import type { Client } from "../../../domain/entities/client";

import { useSelectedClients } from "../../hooks/useSelectedClients";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

interface ClientCardProps {
  client: Client;
  variant?: "default" | "selection"; // ✅ Nova prop para controlar a variante
  onEdit?: (id: string) => void;
  onDelete?: (client: Client) => void;
}

function ClientCard({
  client,
  variant = "default",
  onEdit,
  onDelete,
}: ClientCardProps) {
  const { addClient, removeClient, isSelected } = useSelectedClients();
  const selected = isSelected(client.id);

  const handleToggleSelection = () => {
    if (selected) {
      removeClient(client.id);
    } else {
      addClient(client);
    }
  };

  return (
    <motion.div
      className="w-[285px] h-[138] bg-white rounded-sm shadow-md p-4 flex flex-col justify-between text-sm text-gray-700 hover:shadow-xl transition-shadow duration-200"
      whileHover={{ scale: 1.05 }}
    >
{/*       <div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{client.name}</h3>
      </div> */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{client.name}</h3>
        <p>Salário: {formatCurrency(client.salary)}</p>
        <p>Empresa: {formatCurrency(client.companyValue)}</p>
      </div>
      <div className="flex justify-between items-center gap-4 mt-4 border-t pt-3">
        {variant === "default" && (
          <>
            <button
              onClick={handleToggleSelection}
              title={selected ? "Remover da seleção" : "Adicionar à seleção"}
            >
              <Plus
                size={20}
                className={selected ? "text-orange-500" : "text-gray-500"}
              />
            </button>
            <button
              onClick={() => onEdit?.(client.id)}
              className="text-gray-500 hover:text-green-600"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete?.(client)}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
        {variant === "selection" && (
          <button
            onClick={() => removeClient(client.id)}
            title="Remover da seleção"
            className="text-red-500 hover:text-red-700 self-end"
          >
            <Minus size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ClientCard;
