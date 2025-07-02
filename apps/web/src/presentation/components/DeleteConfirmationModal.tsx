import { X } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteConfirmationModalProps {
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  clientName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
      <motion.div
        className="bg-white rounded-sm shadow-2xl p-5 min-w-[400px] max-w-[520px] h-[148px] flex flex-col justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">Excluir cliente:</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-700 text-justify">
          Você está prestes a excluir o cliente:{" "}
          <span className="font-bold">{clientName}</span>
        </p>

        <div className="flex gap-4 ">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors duration-200"
          >
            Excluir cliente
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteConfirmationModal;
