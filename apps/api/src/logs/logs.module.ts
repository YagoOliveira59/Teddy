import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { FirehosePinoStream } from './firehose-pino-stream'; // Confirme o caminho
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const firehoseDeliveryStreamName = configService.get<string>(
          'FIREHOSE_DELIVERY_STREAM_NAME',
        );
        const awsRegion = configService.get<string>('AWS_REGION');

        console.log(
          `[LogsModule] FIREHOSE_DELIVERY_STREAM_NAME: ${firehoseDeliveryStreamName}`,
        );
        console.log(`[LogsModule] AWS_REGION: ${awsRegion}`);

        if (
          process.env.NODE_ENV === 'production' &&
          firehoseDeliveryStreamName &&
          awsRegion
        ) {
          console.log(
            '[LogsModule] Configurando Pino para enviar logs para Amazon Kinesis Data Firehose.',
          );
          const firehoseStream = new FirehosePinoStream(
            firehoseDeliveryStreamName,
            awsRegion,
          );

          return {
            pinoHttp: {
              level: 'info',
              stream: firehoseStream,
              autoLogging: {
                ignore: (req) => {
                  return Boolean(
                    req.url &&
                      (req.url.includes('/health') ||
                        req.url.includes('/metrics')),
                  );
                },
              },
              genReqId: (req) =>
                req.headers['x-request-id'] ||
                Math.random().toString(36).substring(2, 15),
              timestamp: () => `,"time":"${new Date().toISOString()}"`,
            },
          };
        } else {
          console.log(
            '[LogsModule] Configurando Pino para pino-pretty (desenvolvimento ou Firehose não configurado).',
          );
          return {
            pinoHttp: {
              transport: {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              },
              level: 'debug',
              formatters: {
                level: (label: string): { level: string } => {
                  return { level: label.toUpperCase() };
                },
              },
              timestamp: false,
            },
          };
        }
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LogsModule {}
