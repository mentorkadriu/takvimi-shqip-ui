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
        <h1 className="text-2xl font-bold text-center">Takvimi Shqip per Kosove 2025</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Islamic Prayer Times & Guidance</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto grid gap-6">
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

        {/* Qibla Direction Feature */}
        <Link href="/qibla" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center justify-center text-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <CompassIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="font-medium block text-lg">Qibla Direction</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Find the direction to the Kaaba</span>
          </div>
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Takvimi Shqip. All rights reserved.</p>
      </footer>
    </div>
  );
}
