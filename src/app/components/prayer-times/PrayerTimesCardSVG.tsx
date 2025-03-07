'use client';

import { useMemo } from 'react';
import { PrayerTimes as PrayerTimesType } from '../../types/prayerTimes';
import { 
  FajrIcon, 
  SunriseIcon, 
  DhuhrIcon, 
  AsrIcon, 
  MaghribIcon, 
  IshaIcon,
  ClockIcon
} from '../icons';

// Create an Imsak icon component that reuses the FajrIcon with a different color
const ImsakIcon = (props: React.ComponentProps<typeof FajrIcon>) => <FajrIcon {...props} />;

interface PrayerTimesCardSVGProps {
  prayerTimes: PrayerTimesType | null;
  currentTime: Date;
  isToday: boolean;
}

export default function PrayerTimesCardSVG({ prayerTimes, currentTime, isToday }: PrayerTimesCardSVGProps) {
  // Convert time string to minutes since midnight
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format time to 12-hour format with AM/PM
  const timeFormatter = useMemo(() => {
    function formatTimeToAmPm(time: string): string {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    return formatTimeToAmPm;
  }, []);

  // Get current time in minutes
  const currentTimeInMinutes = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return hours * 60 + minutes;
  }, [currentTime]);

  // Calculate positions and data for the SVG visualization
  const svgData = useMemo(() => {
    if (!prayerTimes) return null;

    const prayers = [
      { name: 'Imsak', time: prayerTimes.imsak, icon: ImsakIcon, color: 'purple' },
      { name: 'Fajr', time: prayerTimes.fajr, icon: FajrIcon, color: 'blue' },
      { name: 'Sunrise', time: prayerTimes.sunrise, icon: SunriseIcon, color: 'amber' },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: DhuhrIcon, color: 'yellow' },
      { name: 'Asr', time: prayerTimes.asr, icon: AsrIcon, color: 'orange' },
      { name: 'Maghrib', time: prayerTimes.maghrib, icon: MaghribIcon, color: 'red' },
      { name: 'Isha', time: prayerTimes.isha, icon: IshaIcon, color: 'indigo' }
    ];

    // Convert prayer times to minutes for positioning
    const prayerTimesInMinutes = prayers.map(prayer => ({
      ...prayer,
      minutesSinceMidnight: timeToMinutes(prayer.time),
      formattedTime: timeFormatter(prayer.time)
    }));

    // Sort prayers by time for proper segment calculation
    const sortedPrayers = [...prayerTimesInMinutes].sort((a, b) => 
      a.minutesSinceMidnight - b.minutesSinceMidnight
    );

    // Calculate positions on a 24-hour scale (0-1440 minutes)
    const totalMinutesInDay = 24 * 60;
    const svgWidth = 100; // percentage width

    // Calculate time segments between prayers
    const timeSegments = [];
    for (let i = 0; i < sortedPrayers.length - 1; i++) {
      const current = sortedPrayers[i];
      const next = sortedPrayers[i + 1];
      
      timeSegments.push({
        start: current.minutesSinceMidnight,
        end: next.minutesSinceMidnight,
        startPosition: (current.minutesSinceMidnight / totalMinutesInDay) * svgWidth,
        endPosition: (next.minutesSinceMidnight / totalMinutesInDay) * svgWidth,
        color: current.color,
        isActive: isToday && 
          currentTimeInMinutes >= current.minutesSinceMidnight && 
          currentTimeInMinutes < next.minutesSinceMidnight
      });
    }

    // Add the last segment (Isha to Imsak next day)
    const lastPrayer = sortedPrayers[sortedPrayers.length - 1]; // Should be Isha
    const firstPrayer = sortedPrayers[0]; // Should be Imsak
    
    timeSegments.push({
      start: lastPrayer.minutesSinceMidnight,
      end: firstPrayer.minutesSinceMidnight + totalMinutesInDay, // Add 24 hours
      startPosition: (lastPrayer.minutesSinceMidnight / totalMinutesInDay) * svgWidth,
      endPosition: 100, // End at 100%
      color: lastPrayer.color,
      isActive: isToday && 
        (currentTimeInMinutes >= lastPrayer.minutesSinceMidnight || 
         currentTimeInMinutes < firstPrayer.minutesSinceMidnight)
    });

    return {
      prayers: sortedPrayers.map(prayer => ({
        ...prayer,
        position: (prayer.minutesSinceMidnight / totalMinutesInDay) * svgWidth,
        isPast: isToday && prayer.minutesSinceMidnight < currentTimeInMinutes,
        isCurrent: isToday && (
          // Regular case: current time is between this prayer and the next
          (prayer.minutesSinceMidnight <= currentTimeInMinutes && 
           sortedPrayers.indexOf(prayer) < sortedPrayers.length - 1 && 
           sortedPrayers[sortedPrayers.indexOf(prayer) + 1].minutesSinceMidnight > currentTimeInMinutes) ||
          // Special case: current time is after the last prayer (Isha)
          (prayer.name === 'Isha' && currentTimeInMinutes >= prayer.minutesSinceMidnight) ||
          // Special case: current time is before the first prayer (Imsak) but after midnight
          (prayer.name === 'Imsak' && currentTimeInMinutes < prayer.minutesSinceMidnight)
        )
      })),
      timeSegments,
      currentPosition: isToday ? (currentTimeInMinutes / totalMinutesInDay) * svgWidth : null
    };
  }, [prayerTimes, currentTimeInMinutes, isToday, timeFormatter]);

  if (!svgData) return null;

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <ClockIcon className="w-4 h-4" />
        Imsak to Isha Prayer Timeline
      </h3>
      
      {/* SVG Timeline */}
      <div className="relative h-24">
        {/* Time segments */}
        {svgData.timeSegments.map(segment => (
          <div 
            key={`segment-${segment.start}-${segment.end}`}
            className={`absolute h-1.5 rounded-full ${
              segment.isActive 
                ? `bg-${segment.color}-500 dark:bg-${segment.color}-600` 
                : `bg-${segment.color}-200 dark:bg-${segment.color}-900/30`
            }`}
            style={{ 
              left: `${segment.startPosition}%`, 
              width: `${segment.endPosition - segment.startPosition}%`,
              top: '2.5rem'
            }}
          ></div>
        ))}
        
        {/* Base line */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700 rounded"></div>
        
        {/* Prayer time markers */}
        {svgData.prayers.map(prayer => (
          <div 
            key={prayer.name}
            className="absolute top-0"
            style={{ left: `${prayer.position}%` }}
          >
            {/* Icon */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              prayer.isPast 
                ? `bg-${prayer.color}-100 border-${prayer.color}-200 dark:bg-${prayer.color}-900/20 dark:border-${prayer.color}-800/50` 
                : prayer.isCurrent
                  ? `bg-${prayer.color}-100 border-${prayer.color}-300 dark:bg-${prayer.color}-900/30 dark:border-${prayer.color}-700`
                  : `bg-white border-${prayer.color}-300 dark:bg-gray-800 dark:border-${prayer.color}-700/50`
            }`}>
              <prayer.icon className={`w-4 h-4 ${
                prayer.isPast 
                  ? `text-${prayer.color}-400 dark:text-${prayer.color}-500` 
                  : prayer.isCurrent
                    ? `text-${prayer.color}-600 dark:text-${prayer.color}-400`
                    : `text-${prayer.color}-500 dark:text-${prayer.color}-400`
              }`} />
            </div>
            
            {/* Label */}
            <div className="absolute top-10 -translate-x-1/2 w-16 text-center">
              <span className={`text-xs font-medium ${
                prayer.isPast 
                  ? `text-${prayer.color}-400 dark:text-${prayer.color}-500` 
                  : prayer.isCurrent
                    ? `text-${prayer.color}-600 dark:text-${prayer.color}-400`
                    : `text-${prayer.color}-500 dark:text-${prayer.color}-400`
              }`}>
                {prayer.name === 'Imsak' ? 'Imsak' : prayer.name}
              </span>
            </div>
            
            {/* Time */}
            <div className="absolute top-16 -translate-x-1/2 w-20 text-center">
              <span className={`text-xs ${
                prayer.isPast 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : prayer.isCurrent
                    ? `text-${prayer.color}-600 dark:text-${prayer.color}-400 font-medium`
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {prayer.formattedTime}
              </span>
            </div>
          </div>
        ))}
        
        {/* Current time marker */}
        {svgData.currentPosition !== null && (
          <div 
            className="absolute top-6 -translate-x-1/2"
            style={{ left: `${svgData.currentPosition}%` }}
          >
            <div className="w-1 h-9 bg-red-500 rounded-full"></div>
            <div className="absolute top-16 -translate-x-1/2 w-16 text-center">
              <span className="text-xs font-medium text-red-500">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      {isToday && (
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Current Time</span>
          </div>
        </div>
      )}
    </div>
  );
} 