import { NavLink } from "react-router-dom";
import { useAuth } from "../../presentation/hooks/useAuth";
import MenuButton from "./ui/MenuButton";

// 1. A interface de props foi simplificada
interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {

  const { user, logout } = useAuth();
  // Classes base para os links de navegação
  const baseLinkClasses =
    "pb-2 text-base font-normal transition-colors duration-200 border-b-2";
  const activeLinkClasses = "text-orange-500 border-orange-500";
  const inactiveLinkClasses =
    "text-gray-700 border-transparent hover:text-orange-500";

  return (
    <header className="flex items-center justify-between px-6 bg-white shadow-lg w-full h-[100px] max-h-[100px]">
      {/* Botão para abrir/fechar o menu lateral */}
      <div>
        <MenuButton
          onClick={onMenuToggle}
          status={isMenuOpen ? "open" : "closed"}
        />
      </div>

      {/* Navegação principal */}
      <nav className="flex items-center gap-6">
        {/* 2. Use NavLink para navegação e estilo automático */}
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
          }
        >
          Clientes
        </NavLink>

        <NavLink
          to="/selected-clients"
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
          }
        >
          Clientes selecionados
        </NavLink>

        {/* 3. O botão "Sair" continua sendo um <button> pois executa uma ação */}
        <button
          className={`${baseLinkClasses} ${inactiveLinkClasses}`}
          onClick={logout} // A função 'logout' vem do hook
        >
          Sair
        </button>
      </nav>

      {/* Saudação ao usuário */}
      <div className="text-gray-800">
        Olá, <span className="font-bold">{user ? user.name : "Visitante"}</span>
      </div>
    </header>
  );
}

export default Header;
