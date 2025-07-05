import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitmqConfig from '@/src/config/rabbitmq.config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.uri')].filter(
              (url): url is string => typeof url === 'string',
            ),
            queue: configService.get<string>('rabbitmq.queue') || '',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class RabbitMQModule {}
