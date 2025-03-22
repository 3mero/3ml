export interface WorkDay {
  type: 'work' | 'off';
  count: number;
  color: string;
}

export interface Schedule {
  id: string;
  name: string;
  startDate: string;
  months: number;
  workDays: WorkDay[];
  notes: Record<string, string>;
  pins: Record<string, boolean>;
  monthColors: Record<string, string>;
  createdAt: string;
  backgroundColor?: string;
}

export interface SavedSchedule {
  id: number;
  name: string;
  data: Schedule;
  startDate: string;
  createdDate: string;
}

export interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  savedSchedules: SavedSchedule[];
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt'>) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setCurrentSchedule: (id: string) => void;
  saveScheduleToHistory: (name: string, startDate: string) => void;
  loadScheduleFromHistory: (id: number) => void;
  deleteScheduleFromHistory: (id: number) => void;
}