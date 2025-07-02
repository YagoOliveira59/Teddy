import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '@teddy/types';

import { UserMapper } from 'src/modules/users/application/mappers/user.mapper';
import { FindUserByEmailUseCase } from 'src/modules/users/application/use-cases/find-user-by-email/find-user-by-email.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly userMapper: UserMapper,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash' | 'createdAt' | 'updatedAt'>> {
    const user = await this.findUserByEmailUseCase.execute({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.userMapper.toDto(user);
  }
}
