import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { 
  NatalChart, 
  NatalChartInsert, 
  NatalChartData 
} from '@/types/database'

export class NatalChartService {
  /**
   * Get natal chart by profile ID
   */
  static async getByProfileId(profileId: string): Promise<NatalChart | null> {
    try {
      const { data: chart, error } = await supabase
        .from('natal_charts')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No chart found
          return null
        }
        console.error('Error fetching natal chart:', handleSupabaseError(error))
        return null
      }

      return chart
    } catch (error) {
      console.error('Unexpected error in getByProfileId:', error)
      return null
    }
  }

  /**
   * Create or update natal chart
   */
  static async upsert(data: NatalChartInsert): Promise<NatalChart | null> {
    try {
      const { data: chart, error } = await supabase
        .from('natal_charts')
        .upsert([data], {
          onConflict: 'profile_id'
        })
        .select()
        .single()

      if (error) {
        console.error('Error upserting natal chart:', handleSupabaseError(error))
        return null
      }

      return chart
    } catch (error) {
      console.error('Unexpected error in upsert:', error)
      return null
    }
  }

  /**
   * Save calculated natal chart data
   */
  static async saveCalculation(
    profileId: string,
    chartData: NatalChartData
  ): Promise<NatalChart | null> {
    try {
      // Extract main signs for quick access
      const sunSign = chartData.planets.sun.sign
      const moonSign = chartData.planets.moon.sign
      const ascendant = chartData.houses[0]?.sign || ''

      const insertData: NatalChartInsert = {
        profile_id: profileId,
        sun_sign: sunSign,
        moon_sign: moonSign,
        ascendant: ascendant,
        full_data: chartData as any,
        calculated_at: new Date().toISOString()
      }

      return await this.upsert(insertData)
    } catch (error) {
      console.error('Unexpected error in saveCalculation:', error)
      return null
    }
  }

  /**
   * Check if natal chart needs recalculation
   * Returns true if chart is older than 30 days or doesn't exist
   */
  static needsRecalculation(chart: NatalChart | null): boolean {
    if (!chart) return true

    const calculatedAt = new Date(chart.calculated_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return calculatedAt < thirtyDaysAgo
  }

  /**
   * Get parsed chart data
   */
  static getParsedChartData(chart: NatalChart): NatalChartData | null {
    try {
      if (!chart.full_data) return null
      return chart.full_data as unknown as NatalChartData
    } catch (error) {
      console.error('Error parsing chart data:', error)
      return null
    }
  }

  /**
   * Delete natal chart
   */
  static async delete(profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('natal_charts')
        .delete()
        .eq('profile_id', profileId)

      if (error) {
        console.error('Error deleting natal chart:', handleSupabaseError(error))
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error in delete:', error)
      return false
    }
  }

  /**
   * Get chart summary (main signs)
   */
  static getChartSummary(chart: NatalChart): {
    sunSign: string
    moonSign: string
    ascendant: string
  } | null {
    if (!chart) return null

    return {
      sunSign: chart.sun_sign || 'Unknown',
      moonSign: chart.moon_sign || 'Unknown',
      ascendant: chart.ascendant || 'Unknown'
    }
  }
}