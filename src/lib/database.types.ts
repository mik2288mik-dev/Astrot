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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "natal_charts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "daily_advice_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_settings_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}