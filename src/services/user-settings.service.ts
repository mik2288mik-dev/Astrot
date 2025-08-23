import { supabase, handleSupabaseError } from '@/lib/supabase'
import type { 
  UserSettings, 
  UserSettingsInsert, 
  UserSettingsUpdate 
} from '@/types/database'

export class UserSettingsService {
  /**
   * Get user settings by profile ID
   */
  static async getByProfileId(profileId: string): Promise<UserSettings | null> {
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, return null to create default
          return null
        }
        console.error('Error fetching user settings:', handleSupabaseError(error))
        return null
      }

      return settings
    } catch (error) {
      console.error('Unexpected error in getByProfileId:', error)
      return null
    }
  }

  /**
   * Create default settings for a profile
   */
  static async createDefaultSettings(profileId: string): Promise<UserSettings | null> {
    try {
      const defaultSettings: UserSettingsInsert = {
        profile_id: profileId,
        notifications_enabled: true,
        advice_tone: 'balanced',
        theme: 'light',
        language: 'ru'
      }

      const { data: settings, error } = await supabase
        .from('user_settings')
        .insert([defaultSettings])
        .select()
        .single()

      if (error) {
        console.error('Error creating default settings:', handleSupabaseError(error))
        return null
      }

      return settings
    } catch (error) {
      console.error('Unexpected error in createDefaultSettings:', error)
      return null
    }
  }

  /**
   * Get or create settings for a profile
   */
  static async getOrCreateSettings(profileId: string): Promise<UserSettings | null> {
    try {
      // Try to get existing settings
      let settings = await this.getByProfileId(profileId)
      
      // If no settings exist, create default ones
      if (!settings) {
        settings = await this.createDefaultSettings(profileId)
      }

      return settings
    } catch (error) {
      console.error('Unexpected error in getOrCreateSettings:', error)
      return null
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(
    profileId: string,
    updates: UserSettingsUpdate
  ): Promise<UserSettings | null> {
    try {
      const { data: settings, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('profile_id', profileId)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', handleSupabaseError(error))
        return null
      }

      return settings
    } catch (error) {
      console.error('Unexpected error in updateSettings:', error)
      return null
    }
  }

  /**
   * Toggle notifications
   */
  static async toggleNotifications(profileId: string): Promise<boolean> {
    try {
      // Get current settings
      const settings = await this.getOrCreateSettings(profileId)
      if (!settings) return false

      // Toggle the value
      const newValue = !settings.notifications_enabled
      
      // Update settings
      const updated = await this.updateSettings(profileId, {
        notifications_enabled: newValue
      })

      return updated !== null
    } catch (error) {
      console.error('Unexpected error in toggleNotifications:', error)
      return false
    }
  }

  /**
   * Update theme
   */
  static async updateTheme(
    profileId: string,
    theme: 'light' | 'dark' | 'auto'
  ): Promise<UserSettings | null> {
    return await this.updateSettings(profileId, { theme })
  }

  /**
   * Update advice tone
   */
  static async updateAdviceTone(
    profileId: string,
    tone: 'positive' | 'balanced' | 'realistic'
  ): Promise<UserSettings | null> {
    return await this.updateSettings(profileId, { advice_tone: tone })
  }

  /**
   * Update language
   */
  static async updateLanguage(
    profileId: string,
    language: string
  ): Promise<UserSettings | null> {
    return await this.updateSettings(profileId, { language })
  }

  /**
   * Reset settings to default
   */
  static async resetToDefault(profileId: string): Promise<UserSettings | null> {
    try {
      const defaultSettings: UserSettingsUpdate = {
        notifications_enabled: true,
        advice_tone: 'balanced',
        theme: 'light',
        language: 'ru'
      }

      return await this.updateSettings(profileId, defaultSettings)
    } catch (error) {
      console.error('Unexpected error in resetToDefault:', error)
      return null
    }
  }

  /**
   * Delete user settings (will be recreated with defaults on next access)
   */
  static async deleteSettings(profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('profile_id', profileId)

      if (error) {
        console.error('Error deleting settings:', handleSupabaseError(error))
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error in deleteSettings:', error)
      return false
    }
  }
}