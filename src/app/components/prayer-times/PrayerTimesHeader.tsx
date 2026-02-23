'use client';

import { useState } from 'react';
import { LocationIcon, ChevronDownIcon } from '../icons';
import { formatDateForDisplay, parseISODate } from '../../lib/dateUtils';
import CitySelector from './CitySelector';

interface PrayerTimesHeaderProps {
  date: string;
  weekday: string;
  islamicEvents: string | null;
  cityName: string;
  onCityChange: (city: string) => void;
}

export default function PrayerTimesHeader({
  date,
  weekday,
  islamicEvents,
  cityName,
  onCityChange,
}: PrayerTimesHeaderProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const formattedDate = formatDateForDisplay(parseISODate(date));

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {/* City button — opens the city selector */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="flex items-center gap-1.5 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Ndrysho qytetin"
          >
            <LocationIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <h2 className="text-xl font-semibold">{cityName}</h2>
            <ChevronDownIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors mt-0.5" />
          </button>

          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">{weekday}</div>
            <div className="font-medium">{formattedDate}</div>
          </div>
        </div>

        {/* Always render with min-height to prevent layout shifts */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 min-h-[1.5rem]">
          {islamicEvents || ''}
        </div>
      </div>

      <CitySelector
        isOpen={selectorOpen}
        selectedCity={cityName}
        onSelect={onCityChange}
        onClose={() => setSelectorOpen(false)}
      />
    </>
  );
}
