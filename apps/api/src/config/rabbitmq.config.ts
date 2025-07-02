import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  uri: process.env.RABBITMQ_URI,
  exchange: process.env.RABBITMQ_EXCHANGE,
  queue: process.env.RABBITMQ_QUEUE,
  routingKey: process.env.RABBITMQ_ROUTING_KEY,
}));
