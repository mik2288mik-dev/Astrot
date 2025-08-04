'use client';

import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, Block, List, ListItem } from 'konsta/react';
import { useTelegramAuth } from '@/lib/telegram-auth';

export default function MainPage() {
  const { user, platform, colorScheme } = useTelegramAuth();

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Главная" />
          <Block strong>
            {user ? (
              <List>
                <ListItem title="ID" after={user.id} />
                <ListItem title="Имя" after={user.first_name} />
                {user.username && (
                  <ListItem title="Username" after={`@${user.username}`} />
                )}
              </List>
            ) : (
              <p>Данные пользователя недоступны</p>
            )}
          </Block>
        </Page>
      </View>
    </Framework7App>
  );
}
