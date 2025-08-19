import { z } from 'zod';

// Схема для валидации данных профиля
export const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Неверный формат времени').optional(),
  unknownTime: z.boolean(),
  location: z.object({
    name: z.string().min(1, 'Место рождения обязательно'),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    timezone: z.string(),
    tzOffset: z.number().min(-14).max(14)
  }).nullable(),
  houseSystem: z.enum(['P', 'W'])
}).refine((data) => {
  if (!data.unknownTime && !data.birthTime) {
    return false;
  }
  return true;
}, {
  message: 'Время рождения обязательно, если не отмечено "Не знаю время"',
  path: ['birthTime']
});

// Схема для API профиля
export const ProfileApiSchema = z.object({
  tgId: z.number(),
  name: z.string().min(1).max(100),
  preferredName: z.string().max(100).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  timeUnknown: z.boolean().default(false),
  location: z.object({
    name: z.string(),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    timezone: z.string(),
    tzOffset: z.number().min(-14).max(14)
  }),
  houseSystem: z.enum(['P', 'W']).default('P'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Типы для компонентов
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
export type Profile = z.infer<typeof ProfileApiSchema>;

// Интерфейс для результатов геокодинга
export interface PlaceResult {
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  cityLikeLabel: string;
  timezone: string;
  tzOffset: number;
}

// Интерфейс для информации о часовом поясе
export interface TimezoneInfo {
  timezone: string;
  tzOffset: number;
}

// Интерфейс для ответов API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Интерфейс для ответа геокодинга
export interface GeocodeResponse {
  places: PlaceResult[];
}

// Интерфейс для ответа профиля
export interface ProfileResponse {
  success: boolean;
  profile: Profile;
}