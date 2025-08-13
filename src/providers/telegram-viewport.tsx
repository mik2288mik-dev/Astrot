'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { TelegramWebApp } from '@/lib/telegram'

type Ctx = {
	tg: TelegramWebApp | null
	isExpanded: boolean
	viewportH: number
	stableH: number
}

type TelegramWindow = typeof window & { Telegram?: { WebApp?: TelegramWebApp & { viewportHeight?: number; viewportStableHeight?: number } } }

const ViewportCtx = createContext<Ctx>({ tg: null, isExpanded: false, viewportH: 0, stableH: 0 })
export const useTgViewport = () => useContext(ViewportCtx)

function setCssVars(h: number, hs: number) {
	const r = document.documentElement
	r.style.setProperty('--tg-viewport-height', `${h}px`)
	r.style.setProperty('--tg-viewport-stable-height', `${hs}px`)
	// совместимость: наша своя переменная для layout
	r.style.setProperty('--app-viewport-height', `${hs || h}px`)
}

export function TelegramViewportProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<Ctx>({ tg: null, isExpanded: false, viewportH: 0, stableH: 0 })

	useEffect(() => {
		const w = window as unknown as TelegramWindow
		const tg = w?.Telegram?.WebApp
		if (!tg) return

		// Готовность и ранний expand
		try { tg.ready?.() } catch {}
		try { tg.expand?.() } catch {}

		const updateHeights = () => {
			const h = (tg as { viewportHeight?: number }).viewportHeight ?? tg.viewportHeight ?? 0
			const hs = (tg as { viewportStableHeight?: number }).viewportStableHeight ?? tg.viewportStableHeight ?? h
			setCssVars(h, hs)
			setState({ tg, isExpanded: !!tg.isExpanded, viewportH: h, stableH: hs })
		}

		updateHeights()

		// Реакция на изменение вьюпорта (клавиатура/жесты/топбар)
		const handler = (_payload?: unknown) => {
			updateHeights()
		}
		tg.onEvent?.('viewportChanged', handler)

		return () => {
			tg.offEvent?.('viewportChanged', handler)
		}
	}, [])

	return <ViewportCtx.Provider value={state}>{children}</ViewportCtx.Provider>
}