"use client";

import { useState } from "react";
import { App as Framework7App, View } from "framework7-react";
import {
  Page,
  Navbar,
  Block,
  List,
  ListInput,
  Button,
} from "konsta/react";
import { Sun, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import { UserProfileCard } from "@/components/UserProfile";
import { UserDetails } from "@/components/UserDetails";
import { useTelegramAuth } from "@/lib/telegram-auth";
import { useTelegram } from "@/lib/use-telegram";
import { getSunSign } from "@/lib/astro";
import { upsertProfile } from "@/lib/supabase";

export default function TelegramPage() {
  const { user, isAuthorized, platform, colorScheme } = useTelegramAuth();
  const { hapticFeedback, showAlert } = useTelegram();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [sunSign, setSunSign] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'profile' | 'astro'>('profile');

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    hapticFeedback('medium');
    
    try {
      await upsertProfile({
        id: user.id.toString(),
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: birthPlace,
      });
      setSunSign(getSunSign(birthDate));
      await showAlert("Данные успешно сохранены!");
    } catch (err) {
      console.error(err);
      await showAlert("Ошибка при сохранении данных");
    }
  };

  const handleTabChange = (tab: 'profile' | 'astro') => {
    setActiveTab(tab);
    hapticFeedback('light');
  };

  return (
    <Framework7App theme={platform} className={colorScheme === 'dark' ? 'dark' : ''}>
      <View main>
        <Page>
          <Navbar 
            title="Telegram данные" 
            left={
              <Button 
                component="a" 
                href="/"
                className="flex items-center"
                onClick={() => hapticFeedback('light')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Назад
              </Button>
            }
          />
          
          {/* Профиль пользователя */}
          <Block strong>
            <UserProfileCard />
          </Block>

          {/* Табы */}
          <Block strong>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => handleTabChange('astro')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'astro'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Астрология
              </button>
            </div>
          </Block>

          {/* Контент табов */}
          <Transition
            show={activeTab === 'profile'}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Block strong>
              <UserDetails />
            </Block>
          </Transition>

          <Transition
            show={activeTab === 'astro'}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Block strong>
              <form onSubmit={handleSubmit} className="space-y-4">
                <List strong inset>
                  <ListInput
                    label="Дата рождения"
                    type="date"
                    value={birthDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBirthDate(e.target.value)
                    }
                  />
                  <ListInput
                    label="Время рождения"
                    type="time"
                    value={birthTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBirthTime(e.target.value)
                    }
                  />
                  <ListInput
                    label="Место рождения"
                    type="text"
                    value={birthPlace}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBirthPlace(e.target.value)
                    }
                    placeholder="Город"
                  />
                </List>
                <Button 
                  onClick={handleSubmit}
                  disabled={!birthDate || !birthTime || !birthPlace}
                  className="w-full"
                >
                  Сохранить данные
                </Button>
              </form>
              
              <Transition
                show={Boolean(sunSign)}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
              >
                {sunSign && (
                  <Block strong className="mt-4">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        initial={{ rotate: 0, scale: 0.8 }}
                        animate={{ rotate: 360, scale: 1 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      >
                        <Sun className="h-6 w-6 text-yellow-500" />
                      </motion.div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Ваш знак зодиака: {sunSign}
                        </p>
                        <p className="text-sm text-gray-600">
                          На основе даты рождения
                        </p>
                      </div>
                    </div>
                  </Block>
                )}
              </Transition>
            </Block>
          </Transition>
        </Page>
      </View>
    </Framework7App>
  );
}

