import { z } from 'zod';
import type { LanguageCode } from '@/types/natal';

const messages = {
  ru: {
    name: 'Введите имя (1–100 символов)'.trim(),
    date: 'Введите дату рождения в формате YYYY-MM-DD',
    time: 'Введите время в формате HH:mm (24 часа)',
    placeOrCoords: 'Укажите место рождения или координаты',
    lat: 'Широта должна быть числом от -90 до 90',
    lon: 'Долгота должна быть числом от -180 до 180',
    tz: 'Часовой пояс должен быть валидным IANA идентификатором'
  },
  en: {
    name: 'Enter a name (1–100 chars)'.trim(),
    date: 'Enter birth date as YYYY-MM-DD',
    time: 'Enter time as HH:mm (24h)',
    placeOrCoords: 'Provide a birthplace or coordinates',
    lat: 'Latitude must be a number between -90 and 90',
    lon: 'Longitude must be a number between -180 and 180',
    tz: 'Timezone must be a valid IANA identifier'
  }
} as const satisfies Record<LanguageCode, Record<string, string>>;

export function getNatalSchema(lang: LanguageCode = 'ru') {
  const m = messages[lang] ?? messages.ru;
  return z
    .object({
      name: z.string().trim().min(1, m.name).max(100, m.name),
      birthDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/u, m.date),
      birthTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/u, m.time)
        .optional(),
      timeUnknown: z.boolean().optional(),
      place: z.string().trim().min(1).optional(),
      latitude: z
        .number({ invalid_type_error: m.lat })
        .min(-90, m.lat)
        .max(90, m.lat)
        .optional(),
      longitude: z
        .number({ invalid_type_error: m.lon })
        .min(-180, m.lon)
        .max(180, m.lon)
        .optional(),
      timezone: z.string().trim().optional(),
      language: z.enum(['ru', 'en']).optional(),
      idempotencyKey: z.string().optional()
    })
    .refine((v) => !!v.place || (typeof v.latitude === 'number' && typeof v.longitude === 'number'), {
      message: m.placeOrCoords,
      path: ['place']
    })
    .refine((v) => (v.timeUnknown ? true : !!v.birthTime), {
      message: m.time,
      path: ['birthTime']
    });
}