import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

import { SendWelcomeEmailUseCase } from '../use-cases/send-welcome-email/send-welcome-email.use-case';

export interface ISendWelcomeEmailJob {
  email: string;
  name: string;
}

@Injectable()
@Processor('client-tasks')
export class ClientProcessor extends WorkerHost {
  constructor(
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
    private readonly logger: PinoLogger,
    @InjectMetric('bullmq_jobs_completed_total')
    private jobsCompletedCounter: Counter<string>,
    @InjectMetric('bullmq_jobs_failed_total')
    private jobsFailedCounter: Counter<string>,
    @InjectMetric('bullmq_job_duration_seconds')
    private jobDurationHistogram: Histogram<string>,
  ) {
    super();
    this.logger.setContext(ClientProcessor.name);
  }

  async process(job: Job<ISendWelcomeEmailJob, any, string>): Promise<any> {
    const endTimer = this.jobDurationHistogram.startTimer({
      queue: job.queueName,
      job_name: job.name,
    });

    try {
      this.logger.info(`Iniciando processamento do job '${job.name}'`);
      await this.sendWelcomeEmailUseCase.execute({
        email: job.data.email,
        name: job.data.name,
      });
      endTimer();
      this.logger.info(`Job '${job.name}' finalizado com sucesso.`);
    } catch (error: unknown) {
      endTimer();

      if (error instanceof Error) {
        this.logger.error(
          { err: error },
          `Falha ao processar job '${job.name}'`,
        );
      } else {
        this.logger.error(
          { errorData: JSON.stringify(error) },
          `Falha desconhecida ao processar job '${job.name}'`,
        );
      }

      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.jobsCompletedCounter.inc({ queue: job.queueName, job_name: job.name });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.jobsFailedCounter.inc({ queue: job.queueName, job_name: job.name });
  }
}
