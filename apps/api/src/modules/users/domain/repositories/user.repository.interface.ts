import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract findWithRelations(
    id: string,
    relations: string[],
  ): Promise<User | null>;
  abstract update(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
