import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { ar as arLocale, enUS } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, locale: 'ar' | 'en' = 'ar'): string {
  return format(date, 'EEEE, d MMMM yyyy', {
    locale: locale === 'ar' ? arLocale : enUS
  });
}

export function generateMonthDays(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(start);
  const days: Date[] = [];

  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}