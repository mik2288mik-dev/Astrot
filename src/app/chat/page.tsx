'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { 
  PaperAirplaneIcon,
  SparklesIcon,
  PhotoIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const suggestedQuestions = [
  'Расскажи о моем знаке зодиака',
  'Что ждет меня сегодня?',
  'Какая у меня совместимость с Львом?',
  'Что означает Луна в Скорпионе?'
];

export default function ChatPage() {
  const { hapticFeedback } = useTelegram();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш персональный AI астролог. Задайте мне любой вопрос о звездах, планетах или вашей судьбе ✨',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    hapticFeedback('impact', 'light');
    
    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Получаем активную карту
      const pinned = (await import('@/lib/charts/store')).ChartsStore.getPinned?.();
      const payload = { 
        messages: messages.concat(userMessage).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })), 
        natal: pinned?.result ?? null 
      };
      
      const res = await fetch('/api/astro-chat', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      const { reply, error } = await res.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error || reply || 'Произошла ошибка при получении ответа',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      hapticFeedback('notification', 'success');
    } catch (error) {
      console.error('Chat error:', error);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извините, произошла ошибка. Попробуйте еще раз.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      hapticFeedback('notification', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleSuggestionClick = (question: string) => {
    hapticFeedback('selection');
    sendMessage(question);
  };

  return (
    <div className="page animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col bg-gradient-to-b from-neutral-50 to-white" style={{ ['--page-top' as any]: 'calc(var(--safe-top) + 32px)' }}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-neutral-900">AI Астролог</h1>
          <p className="text-xs text-emerald-600">● Онлайн</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-neutral-500 mb-3">Популярные вопросы:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="bg-white border border-neutral-200 px-3 py-2 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                  : 'bg-white border border-neutral-100 text-neutral-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p 
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-neutral-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-100"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-200"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-neutral-100 py-3 pb-safe">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={() => hapticFeedback('impact', 'light')}
          >
            <PhotoIcon className="w-6 h-6" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Задайте ваш вопрос..."
            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors"
          />
          
          <button
            type="button"
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={() => hapticFeedback('impact', 'light')}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
          
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all ${
              inputText.trim()
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}