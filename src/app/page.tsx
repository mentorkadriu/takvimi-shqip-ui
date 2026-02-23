import Link from "next/link";
import { Suspense } from "react";
import { CompassIcon, ClockIcon } from "./components/icons";

// Create a client component wrapper for the PrayerTimes component
import ClientPrayerTimesWrapper from "@/app/components/ClientPrayerTimesWrapper";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-4 sm:p-6 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto py-4">
        <h1 className="text-2xl font-bold text-center">Takvimi Shqip për Kosovë</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Islamic Prayer Times & Guidance</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto grid gap-4">

        {/* Qibla Direction — pinned at top for quick access */}
        <Link
          href="/qibla"
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          <CompassIcon className="w-6 h-6 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm block">Drejtimi i Kiblës</span>
            <span className="text-xs text-blue-100 block">Gjej drejtimin e Qabesë</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-blue-200">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Prayer Times Card */}
        <Suspense fallback={
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Prayer Times
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
            </div>
            <div className="animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          </section>
        }>
          <ClientPrayerTimesWrapper />
        </Suspense>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Takvimi Shqip. All rights reserved.</p>
      </footer>
    </div>
  );
}
