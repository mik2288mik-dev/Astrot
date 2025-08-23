'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface FriendlyTip {
  id: string;
  text: string;
  emoji?: string;
  category?: string;
}

interface FriendlyCardProps {
  tgId?: string;
  className?: string;
}

export default function FriendlyCard({ tgId, className = '' }: FriendlyCardProps) {
  const [tips, setTips] = useState<FriendlyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTips = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/interpret/friendly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tgId,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить советы');
      }

      const data = await response.json();
      
      if (data.success) {
        setTips(data.tips || []);
      } else {
        throw new Error(data.error || 'Ошибка загрузки советов');
      }
    } catch (err) {
      console.error('Error loading friendly tips:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      
      // Показываем запасные советы в случае ошибки
      setTips([
        {
          id: 'fallback_1',
          text: 'Сегодня отличный день для новых открытий',
          emoji: '✨',
          category: 'general'
        },
        {
          id: 'fallback_2',
          text: 'Доверьтесь своей интуиции — она вас не подведет',
          emoji: '💫',
          category: 'general'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tgId]);

  useEffect(() => {
    loadTips();
  }, [tgId, loadTips]);

  const handleRefresh = () => {
    if (refreshing) return;
    loadTips(false);
  };

  if (loading) {
    return (
      <div className={`card animate-fade-in ${className}`}>
        <div className="text-center">
          <div className="card-title mb-4">Твой совет дня</div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card animate-slide-up ${className}`}>
      <div className="text-center mb-4">
        <h3 className="card-title flex items-center justify-center gap-2">
          ✨ Твой совет дня
        </h3>
        <p className="card-caption">
          {new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long'
          })}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {tips.map((tip, index) => (
          <div
            key={tip.id}
            className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-3">
              {tip.emoji && (
                <span className="text-xl flex-shrink-0 mt-1">
                  {tip.emoji}
                </span>
              )}
              <p className="body-text text-left flex-1">
                {tip.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="caption text-red-600 text-center">
            {error}
          </p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`btn-compact inline-flex items-center gap-2 ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={refreshing ? 'Загружаю новые советы' : 'Получить новые советы'}
        >
          <ArrowPathIcon 
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
            aria-hidden="true"
          />
          {refreshing ? 'Обновляю...' : 'Ещё совет'}
        </button>
      </div>
    </div>
  );
}