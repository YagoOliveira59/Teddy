import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/presentation/MainLayout";

import { makeLoginPage } from "@/main/factories/pages/login-page-factory";
import { makeHomePage } from "@/main/factories/pages/home-page-factory";
import { makeClientsPage } from "@/main/factories/pages/clients-page-factory";
import { makeSelectedClientsPage } from "@/main/factories/pages/selected-clients-page-factory";
import { ProtectedRoute } from "@/presentation/contexts/ProtectedRoute ";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={makeLoginPage()} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={makeHomePage()} />
            <Route path="/clients" element={makeClientsPage()} />
            <Route
              path="/selected-clients"
              element={makeSelectedClientsPage()}
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
