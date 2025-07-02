import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

import { LocalStrategy } from './presentation/strategies/local.strategy';
import { LocalAuthGuard } from './presentation/guards/local-auth.guard';

import { FindUserByEmailUseCase } from 'src/modules/users/application/use-cases/find-user-by-email/find-user-by-email.use-case';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
    LocalStrategy,
    LoginUseCase,
    FindUserByEmailUseCase,
  ],
  exports: [
    JwtModule,
    PassportModule,
    JwtAuthGuard,
    LocalAuthGuard,
    LoginUseCase,
    FindUserByEmailUseCase,
  ],
})
export class AuthModule {}
