import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { 
  DailyAdvice, 
  DailyAdviceInsert,
  AstroContext,
  Json
} from '@/types/database'

export class DailyAdviceService {
  /**
   * Get today's advice for a profile
   */
  static async getTodayAdvice(profileId: string): Promise<DailyAdvice | null> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: advice, error } = await supabase
        .from('daily_advice')
        .select('*')
        .eq('profile_id', profileId)
        .eq('date', today)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No advice found for today
          return null
        }
        console.error('Error fetching daily advice:', handleSupabaseError(error))
        return null
      }

      return advice
    } catch (error) {
      console.error('Unexpected error in getTodayAdvice:', error)
      return null
    }
  }

  /**
   * Get advice for a specific date
   */
  static async getAdviceByDate(
    profileId: string, 
    date: string
  ): Promise<DailyAdvice | null> {
    try {
      const { data: advice, error } = await supabase
        .from('daily_advice')
        .select('*')
        .eq('profile_id', profileId)
        .eq('date', date)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null
        }
        console.error('Error fetching advice by date:', handleSupabaseError(error))
        return null
      }

      return advice
    } catch (error) {
      console.error('Unexpected error in getAdviceByDate:', error)
      return null
    }
  }

  /**
   * Get advice history for a profile
   */
  static async getAdviceHistory(
    profileId: string,
    limit: number = 30
  ): Promise<DailyAdvice[]> {
    try {
      const { data: adviceList, error } = await supabase
        .from('daily_advice')
        .select('*')
        .eq('profile_id', profileId)
        .order('date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching advice history:', handleSupabaseError(error))
        return []
      }

      return adviceList || []
    } catch (error) {
      console.error('Unexpected error in getAdviceHistory:', error)
      return []
    }
  }

  /**
   * Save new daily advice
   */
  static async saveAdvice(
    profileId: string,
    adviceText: string,
    astroContext?: AstroContext
  ): Promise<DailyAdvice | null> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const insertData: DailyAdviceInsert = {
        profile_id: profileId,
        date: today,
        advice_text: adviceText,
        astro_context: astroContext ? (astroContext as unknown as Json) : undefined
      }

      const { data: advice, error } = await supabase
        .from('daily_advice')
        .upsert([insertData], {
          onConflict: 'profile_id,date'
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving daily advice:', handleSupabaseError(error))
        return null
      }

      return advice
    } catch (error) {
      console.error('Unexpected error in saveAdvice:', error)
      return null
    }
  }

  /**
   * Check if advice exists for today
   */
  static async hasAdviceForToday(profileId: string): Promise<boolean> {
    const advice = await this.getTodayAdvice(profileId)
    return advice !== null
  }

  /**
   * Delete old advice (older than specified days)
   */
  static async deleteOldAdvice(
    profileId: string,
    daysToKeep: number = 30
  ): Promise<boolean> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

      const { error } = await supabase
        .from('daily_advice')
        .delete()
        .eq('profile_id', profileId)
        .lt('date', cutoffDateStr)

      if (error) {
        console.error('Error deleting old advice:', handleSupabaseError(error))
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error in deleteOldAdvice:', error)
      return false
    }
  }

  /**
   * Get parsed astro context
   */
  static getParsedAstroContext(advice: DailyAdvice): AstroContext | null {
    try {
      if (!advice.astro_context) return null
      return advice.astro_context as unknown as AstroContext
    } catch (error) {
      console.error('Error parsing astro context:', error)
      return null
    }
  }

  /**
   * Get advice statistics
   */
  static async getAdviceStats(profileId: string): Promise<{
    totalAdvice: number
    firstAdviceDate: string | null
    lastAdviceDate: string | null
  }> {
    try {
      const { data: adviceList, error } = await supabase
        .from('daily_advice')
        .select('date')
        .eq('profile_id', profileId)
        .order('date', { ascending: true })

      if (error || !adviceList || adviceList.length === 0) {
        return {
          totalAdvice: 0,
          firstAdviceDate: null,
          lastAdviceDate: null
        }
      }

      return {
        totalAdvice: adviceList.length,
        firstAdviceDate: adviceList[0]?.date || null,
        lastAdviceDate: adviceList[adviceList.length - 1]?.date || null
      }
    } catch (error) {
      console.error('Unexpected error in getAdviceStats:', error)
      return {
        totalAdvice: 0,
        firstAdviceDate: null,
        lastAdviceDate: null
      }
    }
  }
}