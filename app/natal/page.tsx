import Link from "next/link";

function NatalChart() {
  const lines = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 200 200" className="h-64 w-64 text-indigo-300">
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="2" fill="none" />
      {lines.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = 100 + 95 * Math.cos(angle);
        const y = 100 + 95 * Math.sin(angle);
        return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="currentColor" strokeWidth="1" />;
      })}
    </svg>
  );
}

export default function NatalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-950 via-black to-indigo-950 text-white">
      <h1 className="mb-8 text-4xl font-bold">Натальная карта</h1>
      <NatalChart />
      <Link href="/" className="mt-8 underline">
        На главную
      </Link>
    </div>
  );
}

