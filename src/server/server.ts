import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

import { errorHandler } from '@/server/handlers/expressError';
import { clientCompiler } from '@/server/handlers/clientCompiler';
import { router as mainRouter } from '@/server/routes/router';
import { env } from '$env';

import '@/server/handlers/exit';
import { renderBundle } from './helpers/renderBundle';
import { sessionMiddleware } from '@/server/middleware/sessionMiddleware';
import { serverSession } from '@/server/middleware/serverSession';

const app = express();
const prisma = new PrismaClient();
app.prisma = prisma;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Global locals
app.locals.env = env;
app.locals.renderBundle = renderBundle;
app.locals.title = 'Symulator cząsteczek';

// Library middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Own middlewares, routers
app.use(clientCompiler());
app.use(sessionMiddleware);
app.use(serverSession);
app.use('/', mainRouter);

// Main error handler for uncaught errors
app.use(errorHandler());

app.listen(env.PORT, () => {
  console.info(`Server is running at http://${env.HOST}:${env.PORT}`);
});

// For isolate modules
export {};
