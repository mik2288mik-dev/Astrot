"use client";

import { cn } from '@/lib/cn';

interface BaseProps {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export function Input({ label, helperText, error, className, ...rest }: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('block', className)}>
      {label && <div className="mb-2 text-sm font-medium text-on/90">{label}</div>}
      <input
        className={cn(
          'w-full h-12 rounded-md bg-[#1C1D33] px-4 text-on placeholder-[#8F90A4] outline-none',
          'focus:ring-0 focus-visible:outline-none border border-transparent focus:border-accent/80 shadow-none focus:shadow-focus'
        )}
        {...rest}
      />
      {error ? (
        <div className="mt-2 text-[13px] leading-[18px] text-[#FF6B6B]">{error}</div>
      ) : helperText ? (
        <div className="mt-2 text-[13px] leading-[18px] text-muted">{helperText}</div>
      ) : null}
    </label>
  );
}

export function TextArea({ label, helperText, error, className, rows = 4, ...rest }: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn('block', className)}>
      {label && <div className="mb-2 text-sm font-medium text-on/90">{label}</div>}
      <textarea
        rows={rows}
        className={cn(
          'w-full min-h-[96px] rounded-md bg-[#1C1D33] p-4 text-on placeholder-[#8F90A4] outline-none',
          'focus:ring-0 focus-visible:outline-none border border-transparent focus:border-accent/80 focus:shadow-focus'
        )}
        {...rest}
      />
      {error ? (
        <div className="mt-2 text-[13px] leading-[18px] text-[#FF6B6B]">{error}</div>
      ) : helperText ? (
        <div className="mt-2 text-[13px] leading-[18px] text-muted">{helperText}</div>
      ) : null}
    </label>
  );
}