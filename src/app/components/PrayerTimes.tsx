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

// Import the utility functions
import { processPrayerTimes } from '../lib/prayerTimeUtils';
import { 
  getWeekDates, 
  getDateInfo, 
  formatTimeAmPm, 
  isSameDay, 
  addDays,
  getTimeRemaining,
  type TimeRemaining
} from '../lib/dateUtils';

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
  const [tomorrowImsak, setTomorrowImsak] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cityName] = useState('Prishtina');
  
  // State for week dates
  const [weekDates, setWeekDates] = useState(() => getWeekDates(selectedDate));

  // Update week dates when selected date changes
  useEffect(() => {
    setWeekDates(getWeekDates(selectedDate));
  }, [selectedDate]);

  // Format date for display
  const formatDate = useCallback((date: Date) => {
    return getDateInfo(date, selectedDate);
  }, [selectedDate]);

  // Fetch prayer times - optimized with useCallback
  const fetchPrayerTimes = useCallback(async (date: Date = selectedDate) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const times = await getDayPrayerTimes(date);
      setPrayerTimes(times);
      
      // Fetch tomorrow's prayer times if today is selected
      if (isSameDay(date, new Date())) {
        const tomorrow = addDays(date, 1);
        const tomorrowTimes = await getDayPrayerTimes(tomorrow);
        setTomorrowImsak(tomorrowTimes.imsak);
      } else {
        setTomorrowImsak(null);
      }
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
    
    // Update the week dates when a date is selected to keep the selected date in the middle
    const newWeekDates = getWeekDates(date);
    if (JSON.stringify(newWeekDates) !== JSON.stringify(weekDates)) {
      // Only update if the dates have changed
      setWeekDates(newWeekDates);
    }
  }, [fetchPrayerTimes, weekDates]);

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
    return formatTimeAmPm(time);
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

  // Helper function to convert time string to minutes
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Process prayer times with status
  const { 
    prayersWithStatus: prayerTimesWithStatus, 
    currentPrayer, 
    nextPrayer,
    isNextPrayerTomorrow
  } = useMemo(() => {
    if (!prayerTimes) return { 
      prayersWithStatus: [], 
      currentPrayer: undefined, 
      nextPrayer: undefined,
      isNextPrayerTomorrow: false
    };
    
    // Create prayer objects from prayer times
    const prayers: PrayerWithStatus[] = [
      { name: 'Imsak', time: prayerTimes.imsak, label: 'Imsak', timeInMinutes: convertTimeToMinutes(prayerTimes.imsak), isPast: false, isCurrent: false, isNext: false },
      { name: 'Fajr', time: prayerTimes.fajr, label: 'Sabahu', timeInMinutes: convertTimeToMinutes(prayerTimes.fajr), isPast: false, isCurrent: false, isNext: false },
      { name: 'Sunrise', time: prayerTimes.sunrise, label: 'Lindja e Diellit', timeInMinutes: convertTimeToMinutes(prayerTimes.sunrise), isPast: false, isCurrent: false, isNext: false },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, label: 'Dreka', timeInMinutes: convertTimeToMinutes(prayerTimes.dhuhr), isPast: false, isCurrent: false, isNext: false },
      { name: 'Asr', time: prayerTimes.asr, label: 'Ikindia', timeInMinutes: convertTimeToMinutes(prayerTimes.asr), isPast: false, isCurrent: false, isNext: false },
      { name: 'Maghrib', time: prayerTimes.maghrib, label: 'Akshami', timeInMinutes: convertTimeToMinutes(prayerTimes.maghrib), isPast: false, isCurrent: false, isNext: false },
      { name: 'Isha', time: prayerTimes.isha, label: 'Jacia', timeInMinutes: convertTimeToMinutes(prayerTimes.isha), isPast: false, isCurrent: false, isNext: false }
    ];
    
    return processPrayerTimes(prayers, currentTime);
  }, [prayerTimes, currentTime]);

  // Calculate time remaining until next prayer
  const timeRemaining = useMemo(() => {
    // Check if the selected date is today
    const isToday = isSameDay(selectedDate, new Date());
    
    if (!nextPrayer || !isToday) return null;
    
    // Ensure nextPrayer has dateTime property
    if (nextPrayer && 'dateTime' in nextPrayer) {
      return getTimeRemaining(nextPrayer.dateTime as Date, currentTime);
    }
    
    return null;
  }, [nextPrayer, currentTime, selectedDate]);

  // Check if the selected date is today
  const isToday = useMemo(() => {
    return isSameDay(selectedDate, new Date());
  }, [selectedDate]);

  // Check if we need tomorrow's Imsak
  const needsTomorrowImsak = useMemo(() => {
    if (!prayerTimesWithStatus.length) return false;
    
    const currentPrayer = prayerTimesWithStatus.find(prayer => prayer.isCurrent);
    const nextPrayer = prayerTimesWithStatus.find(prayer => prayer.isNext);
    
    return currentPrayer?.name === 'Isha' && nextPrayer?.name === 'Imsak';
  }, [prayerTimesWithStatus]);

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
      
      {isToday && nextPrayer && (
        <NextPrayerAlert 
          nextPrayer={nextPrayer} 
          timeRemaining={timeRemaining}
          getPrayerIcon={getPrayerIcon}
          currentPrayer={currentPrayer?.name}
          isNextPrayerTomorrow={isNextPrayerTomorrow}
        />
      )}
      
      <PrayerTimesList 
        prayerTimesWithStatus={prayerTimesWithStatus} 
        formatTimeToAmPm={formatTimeToAmPm} 
        getPrayerIcon={getPrayerIcon}
        isNextPrayerTomorrow={isNextPrayerTomorrow}
      />
    </section>
  );
} 