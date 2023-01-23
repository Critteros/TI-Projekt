import type { Session } from '@/common/dto/session';

declare module '*.css';

declare global {
  interface Window {
    session: Session | null;
  }
}
