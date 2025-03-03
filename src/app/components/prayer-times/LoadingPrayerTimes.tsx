'use client';

import { LocationIcon } from '../icons';

export default function LoadingPrayerTimes() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LocationIcon className="w-5 h-5" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
      
      {/* Loading placeholder for date selector */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col items-center w-14">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 mb-1"></div>
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading placeholder for Prayer Times Card SVG */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
        <div className="relative h-16">
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-0"
              style={{ left: `${i * 20}%` }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-gray-200 border-gray-100 dark:bg-gray-700 dark:border-gray-600"></div>
              <div className="absolute top-10 -translate-x-1/2 w-16">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading placeholder for next prayer alert */}
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
      
      {/* Loading placeholder for timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Prayer time cards with timeline bullets */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="relative pl-8 pr-4 py-3 rounded-lg shadow-sm border bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
            >
              {/* Timeline bullet */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 bg-gray-200 border-gray-100 dark:bg-gray-700 dark:border-gray-600"></div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 