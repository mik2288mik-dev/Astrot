import { NextRequest, NextResponse } from 'next/server';
import { extractTelegramUser, extractTelegramUserFromBody } from '@/lib/auth/telegram';
import { UserService } from '@/lib/services/user.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Схема валидации профиля
const ProfileSchema = z.object({
  birthDate: z.string(),
  birthTime: z.string().optional(),
  timeUnknown: z.boolean().optional(),
  birthPlace: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  tzOffset: z.number(),
  name: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  houseSystem: z.string().optional().default('P'),
});

// GET - получить профиль текущего пользователя
export async function GET(request: NextRequest) {
  try {
    // Аутентификация через Telegram
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Находим или создаем пользователя
    const user = await UserService.findOrCreate(telegramUser);
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        tgId: user.tgId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
        photoUrl: user.photoUrl,
      },
      profile: user.profile 
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT - создать или обновить профиль
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Аутентификация через Telegram
    const telegramUser = extractTelegramUser(request) || extractTelegramUserFromBody(data);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Telegram authentication required' }, { status: 401 });
    }
    
    // Валидация данных
    const profileData = ProfileSchema.parse(data);
    
    // Находим или создаем пользователя
    const user = await UserService.findOrCreate(telegramUser);
    
    // Преобразуем дату в DateTime
    const birthDateTime = new Date(profileData.birthDate);
    if (profileData.birthTime && !profileData.timeUnknown) {
      const [hours, minutes] = profileData.birthTime.split(':').map(Number);
      birthDateTime.setHours(hours, minutes, 0, 0);
    }
    
    // Создаем или обновляем профиль
    const profile = await UserService.upsertProfile(user.id, {
      birthDate: birthDateTime,
      birthTime: profileData.birthTime,
      timeUnknown: profileData.timeUnknown || false,
      birthPlace: profileData.birthPlace,
      latitude: profileData.latitude,
      longitude: profileData.longitude,
      timezone: profileData.timezone,
      tzOffset: profileData.tzOffset,
      name: profileData.name,
      gender: profileData.gender,
      email: profileData.email,
      phone: profileData.phone,
      houseSystem: profileData.houseSystem || 'P',
    });
    
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating/updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Алиас для POST
export const PUT = POST;

// DELETE - удалить профиль
export async function DELETE(request: NextRequest) {
  try {
    // Аутентификация через Telegram
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Получаем пользователя
    const user = await UserService.getByTgId(telegramUser.id.toString());
    
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    // Удаляем профиль
    await UserService.deleteProfile(user.id);
    
    return NextResponse.json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}