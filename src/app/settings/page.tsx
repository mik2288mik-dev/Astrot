'use client';

import { useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, List, ListItem, Toggle } from 'konsta/react';
import { useTelegramAuth } from '@/lib/telegram-auth';

export default function SettingsPage() {
  const { platform, colorScheme } = useTelegramAuth();
  const [scheme, setScheme] = useState<'light' | 'dark'>(colorScheme);

  return (
    <Framework7App theme={platform} className={scheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Настройки" />
          <List strong inset>
            <ListItem
              title="Тёмная тема"
              after={
                <Toggle
                  checked={scheme === 'dark'}
                  onChange={(e) => setScheme(e.target.checked ? 'dark' : 'light')}
                />
              }
            />
          </List>
        </Page>
      </View>
    </Framework7App>
  );
}
