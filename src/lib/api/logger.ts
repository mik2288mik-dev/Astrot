import { NextRequest, NextResponse } from 'next/server';

// Генератор уникальных debug ID
export function generateDebugId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Логирование API запросов
export function logApiRequest(
  endpoint: string,
  method: string,
  debugId: string,
  params?: any
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${method} ${endpoint} [${debugId}] - START`, {
      timestamp: new Date().toISOString(),
      params: params ? JSON.stringify(params) : undefined,
    });
  }
}

// Логирование успешного ответа
export function logApiSuccess(
  endpoint: string,
  debugId: string,
  duration: number,
  cacheHit?: boolean
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${endpoint} [${debugId}] - SUCCESS`, {
      duration: `${duration}ms`,
      cacheHit: cacheHit || false,
      timestamp: new Date().toISOString(),
    });
  }
}

// Логирование ошибки
export function logApiError(
  endpoint: string,
  debugId: string,
  error: any,
  duration: number
) {
  console.error(`[API] ${endpoint} [${debugId}] - ERROR`, {
    duration: `${duration}ms`,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}

// Обёртка для добавления debug headers
export function withDebugHeaders(
  response: NextResponse,
  debugId: string,
  cacheHit?: boolean
): NextResponse {
  response.headers.set('x-debug-id', debugId);
  if (cacheHit) {
    response.headers.set('x-cache-hit', '1');
  }
  return response;
}