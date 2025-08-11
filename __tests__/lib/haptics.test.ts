import { impactOccurred, notificationOccurred } from '@/lib/haptics';

describe('haptics', () => {
  test('does not throw when Telegram is unavailable', () => {
    // @ts-ignore
    global.window = {};
    expect(() => impactOccurred('light')).not.toThrow();
    expect(() => notificationOccurred('success')).not.toThrow();
  });
});