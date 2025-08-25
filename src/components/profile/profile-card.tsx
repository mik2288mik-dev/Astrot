"use client";

import { motion } from 'framer-motion';
import { useTelegram } from '@/providers/telegram-provider';
import Image from 'next/image';

export function ProfileCard() {
  const { user, isReady } = useTelegram();

  if (!isReady) {
    return (
      <div className="bg-gradient-to-br from-purple-100/10 to-blue-100/10 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300/20 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300/20 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-300/20 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.firstName || 'Гость';
  const username = user?.username;
  const userId = user?.id;
  const photoUrl = user?.photoUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
        <div className="flex items-center space-x-4">
          {photoUrl ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Image
                src={photoUrl}
                alt="avatar"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/30 shadow-lg"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-2 ring-purple-500/30"
            >
              {displayName.slice(0, 1).toUpperCase()}
            </motion.div>
          )}
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-white"
            >
              {displayName}
              {user?.isPremium && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  Premium
                </span>
              )}
            </motion.h3>
            {username && (
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-400"
              >
                @{username}
              </motion.p>
            )}
            {userId && (
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-gray-500 mt-1"
              >
                ID: {userId}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}