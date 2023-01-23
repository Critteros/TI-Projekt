import { typeToFlattenedError, z } from 'zod';

import { Settings } from '@prisma/client';
import { ErrorResponseSchema } from '@/common/dto/error';

const SettingsSchema = z.object({
  particleNumber: z.number(),
  particleSize: z.number(),
  connectionDistance: z.number(),
  lineThickness: z.number(),
} satisfies Record<keyof Omit<Settings, 'id' | 'userId'>, unknown>);

export const SettingsGetResponseSchema = z
  .object({
    found: z.literal(true),
    settings: SettingsSchema,
  })
  .or(
    z.object({
      found: z.literal(false),
    }),
  );
export type SettingsGetResponse = z.infer<typeof SettingsGetResponseSchema>;

export const SettingsUpdateRequestSchema = SettingsSchema;
export type SettingsUpdateRequest = z.infer<typeof SettingsUpdateRequestSchema>;

export const SettingsUpdateResponseSchema = ErrorResponseSchema.or(
  z.object({
    message: z.literal('succeed'),
  }),
);
export type SettingsUpdateResponse = z.infer<typeof SettingsUpdateResponseSchema>;
