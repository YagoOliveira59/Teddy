import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

interface FindUserByEmailInput {
  email: string;
}

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ email }: FindUserByEmailInput): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }
}
