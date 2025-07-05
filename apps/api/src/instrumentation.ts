import * as dotenv from 'dotenv';
dotenv.config();

import { PinoLogger } from 'nestjs-pino';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const logger = new PinoLogger({ pinoHttp: {} });

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
logger.info(
  `[Instrumentation] OpenTelemetry (TRACES ONLY) initialized for service: ${process.env.OTEL_SERVICE_NAME || '(name not defined in .env)'}`,
);

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() =>
      logger.info('[Instrumentation] Tracing terminated successfully.'),
    )
    .catch((error) =>
      logger.error(
        { err: error instanceof Error ? error : { message: String(error) } },
        '[Instrumentation] Error during tracing shutdown.',
      ),
    )
    .finally(() => process.exit(0));
});
