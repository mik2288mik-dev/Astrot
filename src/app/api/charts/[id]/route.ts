import { NextRequest, NextResponse } from 'next/server';
import { extractTelegramUser } from '@/lib/auth/telegram';
import { UserService } from '@/lib/services/user.service';
import { ChartService } from '@/lib/services/chart.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Схема валидации для обновления карты
const UpdateChartSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  pinned: z.boolean().optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - получить карту по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Получаем пользователя
    const user = await UserService.getByTgId(telegramUser.id.toString());
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Получаем карту
    const chart = await ChartService.getById(params.id, user.id);
    
    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, chart });
  } catch (error) {
    console.error('Error fetching chart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - обновить карту
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const data = await request.json();
    const updateData = UpdateChartSchema.parse(data);
    
    // Получаем пользователя
    const user = await UserService.getByTgId(telegramUser.id.toString());
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Обновляем карту
    await ChartService.update(params.id, user.id, updateData);
    
    // Получаем обновленную карту
    const chart = await ChartService.getById(params.id, user.id);
    
    return NextResponse.json({ success: true, chart });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error updating chart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - удалить карту
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Получаем пользователя
    const user = await UserService.getByTgId(telegramUser.id.toString());
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Удаляем карту
    await ChartService.delete(params.id, user.id);
    
    return NextResponse.json({ success: true, message: 'Chart deleted' });
  } catch (error) {
    console.error('Error deleting chart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}