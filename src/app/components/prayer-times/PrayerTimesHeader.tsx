'use client';

import { useState } from 'react';
import { LocationIcon, ChevronDownIcon } from '../icons';
import {
  formatDateForDisplay,
  parseISODate,
  translateWeekday,
  toHijriDate,
} from '../../lib/dateUtils';
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
  const parsedDate = parseISODate(date);
  const formattedDate = formatDateForDisplay(parsedDate);
  const albanianWeekday = translateWeekday(weekday);
  const hijri = toHijriDate(parsedDate);
  const hijriStr = hijri.year > 0 ? `${hijri.day} ${hijri.monthName} ${hijri.year}` : '';

  return (
    <>
      {/* Dark gradient banner */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-700 px-5 pt-5 pb-4">
        {/* Top row: city selector + date */}
        <div className="flex items-start justify-between">
          {/* City button */}
          <button
            onClick={() => setSelectorOpen(true)}
            className="flex items-center gap-1.5 group"
            aria-label="Ndrysho qytetin"
          >
            <LocationIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-white font-semibold text-lg leading-tight group-hover:text-emerald-300 transition-colors">
              {cityName}
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors mt-0.5" />
          </button>

          {/* Date */}
          <div className="text-right">
            <p className="text-slate-400 text-xs font-medium">{albanianWeekday}</p>
            <p className="text-white text-sm font-semibold leading-tight">{formattedDate}</p>
            {hijriStr && <p className="text-slate-400 text-xs mt-0.5">☽ {hijriStr}</p>}
          </div>
        </div>

        {/* Islamic event badge */}
        {islamicEvents && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-emerald-300 text-xs font-medium">{islamicEvents}</span>
          </div>
        )}

        {/* Decorative bottom fade */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mt-4 -mx-5" />
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
