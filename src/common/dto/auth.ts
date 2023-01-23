import { z } from 'zod';

export const SignupSchema = z.object({
  login: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});
export type Signup = z.infer<typeof SignupSchema>;

export const SignupResponseSchema = z.union([
  z.object({
    message: z.literal('success'),
  }),
  z.object({
    error: z.string().min(1),
    fields: z.record(SignupSchema.keyof(), z.array(z.string())).optional(),
  }),
]);
export type SignupResponse = z.infer<typeof SignupResponseSchema>;

export const LogoutResponseSchema = z.object({
  message: z.literal('success'),
});
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

export const TokenResponseSchema = z.union([
  z.object({
    message: z.literal('success'),
    token: z.string(),
  }),
  z.object({
    error: z.string().min(1),
  }),
]);
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
