'use client';

export default function LoadingPrayerTimes() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-slate-800 px-5 pt-5 pb-4 animate-pulse">
        <div className="flex justify-between">
          <div className="h-6 bg-slate-600 rounded-lg w-28" />
          <div className="text-right space-y-1.5">
            <div className="h-3 bg-slate-600 rounded w-16 ml-auto" />
            <div className="h-4 bg-slate-600 rounded w-24 ml-auto" />
          </div>
        </div>
        <div className="h-px bg-slate-700 mt-4 -mx-5" />
      </div>

      {/* Body skeleton */}
      <div className="px-4 pb-4 pt-3 space-y-3">
        {/* Date selector */}
        <div className="grid grid-cols-7 gap-1 animate-pulse">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 py-1.5">
              <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded w-5" />
              <div className="h-7 w-7 bg-slate-100 dark:bg-slate-700 rounded-full" />
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-4" />
            </div>
          ))}
        </div>

        {/* Countdown card */}
        <div className="h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/40 animate-pulse" />

        {/* Prayer rows */}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 animate-pulse"
          >
            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl shrink-0" />
            <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-700 rounded-lg" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-700 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
