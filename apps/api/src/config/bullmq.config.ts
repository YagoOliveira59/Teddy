import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => ({
  redis: {
    host: process.env.BULL_REDIS_HOST,
    port: parseInt(process.env.BULL_REDIS_PORT ?? '6379', 10),
    username: process.env.BULL_REDIS_USERNAME,
    password: process.env.BULL_REDIS_PASSWORD,
  },
}));
