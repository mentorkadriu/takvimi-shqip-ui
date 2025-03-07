import { PrayerTimes, KosovoPrayerMonth } from '../types/prayerTimes';
import { format } from 'date-fns';

// Cache for prayer times to reduce data fetching
const prayerTimesCache: Record<string, PrayerTimes[]> = {};

/**
 * Converts Kosovo prayer time format to standard format
 */
function convertKosovoPrayerTime(
  day: number,
  month: number,
  year: number,
  dayData: {
    kohet: {
      imsaku: string;
      sabahu: string;
      lindja_e_diellit: string;
      dreka: string;
      ikindia: string;
      akshami: string;
      jacia: string;
      gjatesia_e_dites: string;
    };
    dita_javes: string;
    festat_fetare_dhe_shenime_te_tjera_astronomike: string;
  }
): PrayerTimes {
  if (!dayData?.kohet) {
    throw new Error('Invalid prayer time data structure');
  }

  return {
    imsak: dayData.kohet.imsaku,
    fajr: dayData.kohet.sabahu,
    sunrise: dayData.kohet.lindja_e_diellit,
    dhuhr: dayData.kohet.dreka,
    asr: dayData.kohet.ikindia,
    maghrib: dayData.kohet.akshami,
    isha: dayData.kohet.jacia,
    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    dayLength: dayData.kohet.gjatesia_e_dites,
    islamicEvents: dayData.festat_fetare_dhe_shenime_te_tjera_astronomike,
    weekday: dayData.dita_javes
  };
}

/**
 * Validates the date is within available range
 */
function validateDate(date: Date): void {
  const year = date.getFullYear();
  if (year !== 2025) {
    throw new Error('Prayer times are only available for year 2025');
  }
}

/**
 * Fetches prayer times for a specific month and year
 */
export async function getMonthPrayerTimes(
  year: number,
  month: number
): Promise<PrayerTimes[]> {
  validateDate(new Date(year, month - 1));
  
  const cacheKey = `${year}-${month}`;
  
  // Return cached data if available
  if (prayerTimesCache[cacheKey]) {
    return prayerTimesCache[cacheKey];
  }
  
  try {
    const response = await fetch(`/data/takvimi/${year}/${month.toString().padStart(2, '0')}.json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const monthData: { data: KosovoPrayerMonth } = await response.json();
    
    if (!monthData?.data) {
      throw new Error('Invalid month data structure');
    }
    
    // Convert the data to our standard format
    const prayerTimes = Object.entries(monthData.data).map(([day, dayData]) => 
      convertKosovoPrayerTime(parseInt(day), month, year, dayData)
    );
    
    // Cache the results
    prayerTimesCache[cacheKey] = prayerTimes;
    
    return prayerTimes;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

/**
 * Gets prayer times for a specific date
 */
export async function getDayPrayerTimes(date: Date): Promise<PrayerTimes> {
  validateDate(date);
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  const monthPrayerTimes = await getMonthPrayerTimes(year, month);
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  const dayPrayerTimes = monthPrayerTimes.find(times => times.date === formattedDate);
  
  if (!dayPrayerTimes) {
    throw new Error('Prayer times not found for the specified date');
  }
  
  return dayPrayerTimes;
}

/**
 * Gets prayer times for a week centered on the specified date
 */
export async function getWeekPrayerTimes(centerDate: Date): Promise<PrayerTimes[]> {
  validateDate(centerDate);
  
  // Get dates for 3 days before and 3 days after
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);
    dates.push(date);
  }
  
  // Fetch prayer times for all dates
  const prayerTimes = await Promise.all(
    dates.map(date => getDayPrayerTimes(date))
  );
  
  return prayerTimes;
}

// List of available cities in Kosovo
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
  'Presheva'
]; 