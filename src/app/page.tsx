import Link from 'next/link';
import { Suspense } from 'react';
import { CompassIcon } from './components/icons';

// Create a client component wrapper for the PrayerTimes component
import ClientPrayerTimesWrapper from '@/app/components/ClientPrayerTimesWrapper';

export default function Home() {
  return (
    <div className="min-h-screen pb-8">
      {/* Top nav bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-bold text-base text-slate-800 dark:text-slate-100 tracking-tight">
            ☪ Takvimi Shqip
          </span>
          <Link
            href="/qibla"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            <CompassIcon className="w-4 h-4" />
            Kibla
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg mx-auto px-3 pt-4 grid gap-3">
        <Suspense
          fallback={
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="h-28 bg-slate-800 animate-pulse rounded-t-2xl" />
              <div className="p-4 space-y-3">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          }
        >
          <ClientPrayerTimesWrapper />
        </Suspense>
      </main>

      <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
        © {new Date().getFullYear()} Takvimi Shqip · BIK Official Times
      </footer>
    </div>
  );
}
