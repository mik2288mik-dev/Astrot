'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { SelectEntity } from './NatalWheel';
import type { ChartData, Interpretation } from '@/lib/astro/types';
import { getQuickInsight, interpretNatalChart } from '@/lib/astro/interp';

interface InsightSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntity: SelectEntity | null;
  chartData: ChartData | null;
  onFullAnalysis?: () => void;
}

export default function InsightSheet({ 
  isOpen, 
  onClose, 
  selectedEntity, 
  chartData,
  onFullAnalysis 
}: InsightSheetProps) {
  const [fullInterpretation, setFullInterpretation] = useState<Interpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullInterpretation, setShowFullInterpretation] = useState(false);

  // Загружаем полную интерпретацию при открытии
  useEffect(() => {
    if (isOpen && chartData && !fullInterpretation) {
      setLoading(true);
      interpretNatalChart(chartData)
        .then(setFullInterpretation)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, chartData, fullInterpretation]);

  // Сброс при закрытии
  useEffect(() => {
    if (!isOpen) {
      setShowFullInterpretation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickInsight = selectedEntity && selectedEntity.kind !== 'sign' ? getQuickInsight(selectedEntity.kind, selectedEntity) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Оверлей */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col"
            style={{ 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)'
            }}
          >
            {/* Хендл */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Заголовок */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {showFullInterpretation ? 'Полный анализ карты' : (selectedEntity?.id || 'Инсайт')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Контент */}
            <div className="flex-1 overflow-y-auto">
              {showFullInterpretation ? (
                // Полная интерпретация
                <div className="p-6 space-y-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  ) : fullInterpretation ? (
                    <>
                      {/* Highlights */}
                      {fullInterpretation.highlights.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Ключевые моменты
                          </h3>
                          <div className="space-y-2">
                            {fullInterpretation.highlights.map((highlight, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-xl border-l-4 ${
                                  highlight.tag === 'strength' 
                                    ? 'bg-green-50 border-green-400 text-green-800'
                                    : highlight.tag === 'risk'
                                    ? 'bg-orange-50 border-orange-400 text-orange-800'
                                    : 'bg-blue-50 border-blue-400 text-blue-800'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                                    {highlight.tag === 'strength' ? 'Сила' : highlight.tag === 'risk' ? 'Внимание' : 'Совет'}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm">{highlight.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Секции */}
                      {fullInterpretation.sections.map((section) => (
                        <div key={section.id} className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {section.title}
                          </h3>
                          <div className="space-y-2">
                            {section.items.map((item, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                <p className="text-gray-700 leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                          {section.tip && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <p className="text-sm text-purple-700">
                                <span className="font-medium">💡 Совет:</span> {section.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Не удалось загрузить интерпретацию
                    </div>
                  )}
                </div>
              ) : (
                // Быстрый инсайт
                <div className="p-6 space-y-4">
                  {quickInsight ? (
                    <>
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {quickInsight.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {quickInsight.description}
                        </p>
                        {quickInsight.advice && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-blue-800 text-sm">
                              <span className="font-medium">💡 Совет:</span> {quickInsight.advice}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Кнопка полного разбора */}
                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setShowFullInterpretation(true)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <span>Полный разбор карты</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Выберите элемент карты
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Нажмите на планету, дом или аспект для получения интерпретации
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Нижние кнопки */}
            {showFullInterpretation && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFullInterpretation(false)}
                    className="flex-1 py-3 px-4 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Назад к элементу
                  </button>
                  {onFullAnalysis && (
                    <button
                      onClick={onFullAnalysis}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Детальный анализ
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}