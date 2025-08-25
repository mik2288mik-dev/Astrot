'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NatalWheel from '@/components/NatalWheel'
import { ChartComputed } from '@/lib/astro/types'
import { AstronomyEngine } from '@/lib/astro/engine'
import { useTWA } from '@/lib/twa'

export default function ChartPage() {
  const params = useParams()
  const router = useRouter()
  const { showBackButton, hideBackButton } = useTWA()
  const [chart, setChart] = useState<ChartComputed | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Setup back button
    showBackButton(() => {
      router.push('/create')
    })
    
    return () => {
      hideBackButton()
    }
  }, [showBackButton, hideBackButton, router])
  
  useEffect(() => {
    // For demo, we'll create a sample chart
    // In production, you would fetch the chart from the database
    const loadChart = async () => {
      try {
        setIsLoading(true)
        
        // Mock data for demonstration
        const engine = new AstronomyEngine()
        const mockChart = engine.computeChart({
          name: 'Demo Chart',
          date: '2000-01-01',
          time: '12:00',
          city: 'Moscow',
          timezone: '+03:00',
          lat: 55.7558,
          lon: 37.6173,
        })
        
        setChart(mockChart)
      } catch (err) {
        setError('Ошибка загрузки карты')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadChart()
  }, [params.id])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка карты...</p>
        </div>
      </div>
    )
  }
  
  if (error || !chart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Карта не найдена'}</p>
          <button
            onClick={() => router.push('/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Создать новую карту
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-4" style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{chart.input.name}</h1>
          <p className="text-gray-600">
            {new Date(chart.input.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            {chart.input.time && `, ${chart.input.time}`}
          </p>
          <p className="text-gray-600">{chart.input.city}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <NatalWheel chart={chart} />
        </div>
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/interpret/${params.id}`)}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Интерпретация
          </button>
          <button
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: `Натальная карта ${chart.input.name}`,
                  text: `Посмотрите мою натальную карту`,
                  url: window.location.href,
                })
              }
            }}
            className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Поделиться
          </button>
        </div>
      </div>
    </div>
  )
}