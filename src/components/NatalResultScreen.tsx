import React, { useEffect, useState } from 'react';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

interface NatalResultScreenProps {
  data: unknown;
  onBack: () => void;
}

export default function NatalResultScreen({ data, onBack }: NatalResultScreenProps) {
  const [result, setResult] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Ты — астролог…' },
              { role: 'user', content: `Моя натальная карта: ${JSON.stringify(data)}` },
            ],
          }),
        });
        const ai = await response.json();
        setResult(ai.choices?.[0]?.message?.content || 'Нет данных');
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [data]);

  return (
    <div className="p-4 text-white">
      <button onClick={onBack} className="mb-4 underline">
        Назад
      </button>
      <pre className="whitespace-pre-wrap">{result || 'Загрузка...'}</pre>
    </div>
  );
}
