'use client';

interface ErrorPrayerTimesProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorPrayerTimes({ error, onRetry }: ErrorPrayerTimesProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="bg-slate-800 h-20 rounded-t-2xl" />
      <div className="px-4 py-10 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Provo përsëri
        </button>
      </div>
    </div>
  );
}
