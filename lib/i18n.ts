import type { LanguageCode } from '@/types/natal';

const dict = {
  ru: {
    invalid: 'Неверные данные. Исправьте ошибки и попробуйте снова.',
    geocode_failed: 'Не удалось определить место рождения',
    tz_failed: 'Не удалось определить часовой пояс, используется значение по умолчанию',
    rate_limited: 'Слишком много запросов. Попробуйте позже.',
    duplicate: 'Запрос уже обрабатывается, подождите...'
  },
  en: {
    invalid: 'Invalid input. Please fix errors and try again.',
    geocode_failed: 'Failed to resolve birthplace',
    tz_failed: 'Failed to detect timezone, using default',
    rate_limited: 'Too many requests. Please try again later.',
    duplicate: 'Request is already in progress, please wait...'
  }
} as const satisfies Record<LanguageCode, Record<string, string>>;

export function t(lang: LanguageCode | undefined, key: keyof typeof dict['ru']): string {
  return dict[lang || 'ru'][key];
}