export interface Job<T> {
  name: string;
  data: T;
  queue?: string;
}

export interface IMessageQueueService {
  add<T>(job: Job<T>): Promise<void>;
}

export const IMessageQueueServiceProvider = 'IMessageQueueService';
