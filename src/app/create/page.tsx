'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useTWA } from '@/lib/twa'

// Validation schema
const chartInputSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  date: z.string().min(1, 'Дата рождения обязательна'),
  time: z.string().optional(),
  unknownTime: z.boolean().default(false),
  city: z.string().min(1, 'Город рождения обязателен'),
  timezone: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
})

type ChartInput = z.infer<typeof chartInputSchema>

export default function CreateChartPage() {
  const router = useRouter()
  const { showMainButton, hideMainButton, hapticFeedback, showAlert } = useTWA()
  
  const [formData, setFormData] = useState<ChartInput>({
    name: '',
    date: '',
    time: '',
    unknownTime: false,
    city: '',
    timezone: '',
    lat: undefined,
    lon: undefined,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [citySuggestions, setCitySuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('lastChartInput')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to parse saved data', e)
      }
    }
  }, [])

  // Setup TWA MainButton
  useEffect(() => {
    const isValid = formData.name && formData.date && formData.city && 
                   (formData.unknownTime || formData.time)
    
    if (isValid) {
      showMainButton('Построить карту', handleSubmit)
    } else {
      hideMainButton()
    }
    
    return () => {
      hideMainButton()
    }
  }, [formData, showMainButton, hideMainButton])

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=ru`
      )
      const data = await response.json()
      setCitySuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Failed to search cities', error)
    }
  }

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value })
    searchCities(value)
  }

  const selectCity = (suggestion: any) => {
    hapticFeedback('selection')
    
    // Get timezone from coordinates
    const lat = parseFloat(suggestion.lat)
    const lon = parseFloat(suggestion.lon)
    
    setFormData({
      ...formData,
      city: suggestion.display_name,
      lat,
      lon,
      // Timezone will be determined on the server
      timezone: '',
    })
    
    setShowSuggestions(false)
    setCitySuggestions([])
  }

  const handleSubmit = async () => {
    hapticFeedback('impact', 'medium')
    
    // Validate form
    try {
      chartInputSchema.parse(formData)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        hapticFeedback('notification', 'error')
        showAlert(Object.values(fieldErrors)[0])
        return
      }
    }

    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem('lastChartInput', JSON.stringify(formData))

      // Send to API
      const response = await fetch('/api/chart/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to build chart')
      }

      const data = await response.json()
      hapticFeedback('notification', 'success')
      
      // Navigate to chart view
      router.push(`/chart/${data.id}`)
    } catch (error) {
      hapticFeedback('notification', 'error')
      showAlert('Ошибка при построении карты. Попробуйте еще раз.')
      console.error('Failed to submit', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-6">Новая натальная карта</h1>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Имя</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите имя"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Дата рождения</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Время рождения</label>
          <div className="space-y-2">
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value, unknownTime: false })}
              disabled={formData.unknownTime}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.unknownTime}
                onChange={(e) => {
                  hapticFeedback('selection')
                  setFormData({ ...formData, unknownTime: e.target.checked, time: '' })
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm">Не знаю время</span>
            </label>
          </div>
          {errors.time && !formData.unknownTime && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>

        {/* City Input with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium mb-2">Город рождения</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleCityChange(e.target.value)}
            onFocus={() => formData.city && searchCities(formData.city)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Начните вводить название города"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          
          {/* City suggestions dropdown */}
          {showSuggestions && citySuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {citySuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectCity(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
                  <div className="text-sm text-gray-500">{suggestion.display_name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hidden timezone field - will be calculated server-side */}
        <input type="hidden" value={formData.timezone} />

        {/* Submit button for non-TWA environments */}
        {typeof window !== 'undefined' && !window.Telegram?.WebApp && (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || !formData.date || !formData.city || (!formData.unknownTime && !formData.time)}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {isLoading ? 'Построение...' : 'Построить карту'}
          </button>
        )}
      </div>
    </div>
  )
}