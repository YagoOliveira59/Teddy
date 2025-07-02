import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { Login } from "../../domain/usecases/login";
import { Register } from "../../domain/usecases/register";

import logo from "/teddy.png";

interface AuthPageProps {
  loginUseCase: Login;
  registerUseCase: Register;
}

export function AuthPage({ loginUseCase, registerUseCase }: AuthPageProps) {
  const [view, setView] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (!registerData.name) {
      setError("Por favor, insira seu nome.");
      return;
    }
    setError(null);
    setRegisterStep(2);
  };

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { token, user } = await loginUseCase.execute({ email, password });
      auth.login(token, user);
      navigate("/clients");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Credenciais inválidas. Tente novamente.",
      );
      console.error("Falha no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await registerUseCase.execute({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      const { token, user } = await loginUseCase.execute({
        email: registerData.email,
        password: registerData.password,
      });
      auth.login(token, user);
      navigate("/clients");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "Ocorreu um erro inesperado.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const renderRegisterForm = () => {
    if (registerStep === 1) {
      return (
        <motion.div
          key="register-step1"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6  pb-2">
            Crie sua conta
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Primeiro, seu nome completo"
              value={registerData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-sm border-2 border-[#D9D9D9]"
            />
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-orange-500 rounded-sm text-white font-bold py-3 rounded-sm..."
            >
              Próximo
            </button>
          </div>
        </motion.div>
      );
    }

    if (registerStep === 2) {
      return (
        <motion.div
          key="register-step2"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Quase lá, {registerData.name.split(" ")[0]}!
          </h1>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Seu melhor e-mail"
              value={registerData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-sm border-2 border-[#D9D9D9]"
            />
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha forte"
              value={registerData.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-sm border-2 border-[#D9D9D9]"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={registerData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-sm border-2 border-[#D9D9D9]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-sm"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm mb-4 text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.div
              key="login"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-8"
            >
              <img
                src={logo}
                alt="Logo Teddy"
                width={100}
                className="mx-auto mb-8"
              />
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Acessar sua conta
              </h1>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Campos de input (email, password) */}
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  required
                  className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  required
                  className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-sm hover:bg-orange-600 transition-colors duration-200 disabled:bg-orange-300"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-6">
                Não tem uma conta?{" "}
                <button
                  onClick={() => setView("register")}
                  className="font-semibold text-orange-500 hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            </motion.div>
          ) : (
            renderRegisterForm()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
