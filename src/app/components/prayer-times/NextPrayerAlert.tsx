'use client';

interface TimeRemaining {
  hours: number;
  minutes: number;
}

interface NextPrayerAlertProps {
  nextPrayer: {
    name: string;
    label: string;
  } | undefined;
  timeRemaining: TimeRemaining | null;
  getPrayerIcon: (name: string, className?: string) => JSX.Element;
}

export default function NextPrayerAlert({ 
  nextPrayer, 
  timeRemaining, 
  getPrayerIcon 
}: NextPrayerAlertProps) {
  if (!nextPrayer || !timeRemaining) return null;

  return (
    <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
      <div className="flex items-center gap-2">
        {getPrayerIcon(nextPrayer.name, 'w-5 h-5 text-emerald-600 dark:text-emerald-400')}
        <p className="text-sm text-emerald-800 dark:text-emerald-200">
          Next prayer: <span className="font-medium">{nextPrayer.label}</span> in{' '}
          <span className="font-medium">
            {timeRemaining.hours}h {timeRemaining.minutes}m
          </span>
        </p>
      </div>
    </div>
  );
} 