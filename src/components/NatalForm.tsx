import React from 'react';

interface NatalFormProps {
  t: {
    name: string;
    birthDate: string;
    birthPlace: string;
    submit: string;
  };
  onSubmit: () => void;
}

export default function NatalForm({ t, onSubmit }: NatalFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
      <input
        type="text"
        placeholder={t.name}
        className="rounded p-2 text-black"
        required
      />
      <input
        type="date"
        placeholder={t.birthDate}
        className="rounded p-2 text-black"
        required
      />
      <input
        type="text"
        placeholder={t.birthPlace}
        className="rounded p-2 text-black"
        required
      />
      <button
        type="submit"
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded"
      >
        {t.submit}
      </button>
    </form>
  );
}
