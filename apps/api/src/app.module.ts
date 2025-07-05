import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/src/config/configuration';

import { AuthModule } from '@/src/modules/auth/auth.module';
import { DatabaseModule } from '@/src/database/database.module';
import { ClientsModule } from '@modules/clients/clients.module';
import { UsersModule } from '@modules/users/users.module';
import { PortfolioModule } from '@modules/portfolio/portfolio.module';

import { BullModule } from '@nestjs/bullmq';
import { LogsModule } from '@/src/shared/logs/logs.module';
import { JwtAuthGuard } from '@/src/modules/auth/presentation/guards/jwt-auth.guard';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsModule } from '@shared/metrics/metrics.module';
import { RabbitMQModule } from '@shared/message-queue/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultLabels: {
        app: 'teddy-api',
      },
    }),
    AuthModule,
    DatabaseModule,
    ClientsModule,
    LogsModule,
    MetricsModule,
    UsersModule,
    PortfolioModule,
    RabbitMQModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
