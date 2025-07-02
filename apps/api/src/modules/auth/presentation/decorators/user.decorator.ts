import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '@teddy/types';
import { Request } from 'express';

type UserWithoutSensitive = Omit<
  UserEntity,
  'passwordHash' | 'createdAt' | 'updatedAt'
>;

interface RequestWithUser extends Request {
  user: UserWithoutSensitive;
}

export interface UserFromJwt {
  id: string;
  email: string;
}

export const User = createParamDecorator(
  (data: keyof UserWithoutSensitive | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
