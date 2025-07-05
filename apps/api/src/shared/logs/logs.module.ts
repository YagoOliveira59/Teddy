import { Module } from '@nestjs/common';
import type { Request } from 'express';
import { LoggerModule } from 'nestjs-pino';
import { FirehosePinoStream } from './firehose-pino-stream';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrettyOptions } from 'pino-pretty';
import { DestinationStream } from 'pino';

type PinoHttpConfig = {
  level: string;
  stream?: DestinationStream;
  transport?: { target: string; options: PrettyOptions };
  autoLogging: { ignore: (req: any) => boolean };
  genReqId: (req: any) => any;
  timestamp: () => string;
};

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        const firehoseStreamName = configService.get<string>(
          'FIREHOSE_DELIVERY_STREAM_NAME',
        );
        const awsRegion = configService.get<string>('AWS_REGION');

        const baseConfig = {
          autoLogging: {
            ignore: (req: Request) =>
              Boolean(
                req.url &&
                  (req.url.includes('/health') || req.url.includes('/metrics')),
              ),
          },
          genReqId: (req: { headers?: Record<string, unknown> }) => {
            const requestId =
              typeof req.headers?.['x-request-id'] === 'string'
                ? req.headers['x-request-id']
                : undefined;
            return requestId || Math.random().toString(36).substring(2, 15);
          },
          timestamp: () => `,"time":"${new Date().toISOString()}"`,
        };

        let transportConfig: Pick<
          PinoHttpConfig,
          'stream' | 'transport' | 'level'
        >;

        // 2. Define apenas a parte que muda com base no ambiente
        if (isProduction && firehoseStreamName && awsRegion) {
          console.log('[LogsModule] Using Firehose stream for production.');
          transportConfig = {
            level: 'info',
            stream: new FirehosePinoStream(firehoseStreamName, awsRegion),
          };
        } else {
          console.log('[LogsModule] Using pino-pretty for development.');
          transportConfig = {
            level: 'debug',
            transport: {
              target: 'pino-pretty',
              options: { singleLine: true, colorize: true },
            },
          };
        }

        return {
          pinoHttp: {
            ...baseConfig,
            ...transportConfig,
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LogsModule {}
