'use client';

import React, { useState } from 'react';
import NatalChartForm, { NatalFormData } from '@/components/features/NatalChartForm';

export default function ChartPage() {
  const [submitted, setSubmitted] = useState<NatalFormData | null>(null);

  const handleSubmit = (data: NatalFormData) => {
    setSubmitted(data);
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-pastel-purple to-pastel-pink" />

      <div className="mx-auto w-full max-w-md px-4 pt-safe pb-8 flex flex-col items-center">
        <NatalChartForm onSubmit={handleSubmit} />

        {submitted && (
          <div className="mt-8 w-full max-w-[320px] bg-pastel-cream p-6 rounded-2xl shadow-soft">
            <h2 className="text-lg font-semibold mb-2 text-neutral-800">Отправленные данные</h2>
            <pre className="text-sm whitespace-pre-wrap text-neutral-800">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

