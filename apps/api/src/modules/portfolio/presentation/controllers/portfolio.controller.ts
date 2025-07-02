import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiSecure } from 'src/common/decorators/api-secure.decorator';
import {
  User,
  UserFromJwt,
} from 'src/modules/auth/presentation/decorators/user.decorator';

import { FindSelectedClientsByUserUseCase } from 'src/modules/clients/application/use-cases/find-clients-by-user/find-selected-clients-by-user.use-case';
import { AssociateClientToUserUseCase } from 'src/modules/clients/application/use-cases/associate-client-to-user/associate-client-to-user.use-case';
import { DisassociateClientFromUserUseCase } from 'src/modules/clients/application/use-cases/disassociate-client-from-user/disassociate-client-from-user.use-case';
import { DisassociateAllClientsFromUserUseCase } from 'src/modules/clients/application/use-cases/disassociate-all-clients-from-user/disassociate-all-clients-from-user.use-case';

@ApiTags('Portfolio')
@ApiSecure()
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly findSelectedClientsUseCase: FindSelectedClientsByUserUseCase,
    private readonly associateClientToUserUseCase: AssociateClientToUserUseCase,
    private readonly disassociateClientFromUserUseCase: DisassociateClientFromUserUseCase,
    private readonly disassociateAllClientsFromUserUseCase: DisassociateAllClientsFromUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's client portfolio" })
  @ApiResponse({
    status: 200,
    description: "A list of the user's associated clients.",
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findMyPortfolio(@User() user: UserFromJwt) {
    return this.findSelectedClientsUseCase.execute({ userId: user.id });
  }

  @Post('/:clientId/select')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add an existing client to the user portfolio' })
  @ApiResponse({ status: 204, description: 'Client associated successfully.' })
  @ApiResponse({ status: 404, description: 'User or Client not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Client is already in the portfolio.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async associateClient(
    @Param('clientId') clientId: string,
    @User() user: UserFromJwt,
  ): Promise<void> {
    await this.associateClientToUserUseCase.execute({
      userId: user.id,
      clientId: clientId,
    });
  }

  @Delete('/:clientId/deselect')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a client from the user portfolio' })
  @ApiResponse({
    status: 204,
    description: 'Client disassociated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  async disassociateClient(
    @Param('clientId') clientId: string,
    @User() user: UserFromJwt,
  ): Promise<void> {
    await this.disassociateClientFromUserUseCase.execute({
      userId: user.id,
      clientId,
    });
  }

  @Delete('/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove all clients from the user portfolio' })
  @ApiResponse({
    status: 204,
    description: 'Clients disassociated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Association not found.' })
  async disassociateAllClients(@User() user: UserFromJwt): Promise<void> {
    await this.disassociateAllClientsFromUserUseCase.execute({
      userId: user.id,
    });
  }
}
