import React from 'react';

interface Props {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: Props) {
  return (
    <div className="p-4 text-white">
      <button onClick={onBack} className="mb-4 underline">
        Назад
      </button>
      <p>Профиль (stub)</p>
    </div>
  );
}
