"use client"

import React, { useEffect, useState } from 'react'
import { useTgViewport } from '@/providers/telegram-viewport'

export default function ExpandOverlay() {
	const { tg, isExpanded } = useTgViewport()
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!tg) return
		setVisible(!isExpanded)
	}, [tg, isExpanded])

	if (!visible) return null
	return (
		<div
			style={{
				position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
				background: 'rgba(0,0,0,0.35)', zIndex: 9999
			}}
		>
			<button
				onClick={() => { try { tg?.expand?.() } catch {} }}
				style={{
					padding: '12px 16px',
					borderRadius: 9999,
					border: '1px solid rgba(255,255,255,0.2)',
					background: 'var(--tg-theme-button-color, #7C5DFA)',
					color: 'var(--tg-theme-button-text-color, #fff)',
					fontWeight: 600
				}}
			>
				Открыть на весь экран
			</button>
		</div>
	)
}