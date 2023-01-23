import { z } from 'zod';
import { ErrorResponseSchema } from '@/common/dto/error';

export const SessionSchema = z.object({
  userId: z.string(),
  login: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

export const SessionResponseSchema = ErrorResponseSchema.or(SessionSchema);
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
