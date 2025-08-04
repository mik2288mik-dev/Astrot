'use client';

import React from 'react';
import { useTelegramAuth } from '@/lib/telegram-auth';
import { useTelegram } from '@/lib/use-telegram';
import { 
  UserIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  GlobeAltIcon,
  IdentificationIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export function UserDetails() {
  const { user, isAuthorized, isLoading } = useTelegramAuth();
  const { webApp, platform, colorScheme } = useTelegram();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !user) {
    return (
      <div className="text-center p-4">
        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Пользователь не авторизован</p>
      </div>
    );
  }

  const userInfo = [
    {
      label: 'ID пользователя',
      value: user.id.toString(),
      icon: IdentificationIcon,
      color: 'text-blue-500',
    },
    {
      label: 'Имя',
      value: user.first_name,
      icon: UserIcon,
      color: 'text-green-500',
    },
    ...(user.last_name ? [{
      label: 'Фамилия',
      value: user.last_name,
      icon: UserIcon,
      color: 'text-green-500',
    }] : []),
    ...(user.username ? [{
      label: 'Username',
      value: `@${user.username}`,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-purple-500',
    }] : []),
    ...(user.language_code ? [{
      label: 'Язык',
      value: user.language_code.toUpperCase(),
      icon: GlobeAltIcon,
      color: 'text-orange-500',
    }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Основная информация */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-gray-600" />
          Основная информация
        </h3>
        <div className="space-y-3">
          {userInfo.map((info, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <info.icon className={`h-4 w-4 mr-2 ${info.color}`} />
                <span className="text-sm text-gray-600">{info.label}:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Статусы */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold mb-4">Статусы</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Premium статус:</span>
            <div className="flex items-center">
              {user.is_premium ? (
                <>
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-yellow-600">Premium</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-500">Обычный</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Доступ к меню вложений:</span>
            <div className="flex items-center">
              {user.added_to_attachment_menu ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">Доступен</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-500">Недоступен</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Разрешение на ЛС:</span>
            <div className="flex items-center">
              {user.allows_write_to_pm ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">Разрешено</span>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-500">Запрещено</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Информация о приложении */}
      {webApp && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">Информация о приложении</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Платформа:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{platform}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Тема:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{colorScheme}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Версия WebApp:</span>
              <span className="text-sm font-medium text-gray-900">{webApp.version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Развернуто:</span>
              <span className="text-sm font-medium text-gray-900">
                {webApp.isExpanded ? 'Да' : 'Нет'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Размер экрана:</span>
              <span className="text-sm font-medium text-gray-900">
                {webApp.viewportWidth} × {webApp.viewportHeight}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}