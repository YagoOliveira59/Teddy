import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserSchema } from './user.schema';
import { ClientSchema } from 'src/modules/clients/infrastructure/database/schemas/client.schema';

@Entity({ name: 'users_clients' })
export class UserClientSchema {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => UserSchema, (user) => user.clients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserSchema;

  @ManyToOne(() => ClientSchema, (client) => client.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientSchema;
}
