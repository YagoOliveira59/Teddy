import { useState } from "react";
import { Toaster } from "sonner";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./styles/index.css";
import "./styles/globals.css";

import Header from "./components/Header";
import Menu from "./components/Menu";

export function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Toaster richColors position="top-right" />

      <AnimatePresence>
        {isMenuOpen && (
          <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Header
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
        />
        <main className="p-4 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              className="opacity-0"
              key={location.pathname}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
