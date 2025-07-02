import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserSchema } from '../schemas/user.schema';
import { UserMapper } from '../../../application/mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userOrmRepository: Repository<UserSchema>,
    private readonly mapper: UserMapper,
  ) {}

  async save(user: User): Promise<void> {
    const userPersistenceModel = this.mapper.toPersistence(user);
    await this.userOrmRepository.save(userPersistenceModel);
  }

  async findById(id: string): Promise<User | null> {
    const userFound = await this.userOrmRepository.findOneBy({ id });

    if (!userFound) {
      return null;
    }

    return this.mapper.toDomain(userFound);
  }

  async findAll(): Promise<User[]> {
    const usersFound = await this.userOrmRepository.find();
    return usersFound.map((user) => this.mapper.toDomain(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFound = await this.userOrmRepository.findOne({
      where: { email },
    });

    if (!userFound) {
      return null;
    }

    return this.mapper.toDomain(userFound);
  }

  async findWithRelations(
    id: string,
    relations: string[],
  ): Promise<User | null> {
    const userFound = await this.userOrmRepository.findOne({
      where: { id },
      relations,
    });

    if (!userFound) {
      return null;
    }
    return this.mapper.toDomain(userFound);
  }

  async update(user: User): Promise<void> {
    const userPersistenceModel = this.mapper.toPersistence(user);
    await this.userOrmRepository.update(user.id, userPersistenceModel);
  }

  async delete(id: string): Promise<void> {
    await this.userOrmRepository.delete(id);
  }
}
