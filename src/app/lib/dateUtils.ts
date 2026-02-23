import {
  format,
  addDays,
  subDays,
  isToday,
  isTomorrow,
  isYesterday,
  isSameDay,
  isSameMonth,
  isSameYear,
  differenceInMinutes,
  eachDayOfInterval,
  parseISO,
  isValid,
} from 'date-fns';
import { sq } from 'date-fns/locale';

// Re-export date-fns functions we're using directly
export { addDays, subDays, isToday, isTomorrow, isYesterday, isSameDay, isSameMonth, isSameYear };

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
    minutes: totalMinutes % 60,
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

export function getDateInfo(
  date: Date,
  selectedDate: Date
): {
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
    fullDate: format(date, 'yyyy-MM-dd'),
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

const WEEKDAY_AL: Record<string, string> = {
  Monday: 'E Hënë',
  Tuesday: 'E Martë',
  Wednesday: 'E Mërkurë',
  Thursday: 'E Enjte',
  Friday: 'E Premte',
  Saturday: 'E Shtunë',
  Sunday: 'E Diel',
};

/** Translate English weekday name (from JSON data) to Albanian */
export function translateWeekday(englishDay: string): string {
  return WEEKDAY_AL[englishDay] ?? englishDay;
}

const HIJRI_MONTHS_AL = [
  'Muharrem',
  'Safer',
  'Rabi ul-Evvel',
  'Rabi ul-Ahir',
  'Xhumadel Ula',
  'Xhumadel Uhra',
  'Rexhep',
  'Shaban',
  'Ramazan',
  'Sheval',
  'Dhul Kade',
  'Dhul Hixhxhe',
];

/** Convert a Gregorian date to the tabular Hijri (Islamic civil) calendar */
export function toHijriDate(date: Date): {
  day: number;
  month: number;
  year: number;
  monthName: string;
} {
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  // Compute Julian Day Number (Gregorian)
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  const JDN =
    gd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // JDN → Hijri (tabular civil algorithm)
  const L = JDN - 1948440 + 10632;
  const N = Math.floor((L - 1) / 10631);
  const L2 = L - 10631 * N + 354;
  const J =
    Math.floor((10985 - L2) / 5316) * Math.floor((50 * L2) / 17719) +
    Math.floor(L2 / 5670) * Math.floor((43 * L2) / 15238);
  const L3 =
    L2 -
    Math.floor((30 - J) / 15) * Math.floor((17719 * J) / 50) -
    Math.floor(J / 16) * Math.floor((15238 * J) / 43) +
    29;
  const hMonth = Math.floor((24 * L3) / 709);
  const hDay = L3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * N + J - 30;

  return {
    day: hDay,
    month: hMonth,
    year: hYear,
    monthName: HIJRI_MONTHS_AL[hMonth - 1] ?? '',
  };
}
