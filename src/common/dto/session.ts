import { z } from 'zod';
import { ErrorResponseSchema } from '@/common/dto/error';

export const SessionResponseSchema = ErrorResponseSchema.or(
  z.object({
    userId: z.string(),
    login: z.string(),
  }),
);
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
