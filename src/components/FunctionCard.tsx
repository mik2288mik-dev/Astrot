'use client';

import React from 'react';
import Link from 'next/link';

interface FunctionCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  bgColor?: string;
  iconColor?: string;
}

export default function FunctionCard({ 
  href, 
  icon, 
  title, 
  bgColor = 'bg-pastel-purple',
  iconColor = 'text-primary-600'
}: FunctionCardProps) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-neutral-100 hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className={`
        w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center mb-2
        group-hover:scale-110 transition-transform duration-300
      `}>
        <div className={`${iconColor} text-2xl`}>
          {icon}
        </div>
      </div>
      <span className="text-sm font-medium text-neutral-700 text-center">
        {title}
      </span>
    </Link>
  );
}

// Компонент для сетки функций
export function FunctionGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {children}
    </div>
  );
}