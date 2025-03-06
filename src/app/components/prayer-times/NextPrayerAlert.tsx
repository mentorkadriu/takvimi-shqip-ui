'use client';

import { type ReactElement } from 'react';

interface TimeRemaining {
  hours: number;
  minutes: number;
}

interface NextPrayerAlertProps {
  nextPrayer: {
    name: string;
    time: string;
  } | undefined;
  timeRemaining: TimeRemaining | null;
  getPrayerIcon: (name: string, className?: string) => ReactElement;
  currentPrayer?: string;
}

export default function NextPrayerAlert({ 
  nextPrayer, 
  timeRemaining, 
  getPrayerIcon,
  currentPrayer
}: NextPrayerAlertProps) {
  if (!nextPrayer || !timeRemaining) return null;

  // If current prayer is Isha and next prayer is Imsak, it's tomorrow's Imsak
  const isTomorrow = currentPrayer === 'Isha' && nextPrayer.name === 'Imsak';
  const timePrefix = isTomorrow ? 'Neser' : 'Sot';

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getPrayerIcon(nextPrayer.name, "w-5 h-5")}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {timePrefix}: {nextPrayer.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nextPrayer.time}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Koha e mbetur
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {timeRemaining.hours}h {timeRemaining.minutes}m
          </p>
        </div>
      </div>
    </div>
  );
} 