import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '@teddy/types';

import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
};

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
