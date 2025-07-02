import { useState, type ReactNode, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../../domain/entities/user";
import { makeAuthRepository } from "@/main/factories/pages/auth-repository-factory";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/login";
  }, []);

  const verifyAuthToken = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const authRepository = makeAuthRepository();
        const userData = await authRepository.getProfile();
        console.log("Usuário autenticado:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Token inválido, fazendo logout.", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    verifyAuthToken();
  }, [verifyAuthToken]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  if (loading) {
    return <div>Carregando aplicação...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
