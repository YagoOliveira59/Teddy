import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiSecure } from 'src/common/decorators/api-secure.decorator';
import {
  User,
  UserFromJwt,
} from 'src/modules/auth/presentation/decorators/user.decorator';
import {
  createClientSchema,
  CreateClientDto,
  updateClientSchema,
  UpdateClientDto,
  Client as ClientDto,
} from '@teddy/types';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { ClientMapper } from '../../application/mappers/client.mapper';

import { CreateClientUseCase } from '../../application/use-cases/create-client/create-client.use-case';
import { FindAllClientsUseCase } from '../../application/use-cases/find-all-clients/find-all-clients.use-case';
import { FindOneClientUseCase } from '../../application/use-cases/find-one-client/find-one-client.use-case';
import { UpdateClientUseCase } from '../../application/use-cases/update-client/update-client.use-case';
import { DeleteClientUseCase } from '../../application/use-cases/delete-client/delete-client.use-case';

@ApiTags('Clients')
@ApiSecure()
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findAllClientsUseCase: FindAllClientsUseCase,
    private readonly findOneClientUseCase: FindOneClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly clientMapper: ClientMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new client and add it to the creator portfolio',
  })
  @ApiResponse({
    status: 201,
    description: 'Client created and associated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body(new ZodValidationPipe(createClientSchema))
    createClientDto: CreateClientDto,
    @User() user: UserFromJwt,
  ) {
    const newClientEntity = await this.createClientUseCase.execute({
      createClientDto,
      userId: user.id,
    });
    return this.clientMapper.toDto(newClientEntity);
  }

  @Get()
  @ApiOperation({
    summary: 'List all clients available in the system (for Browse)',
  })
  @ApiResponse({ status: 200, description: 'An array of all clients.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async listAll() {
    const clients = await this.findAllClientsUseCase.execute();
    return clients;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific client by its ID' })
  @ApiResponse({ status: 200, description: 'Client data found.' })
  @ApiResponse({
    status: 404,
    description: 'Client with the given ID not found.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<ClientDto> {
    const clientEntity = await this.findOneClientUseCase.execute({ id });
    return this.clientMapper.toDto(clientEntity);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a client (permission required)' })
  @ApiResponse({ status: 204, description: 'Client updated successfully.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateClientSchema))
    updateClientDto: UpdateClientDto,
  ) {
    await this.updateClientUseCase.execute({
      id,
      ...updateClientDto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a client from the system (permission required)',
  })
  @ApiResponse({ status: 204, description: 'Client deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async remove(@Param('id') id: string) {
    await this.deleteClientUseCase.execute({ clientId: id });
  }
}
