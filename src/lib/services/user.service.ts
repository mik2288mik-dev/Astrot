import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export class UserService {
  /**
   * Находит или создает пользователя по данным из Telegram
   */
  static async findOrCreate(telegramUser: TelegramUser) {
    const tgId = telegramUser.id.toString()
    
    return prisma.user.upsert({
      where: { tgId },
      update: {
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium || false,
        photoUrl: telegramUser.photo_url,
      },
      create: {
        tgId,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        languageCode: telegramUser.language_code || 'ru',
        isPremium: telegramUser.is_premium || false,
        photoUrl: telegramUser.photo_url,
      },
      include: {
        profile: true,
      }
    })
  }
  
  /**
   * Получает пользователя по Telegram ID
   */
  static async getByTgId(tgId: string) {
    return prisma.user.findUnique({
      where: { tgId },
      include: {
        profile: true,
      }
    })
  }
  
  /**
   * Получает профиль пользователя
   */
  static async getProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      include: { user: true }
    })
  }
  
  /**
   * Создает или обновляет профиль пользователя
   */
  static async upsertProfile(userId: string, data: Prisma.ProfileCreateInput | Prisma.ProfileUpdateInput) {
    // Проверяем существование профиля
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    })
    
    if (existingProfile) {
      // Обновляем существующий профиль
      return prisma.profile.update({
        where: { userId },
        data: data as Prisma.ProfileUpdateInput
      })
    } else {
      // Создаем новый профиль
      return prisma.profile.create({
        data: {
          ...data,
          user: { connect: { id: userId } }
        } as Prisma.ProfileCreateInput
      })
    }
  }
  
  /**
   * Удаляет профиль пользователя
   */
  static async deleteProfile(userId: string) {
    return prisma.profile.delete({
      where: { userId }
    })
  }
}