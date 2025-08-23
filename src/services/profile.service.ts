import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate, 
  ProfileWithRelations 
} from '@/types/database'

export class ProfileService {
  /**
   * Create or update user profile based on Telegram ID
   */
  static async upsertProfile(data: ProfileInsert): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .upsert([data], {
          onConflict: 'telegram_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('Error upserting profile:', handleSupabaseError(error))
        return null
      }

      return profile
    } catch (error) {
      console.error('Unexpected error in upsertProfile:', error)
      return null
    }
  }

  /**
   * Get profile by Telegram ID
   */
  static async getProfileByTelegramId(telegramId: number): Promise<ProfileWithRelations | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          natal_chart:natal_charts(*),
          settings:user_settings(*)
        `)
        .eq('telegram_id', telegramId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        console.error('Error fetching profile:', handleSupabaseError(error))
        return null
      }

      return profile as ProfileWithRelations
    } catch (error) {
      console.error('Unexpected error in getProfileByTelegramId:', error)
      return null
    }
  }

  /**
   * Get profile by ID
   */
  static async getProfileById(id: string): Promise<ProfileWithRelations | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          natal_chart:natal_charts(*),
          settings:user_settings(*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching profile:', handleSupabaseError(error))
        return null
      }

      return profile as ProfileWithRelations
    } catch (error) {
      console.error('Unexpected error in getProfileById:', error)
      return null
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(id: string, data: ProfileUpdate): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', handleSupabaseError(error))
        return null
      }

      return profile
    } catch (error) {
      console.error('Unexpected error in updateProfile:', error)
      return null
    }
  }

  /**
   * Update birth data for profile
   */
  static async updateBirthData(
    profileId: string,
    birthData: {
      birth_date: string
      birth_time: string
      birth_place: string
    }
  ): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(birthData)
        .eq('id', profileId)
        .select()
        .single()

      if (error) {
        console.error('Error updating birth data:', handleSupabaseError(error))
        return null
      }

      return profile
    } catch (error) {
      console.error('Unexpected error in updateBirthData:', error)
      return null
    }
  }

  /**
   * Check if profile has complete birth data
   */
  static hasCompleteBirthData(profile: Profile): boolean {
    return !!(profile.birth_date && profile.birth_time && profile.birth_place)
  }

  /**
   * Delete profile (cascade deletes related data)
   */
  static async deleteProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting profile:', handleSupabaseError(error))
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error in deleteProfile:', error)
      return false
    }
  }
}