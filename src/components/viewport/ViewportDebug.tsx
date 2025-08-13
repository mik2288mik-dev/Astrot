"use client"

import React from 'react'
import { useTgViewport } from '@/providers/telegram-viewport'
import type { TelegramWebApp } from '@/lib/telegram'

export default function ViewportDebug() {
	const { tg, isExpanded, viewportH, stableH } = useTgViewport()
	if (process.env.NEXT_PUBLIC_DEBUG_VIEWPORT !== '1') return null
	const t: TelegramWebApp | null = tg
	return (
		<div style={{
			position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
			fontSize: 12, padding: 8, background: 'rgba(0,0,0,0.6)', color: '#fff'
		}}>
		expanded: {String(isExpanded)} | vh: {viewportH} | sh: {stableH} | platform: {t && (t as unknown as { platform?: string }).platform} | ver: {t && (t as unknown as { version?: string }).version}
		</div>
	)
}