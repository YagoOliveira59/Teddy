import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom"; // 1. Importe o NavLink

// Seus ícones e logo
import logo from "/teddy.png";
import HomeIcon from "./ui/icons/HomeIcon";
import ClientIcon from "./ui/icons/ClientIcon";
import SelectedClientIcon from "./ui/icons/SelectedClient";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function Menu({ isOpen, onClose }: MenuProps) {
    console.log("Menu aberto:", isOpen);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Classes base para os links, evitando repetição
  const baseLinkClasses =
    "w-full text-left py-3 px-4 flex items-center gap-4 transition-colors duration-200 rounded-md";

  return (
    <motion.div
      ref={menuRef}
      className={`
        flex flex-col bg-white shadow-lg w-[260px] text-base h-dvh z-20
        absolute top-0 left-0
        transform transition-transform duration-300 ease-in-out

        lg:translate-x-0
      `}
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
    >
      <div className="flex items-center justify-center bg-[#363636] h-32 w-full">
        <img src={logo} alt="Logo" width={100} />
      </div>

      <nav className="flex flex-col items-start py-8 pl-4 space-y-2">
        {/* 3. Use NavLink em vez de button */}
        <NavLink
          to="/home" // Define o caminho da rota
          onClick={onClose} // Fecha o menu ao clicar
          className={(
            { isActive }, // Estilo dinâmico
          ) =>
            `${baseLinkClasses} ${isActive ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"}`
          }
          style={{ fontFamily: "Geologica, sans-serif" }}
        >
          <HomeIcon />
          Home
        </NavLink>

        <NavLink
          to="/clients"
          onClick={onClose}
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"}`
          }
          style={{ fontFamily: "Geologica, sans-serif" }}
        >
          <ClientIcon />
          Clientes
        </NavLink>

        <NavLink
          to="/selected-clients"
          onClick={onClose}
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:bg-gray-100"}`
          }
          style={{ fontFamily: "Geologica, sans-serif" }}
        >
          <SelectedClientIcon />
          Clientes Selecionados
        </NavLink>
      </nav>
    </motion.div>
  );
}

export default Menu;
