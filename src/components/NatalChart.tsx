import React, { useMemo } from 'react';

interface NatalChartProps {
  placeholder: string;
}

const signs = ['\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D', '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'];

export default function NatalChart({ placeholder }: NatalChartProps) {
  const sign = useMemo(() => signs[Math.floor(Math.random() * signs.length)], []);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center gap-4">
      <div className="text-7xl">{sign}</div>
      <p>{placeholder}</p>
    </div>
  );
}
