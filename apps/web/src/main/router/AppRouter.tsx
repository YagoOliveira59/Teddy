import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/presentation/MainLayout";
import { PrivateRoute } from "@/presentation/contexts/ProtectedRoute"; // 1. Importe o PrivateRoute

import { makeLoginPage } from "@/main/factories/pages/login-page-factory";
import { makeHomePage } from "@/main/factories/pages/home-page-factory";
import { makeClientsPage } from "@/main/factories/pages/clients-page-factory";
import { makeSelectedClientsPage } from "@/main/factories/pages/selected-clients-page-factory";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={makeLoginPage()} />

        {/* 2. Rotas protegidas dentro do PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={makeHomePage()} />
            <Route path="/clients" element={makeClientsPage()} />
            <Route
              path="/selected-clients"
              element={makeSelectedClientsPage()}
            />
            {/* Redirecionamento da raiz para /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>

        {/* Rota para qualquer outro caminho não encontrado */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}