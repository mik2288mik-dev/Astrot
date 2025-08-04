'use client';

import { useEffect, useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, Block, List, ListItem } from 'konsta/react';


export default function HomePage() {
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'md'>('ios');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setPlatform(tg.platform === 'ios' ? 'ios' : 'md');
      setColorScheme(tg.colorScheme === 'dark' ? 'dark' : 'light');
      const user = tg.initDataUnsafe?.user;
      if (user) {
        const displayName =
          user.username || [user.first_name, user.last_name].filter(Boolean).join(' ');
        setName(displayName);
        if (user.id !== undefined) setUserId(user.id);
      }
    }
  }, []);

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Astrot" />
          <Block strong>
            {name && <p>Привет, {name}!</p>}
            {userId && <p>ID: {userId}</p>}
          </Block>
          <List strong inset>
            <ListItem title="Настройки" component="a" href="/settings" />
          </List>
        </Page>
      </View>
    </Framework7App>
  );
}
