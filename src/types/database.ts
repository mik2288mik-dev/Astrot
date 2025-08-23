export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          birth_date: string | null
          birth_time: string | null
          birth_place: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      natal_charts: {
        Row: {
          id: string
          profile_id: string
          sun_sign: string | null
          moon_sign: string | null
          ascendant: string | null
          full_data: Json | null
          calculated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          sun_sign?: string | null
          moon_sign?: string | null
          ascendant?: string | null
          full_data?: Json | null
          calculated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          sun_sign?: string | null
          moon_sign?: string | null
          ascendant?: string | null
          full_data?: Json | null
          calculated_at?: string
        }
      }
      daily_advice: {
        Row: {
          id: string
          profile_id: string
          date: string
          advice_text: string | null
          astro_context: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          date: string
          advice_text?: string | null
          astro_context?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          date?: string
          advice_text?: string | null
          astro_context?: Json | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          profile_id: string
          notifications_enabled: boolean
          advice_tone: 'positive' | 'balanced' | 'realistic'
          theme: 'light' | 'dark' | 'auto'
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          notifications_enabled?: boolean
          advice_tone?: 'positive' | 'balanced' | 'realistic'
          theme?: 'light' | 'dark' | 'auto'
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          notifications_enabled?: boolean
          advice_tone?: 'positive' | 'balanced' | 'realistic'
          theme?: 'light' | 'dark' | 'auto'
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      advice_tone: 'positive' | 'balanced' | 'realistic'
      theme: 'light' | 'dark' | 'auto'
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type NatalChart = Database['public']['Tables']['natal_charts']['Row']
export type NatalChartInsert = Database['public']['Tables']['natal_charts']['Insert']
export type NatalChartUpdate = Database['public']['Tables']['natal_charts']['Update']

export type DailyAdvice = Database['public']['Tables']['daily_advice']['Row']
export type DailyAdviceInsert = Database['public']['Tables']['daily_advice']['Insert']
export type DailyAdviceUpdate = Database['public']['Tables']['daily_advice']['Update']

export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

// Extended types with relations
export interface ProfileWithRelations extends Profile {
  natal_chart?: NatalChart | null
  settings?: UserSettings | null
  daily_advice?: DailyAdvice[]
}

// Natal chart full data structure
export interface NatalChartData {
  planets: {
    sun: PlanetPosition
    moon: PlanetPosition
    mercury: PlanetPosition
    venus: PlanetPosition
    mars: PlanetPosition
    jupiter: PlanetPosition
    saturn: PlanetPosition
    uranus: PlanetPosition
    neptune: PlanetPosition
    pluto: PlanetPosition
  }
  houses: House[]
  aspects: Aspect[]
  elements: ElementDistribution
  modalities: ModalityDistribution
}

export interface PlanetPosition {
  sign: string
  degree: number
  house: number
  retrograde: boolean
}

export interface House {
  number: number
  sign: string
  degree: number
}

export interface Aspect {
  planet1: string
  planet2: string
  type: string
  degree: number
  orb: number
}

export interface ElementDistribution {
  fire: number
  earth: number
  air: number
  water: number
}

export interface ModalityDistribution {
  cardinal: number
  fixed: number
  mutable: number
}

// Astro context for daily advice
export interface AstroContext {
  current_transits: {
    moon_sign: string
    moon_phase: string
    planetary_positions: Record<string, PlanetPosition>
  }
  personal_transits: {
    major_aspects: Aspect[]
    active_houses: number[]
  }
  energy_level: 'high' | 'medium' | 'low'
  favorable_activities: string[]
}