export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number; // В Telegram Stars
  icon: string;
}

export interface PaymentData {
  feature: PremiumFeature;
  userId: number;
  paymentId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

class MonetizationService {
  private features: PremiumFeature[] = [
    {
      id: 'premium_access',
      name: 'Премиум доступ',
      description: 'Полный доступ ко всем функциям приложения, детальные натальные карты, персональные прогнозы',
      price: 100, // 100 Telegram Stars
      icon: '⭐',
    },
    {
      id: 'detailed_natal',
      name: 'Детальная натальная карта',
      description: 'Расширенная интерпретация натальной карты с аспектами и транзитами',
      price: 50,
      icon: '🔮',
    },
    {
      id: 'compatibility',
      name: 'Совместимость',
      description: 'Анализ совместимости с партнером по натальным картам',
      price: 75,
      icon: '💕',
    },
    {
      id: 'yearly_forecast',
      name: 'Годовой прогноз',
      description: 'Персональный астрологический прогноз на год',
      price: 150,
      icon: '📅',
    },
  ];

  getFeatures(): PremiumFeature[] {
    return this.features;
  }

  getFeatureById(id: string): PremiumFeature | undefined {
    return this.features.find(feature => feature.id === id);
  }

  async initiatePremiumPayment(userId: number): Promise<PaymentResult> {
    const premiumFeature = this.getFeatureById('premium_access');
    if (!premiumFeature) {
      return { success: false, error: 'Премиум функция не найдена' };
    }

    return this.initiatePayment({ feature: premiumFeature, userId });
  }

  async initiatePayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const tg = window.Telegram?.WebApp;
      
      if (!tg) {
        throw new Error('Telegram WebApp недоступен');
      }

      // В реальном приложении здесь будет вызов вашего бэкенда для создания invoice
      const invoice = await this.createInvoice(paymentData);
      
      return new Promise((resolve) => {
        tg.openInvoice(invoice.url, (status: string) => {
          if (status === 'paid') {
            this.handleSuccessfulPayment(paymentData);
            resolve({
              success: true,
              paymentId: invoice.paymentId,
            });
          } else if (status === 'cancelled') {
            resolve({
              success: false,
              error: 'Платеж отменен пользователем',
            });
          } else if (status === 'failed') {
            resolve({
              success: false,
              error: 'Ошибка при оплате',
            });
          } else {
            resolve({
              success: false,
              error: `Неизвестный статус платежа: ${status}`,
            });
          }
        });
      });
    } catch (error) {
      console.error('Ошибка при инициации платежа:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  }

  private async createInvoice(paymentData: PaymentData) {
    // В реальном приложении здесь будет запрос к вашему бэкенду
    // для создания invoice через Telegram Bot API
    
    // Заглушка для демонстрации
    const mockInvoice = {
      url: 'https://t.me/invoice/demo', // В реальности это будет ссылка на invoice
      paymentId: `payment_${Date.now()}`,
    };

    // Симуляция задержки сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockInvoice;
  }

  private async handleSuccessfulPayment(paymentData: PaymentData) {
    try {
      // Отправка уведомления на бэкенд о успешном платеже
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: paymentData.userId,
          featureId: paymentData.feature.id,
          amount: paymentData.feature.price,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Обновление локального состояния пользователя
        this.updateUserPremiumStatus(paymentData.userId, paymentData.feature.id);
        
        // Показ уведомления об успешной покупке
        this.showSuccessNotification(paymentData.feature);
      }
    } catch (error) {
      console.error('Ошибка при обработке успешного платежа:', error);
    }
  }

  private updateUserPremiumStatus(userId: number, featureId: string) {
    // Сохранение в localStorage для демонстрации
    // В реальном приложении это будет синхронизировано с бэкендом
    const userPremiumFeatures = this.getUserPremiumFeatures(userId);
    userPremiumFeatures.push(featureId);
    localStorage.setItem(`premium_${userId}`, JSON.stringify(userPremiumFeatures));
  }

  getUserPremiumFeatures(userId: number): string[] {
    const stored = localStorage.getItem(`premium_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  hasFeature(userId: number, featureId: string): boolean {
    const userFeatures = this.getUserPremiumFeatures(userId);
    return userFeatures.includes(featureId) || userFeatures.includes('premium_access');
  }

  private showSuccessNotification(feature: PremiumFeature) {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.showAlert(`Спасибо за покупку! ${feature.icon} ${feature.name} теперь доступен.`);
      tg.HapticFeedback.notificationOccurred('success');
    }
  }

  // Функция для показа информации о премиум функциях
  showPremiumInfo() {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const message = `🌟 Премиум возможности:\n\n${this.features.map(f => 
        `${f.icon} ${f.name} - ${f.price} ⭐\n${f.description}`
      ).join('\n\n')}`;
      
      tg.showPopup({
        title: 'Премиум функции',
        message,
        buttons: [
          { id: 'buy', type: 'default', text: 'Купить премиум' },
          { id: 'cancel', type: 'cancel', text: 'Закрыть' }
        ]
      }, (buttonId) => {
        if (buttonId === 'buy') {
          // Здесь можно перенаправить на экран покупки
          console.log('Redirect to premium purchase');
        }
      });
    }
  }

  // Функция для получения статуса подписки пользователя
  async getUserSubscriptionStatus(userId: number) {
    try {
      // В реальном приложении - запрос к бэкенду
      const response = await fetch(`/api/user/${userId}/subscription`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Ошибка при получении статуса подписки:', error);
    }
    
    // Заглушка - проверяем localStorage
    const features = this.getUserPremiumFeatures(userId);
    return {
      hasPremium: features.includes('premium_access'),
      features: features,
      expiresAt: null, // В реальности здесь будет дата окончания подписки
    };
  }
}

export const monetizationService = new MonetizationService();