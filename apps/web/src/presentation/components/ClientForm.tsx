import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { Client } from "../../domain/entities/client";

interface ClientFormProps {
  title: string;
  initialData: Partial<Client>;
  onSubmit: (data: Omit<Client, "id">) => void;
  onClose: () => void;
}

function ClientForm({
  title,
  initialData,
  onSubmit,
  onClose,
}: ClientFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      salary: Number(formData.get("salary")) || 0,
      companyValue: Number(formData.get("companyValue")) || 0,
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
      <motion.div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Digite o nome:"
                defaultValue={initialData.name}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="salary"
                step="any"
                placeholder="Digite o salário:"
                defaultValue={initialData.salary}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="companyValue"
                placeholder="Digite o valor da empresa:"
                defaultValue={initialData.companyValue}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors duration-200"
            >
              {title.includes("Criar") ? "Criar cliente" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ClientForm;
