"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTelegramUser } from "@/lib/telegram";

interface TopBarProps {
	className?: string;
}

function getDisplayName(user: { first_name?: string; last_name?: string; username?: string } | null) {
	if (!user) return "Гость";
	if (user.username) return `@${user.username}`;
	const full = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
	return full || "Гость";
}

export default function TopBar({ className }: TopBarProps) {
	const { user } = useTelegramUser();
	const title = useMemo(() => getDisplayName(user), [user]);
	const avatar = user?.photo_url ?? undefined;
	const initial = title === "Гость" ? "G" : (title.startsWith("@") ? title.slice(1, 2) : title.slice(0, 1)).toUpperCase();

	return (
		<div
			className={[
				"fixed inset-x-0 z-50",
				"pt-[env(safe-area-inset-top,0px)]",
				"top-0",
				className ?? "",
			].join(" ")}
			role="banner"
			aria-label="Astrot top bar"
		>
			<div className="mx-auto max-w-screen-md px-3">
				<div
					className={[
						"h-[56px]",
						"rounded-[20px]",
						"flex items-center",
						"px-3",
						"shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
						"backdrop-blur-md",
						"bg-[rgba(255,255,255,0.55)] dark:bg-[rgba(18,18,28,0.55)]",
					].join(" ")}
					style={{
						backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)",
					}}
				>
					{/* Left: avatar */}
					<div className="flex items-center gap-3">
						<div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/70 shadow-[0_4px_14px_rgba(0,0,0,0.12)] bg-gradient-to-br from-[#FDCBFF] to-[#B3CFFF]">
							{avatar ? (
								<Image src={avatar} alt="Аватар" fill className="object-cover" priority unoptimized />
							) : (
								<div className="w-full h-full grid place-items-center text-white font-semibold text-sm">
									{initial}
								</div>
							)}
						</div>
						<div className="min-w-0">
							<div className="text-[14px] leading-4 font-semibold text-[#2C2C2C] dark:text-white truncate">
								{title}
							</div>
							<div className="text-[11px] leading-4 text-[#666] dark:text-white/70 truncate">
								Добро пожаловать 👋
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}