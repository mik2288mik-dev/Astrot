export interface NatalData {
  name: string;
  date: string;
  time: string;
  city: string;
  telegramId: number;
}

export interface NatalResult {
  id: string;
  name: string;
  birthData: {
    date: string;
    time: string;
    city: string;
  };
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house: number;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    degree: number;
  }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
  interpretation: {
    summary: string;
    personality: string;
    relationships: string;
    career: string;
    health: string;
  };
}

export interface HoroscopeData {
  sign: string;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface HoroscopeResult {
  sign: string;
  period: string;
  date: string;
  prediction: {
    general: string;
    love: string;
    career: string;
    health: string;
    finance: string;
  };
  luckyNumbers: number[];
  luckyColors: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // В продакшене здесь будет реальный URL вашего бэкенда
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://your-backend-api.com/api';
  }

  async postNatal(data: NatalData): Promise<NatalResult> {
    try {
      const response = await fetch(`${this.baseUrl}/natal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error posting natal data:', error);
      
      // Заглушка для демонстрации
      return this.getMockNatalResult(data);
    }
  }

  async getHoroscope(data: HoroscopeData): Promise<HoroscopeResult> {
    try {
      const response = await fetch(`${this.baseUrl}/horoscope?sign=${data.sign}&period=${data.period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting horoscope:', error);
      
      // Заглушка для демонстрации
      return this.getMockHoroscopeResult(data);
    }
  }

  private getMockNatalResult(data: NatalData): NatalResult {
    return {
      id: `natal_${Date.now()}`,
      name: data.name,
      birthData: {
        date: data.date,
        time: data.time,
        city: data.city,
      },
      planets: [
        { name: 'Солнце', sign: 'Лев', degree: 15.5, house: 1 },
        { name: 'Луна', sign: 'Рак', degree: 22.3, house: 12 },
        { name: 'Меркурий', sign: 'Дева', degree: 8.7, house: 2 },
        { name: 'Венера', sign: 'Весы', degree: 12.1, house: 3 },
        { name: 'Марс', sign: 'Скорпион', degree: 28.9, house: 4 },
        { name: 'Юпитер', sign: 'Стрелец', degree: 5.2, house: 5 },
        { name: 'Сатурн', sign: 'Козерог', degree: 18.4, house: 6 },
        { name: 'Уран', sign: 'Водолей', degree: 11.8, house: 7 },
        { name: 'Нептун', sign: 'Рыбы', degree: 25.6, house: 8 },
        { name: 'Плутон', sign: 'Овен', degree: 3.3, house: 9 },
      ],
      houses: [
        { number: 1, sign: 'Лев', degree: 10.5 },
        { number: 2, sign: 'Дева', degree: 15.2 },
        { number: 3, sign: 'Весы', degree: 20.8 },
        { number: 4, sign: 'Скорпион', degree: 25.1 },
        { number: 5, sign: 'Стрелец', degree: 0.7 },
        { number: 6, sign: 'Козерог', degree: 5.3 },
        { number: 7, sign: 'Водолей', degree: 10.5 },
        { number: 8, sign: 'Рыбы', degree: 15.2 },
        { number: 9, sign: 'Овен', degree: 20.8 },
        { number: 10, sign: 'Телец', degree: 25.1 },
        { number: 11, sign: 'Близнецы', degree: 0.7 },
        { number: 12, sign: 'Рак', degree: 5.3 },
      ],
      aspects: [
        { planet1: 'Солнце', planet2: 'Луна', aspect: 'Трин', orb: 2.5 },
        { planet1: 'Венера', planet2: 'Марс', aspect: 'Соединение', orb: 1.2 },
        { planet1: 'Юпитер', planet2: 'Сатурн', aspect: 'Квадрат', orb: 3.8 },
        { planet1: 'Меркурий', planet2: 'Нептун', aspect: 'Секстиль', orb: 2.1 },
      ],
      interpretation: {
        summary: `Добро пожаловать в ваш астрологический портрет, ${data.name}! Ваша натальная карта раскрывает уникальную космическую подпись момента вашего рождения.`,
        personality: 'Вы обладаете сильной индивидуальностью с творческим потенциалом. Ваше Солнце во Льве дает вам природное лидерство и харизму.',
        relationships: 'В отношениях вы цените глубину и эмоциональную связь. Ваша Венера в Весах стремится к гармонии и красоте.',
        career: 'Ваш профессиональный путь связан с творчеством или лидерством. Вы способны вдохновлять других и достигать высоких целей.',
        health: 'Обратите внимание на баланс между работой и отдыхом. Ваша энергия требует правильного направления.',
      },
    };
  }

  private getMockHoroscopeResult(data: HoroscopeData): HoroscopeResult {
    const predictions = {
      'Овен': {
        general: 'Сегодня вас ждет день полный энергии и новых возможностей.',
        love: 'В любви возможны неожиданные встречи и романтические моменты.',
        career: 'Хороший день для карьерных решений и новых проектов.',
        health: 'Энергия на высоте, но не забывайте об отдыхе.',
        finance: 'Финансовые дела требуют осторожности и планирования.',
      },
      'Телец': {
        general: 'День стабильности и практических решений.',
        love: 'Отношения становятся более глубокими и серьезными.',
        career: 'Время для методичной работы и долгосрочного планирования.',
        health: 'Уделите внимание правильному питанию и режиму.',
        finance: 'Хорошее время для инвестиций и сбережений.',
      },
      // Добавить другие знаки по аналогии...
    };

    const defaultPrediction = {
      general: 'Сегодня звезды благоволят вам в новых начинаниях.',
      love: 'В отношениях ожидается гармония и взаимопонимание.',
      career: 'Профессиональная сфера требует активности и решительности.',
      health: 'Здоровье в норме, но стоит больше внимания уделить отдыху.',
      finance: 'Финансовое положение стабильно, избегайте необдуманных трат.',
    };

    return {
      sign: data.sign,
      period: data.period,
      date: new Date().toISOString().split('T')[0],
      prediction: predictions[data.sign as keyof typeof predictions] || defaultPrediction,
      luckyNumbers: [3, 7, 14, 21, 28],
      luckyColors: ['золотой', 'синий', 'зеленый'],
    };
  }
}

export const apiService = new ApiService();