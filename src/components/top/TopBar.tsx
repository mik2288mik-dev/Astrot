"use client";
import Image from "next/image";
import { useMemo } from "react";
import { useTelegramUser } from "@/lib/telegram";

// Утил: форматируем заголовок
function formatName(u: { first_name?: string; last_name?: string; username?: string }) {
  if (u.username) return `@${u.username}`;
  const first = u.first_name?.trim() ?? "";
  const last = u.last_name?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  return full || "Гость";
}

// Утил: компактный ID
function formatId(id?: number) {
  if (!id && id !== 0) return "";
  return `ID: ${id}`;
}

export default function TopBar() {
  const { user, loaded } = useTelegramUser();

  // Данные для рендера
  const title = useMemo(() => (user ? formatName(user) : "Гость"), [user]);
  const sub = useMemo(() => (user ? formatId(user.id) : ""), [user]);
  const avatar = user?.photo_url ?? null;

  return (
    <div
      className={[
        "fixed left-0 right-0 z-50",
        "pt-[env(safe-area-inset-top,0px)]",
        "top-0",
      ].join(" ")}
      role="banner"
      aria-label="Top user bar"
    >
      <div
        className={[
          "mx-auto max-w-screen-md",
          "px-4 py-2",
        ].join(" ")}
      >
        {/* Контейнер бара */}
        <div
          className={[
            "w-full",
            "rounded-3xl",
            "bg-gradient-to-r from-white/95 via-[#FFF5ED]/90 to-white/95",
            "backdrop-blur-xl",
            "border border-[#E8D5FF]/30",
            "shadow-[0_8px_32px_rgba(183,148,246,0.12)]",
            "flex items-center gap-3",
            "min-h-[60px] px-4",
            "transition-all duration-300",
            "hover:shadow-[0_12px_40px_rgba(183,148,246,0.18)]",
          ].join(" ")}
        >
          {/* Аватар / скелетон */}
          {loaded ? (
            avatar ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE0EC] to-[#E8D5FF] rounded-full blur-md opacity-60" />
                <Image
                  src={avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="relative rounded-full ring-2 ring-white/80 shadow-lg object-cover"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE0EC] to-[#E8D5FF] rounded-full blur-md opacity-40" />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#B794F6] to-[#9F7AEA] ring-2 ring-white/80 shadow-lg grid place-items-center text-white text-sm font-bold">
                  {title.slice(0, 1).toUpperCase()}
                </div>
              </div>
            )
          ) : (
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F3E7FF] to-[#E8D5FF] animate-pulse" />
            </div>
          )}

          {/* Имя/ник + ID */}
          <div className="flex-1 min-w-0">
            {loaded ? (
              <>
                <div className="truncate text-[16px] font-semibold text-[#4A3D5C] leading-tight">
                  {title}
                </div>
                {sub && (
                  <div className="truncate text-[13px] text-[#9B8FAB] leading-tight font-medium">
                    {sub}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="h-4 w-32 bg-gradient-to-r from-[#F3E7FF] to-[#E8D5FF] rounded-lg mb-1 animate-pulse" />
                <div className="h-3 w-20 bg-gradient-to-r from-[#F3E7FF] to-[#E8D5FF] rounded-lg animate-pulse" />
              </>
            )}
          </div>

          {/* Правый блок с декоративными элементами */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFE0EC] to-[#E8D5FF] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#D6ECFF] to-[#E8D5FF] animate-pulse animation-delay-200" />
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#D6FFE8] to-[#E8D5FF] animate-pulse animation-delay-400" />
          </div>
        </div>
      </div>
    </div>
  );
}