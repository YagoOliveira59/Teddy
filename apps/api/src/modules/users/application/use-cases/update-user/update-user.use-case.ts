import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from '@teddy/types';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

type UpdateUserInput = UpdateUserDto & { id: string };

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new NotFoundException(`User with ID "${input.id}" not found.`);
    }

    // Use the entity's own methods to update its state
    if (input.name) {
      user.changeName(input.name);
    }

    if (input.password) {
      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(input.password, saltRounds);
      user.changePassword(newPasswordHash);
    }

    await this.userRepository.save(user);
  }
}
