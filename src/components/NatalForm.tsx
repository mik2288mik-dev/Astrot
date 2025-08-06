import React, { useState } from 'react';
import { apiService, NatalData } from '../services/ApiService';
import '../types/telegram';

interface NatalFormProps {
  onResult: (result: any) => void;
  onBack: () => void;
}

const NatalForm: React.FC<NatalFormProps> = ({ onResult, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.date) {
      newErrors.date = 'Дата рождения обязательна';
    }

    if (!formData.time) {
      newErrors.time = 'Время рождения обязательно';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Город рождения обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Получение ID пользователя из Telegram
      let telegramId = 12345; // Заглушка по умолчанию
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
      }

      const natalData: NatalData = {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        city: formData.city,
        telegramId
      };

      const result = await apiService.postNatal(natalData);
      onResult(result);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      setErrors({ submit: 'Произошла ошибка при обработке запроса' });
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<{
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
  }> = ({ label, type, value, onChange, error, placeholder }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border-2 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 ${
          error ? 'border-red-400' : 'border-white border-opacity-30'
        }`}
      />
      {error && (
        <p className="text-red-300 text-xs mt-1">{error}</p>
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden px-4 py-8"
      style={{
        backgroundImage: 'url(/assets/bg-main.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Основной контент */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-bold mb-2">
            🌟 Натальная карта
          </h1>
          <p className="text-blue-200 text-sm opacity-80">
            Введите данные для построения вашей астрологической карты
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            
            <InputField
              label="Имя"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              placeholder="Ваше имя"
            />

            <InputField
              label="Дата рождения"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
              error={errors.date}
            />

            <InputField
              label="Время рождения"
              type="time"
              value={formData.time}
              onChange={(value) => handleInputChange('time', value)}
              error={errors.time}
            />

            <InputField
              label="Город рождения"
              type="text"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              error={errors.city}
              placeholder="Москва, Санкт-Петербург..."
            />

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
                <p className="text-red-300 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-6 bg-gray-600 bg-opacity-50 text-white rounded-lg font-medium transition-all duration-200 hover:bg-opacity-70 active:scale-95"
              >
                Назад
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-purple-600 hover:to-pink-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Обработка...
                  </>
                ) : (
                  'Показать натальную карту'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Информационный блок */}
        <div className="mt-6 bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-white text-sm font-medium mb-2">💡 Совет:</h3>
          <p className="text-blue-200 text-xs leading-relaxed">
            Для более точного анализа укажите максимально точное время рождения. 
            Если точное время неизвестно, можно указать приблизительное.
          </p>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-8 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-12 w-1 h-1 bg-pink-300 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-32 left-16 w-3 h-3 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 right-8 w-1 h-1 bg-white rounded-full animate-ping opacity-70"></div>
    </div>
  );
};

export default NatalForm;
