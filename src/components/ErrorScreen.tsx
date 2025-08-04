'use client';

import React from 'react';
import { Block, Button } from 'konsta/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Block strong className="text-center p-8 max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600">Ошибка авторизации</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {error}
          </p>
          <Button
            fill
            color="blue"
            onClick={onRetry}
            className="flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Попробовать снова</span>
          </Button>
        </div>
      </Block>
    </div>
  );
};