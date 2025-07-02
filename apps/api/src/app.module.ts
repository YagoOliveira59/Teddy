import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

import { AuthModule } from 'src/modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './modules/clients/clients.module';
import { UsersModule } from './modules/users/users.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';

import { BullModule } from '@nestjs/bullmq';
import { LogsModule } from './logs/logs.module';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

const configuredModule = BullModule.forRoot({
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    configuredModule,
    AuthModule,
    DatabaseModule,
    ClientsModule,
    LogsModule,
    UsersModule,
    PortfolioModule,
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
