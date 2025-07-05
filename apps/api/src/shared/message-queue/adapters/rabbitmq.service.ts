import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import {
  IMessageQueueService,
  Job,
} from '../ports/message-queue.service.interface';

@Injectable()
export class RabbitMQService implements IMessageQueueService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RabbitMQService.name);
    this.logger.info('RabbitMQService initialized.');
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async add<T>(job: Job<T>): Promise<void> {
    this.logger.info(`Adding job to RabbitMQ: ${job.name}`, job.data);
    this.client.emit(job.name, job.data);
  }
}
