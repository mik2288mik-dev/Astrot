import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-black via-purple-900 to-black text-white text-3xl">
      <p className="mb-6">Astrot работает! 🚀</p>
      <Link href="/natal" className="text-xl underline">
        Перейти к натальной карте
      </Link>
    </div>
  );
}

