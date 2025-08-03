import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-4 text-4xl">404</h1>
      <p className="mb-8 text-lg">Страница не найдена.</p>
      <Link
        href="/"
        className="rounded bg-purple-700 px-4 py-2 text-white hover:bg-purple-600"
      >
        На главную
      </Link>
    </div>
  );
}
