'use client';

import React, { useState } from 'react';
import NatalChartForm, { NatalFormData } from '@/components/NatalChartForm';

export default function ChartPage() {
  const [submitted, setSubmitted] = useState<NatalFormData | null>(null);

  const handleSubmit = (data: NatalFormData) => {
    setSubmitted(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto mt-8">
        <NatalChartForm onSubmit={handleSubmit} />

        {submitted && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">Отправленные данные</h2>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

