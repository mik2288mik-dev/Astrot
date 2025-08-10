"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { impactLight } from "@/lib/haptics";
import manifest from "@/src/config/asset_manifest.json";
import { useKeyboardAwareTabbar } from "@/lib/useKeyboardAwareTabbar";

function resolvePublicPath(path: string): string {
  return path.startsWith("/public") ? path.replace("/public", "") : path;
}

const tabs = [
  { href: "/", label: "Главная", iconKey: "home" as const },
  { href: "/natal", label: "Карта", iconKey: "natal_chart" as const },
  { href: "/premium", label: "Премиум", iconKey: "subscription" as const },
  { href: "/settings", label: "Настройки", iconKey: "settings" as const },
];

export function BottomBar() {
  const pathname = usePathname() || "";
  const hidden = useKeyboardAwareTabbar();

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 bottom-[max(8px,env(safe-area-inset-bottom))] z-50 w-[min(560px,92vw)] h-[var(--tabbar-h)] rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_8px_24px_rgba(30,12,64,0.12)] transition-transform duration-200",
        hidden && "translate-y-[120%]"
      )}
      aria-label="Основная навигация"
    >
      <div className="h-full px-1 flex items-center justify-between">
        {tabs.map(({ href, label, iconKey }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          const src = resolvePublicPath((manifest as any).icons[iconKey]);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => impactLight()}
              className={cn(
                "relative flex flex-col items-center justify-center h-14 w-16 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition-transform",
                isActive ? "text-on" : "text-muted"
              )}
              aria-label={label}
            >
              <span className="relative h-6 w-6">
                <Image src={src} alt="" fill sizes="24px" className={cn("object-contain opacity-80", isActive ? "opacity-100" : "")} />
              </span>
              <span className={cn("mt-1 text-[11px] leading-none px-2 py-0.5 rounded-full", isActive ? "text-on bg-white/60" : "text-muted")}>{label}</span>
              {isActive && <span aria-hidden className="absolute -bottom-1 h-1.5 w-10 rounded-full bg-grad-accent blur-[1px]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}