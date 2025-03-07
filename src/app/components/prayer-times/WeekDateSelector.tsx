'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { type Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface DateInfo {
  day: number;
  weekday: string;
  month: string;
  isToday: boolean;
  isSelected: boolean;
  fullDate: string;
}

interface WeekDateSelectorProps {
  onDateSelect: (date: Date) => void;
  weekDates: Date[];
  formatDate: (date: Date) => DateInfo;
}

export default function WeekDateSelector({ 
  onDateSelect, 
  weekDates, 
  formatDate 
}: WeekDateSelectorProps) {
  // Use selectedDate to determine the current week's range
  const weekRange = `${formatDate(weekDates[0]).month} - ${formatDate(weekDates[weekDates.length - 1]).month}`;
  
  // Reference to the Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Find the index of the selected date (should be 3 - the middle)
  const selectedIndex = weekDates.findIndex(date => 
    formatDate(date).isSelected
  );
  
  // Initialize the slider to the selected date
  useEffect(() => {
    if (swiperRef.current && selectedIndex !== -1) {
      swiperRef.current.slideTo(selectedIndex, 0);
    }
  }, [selectedIndex]);

  return (
    <div className="relative mb-6">
      {/* Week range indicator */}
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
        {weekRange}
      </div>
      
      {/* Fixed width date selector */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map(date => {
          const formattedDate = formatDate(date);
          return (
            <button
              key={formattedDate.fullDate}
              onClick={() => onDateSelect(date)}
              className={`flex flex-col items-center py-1 rounded-lg transition-colors ${
                formattedDate.isSelected 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
              }`}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate.weekday}</span>
              <span className={`flex items-center justify-center w-8 h-8 my-1 rounded-full ${
                formattedDate.isToday 
                  ? formattedDate.isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                  : formattedDate.isSelected
                    ? 'bg-blue-500 text-white'
                    : ''
              }`}>
                {formattedDate.day}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate.month}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 