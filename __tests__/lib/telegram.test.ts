import { getTelegramWebApp, initTelegram } from '@/lib/telegram';

describe('telegram', () => {
  test('getTelegramWebApp returns null without window.Telegram', () => {
    // Ensure no window
    // @ts-ignore
    global.window = undefined;
    expect(getTelegramWebApp()).toBeNull();
  });

  test('initTelegram does not throw without SDK', () => {
    // @ts-ignore
    global.window = {};
    expect(() => initTelegram()).not.toThrow();
  });
});