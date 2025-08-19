'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { useRouter } from 'next/navigation';
import { BellIcon, ShieldCheckIcon, QuestionMarkCircleIcon, StarIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string;
  action?: () => void;
  color?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { fullName, username, photoUrl, userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const [profile, setProfile] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [preferredName, setPreferredName] = useState('');

  // Загружаем профиль пользователя
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`/api/profile?tgId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setPreferredName(data.profile?.preferredName || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const savePreferredName = async () => {
    if (!userId) return;
    
    try {
      const method = profile ? 'PUT' : 'POST';
      const res = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          tgId: userId,
          name: fullName || 'Пользователь',
          preferredName: preferredName.trim() || undefined,
          // Если профиля нет, создаем минимальные данные
          ...(!profile && {
            birthDate: '2000-01-01',
            location: {
              name: 'Москва',
              lat: 55.7558,
              lon: 37.6176,
              timezone: 'Europe/Moscow',
              tzOffset: 3
            }
          })
        })
      });

      if (res.ok) {
        await loadProfile();
        setIsEditingName(false);
        hapticFeedback('notification', 'success');
      }
    } catch (error) {
      console.error('Error saving preferred name:', error);
      hapticFeedback('notification', 'error');
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: UserIcon,
      label: 'Имя для обращений',
      value: preferredName || 'Не указано',
      action: () => setIsEditingName(true),
    },
    {
      icon: BellIcon,
      label: 'Уведомления',
      action: () => router.push('/profile/notifications'),
    },
    {
      icon: ShieldCheckIcon,
      label: 'Конфиденциальность',
      action: () => router.push('/profile/privacy'),
    },
    {
      icon: QuestionMarkCircleIcon,
      label: 'Помощь и поддержка',
      action: () => router.push('/profile/help'),
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    hapticFeedback('impact', 'light');
    if (item.action) {
      item.action();
    }
  };

  return (
    <div className="page animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col" style={{ ['--page-top' as any]: 'calc(var(--safe-top) + 32px)' }}>
      {/* Профиль пользователя */}
      <section className="mb-6">
        <div className="bg-gradient-to-br from-pastel-purple via-pastel-pink to-pastel-peach p-6 rounded-2xl shadow-card">
          <div className="flex items-center gap-4 mb-4">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={fullName}
                width={80}
                height={80}
                unoptimized
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center border-4 border-white shadow-lg">
                <UserIcon className="w-10 h-10 text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-neutral-900">{fullName}</h1>
              {username && (
                <p className="text-sm text-neutral-700">@{username}</p>
              )}
              <p className="text-xs text-neutral-600 mt-1">ID: {userId || 'Гость'}</p>
            </div>
          </div>

          {/* Премиум статус */}
          <div className="bg-white/60 backdrop-blur p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Премиум</p>
                  <p className="text-xs text-neutral-600">Активировать</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  hapticFeedback('impact', 'medium');
                  router.push('/premium');
                }}
                className="text-primary-600 font-medium text-sm px-3 py-1.5 bg-white rounded-lg"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Меню */}
      <section className="mb-20">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${
                    item.color ? 'bg-red-50' : 'bg-neutral-50'
                  } flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color || 'text-neutral-600'}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    item.color ? item.color : 'text-neutral-800'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {item.value && (
                  <span className="text-sm text-neutral-500">{item.value}</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Модальное окно редактирования имени */}
      {isEditingName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Имя для обращений</h3>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              placeholder="Как к вам обращаться?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-primary-400"
              maxLength={100}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditingName(false)}
                className="flex-1 py-3 px-4 bg-gray-100 rounded-xl text-gray-700 font-medium"
              >
                Отмена
              </button>
              <button
                onClick={savePreferredName}
                className="flex-1 py-3 px-4 bg-primary-500 rounded-xl text-white font-medium"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Версия приложения */}
      <section className="text-center pb-24">
        <p className="text-xs text-neutral-400">
          DeepSoul v1.0.0
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Made with ❤️ for Telegram
        </p>
      </section>
    </div>
  );
}