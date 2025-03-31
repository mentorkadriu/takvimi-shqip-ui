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
  isToday: boolean;
}

export default function PrayerTimesList({ 
  prayerTimesWithStatus, 
  formatTimeToAmPm,
  getPrayerIcon,
  isNextPrayerTomorrow,
  isToday
}: PrayerTimesListProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  const { 
    prayersWithStatus, 
    currentPrayer
  } = processPrayerTimes(prayerTimesWithStatus, currentTime);
  
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl">
      <div className="relative">
        <div className="space-y-4">
          {prayersWithStatus.map((prayer) => {
            const isPast = prayer.calculatedIsPast;
            const isCurrent = isToday && prayer.calculatedIsCurrent;
            const isNext = isToday && prayer.calculatedIsNext;
            
            const isImsakSpecial = isToday && prayer.name === "Imsak" && isCurrent && currentPrayer?.name === "Imsak";
            
            const isTomorrow = isToday && ((isNext && isNextPrayerTomorrow) || 
                              (prayer.name === "Imsak" && currentPrayer?.name === "Isha"));
            
            return (
              <div 
                key={prayer.name}
                className={cn(
                  "relative pl-8 pr-4 py-3 rounded-lg shadow-sm border",
                  {
                    "bg-blue-50/50 border-blue-300 border-2 dark:bg-blue-900/20 dark:border-blue-600 text-blue-600 dark:text-blue-400": isNext,
                    "bg-white border-green-200 border-2 dark:bg-gray-800 dark:border-green-800/50 text-green-600 dark:text-green-400": isCurrent,
                    "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700": !isCurrent && !isNext
                  }
                )}
              >

                
                <div className={cn(
                  "absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2",
                  {
                    "bg-gray-200 border-gray-100 dark:bg-gray-700 dark:border-gray-600": isPast && !isCurrent,
                    "bg-blue-100 border-blue-400 dark:bg-blue-900/30 dark:border-green-600": isCurrent,
                    "bg-white border-green-400 dark:bg-gray-800 dark:border-blue-600": isNext,
                    "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600": !isPast && !isCurrent && !isNext
                  }
                )}>
                  <div className={cn(
                    "absolute inset-0.5 rounded-full",
                    {
                      "bg-gray-400 dark:bg-gray-500": isPast && !isCurrent,
                      "bg-green-500 dark:bg-green-400": isCurrent,
                      "bg-blue-500 dark:bg-blue-400": isNext,
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
                        "text-green-600 dark:text-green-400": isCurrent,
                        "text-blue-600 dark:text-blue-400": isNext,
                        "text-gray-600 dark:text-gray-400": !isPast && !isCurrent && !isNext
                      }
                    ))}
                    <span className={cn("text-sm")}>
                      {prayer.label || prayer.name}
                    </span>
                  </div>
                  <span className={cn("text-sm")}>
                    {formatTimeToAmPm(prayer.time)}
                  </span>
                </div>
                <TimelineInfo 
                  isImsakSpecial={isImsakSpecial} 
                  isCurrent={isCurrent} 
                  isNext={isNext} 
                  isTomorrow={isTomorrow}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 


function TimelineInfo({isImsakSpecial, isCurrent, isNext, isTomorrow}: {isImsakSpecial: boolean, isCurrent: boolean, isNext: boolean, isTomorrow: boolean}) {
  return (
    <>
      {isImsakSpecial && (
        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          Koha aktuale deri në Sabah
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-2.5 left-0 right-0 mx-auto w-fit text-xs text-green-600 dark:text-green-400 font-medium bg-white dark:bg-black px-2">
          Koha aktuale
        </div>
      )}
      {isNext && (
        <div className="absolute -top-2.5 left-0 right-0 mx-auto w-fit text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-black px-2">
          Koha e ardhme
        </div>
      )}
      {isTomorrow && (
        <div className="absolute -top-2.5 left-0 right-0 mx-auto w-fit text-xs text-green-600 dark:text-green-400 font-medium bg-white dark:bg-black px-2">
          Neser
        </div>
      )}
    </>
  )
}