import { Injectable, Inject } from '@nestjs/common';
import { UserDto } from '@teddy/types';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.userMapper.toDto(user));
  }
}
