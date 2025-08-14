import { getTelegramWebApp, initTelegram } from '@/lib/telegram';

describe('telegram', () => {
  test('getTelegramWebApp returns null without window.Telegram', () => {
    expect(getTelegramWebApp()).toBeNull();
  });

  test('initTelegram does not throw without SDK', () => {
    expect(() => initTelegram()).not.toThrow();
  });

  test('initTelegram requests fullscreen when option is set', () => {
    const requestFullscreen = jest.fn();
    const ready = jest.fn();
    // @ts-ignore
    window.Telegram = { WebApp: { requestFullscreen, ready } };
    initTelegram({ requestFullscreen: true });
    expect(requestFullscreen).toHaveBeenCalled();
    // @ts-ignore
    delete window.Telegram;
  });

  test('initTelegram enables closing confirmation when option is set', () => {
    const enableClosingConfirmation = jest.fn();
    const ready = jest.fn();
    // @ts-ignore
    window.Telegram = { WebApp: { enableClosingConfirmation, ready } };
    initTelegram({ enableClosingConfirmation: true });
    expect(enableClosingConfirmation).toHaveBeenCalled();
    // @ts-ignore
    delete window.Telegram;
  });
});