// import database
import '@/utils/db';
import '@/utils/redis';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'path';
import { pino } from 'pino';

import { env } from '@/config/env';
import errorHandler from '@/middleware/errorHandler';
import rateLimiter from '@/middleware/rateLimiter';
import requestLogger from '@/middleware/requestLogger';

import router from './routes/routes';

const logger = pino({ name: 'server start' });
const app: Express = express();

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors({ origin: env.CORS_ORIGIN?.split(';'), credentials: true }));

app.use(helmet());

app.use(rateLimiter);

// Routes
app.use('/api', router);

// Request logging
app.use(requestLogger);

// static file
app.use('/public', express.static(path.join(__dirname, 'public')));

// Error handlers
app.use(errorHandler());

export { app, logger };
