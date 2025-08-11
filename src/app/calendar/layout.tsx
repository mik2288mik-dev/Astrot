"use client";
import React from 'react';
import { useBackButton } from '@/lib/use-back-button';

export default function Layout({ children }: { children: React.ReactNode }) {
  useBackButton(true);
  return <>{children}</>;
}