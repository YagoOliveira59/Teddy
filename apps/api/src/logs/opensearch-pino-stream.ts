import { Writable } from 'stream';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';

export class OpenSearchPinoStream extends Writable {
  private client: Client;
  private indexName: string;

  constructor(
    opensearchEndpoint: string, // Ex: https://seu-dominio-opensearch.us-east-1.es.amazonaws.com
    region: string, // Ex: us-east-1
    indexName: string = 'nestjs-api-logs',
  ) {
    super({ objectMode: true });

    this.indexName = indexName;

    this.client = new Client({
      node: opensearchEndpoint,
      ...AwsSigv4Signer({
        region,
        service: 'es',
        getCredentials: defaultProvider(),
      }),
      ssl: {},
    });

    this.client
      .info()
      .then(() => console.log('Conectado ao OpenSearch para logs.'))
      .catch((err) => console.error('Erro ao conectar ao OpenSearch:', err));
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

      this.client
        .index({
          index: this.indexName,
          body: logEntry,
        })
        .then(() => callback())
        .catch((error) => {
          console.error('Erro ao indexar log no OpenSearch:', error);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          callback(error);
        });
    } catch (error) {
      console.error('Erro ao processar log do Pino:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      callback(error);
    }
  }
}
