import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Ajuste o caminho se necessário

export function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto a autenticação está sendo verificada, não renderize nada
  // O AuthProvider já mostra uma mensagem de "Carregando" global.
  if (loading) {
    return null;
  }

  // Se estiver autenticado, permite o acesso à rota filha (Outlet).
  // Caso contrário, redireciona para a página de login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
