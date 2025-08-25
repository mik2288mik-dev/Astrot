'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartComputed } from '@/lib/astro/types'
import { AstronomyEngine } from '@/lib/astro/engine'
import { resolveInterpretation, InterpretationMode, InterpretationTopic, InterpretationSection } from '@/lib/interpret/resolve'
import { useTWA } from '@/lib/twa'

export default function InterpretPage() {
  const params = useParams()
  const router = useRouter()
  const { showBackButton, hideBackButton, showMainButton, hideMainButton } = useTWA()
  
  const [chart, setChart] = useState<ChartComputed | null>(null)
  const [mode, setMode] = useState<InterpretationMode>('friendly')
  const [topic, setTopic] = useState<InterpretationTopic | undefined>(undefined)
  const [sections, setSections] = useState<InterpretationSection[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1, 2]))
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Setup TWA buttons
    showBackButton(() => {
      router.push(`/chart/${params.chartId}`)
    })
    
    showMainButton('Поделиться', () => {
      if (navigator.share) {
        navigator.share({
          title: `Интерпретация натальной карты`,
          text: sections.slice(0, 3).map(s => `${s.title}: ${s.content}`).join('\n\n'),
          url: window.location.href,
        })
      }
    })
    
    return () => {
      hideBackButton()
      hideMainButton()
    }
  }, [showBackButton, hideBackButton, showMainButton, hideMainButton, router, params.chartId, sections])
  
  useEffect(() => {
    // Load chart data
    const loadChart = async () => {
      try {
        setIsLoading(true)
        
        // For demo, create a sample chart
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
      } catch (error) {
        console.error('Error loading chart:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadChart()
  }, [params.chartId])
  
  useEffect(() => {
    if (chart) {
      const interpretations = resolveInterpretation(chart, mode, topic)
      setSections(interpretations)
    }
  }, [chart, mode, topic])
  
  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка интерпретации...</p>
        </div>
      </div>
    )
  }
  
  if (!chart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Карта не найдена</p>
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
    <div className="min-h-screen" style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Интерпретация</h1>
          <p className="text-gray-600">{chart.input.name}</p>
        </div>
        
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('easy')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === 'easy' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Легко
          </button>
          <button
            onClick={() => setMode('friendly')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === 'friendly' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Дружески
          </button>
          <button
            onClick={() => setMode('deep')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              mode === 'deep' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Подробно
          </button>
        </div>
        
        {/* Topic Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setTopic(undefined)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              !topic 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setTopic('love')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              topic === 'love' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Любовь
          </button>
          <button
            onClick={() => setTopic('money')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              topic === 'money' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Деньги
          </button>
          <button
            onClick={() => setTopic('career')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              topic === 'career' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Карьера
          </button>
          <button
            onClick={() => setTopic('health')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              topic === 'health' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Здоровье
          </button>
        </div>
        
        {/* Interpretation Sections */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {sections.map((section, index) => (
              <motion.div
                key={`${section.title}-${mode}-${topic}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-left">{section.title}</h3>
                  <motion.svg
                    animate={{ rotate: expandedSections.has(index) ? 180 : 0 }}
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                
                <AnimatePresence>
                  {expandedSections.has(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {sections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Интерпретации для выбранной темы не найдены
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              // Save interpretation
              const text = sections.map(s => `${s.title}\n${s.content}`).join('\n\n')
              const blob = new Blob([text], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `interpretation-${chart.input.name}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Сохранить текст
          </button>
        </div>
      </div>
    </div>
  )
}