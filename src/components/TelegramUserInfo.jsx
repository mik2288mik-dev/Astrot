import React from 'react';
import { getTelegramUser } from '../lib/telegram-init';

export default function TelegramUserInfo() {
  const user = getTelegramUser();

  if (!user) {
    return null;
  }

  return (
    <div className="glassy p-3 rounded-xl border border-blue-400/30 max-w-sm mx-auto mb-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={user.photo_url || 'https://via.placeholder.com/40/1a1a2e/ffffff?text=*'} 
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-400/50"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-blue-200 font-medium text-sm">
            {user.first_name} {user.last_name || ''}
          </div>
          <div className="text-blue-300 text-xs">
            @{user.username || 'user'}
          </div>
          <div className="text-blue-400 text-xs">
            ID: {user.id}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}