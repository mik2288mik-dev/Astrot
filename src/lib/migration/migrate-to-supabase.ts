'use client';

import { useState, useEffect } from 'react';

interface OldChart {
  id: string;
  userId?: number;
  createdAt: number;
  input: any;
  result: any;
  pinned?: boolean;
  title?: string;
  threads?: any[];
}

interface MigrationResult {
  success: boolean;
  migratedCharts: number;
  migratedProfile: boolean;
  errors: string[];
}

/**
 * Мигрирует данные из localStorage в Supabase
 * Запускается один раз при первом входе пользователя после обновления
 */
export async function migrateToSupabase(initData: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCharts: 0,
    migratedProfile: false,
    errors: [],
  };

  try {
    // 1. Мигрируем профиль пользователя
    const userProfile = localStorage.getItem('userProfile');
    const natalFormData = localStorage.getItem('natalFormData');
    
    if (userProfile || natalFormData) {
      try {
        const profileData = userProfile ? JSON.parse(userProfile) : {};
        const natalData = natalFormData ? JSON.parse(natalFormData) : {};
        
        // Объединяем данные
        const mergedProfile = {
          ...natalData,
          ...profileData,
        };
        
        // Отправляем на сервер
        const profileResponse = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': initData,
          },
          body: JSON.stringify(mergedProfile),
        });
        
        if (profileResponse.ok) {
          result.migratedProfile = true;
          // Удаляем старые данные после успешной миграции
          localStorage.removeItem('userProfile');
          localStorage.removeItem('natalFormData');
        } else {
          const error = await profileResponse.text();
          result.errors.push(`Profile migration failed: ${error}`);
        }
      } catch (err) {
        console.error('Error migrating profile:', err);
        result.errors.push(`Profile migration error: ${err}`);
      }
    }
    
    // 2. Мигрируем натальные карты
    const oldCharts = localStorage.getItem('astrot.charts.v1');
    
    if (oldCharts) {
      try {
        const charts: OldChart[] = JSON.parse(oldCharts);
        
        for (const chart of charts) {
          try {
            // Преобразуем старый формат в новый
            const newChart = {
              title: chart.title || `Карта от ${new Date(chart.createdAt).toLocaleDateString()}`,
              description: undefined,
              inputData: chart.input,
              chartData: chart.result,
              timeUnknown: chart.input?.timeUnknown || false,
              houseSystem: chart.input?.houseSystem || 'P',
              pinned: chart.pinned || false,
            };
            
            // Отправляем на сервер
            const chartResponse = await fetch('/api/charts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Telegram-Init-Data': initData,
              },
              body: JSON.stringify(newChart),
            });
            
            if (chartResponse.ok) {
              result.migratedCharts++;
            } else {
              const error = await chartResponse.text();
              result.errors.push(`Chart ${chart.id} migration failed: ${error}`);
            }
          } catch (err) {
            console.error(`Error migrating chart ${chart.id}:`, err);
            result.errors.push(`Chart ${chart.id} error: ${err}`);
          }
        }
        
        // Если все карты успешно мигрированы, удаляем старые данные
        if (result.migratedCharts === charts.length) {
          localStorage.removeItem('astrot.charts.v1');
        }
      } catch (err) {
        console.error('Error parsing old charts:', err);
        result.errors.push(`Charts parsing error: ${err}`);
      }
    }
    
    // 3. Удаляем другие старые данные
    localStorage.removeItem('natalChart');
    
    // Помечаем миграцию как выполненную
    localStorage.setItem('supabase_migration_completed', 'true');
    localStorage.setItem('supabase_migration_date', new Date().toISOString());
    
    result.success = result.errors.length === 0;
    
    // Миграция завершена
    
  } catch (err) {
    console.error('Migration failed:', err);
    result.errors.push(`General error: ${err}`);
  }
  
  return result;
}

/**
 * Проверяет, нужна ли миграция
 */
export function needsMigration(): boolean {
  // Проверяем, была ли уже выполнена миграция
  if (localStorage.getItem('supabase_migration_completed') === 'true') {
    return false;
  }
  
  // Проверяем наличие старых данных
  const hasOldCharts = localStorage.getItem('astrot.charts.v1') !== null;
  const hasOldProfile = localStorage.getItem('userProfile') !== null;
  const hasOldNatalData = localStorage.getItem('natalFormData') !== null;
  
  return hasOldCharts || hasOldProfile || hasOldNatalData;
}

/**
 * Hook для автоматической миграции при загрузке приложения
 */
export function useMigration(initData: string | undefined) {
  if (typeof window === 'undefined' || !initData) {
    return { migrationNeeded: false, migrationCompleted: false };
  }
  
  const migrationNeeded = needsMigration();
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  
  useEffect(() => {
    if (migrationNeeded && !migrationCompleted) {
      migrateToSupabase(initData).then(result => {
        setMigrationResult(result);
        setMigrationCompleted(true);
        
        // Показываем уведомление пользователю
        if (result.success) {
          // Миграция завершена успешно
        } else {
          console.error('⚠️ Миграция завершена с ошибками:', result.errors);
        }
      });
    }
  }, [migrationNeeded, migrationCompleted, initData]);
  
  return { migrationNeeded, migrationCompleted, migrationResult };
}