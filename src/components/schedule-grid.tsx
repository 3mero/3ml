import React from 'react';
import { format, isSameMonth, isSameDay, addMonths, differenceInDays, startOfMonth } from 'date-fns';
import { ar as arLocale, enUS } from 'date-fns/locale';
import { Calendar, Pin } from 'lucide-react';
import { useScheduleStore } from '@/lib/store';
import { cn, generateMonthDays } from '@/lib/utils';
import type { WorkDay } from '@/lib/types';

interface ScheduleGridProps {
  startDate: Date;
  months: number;
  fontSize: string;
  textColor: string;
}

export function ScheduleGrid({ startDate, months, fontSize, textColor }: ScheduleGridProps) {
  const { currentSchedule, updateSchedule } = useScheduleStore();

  if (!currentSchedule) return null;

  const handlePinToggle = (monthKey: string, dayKey: string) => {
    const pins = { ...currentSchedule.pins };
    const key = `${monthKey}-${dayKey}`;
    pins[key] = !pins[key];
    updateSchedule(currentSchedule.id, { pins });
  };

  const getWorkDayForDate = (date: Date): WorkDay | null => {
    if (!currentSchedule?.workDays?.length) return null;

    const totalDays = currentSchedule.workDays.reduce((sum, day) => sum + day.count, 0);
    if (totalDays === 0) return null;

    const daysDiff = differenceInDays(date, new Date(startDate));
    let cyclePosition = ((daysDiff % totalDays) + totalDays) % totalDays;
    let currentPosition = 0;

    for (const workDay of currentSchedule.workDays) {
      if (cyclePosition < currentPosition + workDay.count) {
        return workDay;
      }
      currentPosition += workDay.count;
    }

    return currentSchedule.workDays[0];
  };

  const today = new Date();
  const monthsToShow = Array.from({ length: months }, (_, i) => addMonths(new Date(startDate), i));

  const weekDays = [
    { name: 'الأحد', color: 'text-gray-700' },
    { name: 'الإثنين', color: 'text-gray-700' },
    { name: 'الثلاثاء', color: 'text-gray-700' },
    { name: 'الأربعاء', color: 'text-gray-700' },
    { name: 'الخميس', color: 'text-gray-700' },
    { name: 'الجمعة', color: 'text-green-600' },
    { name: 'السبت', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthsToShow.map((month) => {
          const monthKey = format(month, 'yyyy-MM');
          const monthNumber = parseInt(format(month, 'M'));
          const days = generateMonthDays(month.getFullYear(), month.getMonth());
          const isCurrentMonth = isSameMonth(month, today);

          return (
            <div
              key={monthKey}
              className={cn(
                'rounded-xl border bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1',
                isCurrentMonth && 'ring-2 ring-primary',
                currentSchedule.monthColors[monthKey] && `bg-[${currentSchedule.monthColors[monthKey]}]`
              )}
              style={{ color: textColor }}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className={cn(
                      'text-xl font-bold',
                      isCurrentMonth && 'text-primary'
                    )}>
                      {format(month, 'MMMM yyyy', { locale: arLocale })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(month, 'MMMM yyyy', { locale: enUS })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const colors = { ...currentSchedule.monthColors };
                        colors[monthKey] = '#' + Math.random().toString(16).slice(2, 8);
                        updateSchedule(currentSchedule.id, { monthColors: colors });
                      }}
                      className="relative p-2 rounded-full hover:bg-white/20 transition-colors group"
                    >
                      <Calendar className="h-6 w-6 text-primary" />
                      <span className="absolute top-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 text-sm font-semibold">
                        {monthNumber}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day.name}
                      className={cn(
                        "text-center font-medium py-2 px-1 rounded-md bg-gray-50/80 border border-gray-100",
                        day.color,
                        fontSize
                      )}
                    >
                      {day.name}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-[2px]">
                  {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {days.map((day, i) => {
                    const dayKey = format(day, 'dd');
                    const isPinned = currentSchedule.pins[`${monthKey}-${dayKey}`];
                    const isToday = isSameDay(day, today);
                    const workDay = getWorkDayForDate(day);
                    const dayOfWeek = day.getDay();
                    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday

                    return (
                      <button
                        key={i}
                        onClick={() => handlePinToggle(monthKey, dayKey)}
                        className={cn(
                          'relative aspect-square flex flex-col items-center justify-center text-sm transition-all duration-200',
                          'border-t border-l last:border-r first:border-r [&:nth-child(7n)]:border-r border-b',
                          fontSize,
                          {
                            'bg-green-50 border-green-200': isWeekend && !workDay,
                            'bg-opacity-90 hover:bg-opacity-100': workDay,
                            'text-white': workDay?.type === 'work',
                            'text-gray-900': workDay?.type === 'off',
                          },
                          isToday && 'ring-2 ring-primary ring-offset-2',
                          isPinned && 'ring-1 ring-yellow-500'
                        )}
                        style={{
                          backgroundColor: workDay?.color || (isWeekend ? '#f0fdf4' : 'white')
                        }}
                      >
                        <span className={cn(
                          'text-base',
                          isToday && 'font-bold'
                        )}>
                          {format(day, 'd')}
                        </span>
                        {isPinned && (
                          <Pin className="absolute top-0.5 right-0.5 h-3 w-3 text-yellow-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}