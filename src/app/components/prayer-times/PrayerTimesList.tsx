'use client';

import { type ReactElement, useEffect, useState } from 'react';
import { PrayerWithStatus } from '../../types/prayerTimes';
import { cn } from '../../lib/utils';
import { processPrayerTimes } from '../../lib/prayerTimeUtils';

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
  isToday,
}: PrayerTimesListProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { prayersWithStatus } = processPrayerTimes(prayerTimesWithStatus, currentTime);

  return (
    <div className="space-y-1.5">
      {prayersWithStatus.map((prayer) => {
        const isPast = prayer.calculatedIsPast;
        const isCurrent = isToday && prayer.calculatedIsCurrent;
        const isNext = isToday && prayer.calculatedIsNext;
        const isTomorrow = isToday && isNext && isNextPrayerTomorrow;

        return (
          <div
            key={prayer.name}
            className={cn(
              'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all',
              isCurrent
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                : isNext
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60'
                  : isPast
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-700/50 opacity-60'
                    : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
            )}
          >
            {/* Colored left accent bar */}
            {(isCurrent || isNext) && (
              <div
                className={cn(
                  'absolute left-0 top-2 bottom-2 w-0.5 rounded-full',
                  isCurrent ? 'bg-emerald-500' : 'bg-blue-500'
                )}
              />
            )}

            {/* Prayer icon */}
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                isCurrent
                  ? 'bg-emerald-100 dark:bg-emerald-900/40'
                  : isNext
                    ? 'bg-blue-100 dark:bg-blue-900/40'
                    : isPast
                      ? 'bg-slate-100 dark:bg-slate-700/50'
                      : 'bg-slate-50 dark:bg-slate-700/30'
              )}
            >
              {getPrayerIcon(prayer.name, 'w-5 h-5')}
            </div>

            {/* Name + status badge */}
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  'text-sm font-semibold',
                  isCurrent
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : isNext
                      ? 'text-blue-700 dark:text-blue-400'
                      : isPast
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-200'
                )}
              >
                {prayer.label || prayer.name}
              </span>
              {isCurrent && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-full">
                  Aktual
                </span>
              )}
              {isNext && !isTomorrow && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-full">
                  Ardhshëm
                </span>
              )}
              {isTomorrow && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/50 px-1.5 py-0.5 rounded-full">
                  Nesër
                </span>
              )}
            </div>

            {/* Time */}
            <span
              className={cn(
                'text-sm font-semibold tabular-nums shrink-0',
                isCurrent
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : isNext
                    ? 'text-blue-700 dark:text-blue-400'
                    : isPast
                      ? 'text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 dark:text-slate-300'
              )}
            >
              {formatTimeToAmPm(prayer.time)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
