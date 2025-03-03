import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly, url } from 'envalid';
import fs from 'fs';
import path from 'path';

const nodeEnvironment = process.env.NODE_ENV || 'development';

const envPath = nodeEnvironment !== 'production' ? path.resolve(process.cwd(), `.env.${nodeEnvironment}`) : null;

if (envPath && fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  if (nodeEnvironment !== 'production') {
    console.error(`Environment file .env.${process.env.NODE_ENV} not found`);
  }
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'production.local', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:5173;http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  POSTGRES_URL: url({ devDefault: testOnly('postgres://postgres:password@localhost:5432/your_db_name') }),
  JWT_SECRET_KEY: str({ devDefault: testOnly('mySecret') }),
  JWT_EXPIRES_IN: str({ devDefault: testOnly('1d') }),
  BCRYPT_SALT_ROUNDS: num({ devDefault: testOnly(10) }),
  SESSION_SECRET: str({ devDefault: testOnly('mySecret') }),

  FRONTEND_URL: url({ devDefault: testOnly('http://localhost:5173') }),

  // REDIS
  REDIS_HOST: str({ devDefault: testOnly('redis') }),
  REDIS_PORT: num({ devDefault: testOnly(6379) }),

  // OPENAI
  OPENAI_API_KEY: str({ devDefault: testOnly(''), desc: 'OpenAI API key' }),

  // TWITTER
  TWITTER_CLIENT_ID: str({ devDefault: testOnly(''), desc: 'Twitter client id' }),
  TWITTER_CLIENT_SECRET: str({ devDefault: testOnly(''), desc: 'Twitter client secret' }),
  TWITTER_API_SECRET: str({ devDefault: testOnly(''), desc: 'Twitter api secret' }),
  TWITTER_API_KEY: str({ devDefault: testOnly(''), desc: 'Twitter api key' }),
  TWITTER_REDIRECT_URI: str({ devDefault: testOnly(''), desc: 'Twitter redirect uri' }),

  // SPORTRADER
  SPORTRADER_API_KEY: str({ devDefault: testOnly(''), desc: 'Sportrader API key' }),
});
