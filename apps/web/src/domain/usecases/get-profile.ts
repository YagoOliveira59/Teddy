import type { User } from "../entities/user";
import type { IAuthRepository } from "../repositories/iauth-repository";

export class GetProfile {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<User> {
    return await this.authRepository.getProfile();
  }
}
