"use client";
import Image from "next/image";
import { useTelegramUser } from "@/lib/telegram";
import { useMemo, useState } from "react";
import type { TgUser } from "@/types/telegram";

function titleOf(u: TgUser | null) {
  if (!u) return "Гость";
  if (u.username) return `@${u.username}`;
  const full = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return full || "Гость";
}

interface TopHudProps {
  onMenuClick?: () => void;
}

export default function TopHud({ onMenuClick }: TopHudProps = {}) {
  const { user } = useTelegramUser();
  const title = useMemo(() => titleOf(user), [user]);
  const avatar = user?.photo_url ?? null;
  const initial = title === "Гость" ? "G" : (title.startsWith("@") ? title.slice(1, 2) : title.slice(0, 1)).toUpperCase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuClick?.();
  };

  return (
    <div
      className={[
        "fixed left-0 right-0 top-0 z-50",
        "pt-[env(safe-area-inset-top,0px)]",
      ].join(" ")}
      role="banner"
      aria-label="Astrot top bar"
    >
      <div className="mx-auto max-w-screen-md px-3">
        {/* Сам бар */}
        <div
          className={[
            "relative w-full h-[56px] rounded-b-2xl",
            "bg-gradient-to-b from-[#121528] to-[#0E111F]",
            "shadow-[0_12px_28px_rgba(0,0,0,0.35)]",
            "border-b border-white/5",
          ].join(" ")}
        >
          {/* Аватар — слева, наполовину выезжает вниз */}
          <div className="absolute -bottom-5 left-3">
            <div className="relative">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={48}
                  height={48}
                  className="rounded-full ring-2 ring-white/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full grid place-items-center ring-2 ring-white/80 shadow-[0_6px_18px_rgba(0,0,0,0.35)] bg-gradient-to-br from-[#FDCBFF] to-[#B3CFFF] text-white font-bold">
                  {initial}
                </div>
              )}
              {/* Капсула с именем — справа от аватара */}
              <div
                className={[
                  "absolute left-14 top-1",
                  "px-3 py-1 rounded-full",
                  "bg-black/85 text-white",
                  "text-[12px] font-semibold tracking-wide",
                  "shadow-[0_4px_10px_rgba(0,0,0,0.35)]",
                  "border border-white/10",
                  "max-w-[calc(100vw-120px)] sm:max-w-[60vw] truncate",
                  "whitespace-nowrap",
                ].join(" ")}
              >
                {title}
              </div>
            </div>
          </div>

          {/* Кнопка меню справа */}
          <button
            type="button"
            aria-label="Меню"
            onClick={handleMenuClick}
            className={[
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-11 h-11 rounded-2xl",
              "bg-[#2A2F4A] hover:bg-[#33395C] active:scale-95",
              "shadow-[0_6px_14px_rgba(0,0,0,0.35)]",
              "border border-white/10",
              "grid place-items-center transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-white/20",
            ].join(" ")}
          >
            <span className="relative block w-5 h-5">
              {/* три полоски с анимацией */}
              <span 
                className={[
                  "absolute inset-x-0 h-0.5 bg-white/90 rounded transition-all duration-200",
                  isMenuOpen ? "top-2 rotate-45" : "top-0"
                ].join(" ")} 
              />
              <span 
                className={[
                  "absolute inset-x-0 top-2 h-0.5 bg-white/90 rounded transition-all duration-200",
                  isMenuOpen ? "opacity-0" : "opacity-100"
                ].join(" ")} 
              />
              <span 
                className={[
                  "absolute inset-x-0 h-0.5 bg-white/90 rounded transition-all duration-200",
                  isMenuOpen ? "top-2 -rotate-45" : "top-4"
                ].join(" ")} 
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}