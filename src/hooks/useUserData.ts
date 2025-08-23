import { useState, useEffect, useCallback } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import { ProfileService } from '@/services/profile.service'
import { NatalChartService } from '@/services/natal-chart.service'
import { DailyAdviceService } from '@/services/daily-advice.service'
import { UserSettingsService } from '@/services/user-settings.service'
import type { 
  ProfileWithRelations, 
  NatalChart, 
  DailyAdvice, 
  UserSettings 
} from '@/types/database'

interface UseUserDataReturn {
  // Data
  profile: ProfileWithRelations | null
  natalChart: NatalChart | null
  todayAdvice: DailyAdvice | null
  settings: UserSettings | null
  
  // Loading states
  isLoading: boolean
  isInitializing: boolean
  
  // Error states
  error: string | null
  
  // Actions
  initializeUser: () => Promise<void>
  updateBirthData: (data: {
    birth_date: string
    birth_time: string
    birth_place: string
  }) => Promise<boolean>
  refreshNatalChart: () => Promise<void>
  refreshDailyAdvice: () => Promise<void>
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>
}

export function useUserData(): UseUserDataReturn {
  const { user: telegramUser, isReady: isTelegramReady } = useTelegram()
  
  // State
  const [profile, setProfile] = useState<ProfileWithRelations | null>(null)
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null)
  const [todayAdvice, setTodayAdvice] = useState<DailyAdvice | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initialize or fetch user profile
   */
  const initializeUser = useCallback(async () => {
    if (!telegramUser?.id) {
      setError('Telegram user not available')
      setIsInitializing(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Try to get existing profile
      let userProfile = await ProfileService.getProfileByTelegramId(telegramUser.id)
      
      // If no profile exists, create one
      if (!userProfile) {
        const newProfile = await ProfileService.upsertProfile({
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null
        })
        
        if (newProfile) {
          userProfile = await ProfileService.getProfileByTelegramId(telegramUser.id)
        }
      }
      
      if (!userProfile) {
        throw new Error('Failed to initialize user profile')
      }

      setProfile(userProfile)
      
      // Load related data
      if (userProfile.natal_chart) {
        // Handle array or single value from Supabase join
        const chart = Array.isArray(userProfile.natal_chart) 
          ? userProfile.natal_chart[0] 
          : userProfile.natal_chart
        setNatalChart(chart)
      }
      
      // Load or create settings
      const userSettings = userProfile.settings || 
        await UserSettingsService.createDefaultSettings(userProfile.id)
      // Handle array or single value from Supabase join
      const settings = Array.isArray(userSettings) 
        ? userSettings[0] 
        : userSettings
      setSettings(settings)
      
      // Load today's advice if birth data is complete
      if (ProfileService.hasCompleteBirthData(userProfile)) {
        const advice = await DailyAdviceService.getTodayAdvice(userProfile.id)
        setTodayAdvice(advice)
      }
      
    } catch (err) {
      console.error('Error initializing user:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize user')
    } finally {
      setIsLoading(false)
      setIsInitializing(false)
    }
  }, [telegramUser])

  /**
   * Update user birth data
   */
  const updateBirthData = useCallback(async (birthData: {
    birth_date: string
    birth_time: string
    birth_place: string
  }): Promise<boolean> => {
    if (!profile) {
      setError('Profile not initialized')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const updatedProfile = await ProfileService.updateBirthData(
        profile.id,
        birthData
      )
      
      if (!updatedProfile) {
        throw new Error('Failed to update birth data')
      }

      // Refresh profile with relations
      const refreshedProfile = await ProfileService.getProfileById(profile.id)
      if (refreshedProfile) {
        setProfile(refreshedProfile)
      }
      
      return true
    } catch (err) {
      console.error('Error updating birth data:', err)
      setError(err instanceof Error ? err.message : 'Failed to update birth data')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  /**
   * Refresh natal chart (force recalculation)
   */
  const refreshNatalChart = useCallback(async () => {
    if (!profile || !ProfileService.hasCompleteBirthData(profile)) {
      setError('Birth data not complete')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // This would trigger a recalculation through your astrology service
      // For now, just fetch the existing one
      const chart = await NatalChartService.getByProfileId(profile.id)
      setNatalChart(chart)
    } catch (err) {
      console.error('Error refreshing natal chart:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh natal chart')
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  /**
   * Refresh daily advice (force regeneration)
   */
  const refreshDailyAdvice = useCallback(async () => {
    if (!profile || !ProfileService.hasCompleteBirthData(profile)) {
      setError('Birth data not complete')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Check if advice already exists for today
      const existingAdvice = await DailyAdviceService.getTodayAdvice(profile.id)
      
      if (existingAdvice) {
        setTodayAdvice(existingAdvice)
      } else {
        // Here you would generate new advice using OpenAI
        // For now, just set null
        setTodayAdvice(null)
      }
    } catch (err) {
      console.error('Error refreshing daily advice:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh advice')
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  /**
   * Update user settings
   */
  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (!profile) {
      setError('Profile not initialized')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const updatedSettings = await UserSettingsService.updateSettings(
        profile.id,
        updates
      )
      
      if (updatedSettings) {
        setSettings(updatedSettings)
      }
    } catch (err) {
      console.error('Error updating settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  // Initialize user when Telegram is ready
  useEffect(() => {
    if (isTelegramReady && telegramUser?.id) {
      initializeUser()
    }
  }, [isTelegramReady, telegramUser?.id, initializeUser])

  return {
    // Data
    profile,
    natalChart,
    todayAdvice,
    settings,
    
    // Loading states
    isLoading,
    isInitializing,
    
    // Error states
    error,
    
    // Actions
    initializeUser,
    updateBirthData,
    refreshNatalChart,
    refreshDailyAdvice,
    updateSettings
  }
}