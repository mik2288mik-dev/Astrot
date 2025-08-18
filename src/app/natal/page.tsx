'use client';

import React, { useState } from 'react';
import NatalChartForm, { NatalFormData } from '@/components/NatalChartForm';
import NatalResult from '@/components/natal/NatalResult';
import { calcNatal } from '../../../lib/api/natal';
import { notificationOccurred } from '../../../lib/haptics';
import type { NatalResult as NatalResultType } from '../../../lib/api/natal';

export default function NatalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NatalResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: NatalFormData) => {
    if (!data.location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const natalInput = {
        name: data.name,
        date: data.birthDate,
        time: data.timeUnknown ? '12:00' : data.birthTime,
        unknownTime: data.timeUnknown,
        place: {
          lat: data.location.lat,
          lon: data.location.lon,
          displayName: data.location.name
        }
      };
      
      const result = await calcNatal(natalInput);
      setResult(result);
      notificationOccurred('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при расчете');
      notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-pastel-purple to-pastel-pink" />

      <div className="mx-auto w-full max-w-md px-4 pt-safe pb-8 flex flex-col items-center">
        {!result ? (
          <>
            <NatalChartForm onSubmit={handleSubmit} loading={loading} />
            
            {error && (
              <div className="mt-4 w-full max-w-[320px] bg-red-50 border border-red-200 p-4 rounded-2xl">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full space-y-6">
            {/* Кнопка назад */}
            <button
              onClick={() => setResult(null)}
              className="mb-4 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              ← Назад к форме
            </button>
            
            <NatalResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}