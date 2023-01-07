import express from 'express';
import type { env } from '@/common/settings/env';

type Locals = {
  env: typeof env;
  renderBundle: (bundleName: string) => string;
};

declare module 'express-serve-static-core' {
  interface Express extends Application {
    locals: Locals;
    request: Request;
    response: Response;
  }
}