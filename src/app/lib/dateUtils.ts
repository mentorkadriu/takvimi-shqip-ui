import {
  format,
  formatDistance,
  formatRelative,
  addDays,
  subDays,
  isToday,
  isTomorrow,
  isYesterday,
  isSameDay,
  isSameMonth,
  isSameYear,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isValid
} from 'date-fns';
import { sq } from 'date-fns/locale';

// Re-export date-fns functions we're using directly
export { 
  addDays, 
  subDays, 
  isToday, 
  isTomorrow, 
  isYesterday, 
  isSameDay, 
  isSameMonth, 
  isSameYear 
};

export function formatDate(date: Date, formatString: string = 'PPP'): string {
  return format(date, formatString, { locale: sq });
}

export function formatDateShort(date: Date): string {
  return format(date, 'd MMM', { locale: sq });
}

export function formatWeekday(date: Date): string {
  return format(date, 'EEE', { locale: sq });
}

export function formatMonth(date: Date): string {
  return format(date, 'MMM', { locale: sq });
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatTimeAmPm(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return format(date, 'h:mm a');
}

export interface TimeRemaining {
  hours: number;
  minutes: number;
}

export function getTimeRemaining(targetDate: Date, currentDate: Date = new Date()): TimeRemaining {
  const diffMinutes = differenceInMinutes(targetDate, currentDate);
  const totalMinutes = diffMinutes < 0 ? diffMinutes + 24 * 60 : diffMinutes;
  
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
}

export function getWeekDates(referenceDate: Date = new Date()): Date[] {
  // Create a new array to hold the 7 days
  const dates: Date[] = [];
  
  // Start 3 days before the reference date
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - 3);
  
  // Generate 7 days (3 before, reference day, 3 after)
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

export function getDateInfo(date: Date, selectedDate: Date): {
  day: number;
  weekday: string;
  month: string;
  isToday: boolean;
  isSelected: boolean;
  fullDate: string;
} {
  return {
    day: date.getDate(),
    weekday: formatWeekday(date),
    month: formatMonth(date),
    isToday: isToday(date),
    isSelected: isSameDay(date, selectedDate),
    fullDate: format(date, 'yyyy-MM-dd')
  };
}

export function formatDateForDisplay(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: sq });
}

export function parseISODate(dateString: string): Date {
  const parsedDate = parseISO(dateString);
  if (!isValid(parsedDate)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return parsedDate;
}

export function getDateRange(startDate: Date, endDate: Date): Date[] {
  return eachDayOfInterval({ start: startDate, end: endDate });
} 