import { z } from 'zod';

export const computeInputSchema = z.object({
  year: z.number().int().min(1).max(9999),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  second: z.number().int().min(0).max(59).optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  tz: z.string().trim().optional(),
  houseSystem: z.enum(['P','K','W','R','C','B','M','H']).optional()
});

export const horoscopeSchema = z.object({
  sign: z.enum(['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']),
  day: z.enum(['today','tomorrow','yesterday']).optional()
});

export const explainSchema = z.object({
  summaryText: z.string().min(3),
  dailyText: z.string().optional(),
  locale: z.enum(['ru','en']).default('ru')
});

export const verifySubscriptionSchema = z.object({
  userId: z.string().min(1)
});