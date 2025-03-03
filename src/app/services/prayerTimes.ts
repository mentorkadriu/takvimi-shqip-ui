interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: string[];
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number;
          Isha: number;
        };
        location: {
          latitude: number;
          longitude: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {
        Imsak: number;
        Fajr: number;
        Sunrise: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Sunset: number;
        Isha: number;
        Midnight: number;
      };
    };
  };
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak?: string;  // Optional for backward compatibility
  date: string;
  hijriDate: string;
  hijriMonth: string;
  hijriYear: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Cache for prayer times to reduce API calls
interface PrayerTimesCache {
  [key: string]: {
    data: PrayerTimes;
    timestamp: number;
  };
}

const prayerTimesCache: PrayerTimesCache = {};
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

// Add this interface for local adjustments
interface LocalAdjustment {
  city: string;
  adjustments: {
    fajr?: number;
    sunrise?: number;
    dhuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
    imsak?: number;
  };
}

// Define known local adjustments (in minutes)
const LOCAL_ADJUSTMENTS: LocalAdjustment[] = [
  {
    city: 'Unknown Location',
    adjustments: {
      fajr: -1,
      sunrise: -1,
      dhuhr: -1,
      asr: -1,
      maghrib: -1,
      isha: -1
    }
  },
  {
    city: 'Vushtrri',
    adjustments: {
      fajr: -1,
      sunrise: -1,
      dhuhr: -1,
      asr: -1,
      maghrib: -1,
      isha: -1
    }
  },
  // Kosovo prayer times adjustments
  // Based on 42.5° latitude and 21° longitude with Temkin of 1.5° (6 minutes)
  {
    city: 'Kosovo',
    adjustments: {
      fajr: -6,     // Sabahu starts 20 min after imsak, with 6 min temkin adjustment
      sunrise: -6,  // Sunrise is calculated 6 min earlier (for higher mountains)
      dhuhr: 0,     // No specific adjustment mentioned for Dhuhr
      asr: 0,       // No specific adjustment mentioned for Asr
      maghrib: 6,   // Perëndimi (sunset) is calculated 6 min later (for higher mountains)
      isha: 0       // No specific adjustment mentioned for Isha
    }
  },
  // Add specific city adjustments based on the Takvim differences
  {
    city: 'Sharri',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6 + 2, // +2 minutes compared to standard Takvim
      isha: 0 + 2     // +2 minutes compared to standard Takvim
    }
  },
  {
    city: 'Ferizaj',
    adjustments: {
      fajr: -6 - 1,   // -1 minute compared to standard Takvim
      sunrise: -6 - 1, // -1 minute compared to standard Takvim
      dhuhr: 0 - 1,    // -1 minute compared to standard Takvim
      asr: 0 - 1,      // -1 minute compared to standard Takvim
      maghrib: 6 - 1,  // -1 minute compared to standard Takvim
      isha: 0 - 1      // -1 minute compared to standard Takvim
    }
  },
  {
    city: 'Gjilan',
    adjustments: {
      fajr: -6 - 1,
      sunrise: -6 - 1,
      dhuhr: 0 - 1,
      asr: 0 - 1,
      maghrib: 6 - 1,
      isha: 0 - 1
    }
  },
  {
    city: 'Prishtina',
    adjustments: {
      fajr: -6 - 1,
      sunrise: -6 - 1,
      dhuhr: 0 - 1,
      asr: 0 - 1,
      maghrib: 6 - 1,
      isha: 0 - 1
    }
  },
  {
    city: 'Podujeva',
    adjustments: {
      fajr: -6 - 1,
      sunrise: -6 - 1,
      dhuhr: 0 - 1,
      asr: 0 - 1,
      maghrib: 6 - 1,
      isha: 0 - 1
    }
  },
  {
    city: 'Presheva',
    adjustments: {
      fajr: -6 - 2,
      sunrise: -6 - 2,
      dhuhr: 0 - 2,
      asr: 0 - 2,
      maghrib: 6 - 2,
      isha: 0 - 2
    }
  },
  // Keep other cities with standard Kosovo adjustments
  {
    city: 'Prizren',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6,
      isha: 0
    }
  },
  {
    city: 'Peja',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6,
      isha: 0
    }
  },
  {
    city: 'Gjakova',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6,
      isha: 0
    }
  },
  {
    city: 'Mitrovica',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6,
      isha: 0
    }
  },
  {
    city: 'Deçan',
    adjustments: {
      fajr: -6,
      sunrise: -6,
      dhuhr: 0,
      asr: 0,
      maghrib: 6,
      isha: 0
    }
  }
];

/**
 * Apply local adjustments to prayer times based on city name
 * @param times The prayer times to adjust
 * @param cityName The name of the city
 * @returns Adjusted prayer times
 */
function applyLocalAdjustments(times: PrayerTimes, cityName: string): PrayerTimes {
  // Find matching city in adjustments
  const cityAdjustment = LOCAL_ADJUSTMENTS.find(
    adj => adj.city.toLowerCase() === cityName.toLowerCase()
  );
  
  // If no exact city match, check if it's in Kosovo
  const isKosovo = [
    'kosovo', 'prishtina', 'prizren', 'peja', 'gjakova', 
    'ferizaj', 'gjilan', 'mitrovica', 'deçan', 'vushtrri'
  ].includes(cityName.toLowerCase());
  
  const adjustmentToUse = cityAdjustment || 
    (isKosovo ? LOCAL_ADJUSTMENTS.find(adj => adj.city === 'Kosovo') : null);
  
  if (!adjustmentToUse) {
    return times; // No adjustments needed
  }
  
  // Helper function to adjust time by minutes
  const adjustTime = (timeStr: string, minutes: number | undefined): string => {
    if (!minutes) return timeStr;
    
    const [hours, mins] = timeStr.split(':').map(Number);
    let totalMinutes = hours * 60 + mins + minutes;
    
    // Handle overflow/underflow
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };
  
  // Apply adjustments
  const { adjustments } = adjustmentToUse;
  
  // Calculate Imsak time for Kosovo (20 minutes before Fajr)
  let imsakTime = times.imsak;
  if (isKosovo && times.fajr) {
    const [fajrHours, fajrMins] = times.fajr.split(':').map(Number);
    let imsakMinutes = fajrHours * 60 + fajrMins - 20; // 20 minutes before Fajr
    
    // Handle underflow
    if (imsakMinutes < 0) imsakMinutes += 24 * 60;
    
    const imsakHours = Math.floor(imsakMinutes / 60);
    const imsakMins = imsakMinutes % 60;
    
    imsakTime = `${imsakHours.toString().padStart(2, '0')}:${imsakMins.toString().padStart(2, '0')}`;
  }
  
  return {
    ...times,
    fajr: adjustTime(times.fajr, adjustments.fajr),
    sunrise: adjustTime(times.sunrise, adjustments.sunrise),
    dhuhr: adjustTime(times.dhuhr, adjustments.dhuhr),
    asr: adjustTime(times.asr, adjustments.asr),
    maghrib: adjustTime(times.maghrib, adjustments.maghrib),
    isha: adjustTime(times.isha, adjustments.isha),
    imsak: imsakTime
  };
}

/**
 * Fetches prayer times for a specific location and date
 * @param coordinates The latitude and longitude coordinates
 * @param date The date to fetch prayer times for (YYYY-MM-DD)
 * @param method The calculation method (1-15, default: 2 - Islamic Society of North America)
 * @returns Formatted prayer times
 */
export async function getPrayerTimes(
  coordinates: Coordinates,
  date: string = new Date().toISOString().split('T')[0],
  method: number = 2,
  cityName: string = ''
): Promise<PrayerTimes> {
  try {
    const { latitude, longitude } = coordinates;
    
    // For Kosovo, use method 3 (Muslim World League)
    const isKosovo = [
      'kosovo', 'prishtina', 'prizren', 'peja', 'gjakova', 
      'ferizaj', 'gjilan', 'mitrovica', 'deçan', 'vushtrri'
    ].includes(cityName.toLowerCase());
    
    // Use method 3 for Kosovo locations
    const methodToUse = isKosovo ? 13 : method;
    
    // Create a cache key based on coordinates, date, and method
    const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}_${date}_${methodToUse}`;
    
    // Check if we have a valid cached result
    const cachedResult = prayerTimesCache[cacheKey];
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
      // Apply local adjustments to cached result if city is provided
      if (cityName) {
        return applyLocalAdjustments(cachedResult.data, cityName);
      }
      return cachedResult.data;
    }
    
    // If not in cache or expired, fetch from API
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${methodToUse}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, { 
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prayer times: ${response.status}`);
      }
      
      const data: PrayerTimesResponse = await response.json();
      
      // Format the times (remove seconds)
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
      };
      
      const formattedTimes: PrayerTimes = {
        fajr: formatTime(data.data.timings.Fajr),
        sunrise: formatTime(data.data.timings.Sunrise),
        dhuhr: formatTime(data.data.timings.Dhuhr),
        asr: formatTime(data.data.timings.Asr),
        maghrib: formatTime(data.data.timings.Maghrib),
        isha: formatTime(data.data.timings.Isha),
        imsak: formatTime(data.data.timings.Imsak),
        date: data.data.date.gregorian.date,
        hijriDate: data.data.date.hijri.day,
        hijriMonth: data.data.date.hijri.month.en,
        hijriYear: data.data.date.hijri.year
      };
      
      // Cache the result
      prayerTimesCache[cacheKey] = {
        data: formattedTimes,
        timestamp: Date.now()
      };
      
      // Apply local adjustments if city is provided
      if (cityName) {
        return applyLocalAdjustments(formattedTimes, cityName);
      }
      
      return formattedTimes;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

// Cache for geolocation to reduce API calls
let locationCache: {
  coordinates: Coordinates | null;
  timestamp: number;
} = {
  coordinates: null,
  timestamp: 0
};

const LOCATION_CACHE_EXPIRY = 300000; // 5 minutes in milliseconds

/**
 * Gets the user's current location coordinates
 * @returns Promise with coordinates
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    // Check if we have a valid cached location
    if (
      locationCache.coordinates && 
      (Date.now() - locationCache.timestamp) < LOCATION_CACHE_EXPIRY
    ) {
      return resolve(locationCache.coordinates);
    }
    
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    const timeoutId = setTimeout(() => {
      reject(new Error('Location request timed out. Using default location.'));
    }, 10000); // 10 second timeout
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Cache the location
        locationCache = {
          coordinates,
          timestamp: Date.now()
        };
        
        resolve(coordinates);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

/**
 * Default coordinates for Tirana, Albania
 */
export const DEFAULT_COORDINATES: Coordinates = {
  latitude: 41.3275,
  longitude: 19.8187
}; 