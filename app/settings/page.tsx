'use client';

import { useEffect, useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, List, ListItem } from 'konsta/react';

interface TelegramWebApp {
  ready: () => void;
  platform: string;
  colorScheme?: string;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export default function SettingsPage() {
  const [platform, setPlatform] = useState<string>('unknown');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setPlatform(tg.platform);
      setColorScheme(tg.colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  return (
    <Framework7App theme={platform === 'ios' ? 'ios' : 'md'} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Настройки" />
          <List strong inset>
            <ListItem title="Платформа" after={platform} />
            <ListItem title="Тема" after={colorScheme} />
          </List>
        </Page>
      </View>
    </Framework7App>
  );
}
