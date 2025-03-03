'use client';

import { type ReactElement } from 'react';
import { PrayerWithStatus } from '../../types/prayerTimes';

interface PrayerTimesListProps {
  prayerTimesWithStatus: PrayerWithStatus[];
  formatTimeToAmPm: (time: string) => string;
  getPrayerIcon: (name: string, className?: string) => ReactElement;
}

export default function PrayerTimesList({ 
  prayerTimesWithStatus, 
  formatTimeToAmPm,
  getPrayerIcon 
}: PrayerTimesListProps) {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="divide-y divide-gray-100 dark:divide-gray-700 space-y-1">
        {prayerTimesWithStatus.map(prayer => (
          <div 
            key={prayer.name}
            className={`flex items-center justify-between py-3 ${
              prayer.isCurrent ? 'bg-blue-50/50 dark:bg-blue-900/20 -mx-4 px-4' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {getPrayerIcon(prayer.name, `w-5 h-5 ${
                prayer.isPast 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : prayer.isCurrent
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
              }`)}
              <span className={`text-sm ${
                prayer.isPast 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : prayer.isCurrent
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
              }`}>
                {prayer.name}
              </span>
            </div>
            <span className={`text-sm ${
              prayer.isPast 
                ? 'text-gray-400 dark:text-gray-500' 
                : prayer.isCurrent
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
            }`}>
              {formatTimeToAmPm(prayer.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 