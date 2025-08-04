import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: "/globe.svg",
    title: "Астрологические карты",
    description: "Исследуйте расположение планет на момент рождения.",
  },
  {
    icon: "/window.svg",
    title: "Прогнозы",
    description: "Получайте актуальные гороскопы и предсказания.",
  },
  {
    icon: "/file.svg",
    title: "История",
    description: "Сохраняйте свои карты и возвращайтесь к ним позже.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-black via-purple-900 to-black p-6 text-white">
      <main className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-pink-400 to-violet-500 bg-clip-text text-transparent">
            Astrot
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-xl">
          Погрузитесь в мир астрологии и узнайте больше о своей натальной карте.
        </p>
        <Link
          href="/natal"
          className="inline-block rounded-lg bg-purple-600 px-8 py-3 text-lg font-semibold shadow-lg transition-colors hover:bg-purple-700"
        >
          Перейти к натальной карте
        </Link>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center">
              <Image src={f.icon} alt="" width={48} height={48} className="mb-4" />
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-200">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
