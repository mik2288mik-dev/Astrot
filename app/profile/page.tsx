'use client';

import { useEffect, useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import { Page, Navbar, Block, List, ListItem, Button } from 'konsta/react';
import { useTelegramAuth } from '../../src/lib/telegram-auth';
import { useTelegramApi } from '../../src/lib/use-telegram-api';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { ErrorScreen } from '../../src/components/ErrorScreen';
import { User, Phone, Copy, ExternalLink, Send } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useTelegramAuth();
  const { 
    getMe, 
    sendData, 
    showAlert, 
    showConfirm, 
    requestContact, 
    readClipboard,
    isLoading: apiLoading,
    error: apiError,
    clearError 
  } = useTelegramApi();
  const [platform, setPlatform] = useState<'ios' | 'md'>('ios');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [clipboardText, setClipboardText] = useState<string>('');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setPlatform(tg.platform === 'ios' ? 'ios' : 'md');
      setColorScheme(tg.colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  // Если пользователь не авторизован, показываем экран загрузки
  if (!isAuthenticated || !user) {
    return <LoadingScreen />;
  }

  const handleSendData = async () => {
    const data = JSON.stringify({
      action: 'user_profile',
      user: user,
      timestamp: new Date().toISOString()
    });
    
    const success = await sendData(data);
    if (success) {
      showAlert('Данные отправлены в Telegram!');
    }
  };

  const handleRequestContact = async () => {
    const contact = await requestContact();
    if (contact) {
      showAlert(`Получен контакт: ${contact.first_name} ${contact.phone_number}`);
    }
  };

  const handleReadClipboard = async () => {
    const text = await readClipboard();
    if (text) {
      setClipboardText(text);
      showAlert(`Текст из буфера: ${text.substring(0, 50)}...`);
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm('Вы уверены, что хотите выйти?');
    if (confirmed) {
      logout();
    }
  };

  const getDisplayName = () => {
    if (user.username) {
      return `@${user.username}`;
    }
    return [user.first_name, user.last_name].filter(Boolean).join(' ');
  };

  const getFullName = () => {
    return [user.first_name, user.last_name].filter(Boolean).join(' ');
  };

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar title="Профиль" backLink />
          
          {/* Основная информация */}
          <Block strong className="text-center">
            <div className="flex flex-col items-center space-y-3">
              {/* Аватар */}
              <div className="relative">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                {user.is_premium && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                )}
              </div>

              {/* Имя пользователя */}
              <div>
                <h2 className="text-2xl font-bold">{getFullName()}</h2>
                {user.username && (
                  <p className="text-gray-600 text-sm">{getDisplayName()}</p>
                )}
              </div>

              {/* ID пользователя */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </Block>

          {/* Детальная информация */}
          <List strong inset>
            <ListItem
              title="Имя"
              after={user.first_name}
              media={<User className="w-5 h-5" />}
            />
            {user.last_name && (
              <ListItem
                title="Фамилия"
                after={user.last_name}
                media={<User className="w-5 h-5" />}
              />
            )}
            {user.username && (
              <ListItem
                title="Username"
                after={`@${user.username}`}
                media={<User className="w-5 h-5" />}
              />
            )}
            {user.language_code && (
              <ListItem
                title="Язык"
                after={user.language_code.toUpperCase()}
                media={<User className="w-5 h-5" />}
              />
            )}
            <ListItem
              title="Premium"
              after={user.is_premium ? 'Да' : 'Нет'}
              media={<span className="text-yellow-500">⭐</span>}
            />
            {user.photo_url && (
              <ListItem
                title="Фото профиля"
                after="Есть"
                media={<User className="w-5 h-5" />}
              />
            )}
          </List>

          {/* Действия */}
          <Block>
            <div className="space-y-3">
              <Button
                fill
                color="blue"
                onClick={handleSendData}
                disabled={apiLoading}
                className="flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Отправить данные в Telegram</span>
              </Button>

              <Button
                fill
                color="green"
                onClick={handleRequestContact}
                disabled={apiLoading}
                className="flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Запросить контакт</span>
              </Button>

              <Button
                fill
                color="purple"
                onClick={handleReadClipboard}
                disabled={apiLoading}
                className="flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Читать буфер обмена</span>
              </Button>

              <Button
                fill
                color="red"
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2"
              >
                <span>Выйти</span>
              </Button>
            </div>
          </Block>

          {/* Буфер обмена */}
          {clipboardText && (
            <Block strong>
              <h3 className="text-lg font-semibold mb-2">Буфер обмена:</h3>
              <p className="text-sm text-gray-600 break-all">{clipboardText}</p>
            </Block>
          )}

          {/* Ошибки API */}
          {apiError && (
            <Block strong color="red">
              <p className="text-red-600">{apiError}</p>
              <Button
                fill
                color="red"
                onClick={clearError}
                className="mt-2"
              >
                Закрыть
              </Button>
            </Block>
          )}
        </Page>
      </View>
    </Framework7App>
  );
}