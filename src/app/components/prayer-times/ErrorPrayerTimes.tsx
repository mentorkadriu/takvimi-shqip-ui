'use client';

import { LocationIcon } from '../icons';

interface ErrorPrayerTimesProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorPrayerTimes({ error, onRetry }: ErrorPrayerTimesProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LocationIcon className="w-5 h-5" />
          Location
        </h2>
      </div>
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </section>
  );
} 