import { test, expect } from '@playwright/test';

test.describe('Форма профиля', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на страницу формы профиля
    await page.goto('/profile/form');
  });

  test('отображает пустую форму с корректными полями', async ({ page }) => {
    // Проверяем наличие всех обязательных полей
    await expect(page.locator('input[id="name"]')).toBeVisible();
    await expect(page.locator('input[id="birthDate"]')).toBeVisible();
    await expect(page.locator('input[id="birthTime"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('input[id="location"]')).toBeVisible();
    
    // Проверяем кнопки системы домов
    await expect(page.locator('text=Placidus')).toBeVisible();
    await expect(page.locator('text=Whole Sign')).toBeVisible();
    
    // Проверяем кнопки действий
    await expect(page.locator('text=Новый расчёт')).toBeVisible();
    await expect(page.locator('text=Сохранить профиль')).toBeVisible();
    
    // Кнопка сохранения должна быть отключена
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
  });

  test('показывает ошибки валидации при отправке пустой формы', async ({ page }) => {
    // Пытаемся отправить пустую форму
    await page.click('button:has-text("Сохранить профиль")');
    
    // Проверяем, что кнопка всё ещё отключена
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
  });

  test('работает чекбокс "Не знаю время"', async ({ page }) => {
    // Заполняем обязательные поля
    await page.fill('input[id="name"]', 'Тестовый пользователь');
    await page.fill('input[id="birthDate"]', '1990-01-01');
    await page.fill('input[id="birthTime"]', '12:00');
    
    // Проверяем, что поле времени активно
    await expect(page.locator('input[id="birthTime"]')).not.toBeDisabled();
    
    // Отмечаем чекбокс "Не знаю время"
    await page.check('input[type="checkbox"]');
    
    // Проверяем, что поле времени стало неактивным и очистилось
    await expect(page.locator('input[id="birthTime"]')).toBeDisabled();
    await expect(page.locator('input[id="birthTime"]')).toHaveValue('');
    
    // Снимаем чекбокс
    await page.uncheck('input[type="checkbox"]');
    
    // Проверяем, что поле времени снова активно
    await expect(page.locator('input[id="birthTime"]')).not.toBeDisabled();
  });

  test('работает автодополнение мест', async ({ page }) => {
    // Начинаем вводить название места
    await page.fill('input[id="location"]', 'Моск');
    
    // Ждём появления предложений (с учётом debounce)
    await page.waitForTimeout(500);
    
    // Проверяем, что появились предложения
    await expect(page.locator('[class*="absolute"][class*="z-10"]')).toBeVisible();
    
    // Кликаем на первое предложение
    await page.click('button:has-text("Москва")');
    
    // Проверяем, что место выбрано и показана информация о часовом поясе
    await expect(page.locator('text=📍')).toBeVisible();
    await expect(page.locator('text=🕐')).toBeVisible();
    
    // Проверяем, что список предложений скрылся
    await expect(page.locator('[class*="absolute"][class*="z-10"]')).not.toBeVisible();
  });

  test('переключает систему домов', async ({ page }) => {
    // По умолчанию выбран Placidus
    await expect(page.locator('button:has-text("Placidus")')).toHaveClass(/bg-pastel-purple/);
    await expect(page.locator('button:has-text("Whole Sign")')).not.toHaveClass(/bg-pastel-purple/);
    
    // Переключаем на Whole Sign
    await page.click('button:has-text("Whole Sign")');
    
    // Проверяем, что выбор изменился
    await expect(page.locator('button:has-text("Whole Sign")')).toHaveClass(/bg-pastel-purple/);
    await expect(page.locator('button:has-text("Placidus")')).not.toHaveClass(/bg-pastel-purple/);
  });

  test('сбрасывает форму кнопкой "Новый расчёт"', async ({ page }) => {
    // Заполняем форму
    await page.fill('input[id="name"]', 'Тестовый пользователь');
    await page.fill('input[id="birthDate"]', '1990-01-01');
    await page.fill('input[id="birthTime"]', '12:00');
    await page.fill('input[id="location"]', 'Москва');
    
    // Ждём автодополнения и выбираем место
    await page.waitForTimeout(500);
    await page.click('button:has-text("Москва")');
    
    // Переключаем систему домов
    await page.click('button:has-text("Whole Sign")');
    
    // Нажимаем "Новый расчёт"
    await page.click('button:has-text("Новый расчёт")');
    
    // Проверяем, что форма сброшена
    await expect(page.locator('input[id="name"]')).toHaveValue('');
    await expect(page.locator('input[id="birthDate"]')).toHaveValue('');
    await expect(page.locator('input[id="birthTime"]')).toHaveValue('');
    await expect(page.locator('input[id="location"]')).toHaveValue('');
    await expect(page.locator('input[type="checkbox"]')).not.toBeChecked();
    await expect(page.locator('button:has-text("Placidus")')).toHaveClass(/bg-pastel-purple/);
    
    // Кнопка сохранения должна быть отключена
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
  });

  test('активирует кнопку отправки при заполнении всех обязательных полей', async ({ page }) => {
    // Изначально кнопка отключена
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
    
    // Заполняем имя
    await page.fill('input[id="name"]', 'Тестовый пользователь');
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
    
    // Заполняем дату
    await page.fill('input[id="birthDate"]', '1990-01-01');
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
    
    // Заполняем время
    await page.fill('input[id="birthTime"]', '12:00');
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
    
    // Выбираем место
    await page.fill('input[id="location"]', 'Москва');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Москва")');
    
    // Теперь кнопка должна быть активна
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeEnabled();
  });

  test('активирует кнопку отправки с отмеченным "Не знаю время"', async ({ page }) => {
    // Заполняем обязательные поля кроме времени
    await page.fill('input[id="name"]', 'Тестовый пользователь');
    await page.fill('input[id="birthDate"]', '1990-01-01');
    
    // Отмечаем "Не знаю время"
    await page.check('input[type="checkbox"]');
    
    // Выбираем место
    await page.fill('input[id="location"]', 'Москва');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Москва")');
    
    // Кнопка должна быть активна
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeEnabled();
  });

  test('успешно отправляет данные профиля', async ({ page }) => {
    // Мокаем API ответы
    await page.route('/api/profile', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            profile: {
              tgId: 123456789,
              name: 'Тестовый пользователь',
              birthDate: '1990-01-01',
              birthTime: '12:00',
              timeUnknown: false,
              location: {
                name: 'Москва, Россия',
                lat: 55.7558,
                lon: 37.6176,
                timezone: 'Europe/Moscow',
                tzOffset: 3
              },
              houseSystem: 'P',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          })
        });
      }
    });

    // Мокаем геокодинг API
    await page.route('/api/geocode*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          places: [{
            displayName: 'Москва, Россия',
            lat: 55.7558,
            lon: 37.6176,
            country: 'Россия',
            cityLikeLabel: 'Москва, Россия',
            timezone: 'Europe/Moscow',
            tzOffset: 3
          }]
        })
      });
    });

    // Заполняем форму
    await page.fill('input[id="name"]', 'Тестовый пользователь');
    await page.fill('input[id="birthDate"]', '1990-01-01');
    await page.fill('input[id="birthTime"]', '12:00');
    
    // Выбираем место
    await page.fill('input[id="location"]', 'Москва');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Москва")');
    
    // Отправляем форму
    await page.click('button:has-text("Сохранить профиль")');
    
    // Проверяем, что произошёл редирект на страницу профиля
    await expect(page).toHaveURL('/profile');
  });

  test('загружает существующий профиль для редактирования', async ({ page }) => {
    // Мокаем API для загрузки профиля
    await page.route('/api/profile*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            profile: {
              tgId: 123456789,
              name: 'Существующий пользователь',
              birthDate: '1985-06-15',
              birthTime: '14:30',
              timeUnknown: false,
              location: {
                name: 'Санкт-Петербург, Россия',
                lat: 59.9311,
                lon: 30.3609,
                timezone: 'Europe/Moscow',
                tzOffset: 3
              },
              houseSystem: 'W'
            }
          })
        });
      }
    });

    // Перезагружаем страницу для загрузки данных
    await page.reload();
    
    // Ждём загрузки
    await page.waitForTimeout(1000);
    
    // Проверяем, что форма заполнена существующими данными
    await expect(page.locator('input[id="name"]')).toHaveValue('Существующий пользователь');
    await expect(page.locator('input[id="birthDate"]')).toHaveValue('1985-06-15');
    await expect(page.locator('input[id="birthTime"]')).toHaveValue('14:30');
    await expect(page.locator('input[id="location"]')).toHaveValue('Санкт-Петербург, Россия');
    await expect(page.locator('button:has-text("Whole Sign")')).toHaveClass(/bg-pastel-purple/);
    
    // Заголовок должен указывать на редактирование
    await expect(page.locator('h1')).toContainText('Редактировать профиль');
  });

  test('проверяет валидацию полей формы', async ({ page }) => {
    // Пытаемся ввести невалидные данные
    await page.fill('input[id="name"]', '');
    await page.fill('input[id="birthDate"]', 'invalid-date');
    await page.fill('input[id="birthTime"]', '25:70');
    
    // Кнопка должна оставаться отключённой
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeDisabled();
    
    // Исправляем данные
    await page.fill('input[id="name"]', 'Валидное имя');
    await page.fill('input[id="birthDate"]', '1990-01-01');
    await page.fill('input[id="birthTime"]', '12:00');
    
    // Выбираем место
    await page.fill('input[id="location"]', 'Москва');
    await page.waitForTimeout(500);
    
    // Мокаем геокодинг
    await page.route('/api/geocode*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          places: [{
            displayName: 'Москва, Россия',
            lat: 55.7558,
            lon: 37.6176,
            country: 'Россия',
            cityLikeLabel: 'Москва, Россия',
            timezone: 'Europe/Moscow',
            tzOffset: 3
          }]
        })
      });
    });
    
    await page.click('button:has-text("Москва")');
    
    // Теперь кнопка должна быть активна
    await expect(page.locator('button:has-text("Сохранить профиль")')).toBeEnabled();
  });

  test('работает автодополнение и выбор места', async ({ page }) => {
    // Мокаем геокодинг API
    await page.route('/api/geocode*', async (route) => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q');
      
      if (query === 'Лон') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            places: [
              {
                displayName: 'Лондон, Великобритания',
                lat: 51.5074,
                lon: -0.1278,
                country: 'Великобритания',
                cityLikeLabel: 'Лондон, Великобритания',
                timezone: 'Europe/London',
                tzOffset: 0
              },
              {
                displayName: 'Лонг-Айленд, США',
                lat: 40.7891,
                lon: -73.1350,
                country: 'США',
                cityLikeLabel: 'Лонг-Айленд, США',
                timezone: 'America/New_York',
                tzOffset: -5
              }
            ]
          })
        });
      }
    });

    // Вводим часть названия
    await page.fill('input[id="location"]', 'Лон');
    
    // Ждём появления предложений
    await page.waitForTimeout(500);
    
    // Проверяем, что появились предложения
    await expect(page.locator('button:has-text("Лондон")')).toBeVisible();
    await expect(page.locator('button:has-text("Лонг-Айленд")')).toBeVisible();
    
    // Выбираем Лондон
    await page.click('button:has-text("Лондон")');
    
    // Проверяем, что место выбрано правильно
    await expect(page.locator('input[id="location"]')).toHaveValue('Лондон, Великобритания');
    await expect(page.locator('text=📍 Лондон, Великобритания')).toBeVisible();
    await expect(page.locator('text=🕐 Europe/London (UTC+0)')).toBeVisible();
  });

  test('успешно создаёт новый профиль', async ({ page }) => {
    // Мокаем успешное создание профиля
    await page.route('/api/profile', async (route) => {
      if (route.request().method() === 'POST') {
        const requestBody = await route.request().postDataJSON();
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            profile: {
              ...requestBody,
              tgId: 123456789,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          })
        });
      }
    });

    // Мокаем геокодинг
    await page.route('/api/geocode*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          places: [{
            displayName: 'Москва, Россия',
            lat: 55.7558,
            lon: 37.6176,
            country: 'Россия',
            cityLikeLabel: 'Москва, Россия',
            timezone: 'Europe/Moscow',
            tzOffset: 3
          }]
        })
      });
    });

    // Заполняем форму полностью
    await page.fill('input[id="name"]', 'Новый пользователь');
    await page.fill('input[id="birthDate"]', '1995-03-20');
    await page.fill('input[id="birthTime"]', '09:15');
    
    // Выбираем место
    await page.fill('input[id="location"]', 'Москва');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Москва")');
    
    // Выбираем систему домов
    await page.click('button:has-text("Whole Sign")');
    
    // Отправляем форму
    await page.click('button:has-text("Сохранить профиль")');
    
    // Проверяем редирект на страницу профиля
    await expect(page).toHaveURL('/profile');
  });

  test('успешно обновляет существующий профиль', async ({ page }) => {
    // Мокаем загрузку существующего профиля
    await page.route('/api/profile*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            profile: {
              tgId: 123456789,
              name: 'Старое имя',
              birthDate: '1990-01-01',
              birthTime: '12:00',
              timeUnknown: false,
              location: {
                name: 'Москва, Россия',
                lat: 55.7558,
                lon: 37.6176,
                timezone: 'Europe/Moscow',
                tzOffset: 3
              },
              houseSystem: 'P'
            }
          })
        });
      } else if (route.request().method() === 'PUT') {
        const requestBody = await route.request().postDataJSON();
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            profile: {
              ...requestBody,
              updatedAt: new Date().toISOString()
            }
          })
        });
      }
    });

    // Перезагружаем страницу для загрузки данных
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Изменяем имя
    await page.fill('input[id="name"]', 'Новое имя');
    
    // Отправляем форму
    await page.click('button:has-text("Сохранить профиль")');
    
    // Проверяем редирект
    await expect(page).toHaveURL('/profile');
  });

  test('адаптивный дизайн на мобильных устройствах', async ({ page }) => {
    // Устанавливаем размер мобильного экрана
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Проверяем, что форма корректно отображается
    await expect(page.locator('form')).toBeVisible();
    
    // Проверяем, что кнопки располагаются вертикально на мобильных
    const buttonsContainer = page.locator('div:has(button:has-text("Новый расчёт"))');
    await expect(buttonsContainer).toHaveClass(/flex-col/);
    
    // Проверяем, что поля ввода занимают всю ширину
    await expect(page.locator('input[id="name"]')).toHaveClass(/w-full/);
    await expect(page.locator('input[id="location"]')).toHaveClass(/w-full/);
  });
});