import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  sync: process.env.DATABASE_SYNC || true,
}));
