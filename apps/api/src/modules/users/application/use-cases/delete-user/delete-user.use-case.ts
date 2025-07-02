import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ id }: { id: string }): Promise<void> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    await this.userRepository.delete(id);
  }
}
