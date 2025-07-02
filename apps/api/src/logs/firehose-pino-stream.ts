import { Writable } from 'stream';
import {
  FirehoseClient,
  PutRecordBatchCommand,
} from '@aws-sdk/client-firehose';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

export class FirehosePinoStream extends Writable {
  private firehoseClient: FirehoseClient;
  private deliveryStreamName: string;
  private buffer: string[] = [];
  private bufferTimer: NodeJS.Timeout | null = null;
  private readonly MAX_BATCH_SIZE = 500; // Limite de 500 registros por batch no Firehose
  private readonly MAX_BUFFER_TIME_MS = 1000; // Tempo máximo para enviar um batch (1 segundo)

  constructor(deliveryStreamName: string, awsRegion: string) {
    super({ objectMode: true });

    this.deliveryStreamName = deliveryStreamName;

    this.firehoseClient = new FirehoseClient({
      region: awsRegion,
      credentials: defaultProvider(), // Usará as credenciais IAM da instância/role
    });

    this.startBufferTimer();

    this.on('close', () => {
      void this.flushBuffer();
    });
  }

  private startBufferTimer() {
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
    }
    this.bufferTimer = setTimeout(() => {
      void this.flushBuffer();
    }, this.MAX_BUFFER_TIME_MS);
  }

  private async flushBuffer() {
    if (this.buffer.length === 0) {
      return;
    }

    const recordsToSend = [...this.buffer];
    this.buffer = [];

    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
      this.bufferTimer = null;
    }

    try {
      for (let i = 0; i < recordsToSend.length; i += this.MAX_BATCH_SIZE) {
        const batch = recordsToSend.slice(i, i + this.MAX_BATCH_SIZE);
        const command = new PutRecordBatchCommand({
          DeliveryStreamName: this.deliveryStreamName,
          Records: batch.map((logString) => ({
            Data: Buffer.from(logString + '\n'),
          })),
        });
        await this.firehoseClient.send(command);
        // console.log(`[FirehosePinoStream] ${batch.length} logs enviados para o Firehose.`);
      }
    } catch (error) {
      console.error(
        '[FirehosePinoStream] Erro ao enviar logs para o Firehose:',
        error,
      );
    } finally {
      this.startBufferTimer(); // Reinicia o timer
    }
  }

  _write(
    chunk: Record<string, unknown>,
    encoding: string,
    callback: (error?: Error | null) => void,
  ) {
    try {
      const logEntry = {
        '@timestamp': new Date().toISOString(),
        ...chunk,
      };

      this.buffer.push(JSON.stringify(logEntry));

      if (this.buffer.length >= this.MAX_BATCH_SIZE) {
        void this.flushBuffer();
      } else {
        if (!this.bufferTimer) {
          this.startBufferTimer();
        }
      }
      callback();
    } catch (error) {
      console.error(
        '[FirehosePinoStream] Erro ao processar log do Pino:',
        error,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      callback(error);
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    this.flushBuffer()
      .then(() => callback())
      .catch(callback);
  }
}
