import React from 'react';
import { useShiftStore } from '@/lib/store';
import { Button } from './ui/button';

export function EmployeeForm() {
  const addEmployee = useShiftStore((state) => state.addEmployee);
  const shifts = useShiftStore((state) => state.shifts);
  
  const [name, setName] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [maxShifts, setMaxShifts] = React.useState('5');
  const [preferredShifts, setPreferredShifts] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name,
      position,
      maxShiftsPerWeek: parseInt(maxShifts),
      preferredShifts,
    });
    setName('');
    setPosition('');
    setPreferredShifts([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-right">إضافة موظف جديد</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">اسم الموظف</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md text-right"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">المنصب</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border rounded-md text-right"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">
          الحد الأقصى للورديات في الأسبوع
        </label>
        <input
          type="number"
          value={maxShifts}
          onChange={(e) => setMaxShifts(e.target.value)}
          min="1"
          max="7"
          className="w-full p-2 border rounded-md text-right"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">الورديات المفضلة</label>
        <div className="space-y-2">
          {shifts.map((shift) => (
            <label key={shift.id} className="flex items-center justify-end space-x-2">
              <span className="text-sm">{shift.name}</span>
              <input
                type="checkbox"
                checked={preferredShifts.includes(shift.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferredShifts([...preferredShifts, shift.id]);
                  } else {
                    setPreferredShifts(preferredShifts.filter((id) => id !== shift.id));
                  }
                }}
                className="ml-2"
              />
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        إضافة موظف
      </Button>
    </form>
  );
}