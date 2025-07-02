import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/controllers/users.controller';

import { UserMapper } from './application/mappers/user.mapper';
import { UserSchema } from './infrastructure/database/schemas/user.schema';
import { UserClientSchema } from './infrastructure/database/schemas/user-client.schema';

import { IUserRepository } from './domain/repositories/user.repository.interface';
import { UserRepository } from './infrastructure/database/repositories/user.repository';

import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users/find-all-users.use-case';
import { FindOneUserUseCase } from './application/use-cases/find-one-user/find-one-user.use-case';
import { FindUserByEmailUseCase } from './application/use-cases/find-user-by-email/find-user-by-email.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';

import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, UserClientSchema]),
    forwardRef(() => ClientsModule),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    DeleteUserUseCase,
    FindAllUsersUseCase,
    FindOneUserUseCase,
    FindUserByEmailUseCase,
    UpdateUserUseCase,
    UserMapper,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    IUserRepository,
    UserMapper,
    FindUserByEmailUseCase,
    FindOneUserUseCase,
  ],
})
export class UsersModule {}
