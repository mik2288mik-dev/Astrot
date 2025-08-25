'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface BottomNavProps {
	className?: string
}

function Label({ active, children }:{ active:boolean; children:React.ReactNode }){
	return (
		<span className={`mt-1 text-[11px] font-semibold ${active ? 'text-[#2C2C2C] dark:text-white' : 'text-[#666666] dark:text-white/70'}`}>
			{children}
		</span>
	)
}

export default function BottomNav({ className }: BottomNavProps) {
	const router = useRouter()
	const pathname = usePathname()

	const isActive = (href:string) => pathname === href || (href !== '/' && pathname.startsWith(href))

	return (
		<nav className={["fixed bottom-0 left-0 right-0 z-50 pb-safe", className ?? ''].join(' ')} aria-label="Навигация">
			<div className="mx-auto max-w-screen-md">
				<div className="relative mx-3">
					{/* Soft shadow under bar */}
					<div className="absolute -top-2 left-6 right-6 h-4 rounded-full blur-md opacity-60" style={{boxShadow:'0 12px 24px rgba(0,0,0,0.18)'}} />

					{/* Bar container */}
					<div className="relative h-[72px] rounded-[24px] border border-white/60 dark:border-white/10 overflow-visible" style={{
						background:'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)',
						backdropFilter:'blur(12px)'
					}}>
						{/* subtle inner highlight */}
						<div className="pointer-events-none absolute inset-0 rounded-[24px]" style={{background:'radial-gradient(120% 120% at 50% -40%, rgba(255,255,255,0.8) 0%, transparent 60%)'}}/>

						{/* Buttons area */}
						<div className="relative h-full flex items-end justify-between px-8">
							{/* Left - Home */}
							<button
								aria-label="Главная"
								onClick={() => router.push('/home')}
								className={`group flex flex-col items-center justify-center transition-all duration-200 ${isActive('/home')||isActive('/') ? 'scale-105' : ''} active:scale-95`}
								style={{ width: '56px', height: '56px' }}
							>
								<div className={`relative w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 ${isActive('/home')||isActive('/') ? 'bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] shadow-md text-white' : 'bg-white/70 text-[#666666] dark:bg-white/10 dark:text-white/80'}`}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path d="M3 12L12 4l9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M5 10v10a1 1 0 001 1h4v-6a1 1 0 011-1h2a1 1 0 011 1v6h4a1 1 0 001-1V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								<Label active={isActive('/home')||isActive('/')}>Главная</Label>
							</button>

							{/* Center - Logo button */}
							<button
								aria-label="Карта"
								onClick={() => router.push('/natal')}
								className="group absolute left-1/2 -translate-x-1/2 -top-5"
							>
								<div className={`relative w-[64px] h-[64px] rounded-full flex items-center justify-center transition-all duration-300 ${isActive('/natal') ? 'scale-105' : ''}`}
									style={{
										background:'linear-gradient(135deg, #FDCBFF 0%, #B3CFFF 100%)',
										boxShadow:'0 12px 24px rgba(0,0,0,0.18)'
									}}
								>
									<div className="absolute inset-0 rounded-full" style={{boxShadow:'inset 0 8px 14px rgba(255,255,255,0.5)'}}/>
									<div className="relative z-10 w-10 h-10">
										<Image src="/logo.png" alt="Astrot" fill className="object-contain" priority />
									</div>
								</div>
								<span className="mt-2 block text-center text-[12px] font-semibold text-[#2C2C2C] dark:text-white">Карта</span>
							</button>

							{/* Right - Profile */}
							<button
								aria-label="Профиль"
								onClick={() => router.push('/profile')}
								className={`group flex flex-col items-center justify-center transition-all duration-200 ${isActive('/profile') ? 'scale-105' : ''} active:scale-95`}
								style={{ width: '56px', height: '56px' }}
							>
								<div className={`relative w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 ${isActive('/profile') ? 'bg-gradient-to-r from-[#FDCBFF] to-[#B3CFFF] shadow-md text-white' : 'bg-white/70 text-[#666666] dark:bg-white/10 dark:text-white/80'}`}>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
										<path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								<Label active={isActive('/profile')}>Профиль</Label>
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}