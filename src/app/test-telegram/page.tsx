"use client";

import { useTelegramUser } from "@/lib/telegram";
import { useEffect, useState } from "react";

export default function TestTelegramPage() {
  const { user, loaded } = useTelegramUser();
  const [mockUser, setMockUser] = useState(false);

  // Для тестирования вне Telegram
  useEffect(() => {
    if (loaded && !user && typeof window !== "undefined") {
      // Имитируем пользователя для демонстрации
      const timer = setTimeout(() => {
        setMockUser(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loaded, user]);

  const displayUser = user || (mockUser ? {
    id: 123456789,
    first_name: "Иван",
    last_name: "Петров",
    username: "ivanpetrov",
    photo_url: null,
    language_code: "ru"
  } : null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6FB] via-[#FBEFFF] to-[#F0E6FF] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A3D5C] mb-2">
            Тест Telegram WebApp
          </h1>
          <p className="text-[#9B8FAB]">
            Демонстрация работы TopBar с данными пользователя
          </p>
        </div>

        {/* Карточка с информацией */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(183,148,246,0.12)] border border-[#E8D5FF]/30">
          <h2 className="text-xl font-semibold text-[#4A3D5C] mb-4">
            Статус подключения
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#F3E7FF]/50 to-[#E8D5FF]/50 rounded-2xl">
              <span className="text-[#6B5D7A] font-medium">SDK загружен:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                loaded 
                  ? "bg-gradient-to-r from-[#D6FFE8] to-[#B3FFD9] text-green-700"
                  : "bg-gradient-to-r from-[#FFE5D6] to-[#FFD6D6] text-orange-700"
              }`}>
                {loaded ? "Да" : "Загрузка..."}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#F3E7FF]/50 to-[#E8D5FF]/50 rounded-2xl">
              <span className="text-[#6B5D7A] font-medium">Пользователь:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                displayUser 
                  ? "bg-gradient-to-r from-[#D6ECFF] to-[#B3E5FF] text-blue-700"
                  : "bg-gradient-to-r from-[#FFE5D6] to-[#FFD6D6] text-orange-700"
              }`}>
                {displayUser ? "Найден" : "Не найден"}
              </span>
            </div>
          </div>
        </div>

        {/* Данные пользователя */}
        {displayUser && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(183,148,246,0.12)] border border-[#E8D5FF]/30">
            <h2 className="text-xl font-semibold text-[#4A3D5C] mb-4">
              Данные пользователя
            </h2>
            
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-[#FFE0EC]/30 to-[#E8D5FF]/30 rounded-2xl">
                <span className="text-[#9B8FAB] text-sm">ID</span>
                <p className="text-[#4A3D5C] font-semibold">{displayUser.id}</p>
              </div>

              <div className="p-3 bg-gradient-to-r from-[#D6ECFF]/30 to-[#E8D5FF]/30 rounded-2xl">
                <span className="text-[#9B8FAB] text-sm">Имя</span>
                <p className="text-[#4A3D5C] font-semibold">
                  {displayUser.first_name} {displayUser.last_name}
                </p>
              </div>

              {displayUser.username && (
                <div className="p-3 bg-gradient-to-r from-[#D6FFE8]/30 to-[#E8D5FF]/30 rounded-2xl">
                  <span className="text-[#9B8FAB] text-sm">Username</span>
                  <p className="text-[#4A3D5C] font-semibold">@{displayUser.username}</p>
                </div>
              )}

              <div className="p-3 bg-gradient-to-r from-[#FFE5D6]/30 to-[#FFF9D6]/30 rounded-2xl">
                <span className="text-[#9B8FAB] text-sm">Язык</span>
                <p className="text-[#4A3D5C] font-semibold">
                  {displayUser.language_code || "не указан"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Подсказка */}
        <div className="bg-gradient-to-r from-[#F3E7FF]/50 to-[#E8D5FF]/50 rounded-2xl p-4 text-center">
          <p className="text-[#6B5D7A] text-sm">
            {!user && !mockUser && loaded && "💡 Откройте эту страницу в Telegram WebApp для отображения реальных данных"}
            {!loaded && "⏳ Ожидание загрузки Telegram SDK..."}
            {mockUser && "🎭 Демонстрационный режим (вне Telegram)"}
            {user && "✅ Подключено к Telegram WebApp"}
          </p>
        </div>
      </div>
    </div>
  );
}