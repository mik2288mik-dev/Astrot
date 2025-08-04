'use client';

import React from 'react';
import { Block, List, ListItem, Avatar, Button } from 'konsta/react';
import { useTelegramAuth, TelegramUser } from '../lib/telegram-auth';
import { User, LogOut, Crown, Globe, Camera } from 'lucide-react';

interface UserProfileProps {
  user: TelegramUser;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
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
    <div className="space-y-4">
      {/* Основная информация пользователя */}
      <Block strong className="text-center">
        <div className="flex flex-col items-center space-y-3">
          {/* Аватар */}
          <div className="relative">
            {user.photo_url ? (
              <Avatar
                src={user.photo_url}
                size="w-20 h-20"
                className="rounded-full border-4 border-blue-500"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            {user.is_premium && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Имя пользователя */}
          <div>
            <h2 className="text-xl font-bold">{getFullName()}</h2>
            {user.username && (
              <p className="text-gray-600 text-sm">{getDisplayName()}</p>
            )}
          </div>

          {/* ID пользователя */}
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
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
            media={<Globe className="w-5 h-5" />}
          />
        )}
        {user.language_code && (
          <ListItem
            title="Язык"
            after={user.language_code.toUpperCase()}
            media={<Globe className="w-5 h-5" />}
          />
        )}
        <ListItem
          title="Premium"
          after={user.is_premium ? 'Да' : 'Нет'}
          media={<Crown className="w-5 h-5" />}
        />
        {user.photo_url && (
          <ListItem
            title="Фото профиля"
            after="Есть"
            media={<Camera className="w-5 h-5" />}
          />
        )}
      </List>

      {/* Кнопка выхода */}
      <Block>
        <Button
          fill
          color="red"
          onClick={onLogout}
          className="flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </Button>
      </Block>
    </div>
  );
};