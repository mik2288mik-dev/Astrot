import { createClient } from '@supabase/supabase-js'
import { ChartInput, ChartComputed } from '@/lib/astro/types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SavedChart {
  id: string
  user_id?: string
  input: ChartInput
  computed: ChartComputed
  created_at: string
  updated_at: string
  is_public: boolean
  share_token?: string
}

export interface ChartPreview {
  id: string
  name: string
  date: string
  city: string
  sun_sign: string
  moon_sign: string
  asc_sign: string
  created_at: string
}

/**
 * Save a chart to the database
 */
export async function saveChart(
  chart: ChartComputed,
  userId?: string
): Promise<SavedChart | null> {
  try {
    // Generate a unique share token
    const shareToken = Math.random().toString(36).substring(2, 15)
    
    const { data, error } = await supabase
      .from('charts')
      .insert({
        user_id: userId,
        input: chart.input,
        computed: chart,
        share_token: shareToken,
        is_public: false,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving chart:', error)
      return null
    }
    
    return data as SavedChart
  } catch (error) {
    console.error('Error saving chart:', error)
    return null
  }
}

/**
 * Get a chart by ID
 */
export async function getChart(id: string): Promise<SavedChart | null> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching chart:', error)
      return null
    }
    
    return data as SavedChart
  } catch (error) {
    console.error('Error fetching chart:', error)
    return null
  }
}

/**
 * Get a chart by share token
 */
export async function getChartByToken(token: string): Promise<SavedChart | null> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('share_token', token)
      .eq('is_public', true)
      .single()
    
    if (error) {
      console.error('Error fetching chart by token:', error)
      return null
    }
    
    return data as SavedChart
  } catch (error) {
    console.error('Error fetching chart by token:', error)
    return null
  }
}

/**
 * Get all charts for a user
 */
export async function getMyCharts(userId: string): Promise<ChartPreview[]> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('id, input, computed, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user charts:', error)
      return []
    }
    
    // Transform to preview format
    const previews: ChartPreview[] = data.map(chart => {
      const computed = chart.computed as ChartComputed
      const sun = computed.planets.find(p => p.name === 'Sun')
      const moon = computed.planets.find(p => p.name === 'Moon')
      const ascSign = getSignFromDegree(computed.ascendant)
      
      return {
        id: chart.id,
        name: chart.input.name,
        date: chart.input.date,
        city: chart.input.city,
        sun_sign: sun?.sign || '',
        moon_sign: moon?.sign || '',
        asc_sign: ascSign,
        created_at: chart.created_at,
      }
    })
    
    return previews
  } catch (error) {
    console.error('Error fetching user charts:', error)
    return []
  }
}

/**
 * Update chart visibility
 */
export async function updateChartVisibility(
  id: string,
  isPublic: boolean,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('charts')
      .update({ is_public: isPublic })
      .eq('id', id)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error updating chart visibility:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error updating chart visibility:', error)
    return false
  }
}

/**
 * Delete a chart
 */
export async function deleteChart(id: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('charts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting chart:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting chart:', error)
    return false
  }
}

/**
 * Helper function to get zodiac sign from degree
 */
function getSignFromDegree(degree: number): string {
  const signs = [
    'Овен', 'Телец', 'Близнецы', 'Рак',
    'Лев', 'Дева', 'Весы', 'Скорпион',
    'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ]
  const signIndex = Math.floor(degree / 30)
  return signs[signIndex]
}

/**
 * Search charts by name
 */
export async function searchCharts(
  userId: string,
  query: string
): Promise<ChartPreview[]> {
  try {
    const { data, error } = await supabase
      .from('charts')
      .select('id, input, computed, created_at')
      .eq('user_id', userId)
      .ilike('input->>name', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('Error searching charts:', error)
      return []
    }
    
    // Transform to preview format
    const previews: ChartPreview[] = data.map(chart => {
      const computed = chart.computed as ChartComputed
      const sun = computed.planets.find(p => p.name === 'Sun')
      const moon = computed.planets.find(p => p.name === 'Moon')
      const ascSign = getSignFromDegree(computed.ascendant)
      
      return {
        id: chart.id,
        name: chart.input.name,
        date: chart.input.date,
        city: chart.input.city,
        sun_sign: sun?.sign || '',
        moon_sign: moon?.sign || '',
        asc_sign: ascSign,
        created_at: chart.created_at,
      }
    })
    
    return previews
  } catch (error) {
    console.error('Error searching charts:', error)
    return []
  }
}