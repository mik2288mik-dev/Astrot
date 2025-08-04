'use client';

import { useEffect, useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, Block, List, ListItem } from 'konsta/react';
import { useTelegramAuth } from '../src/lib/telegram-auth';
import { UserProfile } from '../src/components/UserProfile';
import { LoadingScreen } from '../src/components/LoadingScreen';
import { ErrorScreen } from '../src/components/ErrorScreen';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, error, initTelegram, logout } = useTelegramAuth();
  const [platform, setPlatform] = useState<'ios' | 'md'>('ios');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setPlatform(tg.platform === 'ios' ? 'ios' : 'md');
      setColorScheme(tg.colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  // Показываем экран загрузки
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Показываем экран ошибки
  if (error) {
    return <ErrorScreen error={error} onRetry={initTelegram} />;
  }

  // Если пользователь не авторизован, показываем экран загрузки
  if (!isAuthenticated || !user) {
    return <LoadingScreen />;
  }

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Astrot" />
          <UserProfile user={user} onLogout={logout} />
          <List strong inset>
            <ListItem title="Настройки" component="a" href="/settings" />
            <ListItem title="Профиль" component="a" href="/profile" />
          </List>
        </Page>
      </View>
    </Framework7App>
  );
}
