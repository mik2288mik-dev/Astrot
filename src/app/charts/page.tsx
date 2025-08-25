'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChartPreview, getMyCharts } from '@/lib/db/charts'
import { useTWA } from '@/lib/twa'
import { motion } from 'framer-motion'

export default function ChartsPage() {
  const router = useRouter()
  const { user, showBackButton, hideBackButton } = useTWA()
  const [charts, setCharts] = useState<ChartPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    // Setup back button
    showBackButton(() => {
      router.push('/')
    })
    
    return () => {
      hideBackButton()
    }
  }, [showBackButton, hideBackButton, router])
  
  useEffect(() => {
    loadCharts()
  }, [user])
  
  const loadCharts = async () => {
    try {
      setIsLoading(true)
      
      // For demo purposes, we'll use mock data
      // In production, you would use the actual user ID from TWA
      const mockCharts: ChartPreview[] = [
        {
          id: '1',
          name: 'Иван Иванов',
          date: '1990-05-15',
          city: 'Москва',
          sun_sign: 'Телец',
          moon_sign: 'Скорпион',
          asc_sign: 'Лев',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Мария Петрова',
          date: '1985-12-03',
          city: 'Санкт-Петербург',
          sun_sign: 'Стрелец',
          moon_sign: 'Рак',
          asc_sign: 'Весы',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          name: 'Алексей Сидоров',
          date: '1995-07-20',
          city: 'Новосибирск',
          sun_sign: 'Рак',
          moon_sign: 'Водолей',
          asc_sign: 'Близнецы',
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]
      
      setCharts(mockCharts)
    } catch (error) {
      console.error('Error loading charts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredCharts = charts.filter(chart =>
    chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chart.city.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
  const formatCreatedAt = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'только что'
    if (diffInHours < 24) return `${diffInHours} ч. назад`
    if (diffInHours < 48) return 'вчера'
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} дн. назад`
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка карт...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-4" style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Мои карты</h1>
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или городу..."
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Charts list */}
        {filteredCharts.length > 0 ? (
          <div className="space-y-3">
            {filteredCharts.map((chart, index) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/chart/${chart.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{chart.name}</h3>
                  <span className="text-xs text-gray-500">
                    {formatCreatedAt(chart.created_at)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div>{formatDate(chart.date)}</div>
                  <div>{chart.city}</div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    ☉ {chart.sun_sign}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    ☽ {chart.moon_sign}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    ASC {chart.asc_sign}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Ничего не найдено' : 'У вас пока нет сохраненных карт'}
            </p>
            <button
              onClick={() => router.push('/create')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Создать первую карту
            </button>
          </div>
        )}
        
        {/* Floating action button */}
        <motion.button
          onClick={() => router.push('/create')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ bottom: 'calc(var(--safe-bottom) + 24px)' }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}