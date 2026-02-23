'use client';

import { type ReactElement } from 'react';

interface TimeRemaining {
  hours: number;
  minutes: number;
}

interface NextPrayerAlertProps {
  nextPrayer: { name: string; time: string } | undefined;
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
  isNextPrayerTomorrow = false,
}: NextPrayerAlertProps) {
  if (!nextPrayer || !timeRemaining) return null;

  const dayLabel = isNextPrayerTomorrow ? 'Nesër' : 'Sot';
  const isImsakNext = nextPrayer.name === 'Imsak';
  const isIshaImsakTransition = currentPrayer === 'Isha' && isImsakNext;

  const prayerLabel: Record<string, string> = {
    Imsak: 'Imsak',
    Fajr: 'Sabahu',
    Sunrise: 'Lindja',
    Dhuhr: 'Dreka',
    Asr: 'Ikindia',
    Maghrib: 'Akshami',
    Isha: 'Jacia',
  };

  const label = prayerLabel[nextPrayer.name] ?? nextPrayer.name;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3.5">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
          {getPrayerIcon(nextPrayer.name, 'w-5 h-5')}
        </div>

        {/* Prayer info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            {dayLabel} · Namazi i ardhshëm
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {label}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{nextPrayer.time}</span>
          </div>
          {isIshaImsakTransition && (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">
              Koha e Imsakut fillon pas Jacisë
            </p>
          )}
        </div>

        {/* Countdown pill */}
        <div className="shrink-0 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-sm text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-wide font-medium">mbetur</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none mt-0.5">
            {timeRemaining.hours > 0 && (
              <span>
                {timeRemaining.hours}
                <span className="text-xs font-normal text-slate-400">h </span>
              </span>
            )}
            {timeRemaining.minutes}
            <span className="text-xs font-normal text-slate-400">m</span>
          </p>
        </div>
      </div>
    </div>
  );
}
