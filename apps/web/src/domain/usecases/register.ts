import type { User } from "../entities/user";
import type { IAuthRepository } from "../repositories/iauth-repository";

export class Register {
  private readonly authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    if (data.password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");

    }
    if (!data.email.includes("@")) {
      throw new Error("O email deve ser válido.");
    }

    return await this.authRepository.register(data);
  }
}
