import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Save, Settings, X, MapIcon as WhatsappIcon } from 'lucide-react';
import { useScheduleStore } from './lib/store';
import { ScheduleGrid } from './components/schedule-grid';
import { ScheduleControls } from './components/schedule-controls';
import { ScheduleStats } from './components/schedule-stats';
import { Calendar } from './components/ui/calendar';
import { Button } from './components/ui/button';
import { formatDate } from './lib/utils';
import html2canvas from 'html2canvas';

export default function App() {
  const { 
    currentSchedule, 
    addSchedule, 
    savedSchedules, 
    loadScheduleFromHistory, 
    deleteScheduleFromHistory,
    updateSchedule 
  } = useScheduleStore();
  
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAboutPanel, setShowAboutPanel] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('schedule-font-size') || 'text-base';
  });
  const [textColor, setTextColor] = useState(() => {
    return localStorage.getItem('schedule-text-color') || '#000000';
  });
  const [startDate, setStartDate] = useState(() => {
    const savedDate = localStorage.getItem('schedule-start-date');
    return savedDate ? new Date(savedDate) : new Date();
  });
  const [months, setMonths] = useState(() => {
    return parseInt(localStorage.getItem('schedule-months') || '12', 10);
  });

  const saveAsImage = async () => {
    const element = document.getElementById('schedule-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${currentSchedule?.name || 'schedule'}.png`;
      link.click();
    } catch (error) {
      console.error('Error saving schedule as image:', error);
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/96892670679', '_blank');
  };

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('schedule-font-size', fontSize);
    localStorage.setItem('schedule-text-color', textColor);
    localStorage.setItem('schedule-start-date', startDate.toISOString());
    localStorage.setItem('schedule-months', months.toString());
  }, [fontSize, textColor, startDate, months]);

  // Create initial schedule if none exists
  useEffect(() => {
    if (!currentSchedule) {
      addSchedule({
        name: 'جدول جديد',
        startDate: startDate.toISOString(),
        months: 12,
        workDays: [
          { type: 'work', count: 1, color: '#4CAF50' },
          { type: 'off', count: 3, color: '#FF5252' }
        ],
        notes: {},
        pins: {},
        monthColors: {}
      });
    }
  }, [currentSchedule, addSchedule, startDate]);

  // Update schedule when settings change, but only if the values are different
  useEffect(() => {
    if (currentSchedule && (
      currentSchedule.startDate !== startDate.toISOString() ||
      currentSchedule.months !== months
    )) {
      updateSchedule(currentSchedule.id, {
        startDate: startDate.toISOString(),
        months
      });
    }
  }, [startDate, months]);

  return (
    <div className="min-h-screen bg-gray-50" id="schedule-container">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">جدول العمل</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAboutPanel(true)}
                className="text-primary hover:text-primary/80"
              >
                حول الموقع
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center mx-8">
              {currentSchedule && (
                <h2 className="text-xl font-semibold text-primary">
                  {currentSchedule.name}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={saveAsImage}
              >
                <Save className="h-4 w-4 ml-2" />
                حفظ كصورة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              >
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Button>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600 font-semibold">
                    {formatDate(new Date(), 'ar')}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date(), 'en')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showAboutPanel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">حول الموقع</h2>
                <button
                  onClick={() => setShowAboutPanel(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-center leading-relaxed">
                  موقع عمر التجريبي
                  <br />
                  تم إنشاؤه بواسطة الذكاء الاصطناعي لموقع بولت نيو
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={openWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white gap-2"
                  >
                    <WhatsappIcon className="h-5 w-5" />
                    تواصل معنا على واتساب
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSettingsPanel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">إعدادات الجدول</h2>
                  <button
                    onClick={() => setShowSettingsPanel(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">إعدادات العرض</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">حجم الخط</label>
                        <select
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full rounded-md border p-2"
                        >
                          <option value="text-sm">صغير</option>
                          <option value="text-base">متوسط</option>
                          <option value="text-lg">كبير</option>
                          <option value="text-xl">كبير جداً</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">لون الخط</label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-10 rounded-md"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">تاريخ البدء</label>
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          className="rounded-md border"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">عدد الأشهر</label>
                        <select
                          value={months}
                          onChange={(e) => setMonths(Number(e.target.value))}
                          className="w-full rounded-lg border p-2"
                        >
                          {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num} شهر
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">إعدادات الجدول</h3>
                    <ScheduleControls />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">الإحصائيات</h3>
                    <ScheduleStats />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">الجداول المحفوظة</h3>
                    <div className="space-y-3">
                      {savedSchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                        >
                          <div>
                            <h3 className="font-medium">{schedule.name}</h3>
                            <p className="text-sm text-gray-500">{schedule.createdDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                loadScheduleFromHistory(schedule.id);
                                setStartDate(new Date(schedule.data.startDate));
                                setMonths(schedule.data.months);
                                setShowSettingsPanel(false);
                              }}
                            >
                              تحميل
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteScheduleFromHistory(schedule.id)}
                            >
                              حذف
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <ScheduleGrid 
            startDate={startDate} 
            months={months} 
            fontSize={fontSize}
            textColor={textColor}
          />
        </div>
      </main>
    </div>
  );
}