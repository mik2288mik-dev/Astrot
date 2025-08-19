import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-white">Страница не найдена</h2>
          <p className="text-gray-400 max-w-md">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться на главную
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Если проблема повторяется, попробуйте:</p>
            <ul className="mt-2 space-y-1">
              <li>• Обновить страницу</li>
              <li>• Проверить правильность URL</li>
              <li>• Вернуться позже</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}