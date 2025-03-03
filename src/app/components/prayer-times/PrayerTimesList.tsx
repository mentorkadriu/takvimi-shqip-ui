'use client';

interface PrayerWithStatus {
  name: string;
  time: string;
  label: string;
  status: 'past' | 'current' | 'next' | 'upcoming' | 'normal';
}

interface PrayerTimesListProps {
  prayerTimesWithStatus: PrayerWithStatus[];
  formatTimeToAmPm: (time: string) => string;
  getPrayerIcon: (name: string, className?: string) => JSX.Element;
}

export default function PrayerTimesList({ 
  prayerTimesWithStatus, 
  formatTimeToAmPm, 
  getPrayerIcon 
}: PrayerTimesListProps) {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      {/* Prayer time cards with timeline bullets */}
      <div className="space-y-4">
        {prayerTimesWithStatus.map((prayer) => (
          <div 
            key={prayer.name}
            className={`relative pl-8 pr-4 py-3 rounded-lg shadow-sm border ${
              prayer.status === 'current' 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                : prayer.status === 'next'
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {/* Timeline bullet */}
            <div 
              className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 ${
                prayer.status === 'current'
                  ? 'bg-blue-500 border-blue-300 dark:border-blue-700'
                  : prayer.status === 'next'
                    ? 'bg-emerald-500 border-emerald-300 dark:border-emerald-700'
                    : prayer.status === 'past'
                      ? 'bg-gray-300 border-gray-200 dark:bg-gray-600 dark:border-gray-500'
                      : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
              }`}
            ></div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`${
                  prayer.status === 'past' 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : prayer.status === 'current'
                      ? 'text-blue-600 dark:text-blue-400'
                      : prayer.status === 'next'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {getPrayerIcon(prayer.name)}
                </span>
                <span className={`font-medium ${
                  prayer.status === 'past' ? 'text-gray-500 dark:text-gray-400' : ''
                }`}>
                  {prayer.label}
                </span>
              </div>
              <span className={`${
                prayer.status === 'past' ? 'text-gray-500 dark:text-gray-400' : ''
              }`}>
                {formatTimeToAmPm(prayer.time)}
              </span>
            </div>
            
            {/* Status indicator */}
            {(prayer.status === 'current' || prayer.status === 'next') && (
              <div className="mt-1 text-xs ml-7">
                {prayer.status === 'current' ? (
                  <span className="text-blue-600 dark:text-blue-400">Current prayer time</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">Next prayer time</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 