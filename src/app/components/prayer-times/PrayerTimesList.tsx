'use client';

import { type ReactElement, useEffect, useState } from 'react';
import { PrayerWithStatus } from '../../types/prayerTimes';
import { cn } from '../../lib/utils';
import { 
  processPrayerTimes
} from '../../lib/prayerTimeUtils';

interface PrayerTimesListProps {
  prayerTimesWithStatus: PrayerWithStatus[];
  formatTimeToAmPm: (time: string) => string;
  getPrayerIcon: (name: string, className?: string) => ReactElement;
  isNextPrayerTomorrow: boolean;
}

export default function PrayerTimesList({ 
  prayerTimesWithStatus, 
  formatTimeToAmPm,
  getPrayerIcon,
  isNextPrayerTomorrow
}: PrayerTimesListProps) {
  console.log('prayerTimesWithStatus', prayerTimesWithStatus); // dont delete this
  // Keep current time updated
  const [currentTime, setCurrentTime] = useState(() => new Date());
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Process prayer times using our utility functions
  const { 
    prayersWithStatus, 
    currentPrayer
  } = processPrayerTimes(prayerTimesWithStatus, currentTime);
  
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
        
        {/* Prayer time cards with timeline bullets */}
        <div className="space-y-4">
          {prayersWithStatus.map((prayer) => {
            const isPast = prayer.calculatedIsPast;
            const isCurrent = prayer.calculatedIsCurrent;
            const isNext = prayer.calculatedIsNext;
            
            // Special handling for Imsak
            const isImsakSpecial = prayer.name === "Imsak" && isCurrent && currentPrayer?.name === "Imsak";
            
            // Determine if this prayer is tomorrow
            const isTomorrow = (isNext && isNextPrayerTomorrow) || 
                              (prayer.name === "Imsak" && currentPrayer?.name === "Isha");
            
            return (
              <div 
                key={prayer.name}
                className={cn(
                  "relative pl-8 pr-4 py-3 rounded-lg shadow-sm border",
                  {
                    "bg-blue-50/50 border-blue-300 border-2 dark:bg-blue-900/20 dark:border-blue-600": isCurrent,
                    "bg-white border-green-200 border-2 dark:bg-gray-800 dark:border-green-800/50": isNext,
                    "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700": !isCurrent && !isNext
                  }
                )}
              >
                {/* Today/Tomorrow indicator for next prayer */}
                {isTomorrow && (
                  <div className="absolute right-2 top-1 text-xs text-green-600 dark:text-green-400 font-medium">
                    Neser
                  </div>
                )}
                
                {/* Timeline bullet */}
                <div className={cn(
                  "absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2",
                  {
                    "bg-gray-200 border-gray-100 dark:bg-gray-700 dark:border-gray-600": isPast && !isCurrent,
                    "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-blue-600": isCurrent,
                    "bg-white border-green-400 dark:bg-gray-800 dark:border-green-600": isNext,
                    "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600": !isPast && !isCurrent && !isNext
                  }
                )}>
                  {/* Inner dot */}
                  <div className={cn(
                    "absolute inset-0.5 rounded-full",
                    {
                      "bg-gray-400 dark:bg-gray-500": isPast && !isCurrent,
                      "bg-blue-500 dark:bg-blue-400": isCurrent,
                      "bg-green-500 dark:bg-green-400": isNext,
                      "bg-gray-300 dark:bg-gray-600": !isPast && !isCurrent && !isNext
                    }
                  )} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getPrayerIcon(prayer.name, cn(
                      "w-5 h-5",
                      {
                        "text-gray-400 dark:text-gray-500": isPast && !isCurrent,
                        "text-blue-600 dark:text-blue-400": isCurrent,
                        "text-green-600 dark:text-green-400": isNext,
                        "text-gray-600 dark:text-gray-400": !isPast && !isCurrent && !isNext
                      }
                    ))}
                    <span className={cn(
                      "text-sm",
                      {
                        "text-gray-400 dark:text-gray-500": isPast && !isCurrent,
                        "text-blue-600 dark:text-blue-400 font-medium": isCurrent,
                        "text-green-600 dark:text-green-400 font-medium": isNext,
                        "text-gray-600 dark:text-gray-400": !isPast && !isCurrent && !isNext
                      }
                    )}>
                      {prayer.label || prayer.name}
                    </span>
                  </div>
                  <span className={cn(
                    "text-sm",
                    {
                      "text-gray-400 dark:text-gray-500": isPast && !isCurrent,
                      "text-blue-600 dark:text-blue-400 font-medium": isCurrent,
                      "text-green-600 dark:text-green-400 font-medium": isNext,
                      "text-gray-600 dark:text-gray-400": !isPast && !isCurrent && !isNext
                    }
                  )}>
                    {formatTimeToAmPm(prayer.time)}
                  </span>
                </div>
                
                {/* Special indicator for Imsak when it's current */}
                {isImsakSpecial && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    Koha aktuale deri në Sabah
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 