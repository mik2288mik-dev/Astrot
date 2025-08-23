'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/profile/ProfileForm';
import { useTelegramUser, useTelegram } from '@/hooks/useTelegram';
import { ProfileFormData, ProfileResponse } from '@/types/profile';
import { useSearchParams } from 'next/navigation';

export default function ProfileFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useTelegramUser();
  const { hapticFeedback } = useTelegram();
  const tgId = searchParams.get('tgId') || userId;
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const loadExistingProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile?tgId=${tgId}`);
      if (res.ok) {
        const data: ProfileResponse = await res.json();
        if (data.profile) {
          setInitialData({
            name: data.profile.name,
            birthDate: data.profile.birthDate,
            birthTime: data.profile.birthTime || '',
            unknownTime: data.profile.timeUnknown || false,
            location: data.profile.location,
            houseSystem: data.profile.houseSystem
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  }, [tgId]);

  // Load existing profile on mount
  useEffect(() => {
    if (tgId) {
      loadExistingProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [tgId, loadExistingProfile]);

  const handleSubmit = async (formData: ProfileFormData) => {
    if (!tgId) {
      hapticFeedback('notification', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for API
      const profileData = {
        tgId: tgId,
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.unknownTime ? undefined : formData.birthTime,
        timeUnknown: formData.unknownTime,
        location: formData.location,
        houseSystem: formData.houseSystem
      };

      // Determine if we're creating or updating
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        const data = await res.json();
        hapticFeedback('notification', 'success');
        
        // Navigate back to profile or show success
        router.push('/profile');
      } else {
        const errorData = await res.json();
        console.error('Profile save error:', errorData);
        hapticFeedback('notification', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      hapticFeedback('notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    hapticFeedback('impact', 'light');
    setInitialData(undefined);
  };

  if (loadingProfile) {
    return (
      <div className="page animate-fadeIn min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastel-purple mx-auto mb-4"></div>
          <p className="text-neutral-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fadeIn min-h-[calc(100vh-140px)]" style={{ '--page-top': 'calc(var(--safe-top) + 32px)' } as React.CSSProperties}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          {initialData ? 'Редактировать профиль' : 'Создать профиль'}
        </h1>
        <p className="text-neutral-600">
          Заполните данные для точного астрологического расчёта
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <ProfileForm
          onSubmit={handleSubmit}
          loading={loading}
          initialData={initialData}
          onReset={handleReset}
        />
      </div>

      {/* Help text */}
      <div className="bg-blue-50 rounded-2xl p-4 mb-20">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Советы для точности</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Точное время рождения важно для расчёта домов и асцендента</li>
          <li>• Если не знаете время, отметьте соответствующий чекбокс</li>
          <li>• Выберите место рождения из предложенных вариантов</li>
          <li>• Placidus — самая популярная система домов</li>
        </ul>
      </div>
    </div>
  );
}