import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { ClientsController } from './presentation/controllers/clients.controller';

import { ClientMapper } from './application/mappers/client.mapper';
import { ClientSchema } from './infrastructure/database/schemas/client.schema';
import { IClientRepository } from './domain/repositories/client.repository.interface';
import { ClientRepository } from './infrastructure/database/repositories/client.repository';

import { CreateClientUseCase } from './application/use-cases/create-client/create-client.use-case';
import { FindAllClientsUseCase } from './application/use-cases/find-all-clients/find-all-clients.use-case';
import { FindOneClientUseCase } from './application/use-cases/find-one-client/find-one-client.use-case';
import { UpdateClientUseCase } from './application/use-cases/update-client/update-client.use-case';
import { DeleteClientUseCase } from './application/use-cases/delete-client/delete-client.use-case';

import { FindSelectedClientsByUserUseCase } from './application/use-cases/find-clients-by-user/find-selected-clients-by-user.use-case';
import { AssociateClientToUserUseCase } from './application/use-cases/associate-client-to-user/associate-client-to-user.use-case';
import { DisassociateClientFromUserUseCase } from './application/use-cases/disassociate-client-from-user/disassociate-client-from-user.use-case';

import { ClientProcessor } from './application/processors/client.processor';
import { SendWelcomeEmailUseCase } from './application/use-cases/send-welcome-email/send-welcome-email.use-case';

import { MailModule } from '@shared/mail/mail.module';
import { LogsModule } from '@shared/logs/logs.module';
/* import { MetricsModule } from '@shared/metrics/metrics.module'; */

import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientSchema]),
    forwardRef(() => UsersModule),
    BullModule.registerQueue({
      name: 'client-tasks',
    }),
    forwardRef(() => LogsModule),
    forwardRef(() => MailModule),
    /*     forwardRef(() => MetricsModule), */
  ],
  controllers: [ClientsController],
  providers: [
    AssociateClientToUserUseCase,
    DisassociateClientFromUserUseCase,
    ClientProcessor,
    CreateClientUseCase,
    DeleteClientUseCase,
    FindAllClientsUseCase,
    FindOneClientUseCase,
    FindSelectedClientsByUserUseCase,
    UpdateClientUseCase,
    SendWelcomeEmailUseCase,
    ClientMapper,
    {
      provide: IClientRepository,
      useClass: ClientRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    IClientRepository,
    ClientMapper,
    FindAllClientsUseCase,
    FindOneClientUseCase,
    FindSelectedClientsByUserUseCase,
    AssociateClientToUserUseCase,
    DisassociateClientFromUserUseCase,
  ],
})
export class ClientsModule {}
