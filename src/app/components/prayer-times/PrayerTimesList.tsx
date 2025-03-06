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
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
        
        {/* Prayer time cards with timeline bullets */}
        <div className="space-y-4">
          {prayerTimesWithStatus.map(prayer => (
            <div 
              key={prayer.name}
              className={`relative pl-8 pr-4 py-3 rounded-lg shadow-sm border ${
                prayer.isCurrent 
                  ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50' 
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              {/* Timeline bullet */}
              <div className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 ${
                prayer.isPast 
                  ? 'bg-gray-200 border-gray-100 dark:bg-gray-700 dark:border-gray-600' 
                  : prayer.isCurrent
                    ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                    : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
              }`}>
                {/* Inner dot */}
                <div className={`absolute inset-0.5 rounded-full ${
                  prayer.isPast 
                    ? 'bg-gray-400 dark:bg-gray-500' 
                    : prayer.isCurrent
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              </div>
              
              <div className="flex justify-between items-center">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 