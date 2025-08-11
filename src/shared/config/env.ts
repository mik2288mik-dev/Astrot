import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional().refine((v) => !v || v.startsWith('sk-'), 'Invalid OpenAI API key'),
  AZTRO_API_URL: z.string().url().optional(),
  AZTRO_API_KEY: z.string().optional(),
  TELEGRAM_BOT_NAME: z.string().optional(),
  MAPBOX_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${message}`);
  }
  return parsed.data;
}