import type {
  IAuthRepository,
  LoginResult,
} from "../repositories/iauth-repository";

export class Login {
  private readonly authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email e senha são obrigatórios.");
    }
    return await this.authRepository.login(credentials);
  }
}
