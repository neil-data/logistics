import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }: CardProps) => (
  <div className={cn("px-6 py-4 border-b border-slate-100 bg-slate-50/50", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={cn("px-6 py-4", className)}>
    {children}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    error: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold", variants[variant])}>
      {children}
    </span>
  );
};
