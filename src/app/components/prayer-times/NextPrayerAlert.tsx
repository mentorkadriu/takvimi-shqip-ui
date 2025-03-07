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
  isNextPrayerTomorrow?: boolean;
}

export default function NextPrayerAlert({ 
  nextPrayer, 
  timeRemaining, 
  getPrayerIcon,
  currentPrayer,
  isNextPrayerTomorrow = false
}: NextPrayerAlertProps) {
  if (!nextPrayer || !timeRemaining) return null;

  // Use the isNextPrayerTomorrow prop instead of calculating it here
  const timePrefix = isNextPrayerTomorrow ? 'Neser' : 'Sot';
  
  // Special message for Imsak
  const isImsakNext = nextPrayer.name === 'Imsak';
  const isIshaCurrentAndImsakNext = currentPrayer === 'Isha' && isImsakNext;
  
  // Custom message for when Imsak is next after Isha
  const customMessage = isIshaCurrentAndImsakNext 
    ? 'Koha e Imsakut fillon pas Jacisë'
    : undefined;

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getPrayerIcon(nextPrayer.name, "w-5 h-5")}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {timePrefix}: {nextPrayer.name === 'Imsak' ? 'Imsak' : nextPrayer.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {nextPrayer.time}
            </p>
            {customMessage && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {customMessage}
              </p>
            )}
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