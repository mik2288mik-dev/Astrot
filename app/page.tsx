'use client';

import { useEffect } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, Block, List, ListItem, Button } from 'konsta/react';
import { UserProfileCard } from '@/components/UserProfile';
import { useTelegramAuth } from '@/lib/telegram-auth';
import { useTelegram } from '@/lib/use-telegram';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Settings, User } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthorized, isLoading, error, platform, colorScheme } = useTelegramAuth();
  const { showMainButton, hideMainButton, hapticFeedback, getUserDisplayName } = useTelegram();

  useEffect(() => {
    if (isAuthorized && user) {
      // Показываем главную кнопку при авторизации
      showMainButton('Начать астрологический анализ', () => {
        hapticFeedback('medium');
        // Здесь можно добавить логику для начала анализа
        console.log('Начинаем астрологический анализ для пользователя:', user.id);
      });
    } else {
      hideMainButton();
    }

    return () => {
      hideMainButton();
    };
  }, [isAuthorized, user, showMainButton, hideMainButton, hapticFeedback]);

  const handleItemClick = (action: string) => {
    hapticFeedback('light');
    console.log(`Выполняется действие: ${action}`);
  };

  if (isLoading) {
    return (
      <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
        <View main>
          <Page>
            <Navbar title="AstroT" />
            <Block strong className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </Block>
          </Page>
        </View>
      </Framework7App>
    );
  }

  if (error) {
    return (
      <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
        <View main>
          <Page>
            <Navbar title="AstroT" />
            <Block strong>
              <div className="text-center p-4">
                <div className="text-red-500 mb-4">
                  <User className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ошибка авторизации</h3>
                <p className="text-gray-600">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Попробовать снова
                </Button>
              </div>
            </Block>
          </Page>
        </View>
      </Framework7App>
    );
  }

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="AstroT" />
          
          {/* Профиль пользователя */}
          <Block strong>
            <UserProfileCard />
          </Block>

          {/* Приветствие */}
          {isAuthorized && user && (
            <Block strong>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4">
                  <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  Добро пожаловать, {getUserDisplayName()}! 🌟
                </h2>
                <p className="text-gray-600">
                  Откройте тайны звезд и узнайте больше о себе
                </p>
              </motion.div>
            </Block>
          )}

          {/* Основное меню */}
          <List strong inset>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ListItem 
                title="Натальная карта" 
                component="a" 
                href="/natal"
                onClick={() => handleItemClick('natal')}
                media={<Star className="h-6 w-6 text-purple-500" />}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ListItem 
                title="Гороскоп дня" 
                component="a" 
                href="/horoscope"
                onClick={() => handleItemClick('horoscope')}
                media={<Sun className="h-6 w-6 text-yellow-500" />}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ListItem 
                title="Лунный календарь" 
                component="a" 
                href="/lunar"
                onClick={() => handleItemClick('lunar')}
                media={<Moon className="h-6 w-6 text-blue-500" />}
              />
            </motion.div>
          </List>

          {/* Дополнительные опции */}
          <List strong inset>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ListItem 
                title="Настройки профиля" 
                component="a" 
                href="/settings"
                onClick={() => handleItemClick('settings')}
                media={<Settings className="h-6 w-6 text-gray-500" />}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ListItem 
                title="Telegram данные" 
                component="a" 
                href="/telegram"
                onClick={() => handleItemClick('telegram')}
                media={<User className="h-6 w-6 text-blue-400" />}
              />
            </motion.div>
          </List>
        </Page>
      </View>
    </Framework7App>
  );
}
