import path from 'path';
import express from 'express';
import helmet from 'helmet';

import { errorHandler } from '@/server/handlers/expressError';
import { clientCompiler } from '@/server/handlers/clientCompiler';
import { router as mainRouter } from '@/server/routes/router';
import { env } from '$env';

import '@/server/handlers/exit';
import { renderBundle } from './helpers/renderBundle';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Global locals
app.locals.env = env;
app.locals.renderBundle = renderBundle;
app.locals.title = 'Symulator cząsteczek';

// Library middlewares
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Own middlewares, routers
app.use('/', mainRouter);
app.use(clientCompiler());

// Main error handler for uncaught errors
app.use(errorHandler());

app.listen(env.PORT, () => {
  console.info(`Server is running at http://${env.HOST}:${env.PORT}`);
});

// For isolate modules
export {};
