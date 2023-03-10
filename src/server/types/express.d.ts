import type { env } from '@/common/settings/env';
import type { PrismaClient, User } from '@prisma/client';
import type { Session } from '@/common/dto/session';

type Locals = {
  env: typeof env;
  renderBundle: (bundleName: string) => string;
  title: string;
};

declare module 'express-serve-static-core' {
  interface Express extends Application {
    locals: Locals;
    request: Request & RequestExtra;
    response: Response;
  }
  interface Application {
    prisma: PrismaClient;
  }

  interface Request {
    userId?: string;
    session: User | null;
  }

  interface Response {
    locals: {
      session: Session | null;
    };
  }
}
