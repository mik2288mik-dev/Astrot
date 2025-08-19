import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { extractTelegramUser, extractTelegramUserFromBody } from '@/lib/auth/telegram';
import { ProfileApiSchema, Profile } from '@/types/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - получить профиль по tgId
export async function GET(request: NextRequest) {
  try {
    // Try to authenticate via Telegram
    const telegramUser = extractTelegramUser(request);
    let tgId: string;
    
    if (telegramUser) {
      tgId = telegramUser.id.toString();
    } else {
      // Fallback to query parameter for backward compatibility
      const { searchParams } = new URL(request.url);
      const tgIdParam = searchParams.get('tgId');
      
      if (!tgIdParam) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      tgId = tgIdParam;
    }
    
    const profile = await kv.get(`profile:${tgId}`);
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - создать новый профиль
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract Telegram user for authentication
    const telegramUser = extractTelegramUser(request) || extractTelegramUserFromBody(data);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Telegram authentication required' }, { status: 401 });
    }
    
    const profile = ProfileApiSchema.parse({
      ...data,
      tgId: telegramUser.id, // Use authenticated user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Проверяем, не существует ли уже профиль
    const existingProfile = await kv.get(`profile:${profile.tgId}`);
    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 });
    }
    
    await kv.set(`profile:${profile.tgId}`, profile);
    
    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - обновить профиль
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract Telegram user for authentication
    const telegramUser = extractTelegramUser(request) || extractTelegramUserFromBody(data);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Telegram authentication required' }, { status: 401 });
    }
    
    const updatedData = {
      ...data,
      tgId: telegramUser.id, // Use authenticated user ID
      updatedAt: new Date().toISOString()
    };
    
    const profile = ProfileApiSchema.parse(updatedData);
    
    // Проверяем, существует ли профиль
    const existingProfile = await kv.get(`profile:${profile.tgId}`);
    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    // Сохраняем дату создания из существующего профиля
    const finalProfile = {
      ...profile,
      createdAt: (existingProfile as Profile).createdAt || new Date().toISOString()
    };
    
    await kv.set(`profile:${profile.tgId}`, finalProfile);
    
    return NextResponse.json({ success: true, profile: finalProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - удалить профиль
export async function DELETE(request: NextRequest) {
  try {
    // Try to authenticate via Telegram
    const telegramUser = extractTelegramUser(request);
    let tgId: string;
    
    if (telegramUser) {
      tgId = telegramUser.id.toString();
    } else {
      // Fallback to query parameter for backward compatibility
      const { searchParams } = new URL(request.url);
      const tgIdParam = searchParams.get('tgId');
      
      if (!tgIdParam) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      tgId = tgIdParam;
    }
    
    const profile = await kv.get(`profile:${tgId}`);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    await kv.del(`profile:${tgId}`);
    
    return NextResponse.json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}