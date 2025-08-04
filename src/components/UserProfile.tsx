'use client';

import React from 'react';
import Image from 'next/image';
import { UserIcon, CrownIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTelegramAuth, TelegramUser } from '@/lib/telegram-auth';

interface UserProfileProps {
  user?: TelegramUser | null;
  showDetails?: boolean;
  className?: string;
}

export function UserProfile({ user, showDetails = true, className = '' }: UserProfileProps) {
  const { user: authUser } = useTelegramAuth();
  const displayUser = user || authUser;

  if (!displayUser) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <UserIcon className="h-12 w-12 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Не авторизован</p>
        </div>
      </div>
    );
  }

  const displayName = [
    displayUser.first_name,
    displayUser.last_name
  ].filter(Boolean).join(' ') || displayUser.username || 'Пользователь';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Аватар */}
      <div className="relative">
        {displayUser.photo_url ? (
          <Image
            src={displayUser.photo_url}
            alt={displayName}
            width={48}
            height={48}
            className="rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {displayUser.first_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        
        {/* Индикатор Premium */}
        {displayUser.is_premium && (
          <div className="absolute -top-1 -right-1">
            <CrownIcon className="h-5 w-5 text-yellow-500" />
          </div>
        )}
      </div>

      {/* Информация о пользователе */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          {displayUser.is_premium && (
            <CrownIcon className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        
        {showDetails && (
          <div className="space-y-1">
            {displayUser.username && (
              <p className="text-sm text-gray-600">
                @{displayUser.username}
              </p>
            )}
            <p className="text-xs text-gray-500">
              ID: {displayUser.id}
            </p>
            {displayUser.language_code && (
              <p className="text-xs text-gray-500">
                Язык: {displayUser.language_code.toUpperCase()}
              </p>
            )}
            {displayUser.allows_write_to_pm && (
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">Можно писать в ЛС</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function UserProfileCard() {
  const { user, isAuthorized, isLoading, error } = useTelegramAuth();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!isAuthorized || !user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700 text-sm">
          Для использования приложения необходимо авторизоваться в Telegram
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <UserProfile user={user} showDetails={true} />
    </div>
  );
}