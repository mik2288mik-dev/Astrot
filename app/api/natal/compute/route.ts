// API роут для расчёта натальной карты
// POST /api/natal/compute

import { NextRequest, NextResponse } from 'next/server';
import { calculateNatalChart } from '@/lib/astro/calc';
import type { BirthData, ChartData } from '@/lib/astro/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birth } = body as { birth: BirthData };

    // Валидация входных данных
    if (!birth) {
      return NextResponse.json(
        { error: 'Missing birth data' },
        { status: 400 }
      );
    }

    // Проверяем обязательные поля
    const requiredFields = ['year', 'month', 'day', 'hour', 'minute', 'lat', 'lon'];
    for (const field of requiredFields) {
      if (birth[field as keyof BirthData] === undefined || birth[field as keyof BirthData] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Валидируем диапазоны значений
    if (birth.year < 1800 || birth.year > 2200) {
      return NextResponse.json(
        { error: 'Year must be between 1800 and 2200' },
        { status: 400 }
      );
    }

    if (birth.month < 1 || birth.month > 12) {
      return NextResponse.json(
        { error: 'Month must be between 1 and 12' },
        { status: 400 }
      );
    }

    if (birth.day < 1 || birth.day > 31) {
      return NextResponse.json(
        { error: 'Day must be between 1 and 31' },
        { status: 400 }
      );
    }

    if (birth.hour < 0 || birth.hour > 23) {
      return NextResponse.json(
        { error: 'Hour must be between 0 and 23' },
        { status: 400 }
      );
    }

    if (birth.minute < 0 || birth.minute > 59) {
      return NextResponse.json(
        { error: 'Minute must be between 0 and 59' },
        { status: 400 }
      );
    }

    if (birth.lat < -90 || birth.lat > 90) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90' },
        { status: 400 }
      );
    }

    if (birth.lon < -180 || birth.lon > 180) {
      return NextResponse.json(
        { error: 'Longitude must be between -180 and 180' },
        { status: 400 }
      );
    }

    // Рассчитываем натальную карту
    const chartData: ChartData = await calculateNatalChart(birth);

    // Возвращаем результат
    return NextResponse.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error computing natal chart:', error);
    
    // Обрабатываем специфические ошибки Swiss Ephemeris
    if (error instanceof Error) {
      if (error.message.includes('swisseph')) {
        return NextResponse.json(
          { error: 'Ephemeris calculation error. Please try again.' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('Invalid date')) {
        return NextResponse.json(
          { error: 'Invalid birth date provided' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during chart calculation' },
      { status: 500 }
    );
  }
}

// Добавляем поддержку CORS для фронтенда
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}