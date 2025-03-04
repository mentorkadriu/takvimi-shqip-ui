'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ClockIcon, 
  FajrIcon, 
  SunriseIcon, 
  DhuhrIcon, 
  AsrIcon, 
  MaghribIcon, 
  IshaIcon 
} from './icons';
import { getDayPrayerTimes } from '../services/kosovoPrayerTimes';
import { PrayerTimes as PrayerTimesType } from '../types/prayerTimes';

// Import our components
import PrayerTimesHeader from './prayer-times/PrayerTimesHeader';
import WeekDateSelector from './prayer-times/WeekDateSelector';
import PrayerTimesCardSVG from './prayer-times/PrayerTimesCardSVG';
import NextPrayerAlert from './prayer-times/NextPrayerAlert';
import PrayerTimesList from './prayer-times/PrayerTimesList';
import LoadingPrayerTimes from './prayer-times/LoadingPrayerTimes';
import ErrorPrayerTimes from './prayer-times/ErrorPrayerTimes';

// Define the prayer with status type
interface PrayerWithStatus {
  name: string;
  time: string;
  label: string;
  timeInMinutes: number;
  isPast: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cityName] = useState('Prishtina');

  // Generate week dates centered on selected date
  const weekDates = useMemo(() => {
    const dates = [];
    // Start 3 days before selected date
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 3);
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }, [selectedDate]);

  // Format date for display
  const formatDate = useCallback((date: Date) => {
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: date.toDateString() === new Date().toDateString(),
      isSelected: date.toDateString() === selectedDate.toDateString(),
      fullDate: date.toISOString().split('T')[0]
    };
  }, [selectedDate]);

  // Fetch prayer times - optimized with useCallback
  const fetchPrayerTimes = useCallback(async (date: Date = selectedDate) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const times = await getDayPrayerTimes(date);
      setPrayerTimes(times);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError('Could not load prayer times. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    fetchPrayerTimes(date);
  }, [fetchPrayerTimes]);

  useEffect(() => {
    fetchPrayerTimes();
    
    // Update current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchPrayerTimes]);

  // Format time to 12-hour format with AM/PM - memoized
  const formatTimeToAmPm = useCallback((time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }, []);

  // Get prayer icon based on name
  const getPrayerIcon = useCallback((name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Imsak':
        return <FajrIcon className={className} />; // Using FajrIcon for Imsak as they're similar
      case 'Fajr':
        return <FajrIcon className={className} />;
      case 'Sunrise':
        return <SunriseIcon className={className} />;
      case 'Dhuhr':
        return <DhuhrIcon className={className} />;
      case 'Asr':
        return <AsrIcon className={className} />;
      case 'Maghrib':
        return <MaghribIcon className={className} />;
      case 'Isha':
        return <IshaIcon className={className} />;
      default:
        return <ClockIcon className={className} />;
    }
  }, []);

  // Determine which prayer time is next - memoized
  const prayerTimesWithStatus = useMemo<PrayerWithStatus[]>(() => {
    if (!prayerTimes) return [];
    
    // Only calculate "current" and "next" status for today
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    
    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    // Always include Imsak for Kosovo locations
    const prayers = [
      { name: 'Imsak', time: prayerTimes.imsak, label: 'Imsak' },
      { name: 'Fajr', time: prayerTimes.fajr, label: 'Sabahu' },
      { name: 'Sunrise', time: prayerTimes.sunrise, label: 'Lindja e Diellit' },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, label: 'Dreka' },
      { name: 'Asr', time: prayerTimes.asr, label: 'Ikindia' },
      { name: 'Maghrib', time: prayerTimes.maghrib, label: 'Akshami' },
      { name: 'Isha', time: prayerTimes.isha, label: 'Jacia' }
    ];
    
    // Convert prayer times to minutes for comparison
    const prayerTimesWithMinutes = prayers.map(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      return {
        ...prayer,
        timeInMinutes: hours * 60 + minutes
      };
    });
    
    // If not today, just return all prayers with no special status
    if (!isToday) {
      return prayerTimesWithMinutes.map(prayer => ({
        ...prayer,
        isPast: false,
        isCurrent: false,
        isNext: false
      }));
    }
    
    // Find the next prayer
    const nextPrayerIndex = prayerTimesWithMinutes.findIndex(prayer => 
      prayer.timeInMinutes > currentTimeInMinutes
    );
    
    // If no next prayer today, the first prayer of tomorrow is next
    const actualNextIndex = nextPrayerIndex === -1 ? 0 : nextPrayerIndex;
    
    // Mark previous, current, and next prayers
    return prayerTimesWithMinutes.map((prayer, index) => {
      const isPast = index < actualNextIndex;
      const isCurrent = index === actualNextIndex - 1 || (actualNextIndex === 0 && index === prayerTimesWithMinutes.length - 1);
      const isNext = index === actualNextIndex;

      return {
        ...prayer,
        isPast,
        isCurrent,
        isNext
      };
    });
  }, [prayerTimes, currentTime, selectedDate]);

  // Get the next prayer
  const nextPrayer = useMemo(() => 
    prayerTimesWithStatus.find(prayer => 
      !prayer.isPast && !prayer.isCurrent
    )
  , [prayerTimesWithStatus]);

  // Calculate time remaining until next prayer - memoized
  const timeRemaining = useMemo(() => {
    if (!nextPrayer || !prayerTimes) return null;
    
    // Only show time remaining for today
    if (selectedDate.toDateString() !== new Date().toDateString()) return null;
    
    const now = currentTime;
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    let minutesRemaining = nextPrayer.timeInMinutes - currentTimeInMinutes;
    
    // If next prayer is tomorrow
    if (minutesRemaining < 0) {
      minutesRemaining += 24 * 60; // Add 24 hours
    }
    
    const hoursRemaining = Math.floor(minutesRemaining / 60);
    const remainingMinutes = minutesRemaining % 60;
    
    return {
      hours: hoursRemaining,
      minutes: remainingMinutes
    };
  }, [nextPrayer, currentTime, prayerTimes, selectedDate]);

  // Check if the selected date is today
  const isToday = useMemo(() => 
    selectedDate.toDateString() === new Date().toDateString()
  , [selectedDate]);

  if (isLoading) {
    return <LoadingPrayerTimes />;
  }

  if (error) {
    return <ErrorPrayerTimes error={error} onRetry={() => fetchPrayerTimes()} />;
  }

  if (!prayerTimes) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <PrayerTimesHeader 
        date={prayerTimes.date}
        weekday={prayerTimes.weekday}
        islamicEvents={prayerTimes.islamicEvents}
        cityName={cityName}
      />
      
      <WeekDateSelector 
        onDateSelect={handleDateSelect}
        weekDates={weekDates}
        formatDate={formatDate}
      />
      
      <PrayerTimesCardSVG 
        currentTime={currentTime} 
        isToday={isToday} 
        prayerTimes={prayerTimes}
      />
      
      <NextPrayerAlert 
        nextPrayer={nextPrayer} 
        timeRemaining={timeRemaining} 
        getPrayerIcon={getPrayerIcon} 
      />
      
      <PrayerTimesList 
        prayerTimesWithStatus={prayerTimesWithStatus} 
        formatTimeToAmPm={formatTimeToAmPm} 
        getPrayerIcon={getPrayerIcon} 
      />
    </section>
  );
} 