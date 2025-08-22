import { NextRequest, NextResponse } from 'next/server';
import { extractTelegramUser } from '@/lib/auth/telegram';
import { UserService } from '@/lib/services/user.service';
import { ChartService } from '@/lib/services/chart.service';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Схема валидации для создания карты
const CreateChartSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  inputData: z.any(), // BirthData
  chartData: z.any(), // Результаты расчета
  timeUnknown: z.boolean().optional(),
  houseSystem: z.string().optional(),
});

// GET - получить все карты пользователя
export async function GET(request: NextRequest) {
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
    
    // Получаем карты пользователя
    const charts = await ChartService.getUserCharts(user.id);
    
    return NextResponse.json({ success: true, charts });
  } catch (error) {
    console.error('Error fetching charts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - создать новую карту
export async function POST(request: NextRequest) {
  try {
    const telegramUser = extractTelegramUser(request);
    
    if (!telegramUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const data = await request.json();
    const chartData = CreateChartSchema.parse(data);
    
    // Получаем или создаем пользователя
    const user = await UserService.findOrCreate(telegramUser);
    
    // Создаем карту
    const chart = await ChartService.create(user.id, chartData);
    
    return NextResponse.json({ success: true, chart }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating chart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}