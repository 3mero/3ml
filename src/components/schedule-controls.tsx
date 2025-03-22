import React from 'react';
import { Plus, X, Save, Calendar } from 'lucide-react';
import { useScheduleStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import type { WorkDay } from '@/lib/types';
import html2canvas from 'html2canvas';

export function ScheduleControls() {
  const { currentSchedule, updateSchedule, saveScheduleToHistory } = useScheduleStore();
  const [scheduleName, setScheduleName] = React.useState('');
  
  const addWorkDay = () => {
    if (!currentSchedule) return;
    
    const workDays = [...(currentSchedule.workDays || [])];
    workDays.push({
      type: 'work',
      count: 1,
      color: '#4CAF50'
    });
    
    updateSchedule(currentSchedule.id, { workDays });
  };

  const removeWorkDay = (index: number) => {
    if (!currentSchedule) return;
    
    const workDays = [...(currentSchedule.workDays || [])];
    workDays.splice(index, 1);
    
    updateSchedule(currentSchedule.id, { workDays });
  };

  const updateWorkDay = (index: number, updates: Partial<WorkDay>) => {
    if (!currentSchedule) return;
    
    const workDays = [...(currentSchedule.workDays || [])];
    workDays[index] = { ...workDays[index], ...updates };
    
    updateSchedule(currentSchedule.id, { workDays });
  };

  const saveAsImage = async () => {
    const element = document.getElementById('schedule-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'schedule.png';
      link.click();
    } catch (error) {
      console.error('Error saving schedule as image:', error);
    }
  };

  const handleSaveToHistory = () => {
    if (!scheduleName || !currentSchedule?.startDate) return;
    saveScheduleToHistory(scheduleName, currentSchedule.startDate);
    setScheduleName('');
  };

  if (!currentSchedule) return null;

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">أيام العمل والإجازات</h3>
        <div className="flex gap-2">
          <Button onClick={saveAsImage} size="sm" variant="outline">
            <Save className="h-4 w-4 ml-2" />
            حفظ كصورة
          </Button>
          <Button onClick={addWorkDay} size="sm">
            <Plus className="h-4 w-4" />
            <span>إضافة</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {currentSchedule.workDays?.map((workDay, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <select
              value={workDay.type}
              onChange={(e) => updateWorkDay(index, { type: e.target.value as 'work' | 'off' })}
              className="p-2 border rounded-md"
            >
              <option value="work">أيام العمل</option>
              <option value="off">أيام الإجازة</option>
            </select>

            <input
              type="number"
              value={workDay.count}
              onChange={(e) => updateWorkDay(index, { count: parseInt(e.target.value) })}
              min="1"
              max="99"
              className="w-20 p-2 border rounded-md"
            />

            <input
              type="color"
              value={workDay.color}
              onChange={(e) => updateWorkDay(index, { color: e.target.value })}
              className="w-12 h-8 p-1 border rounded"
            />

            <button
              onClick={() => removeWorkDay(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        <input
          type="text"
          value={scheduleName}
          onChange={(e) => setScheduleName(e.target.value)}
          placeholder="اسم الجدول"
          className="flex-1 p-2 border rounded-md"
        />
        <Button onClick={handleSaveToHistory} disabled={!scheduleName}>
          <Calendar className="h-4 w-4 ml-2" />
          حفظ في السجل
        </Button>
      </div>
    </div>
  );
}