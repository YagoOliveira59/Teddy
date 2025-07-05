import { Writable } from 'stream';
import { PinoLogger } from 'nestjs-pino';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';

export class OpenSearchPinoStream extends Writable {
  private client: Client;
  private indexName: string;

  constructor(
    opensearchEndpoint: string, // https://seu-dominio-opensearch.us-east-1.es.amazonaws.com
    region: string, // us-east-1
    indexName: string = 'nestjs-api-logs',
    private readonly logger: PinoLogger,
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
      .then(() => this.logger.info('Connected to OpenSearch'))
      .catch((err) =>
        this.logger.error(`Error connecting to OpenSearch: ${err}`),
      );
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
          this.logger.error(
            {
              err: error instanceof Error ? error : { message: String(error) },
            },
            'Error indexing log in OpenSearch',
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          callback(error);
        });
    } catch (error) {
      this.logger.error(
        {
          err: error instanceof Error ? error : { message: String(error) },
        },
        'Error processing Pino log',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      callback(error);
    }
  }
}
