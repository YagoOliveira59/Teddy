import { AuthPage } from "../../../presentation/pages/AuthPage";
import { makeAuthRepository } from "./auth-repository-factory";
import { Login } from "../../../domain/usecases/login";
import { Register } from '../../../domain/usecases/register';

export function makeLoginPage() {
  const authRepository = makeAuthRepository();
  const loginUseCase = new Login(authRepository);
  const registerUseCase = new Register(authRepository);
  return <AuthPage loginUseCase={loginUseCase} registerUseCase={registerUseCase} />;
}
