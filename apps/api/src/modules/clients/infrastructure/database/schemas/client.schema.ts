import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserClientSchema } from 'src/modules/users/infrastructure/database/schemas/user-client.schema';

@Entity('clients')
export class ClientSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  salary: number;

  @Column({
    name: 'company_value',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  companyValue: number;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => UserClientSchema, (selection) => selection.client)
  users: UserClientSchema[];
}
