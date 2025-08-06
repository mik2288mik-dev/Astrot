import React from 'react';

export function NatalResultScreen({ data }: { data: Record<string, unknown> | null }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center pt-8">
      <img src="/assets/bg-main.png" className="absolute inset-0 w-full h-full object-cover" />
      <pre className="z-10 text-white bg-black bg-opacity-50 p-4 rounded max-w-full overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
