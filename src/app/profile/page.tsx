'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { useRouter } from 'next/navigation';
import { BellIcon, ShieldCheckIcon, QuestionMarkCircleIcon, StarIcon, UserIcon, PencilIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

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
      icon: Cog6ToothIcon,
      label: 'Данные для расчётов',
      value: profile ? 'Заполнено' : 'Не заполнено',
      action: () => router.push('/profile/form'),
    },
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
      label: 'Помощь',
      action: () => router.push('/profile/help'),
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    hapticFeedback('impact', 'light');
    if (item.action) {
      item.action();
    }
  };

  const displayName = preferredName || fullName || 'Пользователь';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] via-[#FFE5ED] to-[#FFE0EC] pb-28">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="font-semibold text-[32px] text-[#2C2C2C]">Профиль</h1>
        </div>

        {/* Карточка профиля */}
        <div className="rounded-[24px] bg-white shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FDCBFF] to-[#B3CFFF] flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-semibold text-[20px] text-[#2C2C2C]">{displayName}</h2>
              {username && (
                <p className="text-[14px] text-[#666666]">@{username}</p>
              )}
            </div>
          </div>
        </div>

        {/* Меню настроек */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="w-full rounded-[24px] bg-white shadow-md p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-[12px] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#666666]" />
                  </div>
                  <span className="font-medium text-[16px] text-[#2C2C2C]">{item.label}</span>
                </div>
                {item.value && (
                  <span className="text-[14px] text-[#999999]">{item.value}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Премиум блок */}
        <div className="mt-8 rounded-[24px] bg-gradient-to-br from-purple-50 to-pink-50 shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FDCBFF] to-[#B3CFFF] rounded-[16px] flex items-center justify-center shadow-md">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[18px] text-[#2C2C2C]">
                Премиум подписка
              </h3>
              <p className="text-[14px] text-[#666666] leading-tight">
                Расширенные возможности
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              hapticFeedback('impact', 'medium');
              router.push('/premium');
            }}
            className="w-full bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] py-3 font-semibold text-[14px] shadow-md hover:shadow-lg transition-all duration-300"
          >
            Узнать больше
          </button>
        </div>

        {/* Модальное окно редактирования имени */}
        {isEditingName && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-xl">
              <h3 className="font-semibold text-[20px] text-[#2C2C2C] mb-4">
                Имя для обращений
              </h3>
              <p className="text-[14px] text-[#666666] mb-4">
                Как вы хотите, чтобы приложение к вам обращалось?
              </p>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Введите имя"
                className="w-full px-4 py-3 border border-gray-200 rounded-[16px] text-[16px] text-[#2C2C2C] placeholder-gray-400 focus:outline-none focus:border-[#B3CFFF] mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditingName(false);
                    setPreferredName(profile?.preferredName || '');
                  }}
                  className="flex-1 bg-white border border-gray-200 text-[#2C2C2C] rounded-[16px] py-3 font-semibold text-[14px] shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Отмена
                </button>
                <button
                  onClick={savePreferredName}
                  className="flex-1 bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] text-white rounded-[16px] py-3 font-semibold text-[14px] shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}