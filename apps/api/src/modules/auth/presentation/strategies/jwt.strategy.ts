import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '@teddy/types';

import { UserMapper } from 'src/modules/users/application/mappers/user.mapper';
import { FindOneUserUseCase } from 'src/modules/users/application/use-cases/find-one-user/find-one-user.use-case';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly userMapper: UserMapper,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Omit<User, 'passwordHash' | 'createdAt' | 'updatedAt'>> {
    const user = await this.findOneUserUseCase.execute({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    const userDto = this.userMapper.toDto(user);

    return userDto;
  }
}
