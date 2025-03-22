import React from 'react';
import { useShiftStore } from '@/lib/store';
import { Button } from './ui/button';

export function ShiftForm() {
  const addShift = useShiftStore((state) => state.addShift);
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState('#4CAF50');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('17:00');
  const [isNightShift, setIsNightShift] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShift({
      name,
      color,
      startTime,
      endTime,
      isNightShift,
    });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-right">إضافة وردية جديدة</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">اسم الوردية</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md text-right"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">لون الوردية</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded-md"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-right">وقت البداية</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded-md text-right"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-right">وقت النهاية</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded-md text-right"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <label className="text-sm font-medium">وردية ليلية</label>
        <input
          type="checkbox"
          checked={isNightShift}
          onChange={(e) => setIsNightShift(e.target.checked)}
          className="ml-2"
        />
      </div>

      <Button type="submit" className="w-full">
        إضافة الوردية
      </Button>
    </form>
  );
}