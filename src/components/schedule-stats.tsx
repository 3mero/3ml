import React from 'react';
import { useScheduleStore } from '@/lib/store';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ar as arLocale } from 'date-fns/locale';

export function ScheduleStats() {
  const { currentSchedule } = useScheduleStore();

  if (!currentSchedule) return null;

  const calculateMonthlyStats = () => {
    const stats = [];
    const startDate = new Date(currentSchedule.startDate);

    for (let i = 0; i < currentSchedule.months; i++) {
      const currentMonth = addMonths(startDate, i);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let workDays = 0;
      let offDays = 0;

      daysInMonth.forEach(day => {
        const totalDays = currentSchedule.workDays.reduce((sum, wd) => sum + wd.count, 0);
        if (totalDays === 0) return;

        let dayCount = Math.floor((day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        let cyclePosition = ((dayCount % totalDays) + totalDays) % totalDays;
        let currentPosition = 0;

        for (const workDay of currentSchedule.workDays) {
          if (cyclePosition < currentPosition + workDay.count) {
            if (workDay.type === 'work') workDays++;
            else offDays++;
            break;
          }
          currentPosition += workDay.count;
        }
      });

      stats.push({
        month: format(currentMonth, 'MMMM', { locale: arLocale }),
        monthNumber: format(currentMonth, 'M'),
        year: format(currentMonth, 'yyyy'),
        workDays,
        offDays,
      });
    }

    return stats;
  };

  const monthlyStats = calculateMonthlyStats();

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-sm font-semibold">الشهر</th>
              <th className="px-4 py-3 text-sm font-semibold">السنة</th>
              <th className="px-4 py-3 text-sm font-semibold">عدد أيام العمل</th>
              <th className="px-4 py-3 text-sm font-semibold">عدد أيام العطلة</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {monthlyStats.map((stat, index) => (
              <tr
                key={`${stat.month}-${stat.year}`}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {stat.monthNumber}
                    </span>
                    <span>{stat.month}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{stat.year}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {stat.workDays} يوم
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {stat.offDays} يوم
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-gray-50 font-semibold">
              <td colSpan={2} className="px-4 py-3 text-sm">المجموع</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {monthlyStats.reduce((sum, stat) => sum + stat.workDays, 0)} يوم
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {monthlyStats.reduce((sum, stat) => sum + stat.offDays, 0)} يوم
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}