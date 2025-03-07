import { PrayerWithStatus } from '../types/prayerTimes';

// Define the standard prayer order
export const PRAYER_ORDER = { 
  "Imsak": -1,  // Imsak comes before Fajr but isn't a mandatory prayer
  "Fajr": 0, 
  "Sunrise": 1, 
  "Dhuhr": 2, 
  "Asr": 3, 
  "Maghrib": 4, 
  "Isha": 5 
};

// Type for prayer with calculated status and datetime
export interface PrayerWithDateTime extends PrayerWithStatus {
  dateTime: Date;
  calculatedIsPast: boolean;
  calculatedIsCurrent: boolean;
  calculatedIsNext: boolean;
}

/**
 * Convert prayer time strings to Date objects for comparison
 */
export function convertPrayerTimesToDateObjects(
  prayers: PrayerWithStatus[], 
  currentTime: Date
): PrayerWithDateTime[] {
  return prayers.map(prayer => {
    // Extract hours and minutes from HH:MM format
    const [hours, minutes] = prayer.time.split(':').map(Number);
    
    // Create a new date object with today's date but the prayer's time
    const prayerDate = new Date(currentTime);
    prayerDate.setHours(hours, minutes, 0, 0);
    
    return {
      ...prayer,
      dateTime: prayerDate,
      calculatedIsPast: false,
      calculatedIsCurrent: false,
      calculatedIsNext: false
    };
  });
}

/**
 * Sort prayers by their natural order
 */
export function sortPrayersByOrder(prayers: PrayerWithDateTime[]): PrayerWithDateTime[] {
  return [...prayers].sort((a, b) => 
    (PRAYER_ORDER[a.name as keyof typeof PRAYER_ORDER] || 0) - 
    (PRAYER_ORDER[b.name as keyof typeof PRAYER_ORDER] || 0)
  );
}

/**
 * Calculate prayer statuses based on current time
 */
export function calculatePrayerStatuses(
  prayers: PrayerWithDateTime[], 
  currentTime: Date
): PrayerWithDateTime[] {
  // First, sort prayers by their natural order
  const orderedPrayers = sortPrayersByOrder([...prayers]);
  
  // Find indices for each prayer
  const imsakIndex = orderedPrayers.findIndex(p => p.name === "Imsak");
  const fajrIndex = orderedPrayers.findIndex(p => p.name === "Fajr");
  const ishaIndex = orderedPrayers.findIndex(p => p.name === "Isha");
  
  // Calculate if each prayer is past based on time comparison
  const prayersWithPastStatus = orderedPrayers.map(prayer => ({
    ...prayer,
    calculatedIsPast: prayer.dateTime < currentTime
  }));
  
  // Initialize all prayers as not current and not next
  const result = prayersWithPastStatus.map(prayer => ({
    ...prayer,
    calculatedIsCurrent: false,
    calculatedIsNext: false
  }));
  
  // Find the first non-past prayer (this will be our next prayer)
  const nextPrayerIndex = result.findIndex(p => !p.calculatedIsPast);
  
  // If all prayers are past, the next prayer is Fajr (of the next day)
  if (nextPrayerIndex === -1) {
    if (fajrIndex !== -1) {
      result[fajrIndex].calculatedIsNext = true;
    }
    
    // If all prayers are past, the current prayer is Isha
    if (ishaIndex !== -1) {
      result[ishaIndex].calculatedIsCurrent = true;
    }
  } else {
    // Mark the next prayer
    result[nextPrayerIndex].calculatedIsNext = true;
    
    // The current prayer is the one before the next prayer
    // We need to handle the circular nature of prayer times
    const currentPrayerIndex = nextPrayerIndex === 0 
      ? result.length - 1 
      : nextPrayerIndex - 1;
    
    result[currentPrayerIndex].calculatedIsCurrent = true;
  }
  
  // Special handling for Imsak
  if (imsakIndex !== -1 && ishaIndex !== -1) {
    const imsak = result[imsakIndex];
    const isha = result[ishaIndex];
    
    // If current time is after Isha and before midnight, or after midnight and before Imsak
    // then Imsak is the current prayer
    if (isha.calculatedIsPast && !imsak.calculatedIsPast) {
      // Clear any other current prayer
      result.forEach(p => {
        if (p.name !== "Imsak") {
          p.calculatedIsCurrent = false;
        }
      });
      
      // Set Imsak as current
      result[imsakIndex].calculatedIsCurrent = true;
      
      // Next prayer after Imsak is Fajr
      if (fajrIndex !== -1) {
        // Clear any other next prayer
        result.forEach(p => {
          if (p.name !== "Fajr") {
            p.calculatedIsNext = false;
          }
        });
        
        result[fajrIndex].calculatedIsNext = true;
      }
    }
    
    // If Imsak time has passed but it's before Fajr, then Fajr is next
    if (imsak.calculatedIsPast && fajrIndex !== -1 && !result[fajrIndex].calculatedIsPast) {
      // Imsak is current until Fajr
      result[imsakIndex].calculatedIsCurrent = true;
      
      // Clear any other current prayer except Imsak
      result.forEach((p, i) => {
        if (i !== imsakIndex) {
          p.calculatedIsCurrent = false;
        }
      });
      
      // Fajr is next
      result[fajrIndex].calculatedIsNext = true;
      
      // Clear any other next prayer except Fajr
      result.forEach((p, i) => {
        if (i !== fajrIndex) {
          p.calculatedIsNext = false;
        }
      });
    }
  }
  
  return result;
}

/**
 * Find the current prayer (excluding Imsak)
 */
export function findCurrentPrayer(prayers: PrayerWithDateTime[]): PrayerWithDateTime | undefined {
  return prayers.find(p => p.calculatedIsCurrent && p.name !== "Imsak");
}

/**
 * Find the next prayer (excluding Imsak)
 */
export function findNextPrayer(prayers: PrayerWithDateTime[]): PrayerWithDateTime | undefined {
  // First try to find a prayer marked as next
  const nextPrayer = prayers.find(p => p.calculatedIsNext && p.name !== "Imsak");
  
  // If no next prayer found, default to Fajr
  if (!nextPrayer) {
    return prayers.find(p => p.name === "Fajr");
  }
  
  return nextPrayer;
}

/**
 * Determine if the next prayer is tomorrow's Fajr
 */
export function checkIsNextPrayerTomorrow(
  prayers: PrayerWithDateTime[],
  currentPrayer?: PrayerWithDateTime,
  nextPrayer?: PrayerWithDateTime
): boolean {
  if (!nextPrayer) return false;
  
  // If the next prayer is Fajr and the current prayer is Isha, then the next prayer is tomorrow
  if (nextPrayer.name === "Fajr" && currentPrayer?.name === "Isha") {
    return true;
  }
  
  // If all prayers are past, the next prayer is tomorrow
  if (prayers.every(p => p.calculatedIsPast)) {
    return true;
  }
  
  // If the current prayer is Imsak and the next prayer is Fajr, check if Imsak time has passed
  if (currentPrayer?.name === "Imsak" && nextPrayer.name === "Fajr" && currentPrayer.calculatedIsPast) {
    return false; // Fajr is today, not tomorrow
  }
  
  // If the next prayer is Imsak and the current prayer is Isha, then the next prayer is tomorrow
  if (nextPrayer.name === "Imsak" && currentPrayer?.name === "Isha") {
    return true;
  }
  
  return false;
}

/**
 * Process prayer times with all calculations in one function
 */
export function processPrayerTimes(
  prayerTimes: PrayerWithStatus[], 
  currentTime: Date
): {
  prayersWithStatus: PrayerWithDateTime[];
  currentPrayer?: PrayerWithDateTime;
  nextPrayer?: PrayerWithDateTime;
  isNextPrayerTomorrow: boolean;
} {
  // Convert to date objects
  const prayersWithDateTimes = convertPrayerTimesToDateObjects(prayerTimes, currentTime);
  
  // Sort by prayer order
  const orderedPrayers = sortPrayersByOrder(prayersWithDateTimes);
  
  // Calculate statuses
  const prayersWithStatus = calculatePrayerStatuses(orderedPrayers, currentTime);
  
  // Find current and next prayers
  const currentPrayer = findCurrentPrayer(prayersWithStatus);
  const nextPrayer = findNextPrayer(prayersWithStatus);
  
  // Determine if next prayer is tomorrow
  const isNextPrayerTomorrow = nextPrayer ? 
    checkIsNextPrayerTomorrow(prayersWithStatus, currentPrayer, nextPrayer) : 
    false;
  
  return {
    prayersWithStatus,
    currentPrayer,
    nextPrayer,
    isNextPrayerTomorrow
  };
} 