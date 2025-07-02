import { Injectable } from '@nestjs/common';
import { UserDto } from '@teddy/types';
import { User } from '../../domain/entities/user.entity';
import { UserSchema } from '../../infrastructure/database/schemas/user.schema';

@Injectable()
export class UserMapper {
  public toDomain(raw: UserSchema): User {
    return User.hydrate(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
      },
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  public toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public toPersistence(user: User): Partial<UserSchema> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
