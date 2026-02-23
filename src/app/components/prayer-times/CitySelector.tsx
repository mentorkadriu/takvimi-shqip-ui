'use client';

import { useEffect } from 'react';
import { KOSOVO_CITIES, CITY_OFFSETS } from '../../services/kosovoPrayerTimes';
import { XIcon, CheckIcon } from '../icons';
import { cn } from '../../lib/utils';

interface CitySelectorProps {
  isOpen: boolean;
  selectedCity: string;
  onSelect: (city: string) => void;
  onClose: () => void;
}

export default function CitySelector({
  isOpen,
  selectedCity,
  onSelect,
  onClose,
}: CitySelectorProps) {
  // Lock body scroll while sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Zgjidhni Qytetin"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Zgjidhni Qytetin
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Mbyll"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* City grid */}
        <div className="px-4 py-4 grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pb-8">
          {KOSOVO_CITIES.map((city) => {
            const offset = CITY_OFFSETS[city] ?? 0;
            const isSelected = city === selectedCity;

            return (
              <button
                key={city}
                onClick={() => { onSelect(city); onClose(); }}
                className={cn(
                  'flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-medium transition-all active:scale-95',
                  isSelected
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-400 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                )}
              >
                <span>{city}</span>

                <span className="flex items-center gap-1">
                  {offset !== 0 && (
                    <span className={cn(
                      'text-xs px-1.5 py-0.5 rounded-md font-normal',
                      offset > 0
                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    )}>
                      {offset > 0 ? `+${offset}m` : `${offset}m`}
                    </span>
                  )}
                  {isSelected && (
                    <CheckIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
