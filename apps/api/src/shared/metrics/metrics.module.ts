import { Module, Global } from '@nestjs/common';
import {
  makeCounterProvider,
  makeHistogramProvider,
  getToken as getMetricToken,
} from '@willsoto/nestjs-prometheus';

import { MetricsController } from './metics.controller';

@Global()
@Module({
  providers: [
    makeCounterProvider({
      name: 'bullmq_jobs_added_total',
      help: 'Total de jobs adicionados à fila',
      labelNames: ['queue', 'job_name'],
    }),
    makeCounterProvider({
      name: 'bullmq_jobs_completed_total',
      help: 'Total de jobs completados com sucesso',
      labelNames: ['queue', 'job_name'],
    }),
    makeCounterProvider({
      name: 'bullmq_jobs_failed_total',
      help: 'Total de jobs que falharam',
      labelNames: ['queue', 'job_name'],
    }),
    makeHistogramProvider({
      name: 'bullmq_job_duration_seconds',
      help: 'Duração dos jobs da fila em segundos',
      labelNames: ['queue', 'job_name'],
    }),
  ],
  controllers: [MetricsController],
  exports: [
    getMetricToken('bullmq_jobs_added_total'),
    getMetricToken('bullmq_jobs_completed_total'),
    getMetricToken('bullmq_jobs_failed_total'),
    getMetricToken('bullmq_job_duration_seconds'),
  ],
})
export class MetricsModule {}
