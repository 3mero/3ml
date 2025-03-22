import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Schedule, ScheduleState } from './types';

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      schedules: [],
      currentSchedule: null,
      savedSchedules: [],
      addSchedule: (schedule) => {
        const newSchedule = {
          ...schedule,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          schedules: [...state.schedules, newSchedule],
          currentSchedule: newSchedule,
        }));
      },
      updateSchedule: (id, schedule) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...schedule } : s
          ),
          currentSchedule:
            state.currentSchedule?.id === id
              ? { ...state.currentSchedule, ...schedule }
              : state.currentSchedule,
        })),
      deleteSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
          currentSchedule:
            state.currentSchedule?.id === id ? null : state.currentSchedule,
        })),
      setCurrentSchedule: (id) =>
        set((state) => ({
          currentSchedule:
            state.schedules.find((s) => s.id === id) || state.currentSchedule,
        })),
      saveScheduleToHistory: (name: string, startDate: string) => {
        const { currentSchedule } = get();
        if (!currentSchedule) return;

        const savedSchedule = {
          id: Date.now(),
          name: name,
          data: { ...currentSchedule, name },
          startDate,
          createdDate: new Date().toLocaleString('ar-LY'),
        };

        set((state) => ({
          savedSchedules: [...state.savedSchedules, savedSchedule],
          currentSchedule: { ...currentSchedule, name },
        }));
      },
      loadScheduleFromHistory: (id: number) => {
        const { savedSchedules } = get();
        const savedSchedule = savedSchedules.find((s) => s.id === id);
        if (!savedSchedule) return;

        set(() => ({
          currentSchedule: savedSchedule.data,
        }));
      },
      deleteScheduleFromHistory: (id: number) => {
        set((state) => ({
          savedSchedules: state.savedSchedules.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: 'work-schedule-storage',
    }
  )
);