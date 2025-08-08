import React from 'react';

interface StartScreenProps {
  title: string;
  button: string;
  onStart: () => void;
}

export default function StartScreen({ title, button, onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl font-bold mb-8 tracking-widest">{title}</h1>
      <button
        onClick={onStart}
        className="bg-white text-purple-700 font-semibold py-3 px-6 rounded-full shadow-lg animate-bounce"
      >
        {button}
      </button>
    </div>
  );
}
