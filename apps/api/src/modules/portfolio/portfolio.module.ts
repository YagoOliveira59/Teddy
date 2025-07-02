import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { UsersModule } from 'src/modules/users/users.module';

import { PortfolioController } from './presentation/controllers/portfolio.controller';
import { FindSelectedClientsByUserUseCase } from '../clients/application/use-cases/find-clients-by-user/find-selected-clients-by-user.use-case';
import { AssociateClientToUserUseCase } from '../clients/application/use-cases/associate-client-to-user/associate-client-to-user.use-case';
import { DisassociateClientFromUserUseCase } from '../clients/application/use-cases/disassociate-client-from-user/disassociate-client-from-user.use-case';
import { DisassociateAllClientsFromUserUseCase } from '../clients/application/use-cases/disassociate-all-clients-from-user/disassociate-all-clients-from-user.use-case';

@Module({
  imports: [ClientsModule, UsersModule],
  controllers: [PortfolioController],
  providers: [
    FindSelectedClientsByUserUseCase,
    AssociateClientToUserUseCase,
    DisassociateClientFromUserUseCase,
    DisassociateAllClientsFromUserUseCase,
  ],
})
export class PortfolioModule {}
