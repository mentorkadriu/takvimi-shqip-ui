'use client';

import { LocationIcon } from '../icons';

interface PrayerTimesHeaderProps {
  date: string;
  weekday: string;
  islamicEvents?: string;
  cityName: string;
}

export default function PrayerTimesHeader({
  date,
  weekday,
  islamicEvents,
  cityName
}: PrayerTimesHeaderProps) {
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Open Google Maps with the city location
  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(cityName)}`, '_blank');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <button
            onClick={openGoogleMaps}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Open in Google Maps"
          >
            <LocationIcon className="w-5 h-5" />
          </button>
          <span>{cityName}</span>
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">{weekday}</div>
          <div className="font-medium">{formattedDate}</div>
        </div>
      </div>
      {islamicEvents && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {islamicEvents}
        </div>
      )}
    </div>
  );
} 