import { PrayerTimes, NewPrayerTimesData, NewPrayerDay } from '../types/prayerTimes';
import { format } from 'date-fns';

// English month names matching the JSON keys from drilonjaha/kohet-e-namazit-kosove-json
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Cache for the full dataset (loaded once)
let dataCache: NewPrayerTimesData | null = null;

// Cache for processed month arrays
const monthCache: Record<string, PrayerTimes[]> = {};

/**
 * Load the single prayer times JSON file (year-agnostic data from BIK)
 */
async function loadPrayerData(): Promise<NewPrayerTimesData> {
  if (dataCache) return dataCache;

  const response = await fetch('/data/kosovo-prayer-times.json');
  if (!response.ok) {
    throw new Error('Failed to load prayer times data');
  }

  dataCache = (await response.json()) as NewPrayerTimesData;
  return dataCache;
}

/**
 * Convert a day entry from the new format to the standard PrayerTimes interface
 */
function convertDay(dayData: NewPrayerDay, month: number, year: number): PrayerTimes {
  return {
    imsak: dayData.imsak,
    fajr: dayData.fajr,
    sunrise: dayData.sunrise,
    dhuhr: dayData.dhuhr,
    asr: dayData.asr,
    maghrib: dayData.maghrib,
    isha: dayData.isha,
    // Build the date string using the actual requested year (data is year-agnostic)
    date: `${year}-${month.toString().padStart(2, '0')}-${dayData.day.toString().padStart(2, '0')}`,
    dayLength: dayData.day_length,
    islamicEvents: '',
    weekday: dayData.day_of_week,
  };
}

/**
 * Get prayer times for all days in a given month and year
 */
export async function getMonthPrayerTimes(year: number, month: number): Promise<PrayerTimes[]> {
  const cacheKey = `${year}-${month}`;
  if (monthCache[cacheKey]) return monthCache[cacheKey];

  const data = await loadPrayerData();
  const monthName = MONTH_NAMES[month - 1];

  if (!data.prayer_times[monthName]) {
    throw new Error(`No prayer times found for ${monthName}`);
  }

  const result = data.prayer_times[monthName].map((day) => convertDay(day, month, year));

  monthCache[cacheKey] = result;
  return result;
}

/**
 * Get prayer times for a specific date
 */
export async function getDayPrayerTimes(date: Date): Promise<PrayerTimes> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const monthPrayerTimes = await getMonthPrayerTimes(year, month);
  const formattedDate = format(date, 'yyyy-MM-dd');

  const dayPrayerTimes = monthPrayerTimes.find((t) => t.date === formattedDate);
  if (!dayPrayerTimes) {
    throw new Error(`Prayer times not found for ${formattedDate}`);
  }

  return dayPrayerTimes;
}

/**
 * Get prayer times for a week centered on the specified date
 */
export async function getWeekPrayerTimes(centerDate: Date): Promise<PrayerTimes[]> {
  const dates: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    dates.push(d);
  }

  return Promise.all(dates.map((d) => getDayPrayerTimes(d)));
}

// List of available cities in Kosovo with their minute offsets
// Source: drilonjaha/kohet-e-namazit-kosove-json README
export const KOSOVO_CITIES = [
  'Prishtina',
  'Prizren',
  'Peja',
  'Gjakova',
  'Ferizaj',
  'Gjilan',
  'Mitrovica',
  'Deçan',
  'Vushtrri',
  'Podujeva',
  'Sharri',
  'Presheva',
];

// City offsets in minutes relative to the base (Deçan reference)
export const CITY_OFFSETS: Record<string, number> = {
  Sharri: +2,
  Presheva: -2,
  Ferizaj: -1,
  Gjilan: -1,
  Prishtina: -1,
  Podujeva: -1,
  Vushtrri: -1,
  // Deçan, Peja, Prizren, Gjakova, Mitrovica: 0 (base)
};

/**
 * Apply a city's minute offset to a prayer time string (H:MM or HH:MM)
 */
export function applyCityOffset(time: string, offsetMinutes: number): string {
  if (offsetMinutes === 0) return time;
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + offsetMinutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${hh}:${mm.toString().padStart(2, '0')}`;
}
