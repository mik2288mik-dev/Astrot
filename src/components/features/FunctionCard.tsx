'use client';

import React from 'react';
import Link from 'next/link';

interface FunctionCardProps {
  href: string;
  icon: string | React.ReactNode;
  title: string;
  bgColor?: string;
}

export default function FunctionCard({
  href,
  icon,
  title,
  bgColor = 'bg-pastel-purple'
}: FunctionCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white shadow-sm border border-neutral-100/50 hover:shadow-md hover:border-purple-200/50 transition-all duration-200 hover:scale-[1.02] group active:scale-[0.98]"
    >
      <div
        className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-sm`}
      >
        {typeof icon === 'string' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" className="w-7 h-7" />
        ) : (
          <div className="text-2xl">
            {icon}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-neutral-800 text-center leading-tight">
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